// Sección «Rentabilidad vs. K»: compara la rentabilidad sobre el valor de la tierra de la selección de
// «Mi campo» (zona, hectáreas por cultivo y parte cubierta con futuros) con el costo de capital K de
// cada año, y muestra aparte las tablas de referencia de la tesis.
// R sale de TESIS_MOTOR.mezcla (rinde real de cada campaña) y los K salen sólo del libro del CAPM
// (datos.k): acá no se repite ninguna cuenta de márgenes, de rentabilidad ni de K.
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
(function (raiz) {
  "use strict";

  var NBSP = " "; // espacio duro: el «%» nunca queda solo en la línea siguiente
  var RAYA = "–"; // raya corta de los rangos de años

  var MENSAJE_SIN_HECTAREAS = "Cargá hectáreas en al menos un cultivo en «Mi campo» para ver tu rentabilidad.";

  var FORMULAS = {
    rentabilidad: "Σ (hectáreas × margen real) ÷ Σ (hectáreas × valor de la tierra V)",
    brecha: "Rentabilidad − K base del año de cosecha",
    // Lo «con cobertura» depende de la parte cubierta h: parte de las entradas, nunca de las celdas de resultado.
    futuro: "margen real con cobertura = margen real sin cobertura + resultado del futuro, con resultado del futuro = h × [rinde esperado ÷ 10 × (Fs − Fc) − comisión × rinde esperado ÷ 10 × Fs]"
  };

  var TITULO_GRAFICO = "Rentabilidad real sobre el valor de la tierra y costo de capital K, por campaña";
  var AVISO_FINAL = "Esto describe lo que pasó en estas campañas; no es una recomendación.";

  // Referencia de la tesis (D-05): las tablas B y C de Brecha_R_vs_K, tal como están en el Excel de rentabilidad.
  var TITULO_REFERENCIA = "Referencia de la tesis: promedio de zonas con rinde de planteo";
  // Qué quiere decir cada columna: «con cobertura» es la proporción cubierta del Excel de cobertura (Parametros › B7, hoy el
  // 100 %), «spot» es sin cobertura; el rinde es el de planteo fijo de Márgenes Agropecuarios y el valor, el promedio de las zonas.
  var ACLARACION_REFERENCIA_1 = "Estas tablas son las de la tesis, tal como están en el Excel de rentabilidad (hoja Brecha_R_vs_K): " +
    "promedio de todas las zonas con el rinde de planteo fijo de Márgenes Agropecuarios. «Con cobertura» es con el ";
  var ACLARACION_REFERENCIA_2 = " cubierto con futuros (la proporción cubierta de la hoja Parametros, celda B7, del Excel de cobertura) y «spot» es sin cobertura. " +
    "No se comparan uno a uno con tu cifra de arriba, que usa el rinde real de cada campaña (MAGyP), tu zona, tus cultivos y la parte cubierta que elegiste vos.";
  // Las seis columnas de las tablas de referencia: clave en datos.referenciaTesis y encabezado.
  var COLUMNAS_REFERENCIA = [
    ["trigoCobertura", "Trigo", true], ["trigoSpot", "Trigo", false],
    ["sojaCobertura", "Soja", true], ["sojaSpot", "Soja", false],
    ["maizCobertura", "Maíz", true], ["maizSpot", "Maíz", false]
  ];
  var SIN_COBERTURA = "sin cobertura";
  var CON_COBERTURA = "con cobertura";

  function base() { return raiz.TESIS_APP; }

  function esNumero(x) {
    return typeof x === "number" && isFinite(x);
  }

  function sonIguales(a, b, tolerancia) {
    return esNumero(a) && esNumero(b) && Math.abs(a - b) <= tolerancia;
  }

  function celda(v, formato, origen) {
    return { v: v, formato: formato, origen: origen };
  }

  function enteroConPorcentaje(proporcion) {
    return base().formato.numero(proporcion * 100, 0) + NBSP + "%";
  }

  // Nota de origen con la h que eligió la persona (dato propio, no sale de ninguna celda).
  function notaH(h) {
    return "proporción cubierta elegida: " + enteroConPorcentaje(h) + " (la elegiste vos)";
  }

  // Una frase es una lista de partes: texto o celda { v, formato, origen }.
  function textoDeFrase(frase) {
    var formato = base().formato;
    return frase.map(function (parte) {
      return typeof parte === "string" ? parte : formato.aplicar(parte.formato, parte.v);
    }).join("");
  }

  // Lo que dice la selección, en una línea: zona, cultivos con hectáreas y parte cubierta.
  function textoDeSeleccion(e, cultivos) {
    var formato = base().formato;
    var partes = [e.zona];
    var conHectareas = cultivos.filter(function (cultivo) { return e.hectareas[cultivo] > 0; });
    if (conHectareas.length === 0) partes.push("sin hectáreas cargadas");
    conHectareas.forEach(function (cultivo) { partes.push(cultivo + " " + formato.entero(e.hectareas[cultivo]) + " ha"); });
    partes.push(enteroConPorcentaje(e.h) + " cubierto con futuros");
    return partes.join(" · ");
  }

  // β que comparten los años del libro (una celda con las cinco celdas de origen) o null si difieren.
  function celdaBeta(lista) {
    if (!Array.isArray(lista) || lista.length === 0) return null;
    var v = lista[0].v;
    var iguales = lista.every(function (x) { return sonIguales(x.v, v, 1e-12); });
    if (!iguales) return null;
    return celda(v, "beta", base().unirOrigenes(lista.map(function (x) { return x.o; })));
  }

  function indiceDeK(datos, anio) {
    var anios = datos.k.anios;
    for (var i = 0; i < anios.length; i++) if (anios[i].v === anio) return i;
    return -1;
  }

  // Caso (cultivo + zona + campaña) del Excel que hay detrás de la mezcla.
  function casoDe(datos, cultivo, zona, campana) {
    var caso = raiz.TESIS_MOTOR.casosDe(datos, cultivo, zona).filter(function (c) { return c.campana === campana; })[0];
    if (!caso) throw new Error("No hay datos de " + cultivo + " en " + zona + " para la campaña " + campana);
    return caso;
  }

  // Modelo de vista: función pura, sin DOM y sin formatear. Cada cifra es { v, formato, origen }.
  function armarVista(datos, estado) {
    var app = base();
    var motor = raiz.TESIS_MOTOR;
    // Cultivo que falta en el estado = 0 ha (acá no se inventan hectáreas).
    var e = app.normalizarEstado(estado, datos, 0);
    var cultivos = motor.cultivosDe(datos, e.zona);
    var vista = {
      zona: e.zona,
      h: e.h,
      seleccion: textoDeSeleccion(e, cultivos),
      mensaje: "",
      filas: [],
      conteo: null,
      conteoCeldas: null,
      debajoAnios: null,
      debajoCeldas: null,
      promedios: null,
      betaBase: null,
      betaSignificativo: null,
      sinK: datos.k.sinK,
      grafico: null,
      lectura: null
    };
    var total = cultivos.reduce(function (suma, cultivo) { return suma + e.hectareas[cultivo]; }, 0);
    if (!(total > 0)) {
      vista.mensaje = MENSAJE_SIN_HECTAREAS;
      return vista;
    }

    var m = raiz.TESIS_MOTOR.mezcla(datos, e.zona, { hectareasPorCultivo: e.hectareas, h: e.h });
    var hDelExcel = Math.abs(m.h - datos.parametros.h.v) < 1e-9;
    var nota = [notaH(m.h)];
    var partes = []; // por fila: las celdas de las que parten R sin y R con cobertura

    vista.filas = m.porCampana.map(function (p) {
      var casos = m.cultivos.map(function (cultivo) { return casoDe(datos, cultivo, m.zona, p.campana); });
      var origenDe = function (campos) {
        var lista = [];
        casos.forEach(function (caso) { campos.forEach(function (campo) { lista.push(motor.origen(caso, campo, datos)); }); });
        return lista;
      };
      var parteSin = origenDe(["excel.mbRealSin", "v"]);
      // El «con cobertura» parte del real sin cobertura, el rinde esperado, Fs, Fc, V y la comisión; la h es la elegida.
      var parteCon = origenDe(["excel.mbRealSin", "rindeEsperado", "fs", "fc", "v"]).concat([datos.parametros.comision.o]);
      partes.push({ sin: parteSin, con: parteCon });

      // Con un solo cultivo la cifra es la celda del Excel: sólo si de verdad lo es (y, con cobertura, si h es la del Excel).
      var unCultivo = casos.length === 1;
      var enExcelSin = unCultivo && sonIguales(p.rRealSin, casos[0].excel.rRealSin, 1e-9) ? [motor.origen(casos[0], "excel.rRealSin", datos)] : null;
      var enExcelCon = unCultivo && hDelExcel && sonIguales(p.rRealCon, casos[0].excel.rRealCon, 1e-9) ? [motor.origen(casos[0], "excel.rRealCon", datos)] : null;
      var rSin = celda(p.rRealSin, "porcentaje",
        app.origenCalculado("Rentabilidad real " + SIN_COBERTURA + ": " + FORMULAS.rentabilidad, parteSin, enExcelSin));
      var rCon = celda(p.rRealCon, "porcentaje",
        app.origenCalculado("Rentabilidad real " + CON_COBERTURA + ": " + FORMULAS.rentabilidad + ", con " + FORMULAS.futuro, parteCon, enExcelCon, nota));

      // K del año de cosecha (D-02): sólo de datos.k. Una campaña sin año en el libro queda sin K.
      var i = indiceDeK(datos, p.anioCosecha);
      var fila = { campana: p.campana, anio: p.anioCosecha, rSin: rSin, rCon: rCon, kBase: null, kBeta: null, embi: null, brechaSin: null, brechaCon: null, sinK: datos.k.sinK };
      if (i >= 0) {
        var kBase = datos.k.base.k[i];
        var kBeta = datos.k.betaSignificativo.k[i];
        fila.kBase = celda(kBase.v, "porcentaje", kBase.o);
        fila.kBeta = celda(kBeta.v, "porcentaje", kBeta.o);
        // El riesgo país (EMBI) que lleva K ese año: una de las celdas del CAPM, tal cual.
        var embi = datos.k.componentes && datos.k.componentes.embi ? datos.k.componentes.embi[i] : null;
        fila.embi = embi ? celda(embi.v, "porcentaje", embi.o) : null;
        fila.brechaSin = celda(rSin.v - kBase.v, "puntos",
          app.origenCalculado(FORMULAS.brecha + " (" + SIN_COBERTURA + ")", parteSin.concat([kBase.o])));
        fila.brechaCon = celda(rCon.v - kBase.v, "puntos",
          app.origenCalculado(FORMULAS.brecha + " (" + CON_COBERTURA + "), con " + FORMULAS.futuro, parteCon.concat([kBase.o]), null, nota));
        fila.sinK = null;
      }
      return fila;
    });

    vista.betaBase = celdaBeta(datos.k.base.beta);
    vista.betaSignificativo = celdaBeta(datos.k.betaSignificativo.beta);
    vista.grafico = armarGrafico(vista.filas);

    // Las cuentas de abajo sólo cuentan los años que tienen K.
    var conK = [];
    vista.filas.forEach(function (fila, indice) { if (fila.kBase) conK.push(indice); });
    if (conK.length > 0) {
      var filasK = conK.map(function (indice) { return vista.filas[indice]; });
      var unir = function (campo) {
        var lista = [];
        conK.forEach(function (indice) { lista = lista.concat(partes[indice][campo]); });
        return lista;
      };
      var rango = filasK[0].anio + RAYA + filasK[filasK.length - 1].anio;
      var celdasK = filasK.map(function (fila) { return fila.kBase.origen; });
      var promedioDe = function (clave) { return motor.promedio(filasK.map(function (fila) { return fila[clave].v; })); };
      var desdeSin = unir("sin");
      var desdeCon = unir("con");
      // El promedio de K se hace sobre los MISMOS años que R y las brechas (los que tienen K). Sólo si son todos los
      // del libro y da lo mismo que su celda de promedio (H11 y H34), esa celda se nombra como «en el Excel».
      var promedioDeK = function (clave, bloque, nombre) {
        var valor = promedioDe(clave);
        var todosLosAnios = filasK.length === bloque.k.length; // la celda del libro promedia todos los años de su fila de K
        var enExcel = todosLosAnios && sonIguales(valor, bloque.promedio.v, 1e-9) ? [bloque.promedio.o] : null;
        return celda(valor, "porcentaje", app.origenCalculado("Promedio " + rango + " de " + nombre,
          filasK.map(function (fila) { return fila[clave].origen; }), enExcel));
      };
      vista.promedios = {
        rango: rango,
        rSin: celda(promedioDe("rSin"), "porcentaje",
          app.origenCalculado("Promedio " + rango + " de la rentabilidad real " + SIN_COBERTURA + ": " + FORMULAS.rentabilidad, desdeSin)),
        rCon: celda(promedioDe("rCon"), "porcentaje",
          app.origenCalculado("Promedio " + rango + " de la rentabilidad real " + CON_COBERTURA + ": " + FORMULAS.rentabilidad + ", con " + FORMULAS.futuro, desdeCon, null, nota)),
        kBase: promedioDeK("kBase", datos.k.base, "K base"),
        kBeta: promedioDeK("kBeta", datos.k.betaSignificativo, "K con β significativo"),
        brechaSin: celda(promedioDe("brechaSin"), "puntos",
          app.origenCalculado("Promedio " + rango + " de (" + FORMULAS.brecha + ", " + SIN_COBERTURA + ")", desdeSin.concat(celdasK))),
        brechaCon: celda(promedioDe("brechaCon"), "puntos",
          app.origenCalculado("Promedio " + rango + " de (" + FORMULAS.brecha + ", " + CON_COBERTURA + "), con " + FORMULAS.futuro, desdeCon.concat(celdasK), null, nota))
      };
      var superan = function (clave) {
        return filasK.filter(function (fila) { return fila[clave].v > fila.kBase.v; }).length;
      };
      vista.conteo = { sin: superan("rSin"), con: superan("rCon"), total: filasK.length };
      // Años en que R quedó por debajo de K base (de los que tienen K): se cuentan y se nombran uno por uno.
      var debajo = function (clave) {
        return filasK.filter(function (fila) { return fila[clave].v < fila.kBase.v; }).map(function (fila) { return fila.anio; });
      };
      vista.debajoAnios = { sin: debajo("rSin"), con: debajo("rCon") };
      vista.conteoCeldas = {
        sin: celda(vista.conteo.sin, "entero",
          app.origenCalculado("Cantidad de años de " + rango + " con rentabilidad " + SIN_COBERTURA + " mayor que K base", desdeSin.concat(celdasK))),
        con: celda(vista.conteo.con, "entero",
          app.origenCalculado("Cantidad de años de " + rango + " con rentabilidad " + CON_COBERTURA + " mayor que K base", desdeCon.concat(celdasK), null, nota)),
        total: celda(vista.conteo.total, "entero",
          app.origenCalculado("Cantidad de años de " + rango + " con K en el libro del CAPM", celdasK))
      };
      vista.debajoCeldas = {
        sin: celda(vista.debajoAnios.sin.length, "entero",
          app.origenCalculado("Cantidad de años de " + rango + " con rentabilidad " + SIN_COBERTURA + " menor que K base", desdeSin.concat(celdasK))),
        con: celda(vista.debajoAnios.con.length, "entero",
          app.origenCalculado("Cantidad de años de " + rango + " con rentabilidad " + CON_COBERTURA + " menor que K base", desdeCon.concat(celdasK), null, nota))
      };
    }
    vista.lectura = armarLectura(vista);
    return vista;
  }

  // «2021, 2022 y 2023».
  function enumerar(lista) {
    if (lista.length <= 1) return lista.join("");
    return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
  }

  // Lectura en texto simple (D-04): cuenta lo que pasó, sin recomendar y sin explicar causas que los datos no muestran.
  // Cada frase es una lista de partes (texto o celda con su origen). R no incluye la valorización del campo y eso
  // se dice con todas las letras. El aviso de 2025/26 (sin K) no va acá: ya está en el gráfico y en la tabla.
  function armarLectura(vista) {
    var frases = [];
    if (vista.conteoCeldas && vista.promedios) {
      var c = vista.conteoCeldas;
      var p = vista.promedios;
      var d = vista.debajoCeldas;
      frases.push(["La rentabilidad superó a K base en ", c.sin, " de ", c.total, " años sin cobertura y en ", c.con, " de ", c.total,
        " con cobertura (" + p.rango + ")."]);

      // En qué años R quedó por debajo de K base, año por año (todos los que cumplen).
      var anios = vista.debajoAnios;
      var conAnios = function (lista) { return lista.length ? " (" + enumerar(lista.map(String)) + ")" : ""; };
      if (anios.sin.length === 0 && anios.con.length === 0) {
        frases.push(["R no quedó por debajo de K base en ningún año."]);
      } else {
        frases.push(["R quedó por debajo de K base en ", d.sin, " de ", c.total, " años sin cobertura" + conAnios(anios.sin) +
          " y en ", d.con, " de ", c.total, " con cobertura" + conAnios(anios.con) + "."]);
      }
      frases.push(["La brecha promedio (R − K base) fue de ", p.brechaSin, " sin cobertura y de ", p.brechaCon, " con cobertura."]);

      // El riesgo país (EMBI) que lleva K cada año, tal como está en el libro del CAPM.
      var filasK = vista.filas.filter(function (fila) { return fila.kBase; });
      if (filasK.length > 0 && filasK.every(function (fila) { return fila.embi; })) {
        var riesgoPais = ["El riesgo país (EMBI) que lleva K fue de "];
        filasK.forEach(function (fila, i) {
          if (i > 0) riesgoPais.push(i === filasK.length - 1 ? " y " : ", ");
          riesgoPais.push(fila.embi, " en " + fila.anio);
        });
        riesgoPais.push(".");
        frases.push(riesgoPais);
      }
      frases.push(["R es la renta operativa del año sobre el valor de la tierra y no incluye lo que se valorizó el campo: que R esté por debajo de K no quiere decir, por sí solo, que el campo haya perdido plata."]);
    }
    frases.push([AVISO_FINAL]);
    return frases;
  }

  // Tablas de referencia de la tesis (D-05): pura y sin recalcular nada; cada celda es la del Excel con su origen.
  // No depende de la selección: se arma una sola vez.
  function armarReferencia(datos) {
    var ref = datos.referenciaTesis;
    var hExcel = datos.parametros.h;
    var hTexto = base().formato.porcentaje(hExcel.v);
    // Los encabezados dicen qué cobertura es: la de Parametros › B7 (hoy el 100 %) o «spot» = sin cobertura.
    var encabezado = function (columna) { return columna[1] + (columna[2] ? " con cobertura (" + hTexto + ")" : " spot (sin cobertura)"); };
    // La nota del Excel repite el título; de ella sólo se muestra la segunda oración (no es la cifra con rinde real).
    var corte = typeof ref.nota === "string" ? ref.nota.indexOf(". ") : -1;
    var segunda = corte >= 0 ? ref.nota.slice(corte + 2) : ref.nota;
    var aclaracionFrase = [ACLARACION_REFERENCIA_1, celda(hExcel.v, "porcentaje", hExcel.o), ACLARACION_REFERENCIA_2 + " " + segunda];
    var tabla = function (id, titulo, bloque, formato) {
      var celdas = function (fila) {
        return COLUMNAS_REFERENCIA.map(function (columna) {
          var x = fila[columna[0]];
          return celda(x.v, formato, x.o);
        });
      };
      return {
        id: id,
        titulo: titulo,
        columnas: COLUMNAS_REFERENCIA.map(encabezado),
        filas: bloque.filas.map(function (fila) { return { campana: fila.campana, anio: fila.anio.v, celdas: celdas(fila) }; }),
        promedio: celdas(bloque.promedio)
      };
    };
    return {
      titulo: TITULO_REFERENCIA,
      nota: ref.nota,
      aclaracionFrase: aclaracionFrase,
      aclaracion: textoDeFrase(aclaracionFrase),
      tablas: [
        tabla("rk-ref-r", "Rentabilidad por cultivo con cobertura y spot", ref.r, "porcentaje"),
        tabla("rk-ref-brecha", "Brecha R − K base por cultivo (en puntos porcentuales)", ref.brechaBase, "puntos")
      ]
    };
  }

  // Datos del gráfico: los mismos valores de la tabla (acá no se recalcula nada). Las dos líneas de K se cortan
  // donde no hay K (2025/26): ahí el valor es null.
  function armarGrafico(filas) {
    var valores = function (clave) { return filas.map(function (fila) { return fila[clave].v; }); };
    var valoresK = function (clave) { return filas.map(function (fila) { return fila[clave] ? fila[clave].v : null; }); };
    return {
      titulo: TITULO_GRAFICO,
      unidad: "",
      categorias: filas.map(function (fila) { return fila.campana; }),
      series: [
        { nombre: "Rentabilidad real " + SIN_COBERTURA, clase: "serie-sin", valores: valores("rSin") },
        { nombre: "Rentabilidad real " + CON_COBERTURA, clase: "serie-con", valores: valores("rCon") }
      ],
      lineas: [
        { nombre: "K base", clase: "serie-k-base", discontinua: false, valores: valoresK("kBase") },
        { nombre: "K con β significativo", clase: "serie-k-beta", discontinua: true, valores: valoresK("kBeta") }
      ]
    };
  }

  // ---------------------------------------------------------------------------------------
  // Pintado
  // ---------------------------------------------------------------------------------------

  var nodos = null; // se arma en montar()

  // Qué se pintó ya: los bloques que dependen de la selección se rehacen sólo si la selección cambió.
  var pintado = { datos: null, clave: null };

  // Un número de una tabla larga: con origen (se toca) pero sin ser parada de tabulador; el teclado
  // llega a su origen por el botón «Ver orígenes» de la fila.
  function numeroSinTabulador(c) {
    return base().numero(c.v, c.formato, c.origen, { enfocable: false });
  }

  // El botón «Ver orígenes» de una fila: UNA parada de tabulador por fila en vez de una por número.
  // Abre la lista de orígenes de todos los números de la fila (se arma recién al tocarlo).
  function botonOrigenes(nombre, aria, items) {
    var a = base();
    var boton = a.el("button", { type: "button", "class": "df-ver-origenes", "aria-label": aria }, "Ver orígenes");
    a.vincularOrigenes(boton, function () { return { titulo: nombre, items: items() }; });
    return boton;
  }

  // Nodos de una frase: el texto va como texto y cada celda como número con su origen.
  function nodosDeFrase(frase) {
    var a = base();
    return frase.map(function (parte) {
      return typeof parte === "string" ? parte : a.numero(parte.v, parte.formato, parte.origen);
    });
  }

  function montar(contenedor) {
    var a = base();
    var el = a.el;
    nodos = {};
    contenedor.appendChild(el("p", { "class": "mc-intro" },
      "Compará la rentabilidad de tu campo con el costo de capital K de cada año."));
    contenedor.appendChild(el("p", { "class": "ayuda" },
      "R es la renta operativa del año sobre el valor de la tierra (margen ÷ V). No incluye lo que se valorizó el campo. " +
      "K es el costo de capital de cada año (CAPM con el riesgo país). R por debajo de K no quiere decir que el campo haya perdido plata."));
    nodos.seleccion = el("p", { id: "rk-seleccion", "class": "rk-seleccion" });
    nodos.resultados = el("div", { id: "rk-resultados" });
    contenedor.appendChild(nodos.seleccion);
    contenedor.appendChild(nodos.resultados);
    pintado = { datos: null, clave: null };
    // La referencia de la tesis no depende de la selección: se pinta una sola vez, aparte de los resultados.
    contenedor.appendChild(pintarReferencia(armarReferencia(raiz.TESIS_DATOS)));
  }

  // Una tabla de referencia: las celdas tal cual vienen del Excel, sin tabulador por número y con un botón por fila.
  function pintarTablaReferencia(tabla) {
    var a = base();
    var el = a.el;
    var itemsDe = function (celdas) {
      return celdas.map(function (c, i) { return { etiqueta: tabla.columnas[i], v: c.v, formato: c.formato, origen: c.origen }; });
    };
    var filaDe = function (nombre, celdas) {
      var boton = botonOrigenes(tabla.titulo + " · " + nombre, "Ver orígenes de los números de " + nombre + " en la tabla «" + tabla.titulo + "»", function () { return itemsDe(celdas); });
      return el("tr", null, [
        el("th", { scope: "row", "class": "mc-fila-campana" }, [el("span", { "class": "mc-campana" }, nombre)])
      ].concat(celdas.map(function (c) { return el("td", null, numeroSinTabulador(c)); }), [el("td", { "class": "col-origenes" }, boton)]));
    };
    return el("div", { "class": "tabla-contenedor" }, el("table", { id: tabla.id, "class": "mc-tabla rk-tabla rk-tabla-ref" }, [
      el("caption", null, tabla.titulo),
      el("thead", null, el("tr", null, [el("th", { scope: "col" }, "Campaña")].concat(
        tabla.columnas.map(function (texto) { return el("th", { scope: "col" }, texto); }),
        [el("th", { scope: "col", "class": "col-origenes" }, "Orígenes")]))),
      el("tbody", null, tabla.filas.map(function (fila) { return filaDe("campaña " + fila.campana, fila.celdas); })),
      el("tfoot", null, filaDe("promedio", tabla.promedio))
    ]));
  }

  function pintarReferencia(ref) {
    var el = base().el;
    return el("section", { id: "rk-referencia", "class": "rk-referencia" }, [
      el("h3", null, ref.titulo),
      el("p", { "class": "ayuda" }, nodosDeFrase(ref.aclaracionFrase))
    ].concat(ref.tablas.map(pintarTablaReferencia)));
  }

  // «Tu selección: …. Cambiarla en Mi campo» (el enlace lleva a la pestaña de «Mi campo»).
  function pintarSeleccion(vista) {
    var a = base();
    a.vaciar(nodos.seleccion);
    nodos.seleccion.appendChild(raiz.document.createTextNode("Tu selección: " + vista.seleccion + ". "));
    nodos.seleccion.appendChild(a.el("a", { href: "#mi-campo" }, "Cambiarla en Mi campo"));
  }

  // Los β de cada K, en una línea con sus números (no van en los encabezados: ahí no serían tocables con teclado).
  function pintarBetas(vista) {
    var a = base();
    var parte = function (nombre, c) {
      return c ? [nombre + " usa β = ", a.numero(c.v, c.formato, c.origen)] : [nombre + " usa un β distinto según el año"];
    };
    return a.el("p", { "class": "ayuda" }, parte("K base", vista.betaBase).concat(
      ["; "], parte("K con β significativo", vista.betaSignificativo),
      [". La brecha es R − K base, en puntos porcentuales (p.p.): es la resta de los dos porcentajes, no un cambio relativo. Negativa quiere decir que R quedó debajo de K."]));
  }

  // Celdas de una fila para la lista de «Ver orígenes».
  function itemsDeFila(fila) {
    var items = [];
    var agregar = function (etiqueta, c) {
      if (c) items.push({ etiqueta: etiqueta, v: c.v, formato: c.formato, origen: c.origen });
    };
    agregar("R sin cobertura", fila.rSin);
    agregar("R con cobertura", fila.rCon);
    agregar("K base", fila.kBase);
    agregar("K con β significativo", fila.kBeta);
    agregar("Brecha sin cobertura", fila.brechaSin);
    agregar("Brecha con cobertura", fila.brechaCon);
    return items;
  }

  function pintarTabla(vista) {
    var a = base();
    var el = a.el;
    var celdaNumero = function (c) { return el("td", null, numeroSinTabulador(c)); };
    var encabezado = function (texto, completo, serie) {
      return el("th", { scope: "col", title: completo || null },
        serie ? [el("span", { "class": "muestra-serie " + serie, "aria-hidden": "true" }), texto] : texto);
    };
    var columnas = [
      encabezado("Campaña"),
      encabezado("Año de cosecha"),
      encabezado("R sin cobertura", "Rentabilidad real sin cobertura", "serie-sin"),
      encabezado("R con cobertura", "Rentabilidad real con cobertura", "serie-con"),
      encabezado("K base"),
      encabezado("K con β significativo"),
      encabezado("Brecha sin cobertura", "R sin cobertura − K base"),
      encabezado("Brecha con cobertura", "R con cobertura − K base"),
      el("th", { scope: "col", "class": "col-origenes" }, "Orígenes")
    ];
    var filas = vista.filas.map(function (fila) {
      var boton = botonOrigenes("Campaña " + fila.campana, "Ver orígenes de los números de la campaña " + fila.campana, function () { return itemsDeFila(fila); });
      var cola = fila.kBase
        ? [celdaNumero(fila.kBase), celdaNumero(fila.kBeta), celdaNumero(fila.brechaSin), celdaNumero(fila.brechaCon)]
        : [el("td", { "class": "sin-k", colspan: "4" }, fila.sinK)];
      return el("tr", null, [
        el("th", { scope: "row", "class": "mc-fila-campana" }, [el("span", { "class": "mc-campana" }, fila.campana)]),
        el("td", null, String(fila.anio)),
        celdaNumero(fila.rSin),
        celdaNumero(fila.rCon)
      ].concat(cola, [el("td", { "class": "col-origenes" }, boton)]));
    });

    var pie = [];
    if (vista.promedios) {
      var p = vista.promedios;
      var botonPromedio = botonOrigenes("Promedio " + p.rango, "Ver orígenes de los promedios " + p.rango, function () {
        return itemsDeFila(p);
      });
      pie.push(el("tr", null, [
        el("th", { scope: "row", "class": "mc-fila-campana" }, [el("span", { "class": "mc-campana" }, "Promedio " + p.rango)]),
        el("td", null),
        celdaNumero(p.rSin), celdaNumero(p.rCon), celdaNumero(p.kBase), celdaNumero(p.kBeta), celdaNumero(p.brechaSin), celdaNumero(p.brechaCon),
        el("td", { "class": "col-origenes" }, botonPromedio)
      ]));
      var c = vista.conteoCeldas;
      var botonConteo = botonOrigenes("Años con R > K base", "Ver orígenes de la cuenta de años con R mayor que K base", function () {
        return [
          { etiqueta: "Años con R sin cobertura > K base", v: c.sin.v, formato: c.sin.formato, origen: c.sin.origen },
          { etiqueta: "Años con R con cobertura > K base", v: c.con.v, formato: c.con.formato, origen: c.con.origen },
          { etiqueta: "Años con K", v: c.total.v, formato: c.total.formato, origen: c.total.origen }
        ];
      });
      var cuenta = function (parcial) {
        return el("td", null, [numeroSinTabulador(parcial), " de ", numeroSinTabulador(c.total)]);
      };
      pie.push(el("tr", null, [
        el("th", { scope: "row", "class": "mc-fila-campana" }, [el("span", { "class": "mc-campana" }, "Años con R > K base")]),
        el("td", null),
        cuenta(c.sin), cuenta(c.con),
        el("td", { colspan: "4" }),
        el("td", { "class": "col-origenes" }, botonConteo)
      ]));
    }
    return el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla rk-tabla" }, [
      el("caption", null, "Tu rentabilidad contra K, por campaña"),
      el("thead", null, el("tr", null, columnas)),
      el("tbody", null, filas),
      pie.length ? el("tfoot", null, pie) : null
    ]));
  }

  // Barras de R sin y con cobertura y dos líneas de K, con su leyenda en texto: los colores solos no alcanzan
  // (la línea de K con β significativo es de rayas y las barras van siempre en el mismo orden).
  function pintarGrafico(vista) {
    var a = base();
    var el = a.el;
    var g = vista.grafico;
    var svg = raiz.TESIS_GRAFICOS.barrasYLineas(raiz.document, Object.assign({
      formatear: a.formato.porcentaje,
      etiquetarEje: raiz.TESIS_GRAFICOS.etiquetaPorcentaje
    }, g));
    var items = g.series.map(function (serie) {
      return el("li", null, [el("span", { "class": "muestra-serie " + serie.clase, "aria-hidden": "true" }), serie.nombre]);
    }).concat(g.lineas.map(function (linea) {
      return el("li", null, [
        el("span", { "class": "muestra-linea " + linea.clase + (linea.discontinua ? " discontinua" : ""), "aria-hidden": "true" }),
        linea.nombre + (linea.discontinua ? " (línea de rayas)" : " (línea continua)")
      ]);
    }));
    return el("figure", { "class": "rk-grafico" }, [
      a.encabezadoDeGrafico(g.titulo, "rentabilidad (R) y costo de capital (K), en porcentaje del valor de la tierra"),
      svg,
      el("figcaption", null, [
        el("ul", { "class": "leyenda" }, items),
        el("p", { "class": "ayuda" }, "En cada campaña, la barra de la izquierda es sin cobertura y la de la derecha, con cobertura. " +
          vista.sinK + " Los valores exactos están en la tabla de abajo.")
      ])
    ]);
  }

  // Lectura de R contra K, en frases cortas, con cada cifra como número con su origen.
  function pintarLectura(vista) {
    var a = base();
    return a.el("section", { "class": "mc-lectura tarjeta" }, [
      a.el("h3", null, "Qué dice la comparación")
    ].concat(vista.lectura.map(function (frase) { return a.el("p", null, nodosDeFrase(frase)); })));
  }

  function pintarResultados(vista) {
    var a = base();
    a.vaciar(nodos.resultados);
    if (vista.mensaje) {
      nodos.resultados.appendChild(a.el("p", { "class": "mc-mensaje", role: "status" }, [
        vista.mensaje + " ",
        a.el("a", { href: "#mi-campo" }, "Ir a Mi campo")
      ]));
      return;
    }
    nodos.resultados.appendChild(pintarGrafico(vista));
    nodos.resultados.appendChild(pintarLectura(vista));
    nodos.resultados.appendChild(pintarBetas(vista));
    nodos.resultados.appendChild(pintarTabla(vista));
  }

  function actualizar(estado) {
    var a = base();
    var datos = raiz.TESIS_DATOS;
    var e = a.normalizarEstado(estado, datos, 0);
    // Sólo cuentan la zona, las hectáreas y la parte cubierta: la unidad de «Mi campo» no cambia nada acá.
    var clave = JSON.stringify([e.zona, e.hectareas, e.h]);
    if (pintado.datos === datos && pintado.clave === clave) return;
    pintado = { datos: null, clave: null };
    var vista = armarVista(datos, e);
    pintarSeleccion(vista);
    pintarResultados(vista);
    pintado = { datos: datos, clave: clave };
  }

  // Deja los resultados vacíos (la base lo pide si el cálculo falla: no pueden quedar cifras viejas).
  // Y se acuerda de que no hay nada pintado, para que el próximo cálculo que ande lo vuelva a pintar todo.
  function limpiar() {
    pintado = { datos: null, clave: null };
    if (!nodos) return;
    base().vaciar(nodos.seleccion);
    base().vaciar(nodos.resultados);
  }

  var seccion = { id: "rentabilidad", titulo: "Rentabilidad vs. K", grupo: "historico", montar: montar, actualizar: actualizar, limpiar: limpiar };

  var api = {
    armarVista: armarVista,
    armarReferencia: armarReferencia,
    textoDeFrase: textoDeFrase,
    seccion: seccion,
    FORMULAS: FORMULAS
  };
  raiz.TESIS_RENTABILIDAD = api;
  // Sin la base común la sección desaparecería sin decir nada: mejor un error claro en la consola.
  if (!raiz.TESIS_APP) throw new Error("rentabilidad.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
