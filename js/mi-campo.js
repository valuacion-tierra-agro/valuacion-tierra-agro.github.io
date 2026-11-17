// Sección «Probá variantes» (antes «Mi campo»): la zona es la que cargó el productor en el asistente (fija, sólo se muestra);
// arranca con sus hectáreas y su cobertura, que puede cambiar (hasta 1.000 ha en total), y ve, por campaña, el
// margen proyectado, el real sin cobertura y el real con cobertura de su mezcla.
// Todas las cuentas las hace TESIS_MOTOR.mezcla: acá no se repite ninguna cuenta de márgenes.
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
(function (raiz) {
  "use strict";

  var FORMULAS = {
    mezclaUsdHa: "Σ (hectáreas × margen de cada cultivo) ÷ hectáreas totales",
    mezclaUsd: "Σ (hectáreas × margen de cada cultivo)",
    rentMezcla: "Σ (hectáreas × margen) ÷ Σ (hectáreas × V)",
    riesgo: "Desvío estándar muestral entre campañas de la sorpresa (real − proyectado)",
    cambio: "1 − riesgo con cobertura ÷ riesgo sin cobertura",
    // Contexto y detalle por cultivo de cada campaña.
    desvioRinde: "Promedio simple de (rinde real ÷ rinde esperado − 1) de los cultivos elegidos",
    desvioRindeCultivo: "Rinde real ÷ rinde esperado − 1",
    futuroMezcla: "Margen real con cobertura − margen real sin cobertura",
    mbProyectado: "rinde esperado ÷ 10 × (Fs − GC) − CD − cosecha al rinde esperado",
    mbRealSin: "rinde real ÷ 10 × (Sc − GC) − CD − cosecha al rinde real",
    futuro: "h × [rinde esperado ÷ 10 × (Fs − Fc) − comisión × rinde esperado ÷ 10 × Fs]",
    mbRealCon: "real sin cobertura + resultado del futuro",
    rentabilidad: "margen ÷ V",
    cosecha: "tabla de cosecha: piso o costo bajo debajo del rinde bajo, interpolación entre bajo y alto, proporcional arriba del alto"
  };

  // Lo que depende de la proporción cubierta h (todo lo «con cobertura») parte SIEMPRE de estas
  // celdas, sea cual sea h: rinde esperado, Fs y Fc de cada cultivo, la comisión (Parametros › B5)
  // y la h que eligió la persona. Las celdas de resultado del Excel (V, W, Y, AC…) valen lo que da
  // h = Parametros › B7: sólo se nombran, como «en el Excel», cuando h es esa y hay un solo cultivo.
  FORMULAS.mbRealConCompleta = FORMULAS.mbRealCon + ", con resultado del futuro = " + FORMULAS.futuro;

  // Fórmula de una cifra agregada que usa el margen real con cobertura.
  function conFuturo(formula) {
    return formula + ", con margen real con cobertura = " + FORMULAS.mbRealConCompleta;
  }

  var CAMPOS_FUTURO = ["rindeEsperado", "fs", "fc"];
  var CAMPOS_CON_COBERTURA = ["excel.mbRealSin"].concat(CAMPOS_FUTURO);

  // Celdas de RR_Margenes con la tabla de costo de cosecha (M a Q).
  var CAMPOS_TABLA = ["tabla.rindeBajo", "tabla.rindeAlto", "tabla.costoBajo", "tabla.costoAlto", "tabla.piso"];

  var NBSP = "\u00a0"; // espacio duro: el «%» nunca queda solo en la línea siguiente

  // Nota de origen con la h que eligió la persona (dato propio, no sale de ninguna celda).
  function notaH(h) {
    return "proporción cubierta elegida: " + raiz.TESIS_APP.formato.numero(h * 100, 0) + NBSP + "% (la elegiste vos)";
  }
  var SIN_COMPARAR = "la sorpresa fue igual en todas las campañas.";
  var AVISO_FINAL = "Esto describe lo que pasó en estas seis campañas; no es una recomendación.";

  // Glosario (D-16): término y explicación, en el orden en que se muestran.
  var TERMINOS = [
    ["Precio del futuro al sembrar", "lo que pagaba el contrato a futuro cuando sembraste (USD por tonelada)."],
    ["Precio a cosecha", "el precio disponible el día de la cosecha (USD por tonelada)."],
    ["Precio del futuro a cosecha", "lo que pagaba ese mismo contrato a la cosecha, cuando se cierra la cobertura (USD por tonelada)."],
    ["Gastos de comercialización", "lo que cuesta vender y mover la mercadería (USD por tonelada)."],
    ["Valor de la tierra", "lo que vale una hectárea (USD por hectárea); la rentabilidad es el margen dividido por ese valor."],
    ["Margen proyectado", "lo que esperabas ganar al sembrar, con el rinde esperado y el precio del futuro."],
    ["Diferencia con lo proyectado", "lo que ganaste de más o de menos frente a lo proyectado."],
    ["Riesgo", "cuánto se alejó, en general, lo que ganaste de lo que esperabas, de una campaña a otra."]
  ];

  var MENSAJE_SIN_HECTAREAS = "Cargá hectáreas en al menos un cultivo para ver los resultados.";
  var HECTAREAS_TOPE = 1000; // tope entre todos los cultivos (el mismo del asistente)
  var MENSAJE_HECTAREAS = "Poné un número entero entre 0 y 1.000";
  var MENSAJE_TOPE = "Pasaste el tope: son más de 1.000 ha entre todos los cultivos. Bajá alguna para ver los resultados.";
  var MENSAJE_INVITACION = "Para probar variantes primero cargá tu campaña: zona, cultivos y hectáreas.";

  // Los tres márgenes de la tabla: clave de la celda, texto, campo del Excel y del motor.
  var MARGENES = [
    { clave: "proyectado", nombre: "Margen proyectado al sembrar", excel: "excel.mbProyectado", usdHa: "usdHaProyectado", usd: "usdProyectado", serie: "serie-proyectado" },
    { clave: "realSin", nombre: "Margen real sin cobertura", excel: "excel.mbRealSin", usdHa: "usdHaRealSin", usd: "usdRealSin", serie: "serie-sin" },
    { clave: "realCon", nombre: "Margen real con cobertura", excel: "excel.mbRealCon", usdHa: "usdHaRealCon", usd: "usdRealCon", serie: "serie-con", conCobertura: true }
  ];

  // Encabezados cortos de la tabla (V-1): con los nombres largos la tabla no entraba en pantalla.
  // El nombre completo queda en el title de cada encabezado.
  var ENCABEZADOS = {
    proyectado: "Proyectado",
    realSin: "Real sin cobertura",
    realCon: "Real con cobertura"
  };

  // Nombre de cada serie en el gráfico y en su leyenda.
  var SERIES = {
    proyectado: "Proyectado al sembrar",
    realSin: "Real sin cobertura",
    realCon: "Real con cobertura"
  };

  function suma(lista) {
    return lista.reduce(function (a, b) { return a + b; }, 0);
  }

  // Modelo de vista: función pura, sin DOM y sin formatear. Cada celda es
  // { v, formato, origen } y se pinta con TESIS_APP.numero.
  function armarVista(datos, estado) {
    var app = raiz.TESIS_APP;
    var motor = raiz.TESIS_MOTOR;
    // Cultivo que falta en el estado = 0 ha (acá no se inventan hectáreas).
    var e = app.normalizarEstado(estado, datos, 0);
    var cultivos = motor.cultivosDe(datos, e.zona);
    var total = suma(cultivos.map(function (c) { return e.hectareas[c]; }));
    var vista = {
      zona: e.zona,
      zonas: app.zonasDisponibles(datos),
      cultivos: cultivos,
      hectareas: e.hectareas,
      hectareasTotales: total,
      h: e.h,
      unidad: e.unidad,
      mensaje: "",
      campanas: [],
      cantidadCampanas: null,
      grafico: null,
      resumen: null,
      lectura: null
    };
    if (!(total > 0)) {
      vista.mensaje = MENSAJE_SIN_HECTAREAS;
      return vista;
    }

    var m = motor.mezcla(datos, e.zona, { hectareasPorCultivo: e.hectareas, h: e.h });
    var enHa = e.unidad === "USD/ha";
    var formula = enHa ? FORMULAS.mezclaUsdHa : FORMULAS.mezclaUsd;
    vista.campanas = m.porCampana.map(function (p) {
      var fila = { campana: p.campana };
      // Un contexto por cultivo con hectáreas: su caso, sus cuentas y de dónde sale cada dato.
      var contextos = m.cultivos.map(function (cultivo) { return contextoDeCultivo(datos, m, cultivo, p.campana); });
      MARGENES.forEach(function (margen) {
        // Celdas de RR_Margenes de las que parte cada margen: una por cultivo con hectáreas.
        // El «con cobertura» parte de sus entradas reales y de la h elegida (ver CAMPOS_CON_COBERTURA).
        var origenes = margen.conCobertura
          ? celdasDe(contextos, CAMPOS_CON_COBERTURA, datos, true)
          : contextos.map(function (c) { return c.o(margen.excel); });
        fila[margen.clave] = {
          v: p[enHa ? margen.usdHa : margen.usd],
          formato: "usd",
          origen: app.origenCalculado(margen.nombre + ": " + (margen.conCobertura ? conFuturo(formula) : formula), origenes, null,
            margen.conCobertura ? [notaH(m.h)] : null)
        };
      });
      completarCampana(datos, m, p, fila, contextos);
      return fila;
    });
    // «Promedio de las 6 campañas», «4 de las 6»: la cantidad también es un número con origen.
    vista.cantidadCampanas = celdaNumero(vista.campanas.length, "entero",
      app.origenCalculado("Cantidad de campañas de la serie", origenesDe(datos, m, "excel.mbProyectado")));
    vista.grafico = armarGrafico(vista);
    vista.resumen = armarResumen(datos, m, vista);
    vista.lectura = armarLectura(datos, m, vista);
    return vista;
  }

  // ---------------------------------------------------------------------------------------
  // Contexto de cada campaña y detalle por cultivo (D-11, D-13, D-14).
  // Ninguna fórmula nueva: los valores salen de la mezcla, de calcularCaso y de los datos.
  // ---------------------------------------------------------------------------------------

  // Celdas de los campos pedidos, de todos los cultivos con hectáreas (de una campaña); con la
  // comisión de Parametros si el cálculo la usa.
  function celdasDe(contextos, campos, datos, conComision) {
    var lista = [];
    contextos.forEach(function (c) { lista = lista.concat(c.partes(campos)); });
    return conComision ? lista.concat([datos.parametros.comision.o]) : lista;
  }

  // Fila de una lista de datos.porCampana / datos.precios (cultivo + campaña).
  function filaDe(lista, cultivo, campana, nombre) {
    var fila = lista.filter(function (x) { return x.cultivo === cultivo && x.campana === campana; })[0];
    if (!fila) throw new Error("Faltan los datos de " + nombre + " de " + cultivo + " en la campaña " + campana);
    return fila;
  }

  // Todo lo que hace falta de un cultivo en una campaña: el caso, sus cuentas con la h elegida,
  // el contrato y o(campo) = la celda de RR_Margenes de la que sale cada campo.
  function contextoDeCultivo(datos, m, cultivo, campana) {
    var motor = raiz.TESIS_MOTOR;
    var caso = motor.casosDe(datos, cultivo, m.zona).filter(function (c) { return c.campana === campana; })[0];
    if (!caso) throw new Error("No hay datos de " + cultivo + " en " + m.zona + " para la campaña " + campana);
    return {
      cultivo: cultivo,
      caso: caso,
      ha: m.hectareasPorCultivo[cultivo],
      r: motor.calcularCaso(caso, { h: m.h, comision: m.comision }),
      precio: filaDe(datos.precios, cultivo, campana, "contrato"),
      o: function (campo) { return motor.origen(caso, campo, datos); },
      partes: function (campos) { return campos.map(function (campo) { return motor.origen(caso, campo, datos); }); }
    };
  }

  function celdaNumero(v, formato, origen) {
    return { v: v, formato: formato, origen: origen };
  }

  function celdaTexto(texto, origen) {
    return { texto: texto, origen: origen };
  }

  // Filas del detalle: clave, concepto y cómo sale la celda de cada cultivo.
  // `c` es el contexto del cultivo; `d` = { calculado(formula, partes, enExcel, notas), notaH, ... }
  // con el origen calculado, la nota de la h elegida y si esa h es la del Excel (los resultados con
  // cobertura sólo coinciden con el Excel si h = Parametros!B7).
  var FILAS_DETALLE = [
    { clave: "hectareas", concepto: "Hectáreas", celda: function (c) { return celdaNumero(c.ha, "entero", "Lo cargaste vos"); } },
    { clave: "rindeEsperado", concepto: "Rinde esperado (qq/ha)", celda: function (c) { return celdaNumero(c.caso.rindeEsperado, "rinde", c.o("rindeEsperado")); } },
    { clave: "rindeReal", concepto: "Rinde real (qq/ha)", celda: function (c) { return celdaNumero(c.caso.rindeReal, "rinde", c.o("rindeReal")); } },
    { clave: "desvioRinde", concepto: "Cuánto se alejó el rinde", celda: function (c, d) {
      return celdaNumero(c.r.desvioRinde, "porcentaje", d.calculado(FORMULAS.desvioRindeCultivo, c.partes(["rindeEsperado", "rindeReal"]), [c.o("excel.desvioRinde")]));
    } },
    { clave: "contrato", concepto: "Contrato (siembra → cosecha)", celda: function (c, d) {
      var p = c.precio;
      return celdaTexto(p.contrato.v + " (" + p.mesSiembra.v + " → " + p.mesCosecha.v + ")", d.unir([p.contrato.o, p.mesSiembra.o, p.mesCosecha.o]));
    } },
    { clave: "fs", concepto: "Precio del futuro al sembrar (USD/t)", celda: function (c) { return celdaNumero(c.caso.fs, "usd2", c.o("fs")); } },
    { clave: "sc", concepto: "Precio a cosecha (USD/t)", celda: function (c) { return celdaNumero(c.caso.sc, "usd2", c.o("sc")); } },
    { clave: "fc", concepto: "Precio del futuro a cosecha (USD/t)", celda: function (c) { return celdaNumero(c.caso.fc, "usd2", c.o("fc")); } },
    { clave: "gc", concepto: "Gastos de comercialización (USD/t)", celda: function (c) { return celdaNumero(c.caso.gc, "usd2", c.o("gc")); } },
    { clave: "cd", concepto: "Costos directos (USD/ha)", celda: function (c) { return celdaNumero(c.caso.cd, "usd2", c.o("cd")); } },
    { clave: "cosechaEsperado", concepto: "Cosecha al rinde esperado (USD/ha)", celda: function (c, d) {
      return celdaNumero(c.r.cosechaEsperado, "usd2", d.calculado(FORMULAS.cosecha, c.partes(["rindeEsperado"].concat(CAMPOS_TABLA)), [c.o("excel.cosechaEsperado")]));
    } },
    { clave: "cosechaReal", concepto: "Cosecha al rinde real (USD/ha)", celda: function (c, d) {
      return celdaNumero(c.r.cosechaReal, "usd2", d.calculado(FORMULAS.cosecha, c.partes(["rindeReal"].concat(CAMPOS_TABLA)), [c.o("excel.cosechaReal")]));
    } },
    { clave: "v", concepto: "Valor de la tierra (USD/ha)", celda: function (c) { return celdaNumero(c.caso.v, "usd2", c.o("v")); } },
    { clave: "mbProyectado", concepto: "Margen proyectado (USD/ha)", celda: function (c, d) {
      return celdaNumero(c.r.mbProyectado, "usd2", d.calculado(FORMULAS.mbProyectado, c.partes(["rindeEsperado", "fs", "gc", "cd"].concat(CAMPOS_TABLA)), [c.o("excel.mbProyectado")]));
    } },
    { clave: "mbRealSin", concepto: "Margen real sin cobertura (USD/ha)", celda: function (c, d) {
      return celdaNumero(c.r.mbRealSin, "usd2", d.calculado(FORMULAS.mbRealSin, c.partes(["rindeReal", "sc", "gc", "cd"].concat(CAMPOS_TABLA)), [c.o("excel.mbRealSin")]));
    } },
    { clave: "futuro", concepto: "Resultado del futuro (USD/ha)", celda: function (c, d) {
      return celdaNumero(c.r.futuro, "usd2", d.calculado(FORMULAS.futuro, c.partes(CAMPOS_FUTURO).concat([d.comisionO]), d.hDelExcel ? [c.o("excel.futuro")] : null, [d.notaH]));
    } },
    { clave: "mbRealCon", concepto: "Margen real con cobertura (USD/ha)", celda: function (c, d) {
      return celdaNumero(c.r.mbRealCon, "usd2", d.calculado(FORMULAS.mbRealConCompleta, c.partes(CAMPOS_CON_COBERTURA).concat([d.comisionO]), d.hDelExcel ? [c.o("excel.mbRealCon")] : null, [d.notaH]));
    } },
    { clave: "rProyectada", concepto: "Rentabilidad proyectada", celda: function (c, d) {
      return celdaNumero(c.r.rProyectada, "porcentaje", d.calculado(FORMULAS.rentabilidad, c.partes(["excel.mbProyectado", "v"]), [c.o("excel.rProyectada")]));
    } },
    { clave: "rRealSin", concepto: "Rentabilidad real sin cobertura", celda: function (c, d) {
      return celdaNumero(c.r.rRealSin, "porcentaje", d.calculado(FORMULAS.rentabilidad, c.partes(["excel.mbRealSin", "v"]), [c.o("excel.rRealSin")]));
    } },
    { clave: "rRealCon", concepto: "Rentabilidad real con cobertura", celda: function (c, d) {
      return celdaNumero(c.r.rRealCon, "porcentaje", d.calculado(conFuturo(FORMULAS.rentabilidad), c.partes(CAMPOS_CON_COBERTURA.concat(["v"])).concat([d.comisionO]), d.hDelExcel ? [c.o("excel.rRealCon")] : null, [d.notaH]));
    } }
  ];

  // Contexto (desvío de rinde), resultado del futuro, rentabilidades y detalle de una campaña.
  function completarCampana(datos, m, p, fila, contextos) {
    var app = raiz.TESIS_APP;
    var motor = raiz.TESIS_MOTOR;
    var unCultivo = m.cultivos.length === 1;
    var hDelExcel = Math.abs(m.h - datos.parametros.h.v) < 1e-9;
    var delCultivo = function (campo) { return contextos.map(function (c) { return c.o(campo); }); };

    fila.contexto = {
      desvioRinde: celdaNumero(
        motor.promedio(contextos.map(function (c) { return c.r.desvioRinde; })),
        "porcentaje",
        app.origenCalculado(FORMULAS.desvioRinde, delCultivo("rindeEsperado").concat(delCultivo("rindeReal")),
          unCultivo ? delCultivo("excel.desvioRinde") : null)
      )
    };

    fila.futuro = celdaNumero(fila.realCon.v - fila.realSin.v, "usd",
      app.origenCalculado(conFuturo(FORMULAS.futuroMezcla), celdasDe(contextos, CAMPOS_FUTURO, datos, true), null, [notaH(m.h)]));
    fila.rentSin = celdaNumero(p.rRealSin, "porcentaje",
      app.origenCalculado(FORMULAS.rentMezcla, delCultivo("excel.mbRealSin").concat(delCultivo("v")), unCultivo ? delCultivo("excel.rRealSin") : null));
    fila.rentCon = celdaNumero(p.rRealCon, "porcentaje",
      app.origenCalculado(conFuturo(FORMULAS.rentMezcla), celdasDe(contextos, CAMPOS_CON_COBERTURA, datos, true).concat(delCultivo("v")),
        unCultivo && hDelExcel ? delCultivo("excel.rRealCon") : null, [notaH(m.h)]));

    var d = {
      hDelExcel: hDelExcel,
      notaH: notaH(m.h),
      comisionO: datos.parametros.comision.o,
      calculado: app.origenCalculado,
      unir: app.unirOrigenes
    };
    fila.detalle = {
      cultivos: m.cultivos.slice(),
      filas: FILAS_DETALLE.map(function (def) {
        return { clave: def.clave, concepto: def.concepto, celdas: contextos.map(function (c) { return def.celda(c, d); }) };
      })
    };
  }

  // Celdas de RR_Margenes de un campo, de todas las campañas y de los cultivos con hectáreas.
  function origenesDe(datos, m, campo) {
    var motor = raiz.TESIS_MOTOR;
    var lista = [];
    m.cultivos.forEach(function (cultivo) {
      motor.casosDe(datos, cultivo, m.zona).forEach(function (caso) { lista.push(motor.origen(caso, campo, datos)); });
    });
    return lista;
  }

  // Celdas de varios campos, de todas las campañas y de los cultivos con hectáreas.
  function origenesDeVarios(datos, m, campos) {
    var lista = [];
    campos.forEach(function (campo) { lista = lista.concat(origenesDe(datos, m, campo)); });
    return lista;
  }

  // De dónde parte, en todas las campañas, lo que depende de h: el real sin cobertura, el rinde
  // esperado, Fs, Fc y la comisión (ver CAMPOS_CON_COBERTURA).
  function origenesConCobertura(datos, m) {
    return origenesDeVarios(datos, m, CAMPOS_CON_COBERTURA).concat([datos.parametros.comision.o]);
  }

  // Tarjetas de resumen: promedios de las campañas y riesgo de la mezcla. Todo sale de la salida
  // de TESIS_MOTOR.mezcla y de promedio / desvioMuestral del motor: ninguna fórmula nueva.
  function armarResumen(datos, m, vista) {
    var app = raiz.TESIS_APP;
    var enHa = vista.unidad === "USD/ha";
    var cantidad = vista.campanas.length;
    var promedioDe = function (clave) {
      return raiz.TESIS_MOTOR.promedio(vista.campanas.map(function (fila) { return fila[clave].v; }));
    };
    var porCampana = function (campo) { return m.porCampana.map(function (p) { return p[campo]; }); };

    // Con un solo cultivo, las celdas de RR_Riesgo_Zonas que dan lo mismo (el desvío con
    // cobertura depende de h: sólo coincide con el del Excel si h es el de Parametros).
    var control = null;
    if (m.cultivos.length === 1 && datos.controles && datos.controles.zonas) {
      control = datos.controles.zonas.filter(function (z) { return z.cultivo === m.cultivos[0] && z.zona === m.zona; })[0] || null;
    }
    var hDelExcel = Math.abs(m.h - datos.parametros.h.v) < 1e-9;
    var unCultivo = m.cultivos.length === 1;
    var enControl = function (clave, condicion) {
      return control && condicion && control[clave] ? [control[clave].o] : null;
    };

    var promedioMargen = function (clave) {
      var margen = MARGENES.filter(function (x) { return x.clave === clave; })[0];
      var formulaMezcla = enHa ? FORMULAS.mezclaUsdHa : FORMULAS.mezclaUsd;
      return {
        v: promedioDe(clave),
        formato: "usd",
        origen: app.origenCalculado("Promedio de las " + cantidad + " campañas de " + (margen.conCobertura ? conFuturo(formulaMezcla) : formulaMezcla),
          margen.conCobertura ? origenesConCobertura(datos, m) : origenesDe(datos, m, margen.excel),
          null, margen.conCobertura ? [notaH(m.h)] : null)
      };
    };
    // campoMargen: de dónde parte el cálculo. campoExcel: las seis celdas (una por campaña) de las
    // que esta cifra es el PROMEDIO; se dice «promedio de», nunca «en el Excel» (no es igual a ninguna).
    var rentabilidad = function (campoPorCampana, conCobertura, campoExcel, promedioDeExcel) {
      var notas = conCobertura ? [notaH(m.h)] : [];
      if (promedioDeExcel) notas.push("promedio de " + app.unirOrigenes(origenesDe(datos, m, campoExcel)));
      return {
        v: raiz.TESIS_MOTOR.promedio(porCampana(campoPorCampana)),
        formato: "porcentaje",
        origen: app.origenCalculado("Promedio de las " + cantidad + " campañas de " + (conCobertura ? conFuturo(FORMULAS.rentMezcla) : FORMULAS.rentMezcla),
          (conCobertura ? origenesConCobertura(datos, m) : origenesDe(datos, m, "excel.mbRealSin")).concat(origenesDe(datos, m, "v")),
          null, notas)
      };
    };
    // La sorpresa con cobertura = real con cobertura − proyectado: parte del proyectado (T) y de lo
    // «con cobertura» (el real sin cobertura, el rinde esperado, Fs, Fc, la comisión y h).
    var origenSorpresaConUsd = origenesDe(datos, m, "excel.mbProyectado").concat(origenesConCobertura(datos, m));
    var origenSorpresaConR = origenSorpresaConUsd.concat(origenesDe(datos, m, "v"));
    var riesgo = function (sinCobertura) {
      var sorpresas = porCampana(sinCobertura ? "sorpresaSinUsd" : "sorpresaConUsd");
      return {
        v: enHa ? (sinCobertura ? m.riesgo.sdSinUsdHa : m.riesgo.sdConUsdHa) : raiz.TESIS_MOTOR.desvioMuestral(sorpresas),
        formato: "usd",
        origen: app.origenCalculado(sinCobertura ? FORMULAS.riesgo : conFuturo(FORMULAS.riesgo),
          sinCobertura ? origenesDe(datos, m, "excel.sorpresaSin") : origenSorpresaConUsd,
          enHa ? enControl(sinCobertura ? "sdSinUsd" : "sdConUsd", sinCobertura || hDelExcel) : null,
          sinCobertura ? null : [notaH(m.h)])
      };
    };
    var cambio = function (valor, parteDe, enExcel) {
      return { v: valor, formato: "porcentaje", origen: app.origenCalculado(conFuturo(FORMULAS.cambio), parteDe, enExcel, [notaH(m.h)]) };
    };
    var origenSorpresaUsd = origenesDe(datos, m, "excel.sorpresaSin").concat(origenSorpresaConUsd);
    var origenSorpresaR = origenesDe(datos, m, "excel.sorpresaRSin").concat(origenSorpresaConR);

    return {
      proyectado: promedioMargen("proyectado"),
      realSin: promedioMargen("realSin"),
      realCon: promedioMargen("realCon"),
      rentSin: rentabilidad("rRealSin", false, "excel.rRealSin", unCultivo),
      rentCon: rentabilidad("rRealCon", true, "excel.rRealCon", unCultivo && hDelExcel),
      riesgoSin: riesgo(true),
      riesgoCon: riesgo(false),
      cambioRiesgo: cambio(m.riesgo.reduccionUsdHa, origenSorpresaUsd, enControl("reduccionUsd", hDelExcel)),
      riesgoRSin: {
        v: m.riesgo.sdRSin,
        formato: "porcentaje",
        origen: app.origenCalculado(FORMULAS.riesgo, origenesDe(datos, m, "excel.sorpresaRSin"), enControl("sdRSin", true))
      },
      riesgoRCon: {
        v: m.riesgo.sdRCon,
        formato: "porcentaje",
        origen: app.origenCalculado(conFuturo(FORMULAS.riesgo), origenSorpresaConR, enControl("sdRCon", hDelExcel), [notaH(m.h)])
      },
      cambioRiesgoR: cambio(m.riesgo.reduccionR, origenSorpresaR, enControl("reduccionR", hDelExcel))
    };
  }

  // Una frase es una lista de partes: texto o celda { v, formato, origen }.
  function textoDeFrase(frase) {
    var formato = raiz.TESIS_APP.formato;
    return frase.map(function (parte) {
      return typeof parte === "string" ? parte : formato.aplicar(parte.formato, parte.v);
    }).join("");
  }

  function esComparable(celda) {
    return celda && typeof celda.v === "number" && isFinite(celda.v);
  }

  function valorAbsoluto(celda) {
    return { v: Math.abs(celda.v), formato: celda.formato, origen: celda.origen };
  }

  // Cuánto cambió el riesgo con la cobertura (o por qué no se puede decir).
  function fraseCambio(celda) {
    if (!esComparable(celda)) return ["No se puede comparar: " + SIN_COMPARAR];
    if (Math.abs(celda.v) < 0.0005) return ["La cobertura no lo cambió."];
    return [celda.v > 0 ? "La cobertura lo bajó un " : "La cobertura lo subió un ", valorAbsoluto(celda), "."];
  }

  // Cómo cambió el riesgo medido en `medida` («USD» o «rentabilidad») con la cobertura.
  function fraseRiesgo(medida, celda) {
    var sujeto = "El riesgo medido en " + medida;
    if (!esComparable(celda)) return [sujeto + " no se puede comparar: " + SIN_COMPARAR];
    if (Math.abs(celda.v) < 0.0005) return [sujeto + " no cambió con la cobertura."];
    return [sujeto + (celda.v > 0 ? " bajó un " : " subió un "), valorAbsoluto(celda), " con la cobertura."];
  }

  // Lectura en texto simple (D-12): cuenta lo que pasó, sin recomendar.
  function armarLectura(datos, m, vista) {
    var app = raiz.TESIS_APP;
    var r = vista.resumen;
    var frases = [];
    if (vista.h === 0) {
      frases.push(["Con ", celdaNumero(0, "entero", "Lo elegiste vos (proporción cubierta con futuros)"), NBSP + "% cubierto no hay futuros: con y sin cobertura da lo mismo."]);
      frases.push([AVISO_FINAL]);
      return frases;
    }
    var mejores = vista.campanas.filter(function (fila) { return fila.realCon.v > fila.realSin.v; }).length;
    var origenMejores = app.origenCalculado(conFuturo("Cantidad de campañas con margen real con cobertura > margen real sin cobertura"),
      origenesDe(datos, m, "excel.mbRealSin").concat(origenesConCobertura(datos, m)), null, [notaH(m.h)]);
    frases.push(["Cubrirse dejó más margen que no cubrirse en ", celdaNumero(mejores, "entero", origenMejores),
      " de las ", vista.cantidadCampanas, " campañas."]);

    var diferencia = r.realCon.v - r.realSin.v;
    var porUnidad = vista.unidad === "USD/ha" ? "USD por hectárea" : "USD en total";
    if (Math.abs(diferencia) < 0.5) {
      frases.push(["En promedio, cubrirse no cambió el margen."]);
    } else {
      frases.push([
        diferencia > 0 ? "En promedio, cubrirse te hizo ganar " : "En promedio, cubrirse te hizo resignar ",
        {
          v: Math.abs(diferencia),
          formato: "usd",
          origen: app.origenCalculado(conFuturo("Promedio de las " + vista.campanas.length + " campañas de (margen real con cobertura − margen real sin cobertura)"),
            origenesDe(datos, m, "excel.mbRealSin").concat(origenesConCobertura(datos, m)), null, [notaH(m.h)])
        },
        " " + porUnidad + " por campaña."
      ]);
    }

    // Las dos medidas de riesgo que muestran las tarjetas, cada una con su cifra (IN-01): la lectura
    // y la tarjeta «Riesgo» hablan de lo mismo, y la de rentabilidad se dice aparte.
    frases.push(fraseRiesgo("USD", r.cambioRiesgo));
    frases.push(fraseRiesgo("rentabilidad", r.cambioRiesgoR));
    frases.push([AVISO_FINAL]);
    return frases;
  }

  // Datos del gráfico de barras: los mismos valores de la tabla (acá no se recalcula nada).
  function armarGrafico(vista) {
    var enHa = vista.unidad === "USD/ha";
    return {
      titulo: "Margen por campaña: proyectado, real sin cobertura y real con cobertura, en " + (enHa ? "USD por hectárea" : "USD totales"),
      unidad: enHa ? "USD/ha" : "USD",
      categorias: vista.campanas.map(function (fila) { return fila.campana; }),
      series: MARGENES.map(function (margen) {
        return {
          nombre: SERIES[margen.clave],
          clase: margen.serie,
          valores: vista.campanas.map(function (fila) { return fila[margen.clave].v; })
        };
      })
    };
  }

  // ---------------------------------------------------------------------------------------
  // Pintado
  // ---------------------------------------------------------------------------------------

  var nodos = null; // se arma en montar()

  // Contenedores de tabla con scroll propio: se repintan en cada cambio y, sin esto, volverían a
  // la posición 0 en cada tick del deslizador (IN-02). Cada uno se registra con una clave.
  var contenedores = {};

  function contenedorDeTabla(clave, tabla) {
    var contenedor = base().el("div", { "class": "tabla-contenedor" }, tabla);
    contenedores[clave] = contenedor;
    return contenedor;
  }

  function base() { return raiz.TESIS_APP; }

  // Frase en simple para la ventanita «De dónde sale este número» (el archivo y la celda siguen en data-origen y en «Datos y fuentes»).
  var EXPLICA_GENERAL = "Lo calculamos con tus hectáreas y con los precios, rindes y costos de tu zona.";
  var EXPLICAS = [
    [/^Margen proyectado al sembrar/, "Lo que esperabas ganar al sembrar, con el rinde esperado y el precio del futuro, menos los costos."],
    [/^Margen real sin cobertura/, "Lo que ganaste vendiendo a cosecha, con el rinde que se obtuvo, menos los costos."],
    [/^Margen real con cobertura/, "Lo que ganaste vendiendo a cosecha, más lo que dejó (o costó) el futuro, menos los costos."],
    [/^Promedio de las \d+ campañas de \(margen real con cobertura/, "En promedio por campaña, cuánto sumó o restó cubrirse."],
    [/^Promedio de las \d+ campañas de .*Σ \(hectáreas × margen\) ÷ Σ/, "El promedio de la rentabilidad sobre el valor de la tierra en las campañas."],
    [/^Promedio de las /, "El promedio de las campañas de 2020/21 a 2025/26."],
    [/^Cantidad de campañas de la serie/, "Las campañas con datos de tu zona: de 2020/21 a 2025/26."],
    [/^Cantidad de campañas con margen/, "Las campañas en las que cubrirse dejó más margen que no cubrirse."],
    [/^Desvío estándar muestral/, "Cuánto se alejó el margen real del proyectado, en general, de una campaña a otra."],
    [/^1 − riesgo/, "Cuánto bajó el riesgo con la cobertura."],
    [/^Σ \(hectáreas × margen\) ÷ Σ/, "El margen dividido por el valor de la tierra."],
    [/^margen ÷ V/, "El margen dividido por el valor de la tierra."],
    [/^Promedio simple de \(rinde real|^Rinde real ÷ rinde esperado/, "Cuánto se alejó el rinde que se obtuvo del que se esperaba."],
    [/^Margen real con cobertura − margen real sin cobertura/, "Lo que sumó o restó el futuro."],
    [/^h × \[rinde/, "Lo que se ganó o se perdió al cerrar la cobertura, menos la comisión."],
    [/^rinde esperado ÷ 10 × \(Fs/, "Lo que esperabas ganar al sembrar, con el rinde esperado y el precio del futuro, menos los costos."],
    [/^rinde real ÷ 10 × \(Sc/, "Lo que ganaste vendiendo a cosecha, con el rinde que se obtuvo, menos los costos."],
    [/^real sin cobertura \+ resultado/, "Lo que ganaste vendiendo a cosecha, más lo que dejó (o costó) el futuro."],
    [/^tabla de cosecha/, "Lo que cuesta cosechar según el rinde."]
  ];
  function explicaMC(origen) {
    if (typeof origen !== "string" || origen === "") return null;
    if (origen.indexOf(" › ") < 0 && origen.indexOf(" — parte de: ") < 0) return origen; // «Lo cargaste vos», «Lo elegiste vos…»
    if (origen.indexOf(" — parte de: ") < 0) return base().explicarOrigen(origen);
    var formula = origen.slice(0, origen.indexOf(" — parte de: "));
    for (var i = 0; i < EXPLICAS.length; i++) if (EXPLICAS[i][0].test(formula)) return EXPLICAS[i][1];
    return EXPLICA_GENERAL;
  }
  function numeroDe(celda) { return base().numero(celda.v, celda.formato, celda.origen, { explica: explicaMC(celda.origen) }); }

  function montar(contenedor) {
    var a = base();
    var el = a.el;
    var datos = raiz.TESIS_MOTOR.datosProductor(raiz.TESIS_DATOS);
    nodos = { cultivosMontados: null, entradas: {}, avisos: {} };

    nodos.invitacion = el("div", { id: "mc-invitacion", "class": "mc-invitacion tarjeta" }, [
      el("p", null, MENSAJE_INVITACION),
      el("a", { href: "#campana", "class": "boton" }, "Cargar mi campaña")
    ]);
    nodos.invitacion.hidden = true;
    contenedor.appendChild(nodos.invitacion);
    nodos.cuerpo = el("div", { "class": "mc-cuerpo" });
    contenedor.appendChild(nodos.cuerpo);
    // Al salir del asistente hay que partir de la campaña: se vuelve a calcular cuando cambia la dirección.
    if (typeof raiz.addEventListener === "function") {
      raiz.addEventListener("hashchange", function () { if (base().estado) actualizar(base().estado); });
    }

    nodos.cuerpo.appendChild(el("p", { "class": "mc-intro" },
      "Partís de tu campaña: tu zona, tus hectáreas y tu cobertura. Cambiá las hectáreas de cada cultivo o la parte cubierta y vas a ver qué habría pasado en cada campaña, de 2020/21 a 2025/26."));

    // La zona no se elige acá: es la que cargó el productor en el asistente.
    nodos.zona = el("p", { id: "mc-zona", "class": "mc-zona-fija" });

    nodos.hectareas = el("fieldset", null, el("legend", null, "Hectáreas por cultivo"));
    nodos.resultados = el("div", { id: "mc-resultados", "class": "mc-resultados" });
    nodos.tope = el("p", { id: "mc-tope", "class": "mc-tope", role: "alert" }, MENSAJE_TOPE);
    nodos.tope.hidden = true;
    nodos.parcela = el("div", { id: "mc-parcela", "class": "mc-parcela" });

    // Proporción cubierta con futuros: de 0 a 100 % de a 5.
    nodos.h = el("input", { type: "range", id: "mc-h", min: "0", max: "100", step: "5" });
    nodos.hValor = el("output", { id: "mc-h-valor", "for": "mc-h" });
    nodos.h.addEventListener("input", function () { a.cambiar({ h: Number(nodos.h.value) / 100 }); });

    nodos.unidad = el("select", { id: "mc-unidad" }, [
      el("option", { value: "USD/ha" }, "USD por hectárea"),
      el("option", { value: "USD totales" }, "USD totales")
    ]);
    nodos.unidad.addEventListener("change", function () { a.cambiar({ unidad: nodos.unidad.value }); });

    var entradas = el("div", { "class": "mc-entradas tarjeta" }, [
      el("span", { "class": "mc-rotulo" }, "Zona (la de tu campaña)"),
      nodos.zona,
      nodos.hectareas,
      el("p", { "class": "ayuda" }, "Números enteros; entre todos los cultivos, hasta 1.000 ha."),
      nodos.tope,
      el("label", { "for": "mc-h" }, "Parte cubierta con futuros"),
      el("div", { "class": "mc-campo-entrada" }, [nodos.h, nodos.hValor]),
      el("label", { "for": "mc-unidad" }, "Mostrar en"),
      nodos.unidad
    ]);
    nodos.cuerpo.appendChild(el("div", { "class": "mc-disposicion" }, [entradas, el("div", { "class": "mc-derecha" }, [nodos.parcela, nodos.resultados])]));
    nodos.cuerpo.appendChild(glosario());
  }

  // Glosario al pie de la sección (D-16): qué quiere decir cada sigla y cada término de la tabla.
  function glosario() {
    var el = base().el;
    var filas = [];
    TERMINOS.forEach(function (t) {
      filas.push(el("dt", null, t[0]));
      filas.push(el("dd", null, t[1]));
    });
    return el("section", { "class": "mc-glosario" }, [el("h3", null, "Glosario"), el("dl", null, filas)]);
  }

  // Una fila de entrada por cultivo de la zona; se rehace sólo al cambiar los cultivos.
  function armarEntradas(vista) {
    var a = base();
    var clave = vista.cultivos.join("|");
    if (nodos.cultivosMontados === clave) return;
    nodos.cultivosMontados = clave;
    nodos.entradas = {};
    nodos.avisos = {};
    var fieldset = nodos.hectareas;
    a.vaciar(fieldset);
    fieldset.appendChild(a.el("legend", null, "Hectáreas por cultivo"));
    vista.cultivos.forEach(function (cultivo) {
      var id = "mc-ha-" + cultivo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      var entrada = a.el("input", { type: "text", id: id, inputmode: "numeric", autocomplete: "off", "aria-describedby": id + "-error" });
      var aviso = a.el("p", { "class": "mc-error", id: id + "-error" }, MENSAJE_HECTAREAS);
      aviso.hidden = true;
      entrada.addEventListener("input", function () {
        var hectareas = Object.assign({}, a.estado.hectareas);
        hectareas[cultivo] = a.formato.leerHectareas(entrada.value).valor;
        a.cambiar({ hectareas: hectareas });
      });
      // Al salir del campo, un valor válido se reescribe normalizado (así se ve con cuántas ha se calculó).
      entrada.addEventListener("blur", function () {
        var leido = a.formato.leerHectareas(entrada.value);
        if (leido.valido) entrada.value = a.formato.entero(leido.valor);
      });
      nodos.entradas[cultivo] = entrada;
      nodos.avisos[cultivo] = aviso;
      fieldset.appendChild(a.el("div", { "class": "mc-campo-entrada" }, [
        a.el("label", { "for": id }, cultivo),
        entrada,
        a.el("span", null, "ha")
      ]));
      fieldset.appendChild(aviso);
    });
  }

  // Marca el campo como inválido (aria-invalid y aviso visible) si lo escrito no es un entero de 0 a 100.000.
  function marcarEntrada(cultivo) {
    var entrada = nodos.entradas[cultivo];
    var valido = base().formato.leerHectareas(entrada.value).valido;
    if (valido) entrada.removeAttribute("aria-invalid");
    else entrada.setAttribute("aria-invalid", "true");
    nodos.avisos[cultivo].hidden = valido;
  }

  // Campañas con el detalle abierto: se recuerdan para que sigan abiertas al repintar.
  var abiertas = {};

  function idDetalle(campana) {
    return "mc-detalle-" + campana.replace(/\//g, "-");
  }

  function textoBoton(abierto) {
    return abierto ? "Ocultar detalle" : "Ver detalle";
  }

  // Botón real (se maneja con teclado y lo anuncian los lectores de pantalla): abre y cierra el detalle.
  function botonDetalle(campana, filaDetalle) {
    var a = base();
    var boton = a.el("button", {
      type: "button",
      "class": "mc-ver-detalle",
      "aria-expanded": abiertas[campana] ? "true" : "false",
      "aria-controls": filaDetalle.getAttribute("id")
    }, textoBoton(abiertas[campana]));
    var describir = function () { boton.setAttribute("aria-label", textoBoton(abiertas[campana]) + " de " + campana); };
    describir();
    boton.addEventListener("click", function () {
      abiertas[campana] = !abiertas[campana];
      filaDetalle.hidden = !abiertas[campana];
      boton.setAttribute("aria-expanded", abiertas[campana] ? "true" : "false");
      boton.textContent = textoBoton(abiertas[campana]);
      describir();
    });
    return boton;
  }

  // Una celda del detalle: número con su origen o texto con su origen.
  function celdaDeDetalle(celda) {
    var a = base();
    if (typeof celda.texto === "string") {
      return a.el("td", null, a.el("span", { "data-origen": celda.origen, "data-explica": "El contrato a futuro de ese cultivo y los meses de siembra y de cosecha.", title: "El contrato a futuro de ese cultivo y los meses de siembra y de cosecha." }, celda.texto));
    }
    return a.el("td", null, numeroDe(celda));
  }

  // Detalle por cultivo de una campaña: una columna por cultivo y una fila por concepto.
  function pintarDetalle(fila) {
    var a = base();
    var el = a.el;
    var detalle = fila.detalle;
    var tabla = el("table", { "class": "mc-tabla-detalle" }, [
      el("caption", null, "Detalle por cultivo · " + fila.campana),
      el("thead", null, el("tr", null, [el("th", { scope: "col" }, "Concepto")].concat(
        detalle.cultivos.map(function (cultivo) { return el("th", { scope: "col" }, cultivo); })))),
      el("tbody", null, detalle.filas.map(function (f) {
        return el("tr", null, [el("th", { scope: "row" }, f.concepto)].concat(f.celdas.map(celdaDeDetalle)));
      }))
    ]);
    var tr = el("tr", { id: idDetalle(fila.campana), "class": "mc-detalle" },
      el("td", { colspan: "7" }, contenedorDeTabla("detalle-" + fila.campana, tabla)));
    tr.hidden = !abiertas[fila.campana];
    return tr;
  }

  // Primera columna de la tabla (V-1): la campaña y, debajo, su contexto en renglones chicos (el
  // desvío del rinde de los cultivos elegidos) y el botón del detalle.
  function celdaDeCampana(fila, detalle) {
    var a = base();
    var c = fila.contexto;
    return a.el("th", { scope: "row", "class": "mc-fila-campana" }, [
      a.el("span", { "class": "mc-campana" }, fila.campana),
      a.el("span", { "class": "mc-desvio" }, ["Rinde ", numeroDe(c.desvioRinde)]),
      botonDetalle(fila.campana, detalle)
    ]);
  }

  function pintarTabla(vista) {
    var a = base();
    var el = a.el;
    var titulo = vista.unidad === "USD/ha" ? "USD por hectárea" : "USD totales";
    var columna = function (texto, completo) {
      return el("th", { scope: "col", title: completo || null }, texto);
    };
    var encabezados = [columna("Campaña")]
      .concat(MARGENES.map(function (margen) {
        return el("th", { scope: "col", title: margen.nombre }, [el("span", { "class": "muestra-serie " + margen.serie, "aria-hidden": "true" }), ENCABEZADOS[margen.clave]]);
      }))
      .concat([columna("Resultado del futuro"), columna("Rentab. sin cobertura", "Rentabilidad real sin cobertura"), columna("Rentab. con cobertura", "Rentabilidad real con cobertura")]);
    var celda = function (c) { return el("td", null, numeroDe(c)); };
    var filas = [];
    vista.campanas.forEach(function (fila) {
      var detalle = pintarDetalle(fila);
      filas.push(el("tr", null, [celdaDeCampana(fila, detalle)].concat(
        MARGENES.map(function (margen) { return celda(fila[margen.clave]); }),
        [celda(fila.futuro), celda(fila.rentSin), celda(fila.rentCon)])));
      filas.push(detalle);
    });
    return contenedorDeTabla("tabla", el("table", { "class": "mc-tabla" }, [
      el("caption", null, "Resultado por campaña (" + titulo + ")"),
      el("thead", null, el("tr", null, encabezados)),
      el("tbody", null, filas)
    ]));
  }

  // Gráfico de barras por campaña con su leyenda en texto (los colores solos no alcanzan).
  function pintarGrafico(vista) {
    var a = base();
    var el = a.el;
    var svg = raiz.TESIS_GRAFICOS.barrasAgrupadas(raiz.document, Object.assign({ formatear: a.formato.usd, rotularCategoria: function (c) { return String(c).replace(/^20(\d\d)\/(\d\d)$/, "$1/$2"); } }, vista.grafico));
    var leyenda = el("ul", { "class": "leyenda" }, vista.grafico.series.map(function (serie) {
      return el("li", null, [el("span", { "class": "muestra-serie " + serie.clase, "aria-hidden": "true" }), serie.nombre]);
    }));
    var medida = "margen, en " + (vista.grafico.unidad === "USD/ha" ? "USD por hectárea" : "USD totales");
    return el("figure", { "class": "mc-grafico" }, [
      a.encabezadoDeGrafico(vista.grafico.titulo, medida),
      svg,
      el("figcaption", null, [leyenda, el("p", { "class": "ayuda" }, "Los valores exactos están en la tabla de abajo.")])
    ]);
  }

  // Nodos de una frase: el texto va como texto y cada celda como número con su origen.
  function nodosDeFrase(frase) {
    var a = base();
    return frase.map(function (parte) {
      return typeof parte === "string" ? parte : numeroDe(parte);
    });
  }

  // Un renglón de tarjeta: «Sin cobertura  1.234 USD/ha». Sin etiqueta (null) sólo muestra el valor:
  // en las tarjetas de márgenes el título de la tarjeta ya dice qué es.
  function renglon(etiqueta, celda, unidad) {
    var a = base();
    return a.el("p", { "class": "mc-renglon" }, [
      etiqueta ? a.el("span", { "class": "mc-etiqueta" }, etiqueta) : null,
      a.el("span", { "class": "mc-valor" }, [numeroDe(celda)].concat(unidad ? [a.el("span", { "class": "mc-unidad" }, " " + unidad)] : []))
    ]);
  }

  function tarjeta(titulo, serie, cuerpo) {
    var a = base();
    var encabezado = serie ? [a.el("span", { "class": "muestra-serie " + serie, "aria-hidden": "true" }), titulo] : titulo;
    return a.el("div", { "class": "tarjeta mc-tarjeta" }, [a.el("h4", null, encabezado)].concat(cuerpo));
  }

  // Seis tarjetas con el promedio de las campañas: márgenes, rentabilidad y riesgo.
  function pintarResumen(vista) {
    var a = base();
    var r = vista.resumen;
    var unidad = vista.grafico.unidad;
    var margenes = MARGENES.map(function (margen) {
      return tarjeta(margen.nombre, margen.serie, [renglon(null, r[margen.clave], unidad)]);
    });
    // Una línea debajo de las seis tarjetas (si va adentro de la de «Riesgo», esa queda mucho más alta).
    var ayudaRiesgo = a.el("p", { "class": "ayuda mc-ayuda-riesgo" },
      "Riesgo: cuánto se aleja el margen real del proyectado de una campaña a otra. Un número más chico es menos riesgo.");
    return a.el("section", { "class": "mc-resumen" }, [
      a.el("h3", null, nodosDeFrase(["Promedio de las ", vista.cantidadCampanas, " campañas"]))
    ].concat(margenes, [
      tarjeta("Rentabilidad sobre el valor de la tierra", null, [
        renglon("Sin cobertura", r.rentSin),
        renglon("Con cobertura", r.rentCon)
      ]),
      tarjeta("Riesgo", null, [
        renglon("Sin cobertura", r.riesgoSin, unidad),
        renglon("Con cobertura", r.riesgoCon, unidad),
        a.el("p", { "class": "mc-cambio" }, nodosDeFrase(fraseCambio(r.cambioRiesgo)))
      ]),
      tarjeta("Riesgo medido en rentabilidad", null, [
        renglon("Sin cobertura", r.riesgoRSin),
        renglon("Con cobertura", r.riesgoRCon),
        a.el("p", { "class": "mc-cambio" }, nodosDeFrase(fraseCambio(r.cambioRiesgoR)))
      ]),
      ayudaRiesgo
    ]));
  }

  // Lectura de lo que pasó, en frases cortas.
  function pintarLectura(vista) {
    var a = base();
    return a.el("section", { "class": "mc-lectura tarjeta" }, [
      a.el("h3", null, "Qué pasó en estas campañas")
    ].concat(vista.lectura.map(function (frase) { return a.el("p", null, nodosDeFrase(frase)); })));
  }

  // Si falla el cálculo se borran los resultados viejos (no pueden quedar cifras que no corresponden
  // a lo que se ve en los controles) y el error va ARRIBA de la zona de resultados, como alerta.
  function mostrarError(error) {
    var a = base();
    a.vaciar(nodos.resultados);
    nodos.resultados.appendChild(a.el("p", { "class": "mc-mensaje", role: "alert" }, "No se pudo calcular: " + error.message));
  }

  // La campaña que cargó el productor en el asistente: zona, hectáreas por cultivo y cobertura. null si todavía no cargó nada.
  // La cobertura de cada cultivo se lee de lo que cargó; la mezcla usa una sola proporción: si todos los cultivos tienen la
  // misma, esa; si no, el promedio ponderado por hectáreas (de a 5 %).
  function campanaCargada() {
    var ui = raiz.TESIS_CAMPANA_UI;
    if (!ui || typeof ui.vista !== "function" || typeof ui.contexto !== "function") return null;
    var v = ui.vista(), c = ui.contexto();
    if (!v || !c || !v.cultivos || !v.nombres || !c.zona) return null;
    if (base().zonasDisponibles(raiz.TESIS_DATOS).indexOf(c.zona) < 0) return null;
    var hectareas = {}, total = 0, pesada = 0, hp = c.h !== null && typeof c.h === "object" ? c.h : null;
    var distintas = false, primera = null;
    v.nombres.forEach(function (n) {
      var ha = Number(v.cultivos[n] && v.cultivos[n].ha);
      hectareas[n] = isFinite(ha) && ha > 0 ? Math.round(ha) : 0;
      var x = hp && typeof hp[n] === "number" ? hp[n] : (typeof c.h === "number" ? c.h : 0);
      if (primera === null) primera = x; else if (x !== primera) distintas = true;
      total += hectareas[n];
      pesada += hectareas[n] * x;
    });
    var h = distintas && total > 0 ? pesada / total : (primera || 0);
    h = Math.round(Math.min(1, Math.max(0, h)) * 20) / 20;
    return { zona: c.zona, hectareas: hectareas, h: h };
  }

  // Parcela: el campo en hectáreas, con franjas por cultivo y la parte cubierta marcada. La dibuja campana-visual.js;
  // si esa función no está, no se muestra nada.
  function pintarParcela(zona, hectareas, h) {
    var V = raiz.TESIS_VISUAL;
    if (!V || typeof V.crearParcela !== "function") return; // sin la función no se muestra nada
    try {
      var cultivos = Object.keys(hectareas).filter(function (c) { return hectareas[c] > 0; });
      nodos.parcela.hidden = cultivos.length === 0;
      if (!cultivos.length) return;
      var hp = {};
      cultivos.forEach(function (c) { hp[c] = h; });
      var datosParcela = { cultivos: cultivos, hectareas: hectareas, h: hp };
      if (!nodos.parcelaVisual) {
        nodos.parcelaVisual = V.crearParcela(datosParcela);
        nodos.parcela.appendChild(nodos.parcelaVisual.nodo);
      } else {
        nodos.parcelaVisual.actualizar(datosParcela);
      }
    } catch (e) {
      base().vaciar(nodos.parcela);
      nodos.parcelaVisual = null;
    }
  }

  // Mientras la persona está en el asistente («Simulá tu campaña») esta sección no toca el estado compartido:
  // parte de la campaña cuando sale de ahí.
  function enElAsistente() {
    var hash = raiz.location && typeof raiz.location.hash === "string" ? raiz.location.hash : "";
    return hash === "" || hash === "#" || hash.indexOf("#campana") === 0;
  }

  function actualizar(estado) {
    var a = base();
    try {
      if (enElAsistente()) return;
      var cargada = campanaCargada();
      nodos.invitacion.hidden = !!cargada;
      nodos.cuerpo.hidden = !cargada;
      if (!cargada) { a.vaciar(nodos.resultados); a.vaciar(nodos.parcela); nodos.semilla = null; return; }
      // Una campaña nueva en el asistente: la zona, las hectáreas y la cobertura de acá parten de lo que cargó.
      var clave = JSON.stringify(cargada);
      if (nodos.semilla !== clave) {
        nodos.semilla = clave;
        a.cambiar({ zona: cargada.zona, hectareas: cargada.hectareas, h: cargada.h });
        return;
      }
      var e = a.normalizarEstado(estado, raiz.TESIS_MOTOR.datosProductor(raiz.TESIS_DATOS), 0);
      if (e.zona !== cargada.zona) {
        a.cambiar({ zona: cargada.zona });
        return;
      }
      var cultivos = raiz.TESIS_MOTOR.cultivosDe(raiz.TESIS_MOTOR.datosProductor(raiz.TESIS_DATOS), e.zona);
      var total = suma(cultivos.map(function (c) { return e.hectareas[c]; }));
      var pasado = total > HECTAREAS_TOPE;
      nodos.tope.hidden = !pasado;
      var vista = pasado
        ? { zona: e.zona, cultivos: cultivos, hectareas: e.hectareas, h: e.h, unidad: e.unidad, mensaje: MENSAJE_TOPE }
        : armarVista(raiz.TESIS_MOTOR.datosProductor(raiz.TESIS_DATOS), estado);
      armarEntradas(vista);
      nodos.zona.textContent = vista.zona;
      // Deslizador y unidad se sincronizan sin rehacer las entradas (no se pierde el foco al escribir).
      nodos.h.value = String(Math.round(vista.h * 100));
      nodos.hValor.textContent = a.formato.numero(vista.h * 100, 0) + NBSP + "%";
      nodos.unidad.value = vista.unidad;
      vista.cultivos.forEach(function (cultivo) {
        var entrada = nodos.entradas[cultivo];
        // No se pisa lo que la persona está escribiendo si ya vale lo mismo (un texto inválido vale 0).
        if (a.formato.leerEntero(entrada.value) !== vista.hectareas[cultivo]) entrada.value = a.formato.entero(vista.hectareas[cultivo]);
        marcarEntrada(cultivo);
      });
      pintarParcela(vista.zona, vista.hectareas, vista.h);
      // Se recuerda el scroll horizontal de cada tabla y se devuelve al repintar.
      var desplazamientos = {};
      Object.keys(contenedores).forEach(function (k) { desplazamientos[k] = contenedores[k].scrollLeft; });
      contenedores = {};
      a.vaciar(nodos.resultados);
      if (pasado) {
        // El aviso rojo está arriba; sin resultados mientras se pase del tope.
      } else if (vista.mensaje) {
        nodos.resultados.appendChild(a.el("p", { "class": "mc-mensaje", role: "status" }, vista.mensaje));
      } else {
        nodos.resultados.appendChild(pintarResumen(vista));
        nodos.resultados.appendChild(pintarGrafico(vista));
        nodos.resultados.appendChild(pintarLectura(vista));
        nodos.resultados.appendChild(pintarTabla(vista));
        Object.keys(contenedores).forEach(function (k) {
          if (desplazamientos[k]) contenedores[k].scrollLeft = desplazamientos[k];
        });
      }
    } catch (err) {
      mostrarError(err);
    }
  }

  // Deja la zona de resultados vacía (la usa la base si el cálculo falla por otro camino).
  function limpiar() {
    if (nodos) base().vaciar(nodos.resultados);
  }

  var seccion = { id: "mi-campo", titulo: "Probá variantes", grupo: "historico", montar: montar, actualizar: actualizar, limpiar: limpiar };

  var api = { armarVista: armarVista, textoDeFrase: textoDeFrase, seccion: seccion, FORMULAS: FORMULAS };
  raiz.TESIS_MI_CAMPO = api;
  // Sin la base común la sección desaparecería sin decir nada: mejor un error claro en la consola.
  if (!raiz.TESIS_APP) throw new Error("mi-campo.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
