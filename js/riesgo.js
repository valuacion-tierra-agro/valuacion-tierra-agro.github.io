// Sección «Riesgo e hipótesis»: el resultado central de la tesis. Muestra cuánto riesgo le saca la
// cobertura con futuros a cada cultivo y lo compara con el 50 % que pedía la hipótesis.
// Todas las cuentas las hace TESIS_MOTOR (riesgoCultivo y riesgoZona): acá no se repite ninguna.
// Todo lo de esta sección usa SIEMPRE el 100 % cubierto (H_HIPOTESIS), que es como la tesis contrasta
// la hipótesis: no depende de la proporción que se elija en «Mi campo».
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
(function (raiz) {
  "use strict";

  // Proporción cubierta con la que la tesis contrasta la hipótesis: 100 %.
  var H_HIPOTESIS = 1;
  var NBSP = "\u00a0"; // espacio duro: el «%» nunca queda solo en la línea siguiente
  var CULTIVOS = ["Trigo", "Soja", "Maíz"];
  // Las proporciones cubiertas del deslizador: de 0 a 100 % de a 5 (21 valores, i ÷ 20).
  var PASOS_H = [];
  for (var paso = 0; paso <= 20; paso++) PASOS_H.push(paso / 20);

  var FORMULAS = {
    reduccionFijo: "1 − (promedio de zonas del desvío de la sorpresa de precio en USD/ha con cobertura ÷ el mismo desvío sin cobertura), con el rinde fijo en el esperado",
    reduccionReal: "1 − (promedio de zonas del desvío de la sorpresa en rentabilidad con cobertura ÷ el mismo desvío sin cobertura), con el rinde real",
    reduccionUsd: "1 − (promedio de zonas del desvío de la sorpresa en USD/ha con cobertura ÷ el mismo desvío sin cobertura), con el rinde real",
    // Zona por zona (las mismas fórmulas que en «Mi campo»).
    riesgo: "Desvío estándar muestral entre campañas de la sorpresa (real − proyectado)",
    cambio: "1 − riesgo con cobertura ÷ riesgo sin cobertura",
    peorDesvio: "La peor caída de rinde de las campañas: el menor de (rinde real ÷ rinde esperado − 1)",
    estado: "«subió» si el riesgo con cobertura es mayor que el riesgo sin cobertura, «bajó» si es menor",
    // ¿Cuánto cubrir?: la curva según la proporción cubierta h.
    riesgoSinCurva: "Promedio de las zonas del desvío estándar muestral de la sorpresa sin cobertura (margen real sin cobertura − margen proyectado)",
    riesgoCurva: "Promedio de las zonas del desvío estándar muestral de (sorpresa sin cobertura + h × resultado del futuro al 100 %)",
    relativo: "riesgo con h ÷ riesgo sin cobertura",
    margenSinCurva: "Promedio de todos los casos del cultivo del margen real sin cobertura",
    margenCurva: "Promedio de todos los casos del cultivo de (margen real sin cobertura + h × resultado del futuro al 100 %)",
    diferencia: "margen real medio con h − margen real medio sin cobertura",
    hMinima: "− Σ covarianza(sorpresa sin cobertura, resultado del futuro al 100 %) ÷ Σ varianza del resultado del futuro al 100 %, sumando las zonas",
    hMinimaZona: "− covarianza(sorpresa sin cobertura, resultado del futuro al 100 %) ÷ varianza del resultado del futuro al 100 %, calculada zona por zona (el libro no trae este dato por zona)",
    // De dónde vino la sorpresa: la sorpresa sin cobertura partida en precio, rinde e interacción.
    efectoPrecio: "rinde esperado ÷ 10 × (spot a cosecha − futuro al sembrar), promedio de las zonas",
    efectoRinde: "(rinde real − rinde esperado) ÷ 10 × (futuro al sembrar − gastos de comercialización) − (costo de cosecha con el rinde real − costo de cosecha con el rinde esperado), promedio de las zonas",
    interaccion: "(rinde real − rinde esperado) ÷ 10 × (spot a cosecha − futuro al sembrar), promedio de las zonas"
  };

  // Lo que hace falta para armar el resultado del futuro al 100 % (no se usa la celda del Excel: ver CR-01 de «Mi campo»).
  var CAMPOS_FUTURO = ["rindeEsperado", "fs", "fc"];
  var FUTURO_100 = "con resultado del futuro al 100 % = rinde esperado ÷ 10 × (Fs − Fc) − comisión × rinde esperado ÷ 10 × Fs";

  // Todo lo «con cobertura» usa el margen real con cobertura: el real sin cobertura más el resultado del futuro.
  var CON_FUTURO = "con margen real con cobertura = margen real sin cobertura + resultado del futuro, con resultado del futuro = h × [rinde esperado ÷ 10 × (Fs − Fc) − comisión × rinde esperado ÷ 10 × Fs]";

  function conFuturo(formula) {
    return formula + ", " + CON_FUTURO;
  }

  var QUE_SE_PROBO = "Qué se quería probar: que cubrirse con futuros baja el riesgo más de la mitad. Con qué: 114 casos (cada combinación de cultivo, zona y campaña), manteniendo fijo el rinde esperado para medir solo el efecto del precio, que es lo que cubre el futuro.";
  var AVISO = "Este bloque usa siempre el 100 % cubierto, aunque cambies la parte cubierta más abajo o en «Probá variantes».";
  var EXPLICACION = "El futuro fija el precio de las toneladas que se esperaba cosechar. Si el rinde cae, se cosecha menos y el futuro no compensa esa pérdida: cubre el precio, no el rinde.";
  var EXPLICACION_FIJO = "Con el rinde fijo (el esperado, el mismo todos los años) lo único que cambia es el precio, justo lo que cubre el futuro: por eso la baja es tan alta. Con el rinde real también cambia lo que se cosecha, y eso queda sin cubrir.";

  function base() { return raiz.TESIS_APP; }

  function esNumero(x) {
    return typeof x === "number" && isFinite(x);
  }

  function celda(v, formato, origen) {
    return { v: v, formato: formato, origen: origen };
  }

  // Una frase es una lista de partes: texto o celda { v, formato, origen }.
  function textoDeFrase(frase) {
    var formato = base().formato;
    return frase.map(function (parte) {
      return typeof parte === "string" ? parte : formato.aplicar(parte.formato, parte.v);
    }).join("");
  }

  // «a, b y c» a partir de una lista de textos.
  function enumerar(lista) {
    if (lista.length <= 1) return lista.join("");
    return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
  }

  // Lo mismo, pero cada elemento es una lista de partes (texto o celda): devuelve una sola lista de partes.
  function enumerarPartes(elementos) {
    var partes = [];
    elementos.forEach(function (elemento, i) {
      if (i > 0) partes.push(i === elementos.length - 1 ? " y " : ", ");
      partes = partes.concat(elemento);
    });
    return partes;
  }

  function enteroConPorcentaje(proporcion) {
    return base().formato.numero(proporcion * 100, 0) + NBSP + "%";
  }

  // Nota de origen: la proporción cubierta de este bloque no la elige nadie, es la de la tesis.
  function notaH() {
    return "proporción cubierta: " + enteroConPorcentaje(H_HIPOTESIS) + " (la que usa la tesis para contrastar la hipótesis)";
  }

  // ¿H_HIPOTESIS es la h del Excel (Parametros › B7)? Sólo entonces lo «con cobertura» coincide con las celdas del Excel.
  function hDelExcel(datos) {
    return Math.abs(H_HIPOTESIS - datos.parametros.h.v) < 1e-9;
  }

  function sonIguales(a, b, tolerancia) {
    return esNumero(a) && esNumero(b) && Math.abs(a - b) <= tolerancia;
  }

  // Celdas de RR_Margenes de los campos pedidos, de todas las campañas de todas las zonas de un cultivo.
  function origenesCultivo(datos, cultivo, campos) {
    var motor = raiz.TESIS_MOTOR;
    var lista = [];
    motor.zonasDe(datos, cultivo).forEach(function (zona) {
      motor.casosDe(datos, cultivo, zona).forEach(function (caso) {
        campos.forEach(function (campo) { lista.push(motor.origen(caso, campo, datos)); });
      });
    });
    return lista;
  }

  function controlCultivo(datos, cultivo) {
    var lista = datos.controles && datos.controles.cultivos ? datos.controles.cultivos : [];
    return lista.filter(function (c) { return c.cultivo === cultivo; })[0] || null;
  }

  function llegaAlMinimo(real, meta) {
    return !!real && esNumero(real.v) && real.v >= meta.v;
  }

  // ---------------------------------------------------------------------------------------
  // Modelo de vista: ¿se cumple la hipótesis? (función pura, sin DOM y sin formatear)
  // ---------------------------------------------------------------------------------------

  // Veredicto: { seCumple, frase }. La frase es una lista de partes (con la meta como celda).
  // Sólo cuenta los cultivos con reducción calculable; si falta alguno lo nombra y nunca dice «en todos los
  // cultivos» ni que la hipótesis se cumple. Con los datos de la tesis ninguno llega.
  function veredicto(cultivos, meta) {
    var validos = cultivos.filter(function (c) { return c.real && esNumero(c.real.v); });
    if (validos.length === 0) return { seCumple: false, frase: ["No hay datos para contrastar la hipótesis."] };
    var sinDato = cultivos.filter(function (c) { return !(c.real && esNumero(c.real.v)); });
    var nombres = function (lista) { return enumerar(lista.map(function (c) { return c.cultivo.toLowerCase(); })); };
    var falta = sinDato.length ? " Falta el dato de " + nombres(sinDato) + "." : "";
    var llegan = validos.filter(function (c) { return llegaAlMinimo(c.real, meta); }).length;
    if (llegan === validos.length) {
      if (sinDato.length) {
        return { seCumple: false, frase: ["Llega al ", meta, " en " + nombres(validos) + ", pero falta el dato de " + nombres(sinDato) +
          ": no se puede decir que la hipótesis se cumpla."] };
      }
      return { seCumple: true, frase: ["Llega al ", meta, " en todos los cultivos: con estos datos la hipótesis se cumple."] };
    }
    if (llegan === 0) return { seCumple: false, frase: ["No llega al ", meta, ": la hipótesis no se cumple." + falta] };
    return { seCumple: false, frase: ["No llega al ", meta, " en todos los cultivos: la hipótesis no se cumple." + falta] };
  }

  // Qué mide cada barra, en una frase con los números del motor: el rinde fijo va en USD/ha; el rinde real, en
  // rentabilidad (la medida de la hipótesis) y también en USD/ha. Sólo dice «en las dos medidas por debajo de la
  // meta» si es cierto para todos los cultivos con dato.
  function armarMedidas(cultivos, meta) {
    var validos = cultivos.filter(function (c) { return c.real && esNumero(c.real.v) && c.realUsd && esNumero(c.realUsd.v); });
    if (validos.length === 0) return [];
    var usd = validos.map(function (c) { return [c.realUsd, " en " + c.cultivo.toLowerCase()]; });
    var frase = ["El rinde fijo se mide en USD/ha (sólo cambia el precio). El rinde real se mide en rentabilidad, que es la medida de la hipótesis, " +
      "y también en USD/ha: en USD/ha la reducción es de "].concat(enumerarPartes(usd), ["."]);
    var debajo = validos.every(function (c) { return c.real.v < meta.v && c.realUsd.v < meta.v; });
    if (debajo) frase = frase.concat([" En las dos medidas la reducción con rinde real queda por debajo del ", meta, "."]);
    return frase;
  }

  var SERIE_REAL = "Con rinde real";
  var AVISO_SIN_GRAFICO = "No se puede graficar: el riesgo sin cobertura de algún cultivo es 0.";
  var CLAVE_CULTIVO = { "Trigo": "trigo", "Soja": "soja", "Maíz": "maiz" };

  // Cifras de la tesis (rinde fijo, rentabilidad, 114 casos): salen de datos-tesis.js, con su origen.
  function cifrasTesis() { return raiz.TESIS_CIFRAS; }

  // Filas de la tesis: una por cultivo y el total, con la reducción del desvío con cobertura del 100 % y del 50 %.
  function armarFilasTesis(cultivos) {
    var c = cifrasTesis();
    var celdaDe = function (x) { return celda(x.v, "porcentaje", x.o); };
    var filas = cultivos.map(function (k) {
      var clave = CLAVE_CULTIVO[k.cultivo];
      return { nombre: k.cultivo, total: false, cien: celdaDe(c.reduccionRindeFijoPorCultivo[clave]), cincuenta: celdaDe(c.reduccionRindeFijo50PorCultivo[clave]) };
    });
    filas.push({ nombre: "Total", total: true, cien: celdaDe(c.reduccionRindeFijo), cincuenta: celdaDe(c.reduccionRindeFijo50) });
    return filas;
  }

  // La conclusión principal es la de la tesis: rinde fijo, en rentabilidad. Se cumple si todos los cultivos llegan a la meta.
  function armarConclusionTesis(filas, meta) {
    var cultivos = filas.filter(function (f) { return !f.total; });
    var total = filas.filter(function (f) { return f.total; })[0];
    var v = veredicto(cultivos.map(function (f) { return { cultivo: f.nombre, real: f.cien }; }), meta);
    var porCultivo = cultivos.map(function (f) { return [f.cien, " en " + f.nombre.toLowerCase()]; });
    var cierre = v.seCumple ? ["Es más que el ", meta, " que se pedía: la hipótesis se cumple."] : v.frase;
    var frase = ["Resultado: con el rinde fijo, cubrir el 100 % de la cosecha baja el riesgo ", total.cien, " ("].concat(enumerarPartes(porCultivo),
      ["); con el 50 % cubierto lo baja ", total.cincuenta, ". "], cierre);
    return { seCumple: v.seCumple, frase: frase };
  }

  function armarGraficoTesis(filas, meta) {
    var f = base().formato;
    var porcentajeMeta = f.aplicar(meta.formato, meta.v);
    return {
      titulo: "Cuánto baja el riesgo con rinde fijo (114 casos), contra el " + porcentajeMeta + " que se pedía",
      unidad: "",
      categorias: filas.map(function (x) { return x.nombre; }),
      series: [
        { nombre: "Con el 100 % cubierto", clase: "serie-con", valores: filas.map(function (x) { return x.cien.v; }) },
        { nombre: "Con el 50 % cubierto", clase: "serie-proyectado", valores: filas.map(function (x) { return x.cincuenta.v; }) }
      ],
      referencia: { valor: meta.v, nombre: "Lo que se pedía (" + porcentajeMeta + ")", etiqueta: porcentajeMeta },
      margen: { derecha: 54 }
    };
  }

  // Análisis complementario: con rinde real. Una sola serie (rentabilidad); no es la medida de la hipótesis.
  function armarGrafico(cultivos, meta) {
    var f = base().formato;
    var completos = cultivos.length > 0 && cultivos.every(function (c) { return esNumero(c.real.v); });
    if (!completos) return null;
    var porcentajeMeta = f.aplicar(meta.formato, meta.v);
    return {
      titulo: "Con rinde real: cuánto baja el riesgo por cultivo con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto, contra el " + porcentajeMeta + " pedido",
      unidad: "",
      categorias: cultivos.map(function (c) { return c.cultivo; }),
      series: [
        { nombre: SERIE_REAL, clase: "serie-con", valores: cultivos.map(function (c) { return c.real.v; }) }
      ],
      referencia: { valor: meta.v, nombre: "Meta: " + porcentajeMeta, etiqueta: porcentajeMeta },
      margen: { derecha: 54 }
    };
  }

  // Texto del complementario: de cuánto a cuánto baja el riesgo con rinde real y por qué es menos.
  function armarComplemento(cultivos) {
    var validos = cultivos.filter(function (c) { return c.real && esNumero(c.real.v); });
    if (validos.length === 0) return [];
    var menor = validos.reduce(function (acc, c) { return c.real.v < acc.real.v ? c : acc; });
    var mayor = validos.reduce(function (acc, c) { return c.real.v > acc.real.v ? c : acc; });
    var sinDato = cultivos.filter(function (c) { return !(c.real && esNumero(c.real.v)); }).map(function (c) { return c.cultivo.toLowerCase(); });
    var falta = sinDato.length ? " Falta el dato de " + enumerar(sinDato) + "." : "";
    return ["Con rinde real, cubrirse baja menos el riesgo (de ", menor.real, " a ", mayor.real,
      "), porque el futuro no cubre lo que se cosecha. Es un análisis aparte: no es con lo que se prueba la hipótesis." + falta];
  }

  function armarHipotesis(datos) {
    var app = base();
    var motor = raiz.TESIS_MOTOR;
    var delExcel = hDelExcel(datos);
    var comision = datos.parametros.comision.o;
    var nota = notaH();
    var metaDatos = datos.parametros.reduccionHipotesis;
    var meta = celda(metaDatos.v, "porcentaje", metaDatos.o);

    var cultivos = CULTIVOS.filter(function (cultivo) { return motor.zonasDe(datos, cultivo).length > 0; }).map(function (cultivo) {
      var r = raiz.TESIS_MOTOR.riesgoCultivo(datos, cultivo, { h: H_HIPOTESIS });
      var control = controlCultivo(datos, cultivo);
      // «En el Excel» sólo si la cifra es IGUAL a esa celda: con la h del Excel y el mismo valor.
      var enExcel = function (valor, campo) {
        return delExcel && control && control[campo] && sonIguales(valor, control[campo].v, 1e-9) ? [control[campo].o] : null;
      };
      var partes = function (campos) { return origenesCultivo(datos, cultivo, campos).concat([comision]); };
      var fijo = celda(r.reduccionPrecio, "porcentaje",
        app.origenCalculado(FORMULAS.reduccionFijo, partes(["rindeEsperado", "fs", "sc", "fc"]), enExcel(r.reduccionPrecio, "reduccionPrecio"), [nota]));
      var real = celda(r.reduccionR, "porcentaje",
        app.origenCalculado(FORMULAS.reduccionReal, partes(["excel.sorpresaRSin", "excel.mbProyectado", "excel.mbRealSin", "rindeEsperado", "fs", "fc", "v"]),
          enExcel(r.reduccionR, "reduccionR"), [nota]));
      var realUsd = celda(r.reduccionUsd, "porcentaje",
        app.origenCalculado(FORMULAS.reduccionUsd, partes(["excel.sorpresaSin", "excel.mbProyectado", "excel.mbRealSin", "rindeEsperado", "fs", "fc"]),
          enExcel(r.reduccionUsd, "reduccionUsd"), [nota]));
      return { cultivo: cultivo, fijo: fijo, real: real, realUsd: realUsd, llega: llegaAlMinimo(real, meta) };
    });

    var filasTesis = armarFilasTesis(cultivos);
    var conclusion = armarConclusionTesis(filasTesis, meta);
    return {
      meta: meta,
      cultivos: cultivos,
      filasTesis: filasTesis,
      seCumple: conclusion.seCumple,
      conclusion: conclusion.frase,
      explicacionFijo: EXPLICACION_FIJO,
      aviso: AVISO,
      grafico: armarGraficoTesis(filasTesis, meta),
      complementario: {
        titulo: "Análisis complementario: si además cambia el rinde",
        texto: armarComplemento(cultivos),
        explicacion: EXPLICACION,
        medidas: armarMedidas(cultivos, meta),
        grafico: armarGrafico(cultivos, meta)
      }
    };
  }

  // ---------------------------------------------------------------------------------------
  // Modelo de vista: zona por zona (los 19 pares de cultivo y zona)
  // ---------------------------------------------------------------------------------------

  function controlZona(datos, cultivo, zona) {
    var lista = datos.controles && datos.controles.zonas ? datos.controles.zonas : [];
    return lista.filter(function (z) { return z.cultivo === cultivo && z.zona === zona; })[0] || null;
  }

  // Celdas de RR_Margenes de los campos pedidos, de todas las campañas de una zona de un cultivo.
  function origenesZona(datos, cultivo, zona, campos) {
    var motor = raiz.TESIS_MOTOR;
    var lista = [];
    motor.casosDe(datos, cultivo, zona).forEach(function (caso) {
      campos.forEach(function (campo) { lista.push(motor.origen(caso, campo, datos)); });
    });
    return lista;
  }

  function cultivosConZonas(datos) {
    return CULTIVOS.filter(function (cultivo) { return raiz.TESIS_MOTOR.zonasDe(datos, cultivo).length > 0; });
  }

  // De lo que parte todo lo «con cobertura» (no de las celdas de resultado del Excel): el real sin
  // cobertura, el rinde esperado, Fs, Fc y la comisión; la h es la de la tesis (ver notaH).
  var CAMPOS_CON_COBERTURA = ["excel.mbProyectado", "excel.mbRealSin", "rindeEsperado", "fs", "fc"];

  function armarFilaZona(datos, cultivo, zona) {
    var app = base();
    var motor = raiz.TESIS_MOTOR;
    var z = raiz.TESIS_MOTOR.riesgoZona(datos, cultivo, zona, { h: H_HIPOTESIS });
    var control = controlZona(datos, cultivo, zona);
    var delExcel = hDelExcel(datos);
    var comision = datos.parametros.comision.o;
    var nota = notaH();
    // «En el Excel» sólo si la cifra es IGUAL a esa celda. Lo que no depende de h (siempre) vale con
    // cualquier h; lo «con cobertura» sólo si H_HIPOTESIS es la h del Excel (Parametros › B7).
    var enExcel = function (valor, campo, tolerancia, siempre) {
      if (!control || !control[campo] || !(siempre || delExcel)) return null;
      return sonIguales(valor, control[campo].v, tolerancia) ? [control[campo].o] : null;
    };
    var tolUsd = motor.TOLERANCIA_USD;
    var tolProp = motor.TOLERANCIA_PROPORCION;
    var campos = function (lista, conComision) {
      var celdas = origenesZona(datos, cultivo, zona, lista);
      return conComision ? celdas.concat([comision]) : celdas;
    };
    var sinUsd = campos(["excel.sorpresaSin"]);
    var conUsd = campos(CAMPOS_CON_COBERTURA, true);
    var sinR = campos(["excel.sorpresaRSin"]);
    var conR = campos(CAMPOS_CON_COBERTURA.concat(["v"]), true);
    var desvios = campos(["excel.desvioRinde"]);
    var calculado = app.origenCalculado;

    var subio = z.sdConUsd > z.sdSinUsd;
    var textoEstado = subio ? "subió" : (z.sdConUsd < z.sdSinUsd ? "bajó" : "no cambió");
    // La columna Q del Excel dice «Sí» si bajó el riesgo y «No» si no bajó: sólo vale como celda si coincide.
    var qCoincide = delExcel && control && control.bajoElRiesgo && textoEstado !== "no cambió" &&
      control.bajoElRiesgo.v === (z.bajoElRiesgo ? "Sí" : "No");
    var peorCoincide = control && control.campanaPeorDesvio && control.campanaPeorDesvio.v === z.campanaPeorDesvio;

    return {
      cultivo: cultivo,
      zona: zona,
      sdSin: celda(z.sdSinUsd, "usd", calculado(FORMULAS.riesgo, sinUsd, enExcel(z.sdSinUsd, "sdSinUsd", tolUsd, true))),
      sdCon: celda(z.sdConUsd, "usd", calculado(conFuturo(FORMULAS.riesgo), conUsd, enExcel(z.sdConUsd, "sdConUsd", tolUsd, false), [nota])),
      reduccion: celda(z.reduccionUsd, "porcentaje",
        calculado(conFuturo(FORMULAS.cambio), sinUsd.concat(conUsd), enExcel(z.reduccionUsd, "reduccionUsd", tolProp, false), [nota])),
      sdRSin: celda(z.sdRSin, "porcentaje", calculado(FORMULAS.riesgo, sinR, enExcel(z.sdRSin, "sdRSin", tolProp, true))),
      sdRCon: celda(z.sdRCon, "porcentaje", calculado(conFuturo(FORMULAS.riesgo), conR, enExcel(z.sdRCon, "sdRCon", tolProp, false), [nota])),
      reduccionR: celda(z.reduccionR, "porcentaje",
        calculado(conFuturo(FORMULAS.cambio), sinR.concat(conR), enExcel(z.reduccionR, "reduccionR", tolProp, false), [nota])),
      peorDesvio: celda(z.peorDesvio, "porcentaje", calculado(FORMULAS.peorDesvio, desvios, enExcel(z.peorDesvio, "peorDesvio", tolProp, true))),
      campanaPeor: {
        texto: z.campanaPeorDesvio,
        origen: peorCoincide ? control.campanaPeorDesvio.o
          : calculado("Campaña de la peor caída de rinde: la que tiene el menor (rinde real ÷ rinde esperado − 1)", desvios)
      },
      subio: subio,
      estado: {
        texto: textoEstado,
        origen: calculado(conFuturo(FORMULAS.estado), sinUsd.concat(conUsd), qCoincide ? [control.bajoElRiesgo.o] : null, [nota])
      }
    };
  }

  // Cantidad de pares de cultivo y zona: un par es una fila de RR_Riesgo_Zonas y se cuenta por una de sus celdas (la G).
  function celdaTotalPares(datos, filas) {
    var filasDelExcel = filas.map(function (f) {
      var control = controlZona(datos, f.cultivo, f.zona);
      return control && control.sdSinUsd ? control.sdSinUsd.o : null;
    }).filter(function (o) { return o !== null; });
    return celda(filas.length, "entero", base().origenCalculado("Cantidad de pares de cultivo y zona", filasDelExcel));
  }

  // Un conteo de pares de cultivo y zona hecho comparando cifras del motor: parte de las celdas de RR_Margenes de
  // todos los pares (campos) y de la comisión; la h es la de la tesis. enExcel no: es un recuento, no una celda.
  function celdaDeConteo(datos, todas, cantidad, descripcion, campos, extras) {
    var partes = [];
    todas.forEach(function (f) { partes = partes.concat(origenesZona(datos, f.cultivo, f.zona, campos)); });
    partes = partes.concat([datos.parametros.comision.o], extras || []);
    return celda(cantidad, "entero", base().origenCalculado(conFuturo(descripcion), partes, null, [notaH()]));
  }

  // «subió el riesgo en 2 de los 19 pares de cultivo y zona: trigo en Sudeste de Córdoba y maíz en Sur Entre Ríos.»
  function armarResumenZonas(datos, filas) {
    var comision = datos.parametros.comision.o;
    var subieron = filas.filter(function (f) { return f.subio; });
    var bajaron = filas.filter(function (f) { return f.estado.texto === "bajó"; });
    var total = celdaTotalPares(datos, filas);
    var intro = "Con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto, cubrirse ";
    if (subieron.length === 0) {
      // «bajó en los N pares» sólo si de verdad bajó en todos (puede haber pares donde no cambió).
      if (bajaron.length === filas.length) return [intro + "bajó el riesgo en los ", total, " pares de cultivo y zona."];
      var nBajaron = celdaDeConteo(datos, filas, bajaron.length,
        "Cantidad de pares de cultivo y zona donde el riesgo con cobertura es menor que el riesgo sin cobertura", ["excel.sorpresaSin"].concat(CAMPOS_CON_COBERTURA));
      return [intro + "no subió el riesgo en ningún par; bajó en ", nBajaron, " de los ", total, " pares de cultivo y zona y en el resto no cambió."];
    }
    // Se cuenta comparando, en cada par, el riesgo sin cobertura con el riesgo con cobertura.
    var partes = [];
    filas.forEach(function (f) {
      partes = partes.concat(origenesZona(datos, f.cultivo, f.zona, ["excel.sorpresaSin"].concat(CAMPOS_CON_COBERTURA))).concat([comision]);
    });
    var cantidad = celda(subieron.length, "entero", base().origenCalculado(
      conFuturo("Cantidad de pares de cultivo y zona donde el riesgo con cobertura es mayor que el riesgo sin cobertura"),
      partes, null, [notaH()]));
    var nombres = subieron.map(function (f) { return f.cultivo.toLowerCase() + " en " + f.zona; });
    return [intro + "subió el riesgo en ", cantidad, " de los ", total, " pares de cultivo y zona: " + enumerar(nombres) + "."];
  }

  // Lo que hay que saber de los 19 pares juntos (no depende del filtro de cultivo): { contraste, balance }.
  //  - contraste: la hipótesis se juzga con el promedio de cada cultivo, no zona por zona; cuántos pares superan
  //    la meta por sí solos (medido en rentabilidad, la medida de la hipótesis) y en cuántos subió el riesgo (USD/ha).
  //  - balance: en cuántos pares cubrirse bajó el riesgo (USD/ha), en cuántos subió y en cuántos no cambió.
  function armarBalanceDeZonas(datos, todas) {
    var metaDatos = datos.parametros.reduccionHipotesis;
    var meta = celda(metaDatos.v, "porcentaje", metaDatos.o);
    var total = celdaTotalPares(datos, todas);
    var superan = todas.filter(function (f) { return esNumero(f.reduccionR.v) && f.reduccionR.v >= meta.v; });
    var subieron = todas.filter(function (f) { return f.subio; });
    var bajaron = todas.filter(function (f) { return f.estado.texto === "bajó"; });
    var nSuperan = celdaDeConteo(datos, todas, superan.length,
      "Cantidad de pares de cultivo y zona donde la reducción del riesgo en rentabilidad es igual o mayor que la meta de la hipótesis",
      ["excel.sorpresaRSin"].concat(CAMPOS_CON_COBERTURA, ["v"]), [metaDatos.o]);
    var nSubieron = celdaDeConteo(datos, todas, subieron.length,
      "Cantidad de pares de cultivo y zona donde el riesgo con cobertura es mayor que el riesgo sin cobertura", ["excel.sorpresaSin"].concat(CAMPOS_CON_COBERTURA));
    var nBajaron = celdaDeConteo(datos, todas, bajaron.length,
      "Cantidad de pares de cultivo y zona donde el riesgo con cobertura es menor que el riesgo sin cobertura", ["excel.sorpresaSin"].concat(CAMPOS_CON_COBERTURA));
    var contraste = ["La hipótesis se juzga con el promedio de cada cultivo (el bloque de arriba), no zona por zona. Zona por zona, ",
      nSuperan, " de los ", total, " pares superan por sí solos el ", meta, " de reducción (medido en rentabilidad) y en ",
      nSubieron, " el riesgo subió (medido en USD/ha)."];
    var balance = ["Con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto el riesgo bajó en ", nBajaron, " de los ", total, " pares de cultivo y zona (en USD/ha)"];
    if (subieron.length > 0) balance = balance.concat([" y subió en ", nSubieron]);
    var iguales = todas.length - bajaron.length - subieron.length;
    if (iguales > 0) balance.push(" y no cambió en " + iguales);
    balance.push(": el futuro cubre el precio, no el rinde, así que baja el riesgo pero no lo elimina.");
    return { contraste: contraste, balance: balance };
  }

  function armarZonas(datos, filtroPedido) {
    var cultivos = cultivosConZonas(datos);
    var filtro = cultivos.indexOf(filtroPedido) >= 0 ? filtroPedido : "todos";
    var todas = [];
    cultivos.forEach(function (cultivo) {
      raiz.TESIS_MOTOR.zonasDe(datos, cultivo).forEach(function (zona) { todas.push(armarFilaZona(datos, cultivo, zona)); });
    });
    var filas = filtro === "todos" ? todas : todas.filter(function (f) { return f.cultivo === filtro; });
    var global = armarBalanceDeZonas(datos, todas);
    return { filtro: filtro, cultivos: cultivos, filas: filas, resumen: armarResumenZonas(datos, filas),
      contraste: global.contraste, balance: global.balance };
  }

  // ---------------------------------------------------------------------------------------
  // Modelo de vista: ¿cuánto cubrir? (riesgo y margen medio según la parte cubierta)
  // ---------------------------------------------------------------------------------------

  // La celda de RR_Cobertura_Parcial de ese cultivo y campo ({ v, o }) si h es una de las cinco
  // proporciones que trae el libro (0, 25, 50, 75 y 100 %); si no, null.
  function celdaCurva(datos, cultivo, campo, h) {
    var curva = datos.controles && datos.controles.curva;
    if (!curva || !Array.isArray(curva.hs)) return null;
    var control = (curva.cultivos || []).filter(function (c) { return c.cultivo === cultivo; })[0];
    if (!control || !Array.isArray(control[campo])) return null;
    for (var j = 0; j < curva.hs.length; j++) {
      if (Math.abs(curva.hs[j].v - h) < 1e-9 && control[campo][j]) return control[campo][j];
    }
    return null;
  }

  // La fila del cultivo en RR_Cobertura_Parcial (tiene la h de mínima varianza en la columna H).
  function controlDeCurva(datos, cultivo) {
    var curva = datos.controles && datos.controles.curva;
    return curva && Array.isArray(curva.cultivos) ? curva.cultivos.filter(function (c) { return c.cultivo === cultivo; })[0] || null : null;
  }

  var AYUDA_SORPRESA = "Cuánto se alejó el margen real del proyectado (USD/ha, promedio de las zonas), partido en lo que explicó el precio, lo que explicó el rinde y lo que explicaron los dos juntos.";
  var AVISO_MINIMA = "Describe lo que pasó en seis campañas; no es una recomendación. Puede no coincidir con el punto más bajo de la curva, porque se calcula juntando todas las zonas y la curva promedia cada zona.";
  // Desde cuántos puntos de diferencia entre la zona de mayor y la de menor se dice que la proporción varía mucho.
  var DISPERSION_GRANDE = 0.5;
  var AYUDA_DIFERENCIA = "Diferencia negativa: lo que se resignó por cubrirse. Positiva: lo que se ganó.";

  // La proporción de mínima varianza que calcula el libro (RR_Cobertura_Parcial, columna H): la que minimiza la
  // varianza conjunta de las zonas. No se dice que sea el punto más bajo de la curva que se dibuja (esa promedia
  // el desvío de cada zona). rango: { min, max } de la misma cuenta zona por zona (celdas), o null si no hay.
  function fraseMinima(cultivo, hMinima, rango) {
    if (!hMinima || !esNumero(hMinima.v)) return [cultivo + ": no se puede calcular, el resultado del futuro no varió entre campañas."];
    var frase = [cultivo + ": la parte cubierta que deja el resultado más estable es ", hMinima];
    if (hMinima.v <= 0) frase.push(", es decir, ninguna cobertura lo volvió más estable en estas seis campañas");
    else if (hMinima.v > 1) frase.push(", más de lo que se esperaba cosechar");
    frase.push(".");
    if (rango) {
      var mucho = rango.max.v - rango.min.v >= DISPERSION_GRANDE;
      frase = frase.concat([mucho ? " Zona por zona varía mucho: va de " : " Zona por zona va de ",
        rango.min, " a ", rango.max, "."]);
    }
    return frase;
  }

  function armarCoberturaCultivo(datos, cultivo, h, indice) {
    var motor = raiz.TESIS_MOTOR;
    var cv = raiz.TESIS_MOTOR.curvaCobertura(datos, cultivo, PASOS_H);
    var control = controlCultivo(datos, cultivo);
    var comision = datos.parametros.comision.o;
    var calculado = base().origenCalculado;
    var tolUsd = motor.TOLERANCIA_USD;
    var tolProp = motor.TOLERANCIA_PROPORCION;
    var delExcel = Math.abs(h - datos.parametros.h.v) < 1e-9;
    var nota = "proporción cubierta elegida: " + enteroConPorcentaje(h) + " (la elegiste vos)";
    var sorpresas = origenesCultivo(datos, cultivo, ["excel.sorpresaSin"]);
    var margenes = origenesCultivo(datos, cultivo, ["excel.mbRealSin"]);
    var futuros = origenesCultivo(datos, cultivo, CAMPOS_FUTURO).concat([comision]);
    var deControl = function (campo) { return control && control[campo] ? control[campo] : null; };
    // «En el Excel» sólo con las celdas que valen LO MISMO que la cifra (la de la curva si h es una de
    // las cinco del libro y, con la h del Excel, la del resumen por cultivo); si ninguna, no se nombra.
    var enExcel = function (valor, tolerancia, celdas) {
      var lista = [];
      celdas.forEach(function (c) { if (c && sonIguales(valor, c.v, tolerancia)) lista.push(c.o); });
      return lista.length ? lista : null;
    };

    var riesgoSin = celda(cv.riesgo[0], "usd", calculado(FORMULAS.riesgoSinCurva, sorpresas,
      enExcel(cv.riesgo[0], tolUsd, [celdaCurva(datos, cultivo, "riesgo", 0), deControl("sdSinUsd")])));
    var riesgo = celda(cv.riesgo[indice], "usd", calculado(FORMULAS.riesgoCurva + ", " + FUTURO_100 + ", con h = " + enteroConPorcentaje(h),
      sorpresas.concat(futuros), enExcel(cv.riesgo[indice], tolUsd, [celdaCurva(datos, cultivo, "riesgo", h), delExcel ? deControl("sdConUsd") : null]), [nota]));
    var relativo = celda(cv.riesgoRelativo[indice], "porcentaje", calculado(FORMULAS.relativo + ", " + FUTURO_100,
      sorpresas.concat(futuros), enExcel(cv.riesgoRelativo[indice], tolProp, [celdaCurva(datos, cultivo, "riesgoRelativo", h)]), [nota]));
    // Lo mismo que «relativo» pero con el 100 % cubierto (la h de la tesis): une esta tabla con la conclusión de arriba.
    var indice100 = PASOS_H.indexOf(H_HIPOTESIS);
    var quedaAl100 = celda(cv.riesgoRelativo[indice100], "porcentaje", calculado(FORMULAS.relativo + ", " + FUTURO_100,
      sorpresas.concat(futuros), enExcel(cv.riesgoRelativo[indice100], tolProp, [celdaCurva(datos, cultivo, "riesgoRelativo", H_HIPOTESIS)]), [notaH()]));
    var margenSin = celda(cv.margenRealMedio[0], "usd", calculado(FORMULAS.margenSinCurva, margenes,
      enExcel(cv.margenRealMedio[0], tolUsd, [celdaCurva(datos, cultivo, "margenRealMedio", 0)])));
    var margen = celda(cv.margenRealMedio[indice], "usd", calculado(FORMULAS.margenCurva + ", " + FUTURO_100,
      margenes.concat(futuros), enExcel(cv.margenRealMedio[indice], tolUsd, [celdaCurva(datos, cultivo, "margenRealMedio", h)]), [nota]));
    var diferencia = celda(margen.v - margenSin.v, "usd", calculado(FORMULAS.diferencia + ", " + FUTURO_100,
      margenes.concat(futuros), null, [nota]));
    var hMinima = celda(cv.hMinimaVarianza, "porcentaje", calculado(FORMULAS.hMinima + ", " + FUTURO_100,
      sorpresas.concat(futuros), enExcel(cv.hMinimaVarianza, tolProp, [(controlDeCurva(datos, cultivo) || {}).hMinimaVarianza])));
    // La misma cuenta zona por zona (el libro no la trae): el mínimo y el máximo entre las zonas del cultivo.
    var porZonas = Array.isArray(cv.porZona) ? cv.porZona.map(function (z) { return z.hMinimaVarianza; }).filter(esNumero) : [];
    var origenRango = calculado(FORMULAS.hMinimaZona + ", " + FUTURO_100, sorpresas.concat(futuros));
    var rangoMinima = porZonas.length >= 2
      ? { min: celda(Math.min.apply(null, porZonas), "porcentaje", origenRango), max: celda(Math.max.apply(null, porZonas), "porcentaje", origenRango) }
      : null;
    return {
      cultivo: cultivo,
      riesgoSin: riesgoSin,
      riesgo: riesgo,
      relativo: relativo,
      quedaAl100: quedaAl100,
      margenSin: margenSin,
      margen: margen,
      diferencia: diferencia,
      hMinima: hMinima,
      rangoMinima: rangoMinima,
      serie: cv.riesgo,
      fraseMinima: fraseMinima(cultivo, hMinima, rangoMinima)
    };
  }

  // «Maíz» → «serie-maiz»: la clase de CSS que le da su color y su trazo.
  function claseDeSerie(cultivo) {
    return "serie-" + cultivo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Une «queda X % del riesgo» de la tabla de acá (en USD/ha) con la conclusión de arriba: con el 100 % cubierto,
  // lo que queda es 100 % − la reducción en USD/ha, y la conclusión usa la misma reducción medida en rentabilidad.
  // Todas las cifras salen del motor (la de «queda» de la curva; las dos reducciones, de la hipótesis).
  function armarConexion(cultivos, hipotesis) {
    var partes = [];
    cultivos.forEach(function (x) {
      var hip = hipotesis.cultivos.filter(function (c) { return c.cultivo === x.cultivo; })[0];
      if (!hip || !esNumero(x.quedaAl100.v) || !esNumero(hip.realUsd.v) || !esNumero(hip.real.v)) return;
      partes.push([x.cultivo + " queda con ", x.quedaAl100, " del riesgo (una reducción de ", hip.realUsd,
        " en USD/ha; en rentabilidad, que es la medida de la conclusión de arriba, ", hip.real, ")"]);
    });
    if (partes.length === 0) return [];
    var junto = [];
    partes.forEach(function (p, i) { junto = junto.concat(i === 0 ? p : ["; "].concat(p)); });
    return ["Con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto la tabla y la conclusión de arriba dicen lo mismo con otra medida: "].concat(junto, ["."]);
  }

  // Todo lo que depende de h: es lo único de la sección que se rehace al mover el deslizador.
  // hipotesis (opcional): la de armarHipotesis(datos), para no rehacerla en cada movimiento del deslizador.
  function armarCobertura(datos, h, hipotesis) {
    var indice = Math.round(h * 20);
    // h tiene que ser una de las 21 proporciones del deslizador (múltiplo de 0,05): si no, los números de una parte rotularían otra.
    if (!(Math.abs(PASOS_H[indice] - h) <= 1e-9)) throw new Error("armarCobertura: h tiene que ser múltiplo de 0,05 entre 0 y 1 (llegó " + h + ")");
    var cultivos = cultivosConZonas(datos).map(function (cultivo) { return armarCoberturaCultivo(datos, cultivo, h, indice); });
    return {
      h: h,
      indice: indice,
      cultivos: cultivos,
      conexion: armarConexion(cultivos, hipotesis || armarHipotesis(datos)),
      aviso: AVISO_MINIMA,
      ayudaDiferencia: AYUDA_DIFERENCIA,
      grafico: {
        titulo: "Riesgo por cultivo según la parte cubierta con futuros (USD/ha, promedio de las zonas)",
        unidad: "USD/ha",
        xs: PASOS_H,
        marcasX: [0, 0.25, 0.5, 0.75, 1],
        marcaX: h,
        series: cultivos.map(function (x) { return { nombre: x.cultivo, clase: claseDeSerie(x.cultivo), valores: x.serie }; })
      }
    };
  }

  // ---------------------------------------------------------------------------------------
  // Modelo de vista: de dónde vino la sorpresa (precio, rinde e interacción por cultivo y campaña)
  // ---------------------------------------------------------------------------------------

  // Se arma al usarla (no al cargar el archivo): el formato de números viene de app.js, que ya tiene que estar cargado.
  function lecturaFija() {
    return "Con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto, cuando pesa el precio el futuro compensa gran parte de ese efecto; el efecto del rinde, en cambio, el futuro no lo compensa: cubre el precio de lo que se esperaba cosechar, no las toneladas que faltan o sobran.";
  }
  var NOTA_SIN_H = "no depende de la proporción cubierta";

  // Los casos del cultivo y la campaña de una fila de RR_Por_Campaña (todas las zonas del cultivo).
  function casosDeLaFila(datos, fila) {
    var motor = raiz.TESIS_MOTOR;
    var casos = [];
    motor.zonasDe(datos, fila.cultivo).forEach(function (zona) {
      motor.casosDe(datos, fila.cultivo, zona).forEach(function (caso) { if (caso.campana === fila.campana) casos.push(caso); });
    });
    if (casos.length === 0) throw new Error("No hay casos de " + fila.cultivo + " en la campaña " + fila.campana);
    return casos;
  }

  function armarFilaSorpresa(datos, fila) {
    var motor = raiz.TESIS_MOTOR;
    var calculado = base().origenCalculado;
    var casos = casosDeLaFila(datos, fila);
    var resultados = casos.map(function (caso) { return raiz.TESIS_MOTOR.calcularCaso(caso, { h: H_HIPOTESIS, datos: datos }); });
    var promedioDe = function (campo) { return motor.promedio(resultados.map(function (r) { return r[campo]; })); };
    var partes = function (campos) {
      var lista = [];
      casos.forEach(function (caso) { campos.forEach(function (campo) { lista.push(motor.origen(caso, campo, datos)); }); });
      return lista;
    };
    // «En el Excel» sólo si la cifra es IGUAL a la celda N, O o P de esa fila de RR_Por_Campaña.
    var enExcel = function (valor, celdaDeLaFila) {
      return celdaDeLaFila && sonIguales(valor, celdaDeLaFila.v, motor.TOLERANCIA_USD) ? [celdaDeLaFila.o] : null;
    };
    var precio = promedioDe("efectoPrecio");
    var rinde = promedioDe("efectoRinde");
    var interaccion = promedioDe("interaccion");
    return {
      cultivo: fila.cultivo,
      campana: fila.campana,
      efectoPrecio: celda(precio, "usd", calculado(FORMULAS.efectoPrecio, partes(["rindeEsperado", "sc", "fs"]), enExcel(precio, fila.efectoPrecio), [NOTA_SIN_H])),
      efectoRinde: celda(rinde, "usd", calculado(FORMULAS.efectoRinde,
        partes(["rindeEsperado", "rindeReal", "fs", "gc", "excel.cosechaEsperado", "excel.cosechaReal"]), enExcel(rinde, fila.efectoRinde), [NOTA_SIN_H])),
      interaccion: celda(interaccion, "usd", calculado(FORMULAS.interaccion,
        partes(["rindeEsperado", "rindeReal", "sc", "fs"]), enExcel(interaccion, fila.interaccion), [NOTA_SIN_H])),
      pesoMas: { texto: fila.quePesoMas.v, origen: fila.quePesoMas.o }
    };
  }

  // La lectura: en qué campañas pesó el precio en todos los cultivos y en cuáles el rinde (y si el rinde cayó o subió),
  // más una frase fija que lo conecta con la conclusión. Cada frase es una lista de partes (se escribe con textoDeFrase).
  function armarLectura(filas) {
    var campanas = [];
    filas.forEach(function (f) { if (campanas.indexOf(f.campana) < 0) campanas.push(f.campana); });
    var deLaCampana = function (campana) { return filas.filter(function (f) { return f.campana === campana; }); };
    var todasDicen = function (campana, texto) { return deLaCampana(campana).every(function (f) { return f.pesoMas.texto === texto; }); };
    var frases = [];
    var precio = campanas.filter(function (c) { return todasDicen(c, "Precio"); });
    if (precio.length > 0) frases.push(["En " + enumerar(precio) + " pesó más el precio en todos los cultivos."]);
    var rinde = campanas.filter(function (c) { return todasDicen(c, "Rinde"); }).map(function (c) {
      var efectos = deLaCampana(c).map(function (f) { return f.efectoRinde.v; });
      if (efectos.every(function (v) { return v < 0; })) return c + " (el rinde cayó)";
      if (efectos.every(function (v) { return v > 0; })) return c + " (el rinde subió)";
      return c;
    });
    if (rinde.length > 0) frases.push(["En " + enumerar(rinde) + " pesó más el rinde en todos los cultivos."]);
    frases.push([lecturaFija()]);
    return frases;
  }

  function armarSorpresa(datos) {
    var filas = (datos.porCampana || []).map(function (fila) { return armarFilaSorpresa(datos, fila); });
    return { filas: filas, lectura: armarLectura(filas) };
  }

  // armarVista(datos, estado, opciones): estado es el estado compartido de la página (sólo se usa para
  // normalizar h). Lo de «¿Se cumple la hipótesis?» y «Zona por zona» no depende de él (usa siempre el
  // 100 % cubierto); «¿Cuánto cubrir?» usa la h compartida. opciones.filtroCultivo: «Trigo», «Soja»,
  // «Maíz» o «todos» (el valor del filtro de «Zona por zona»).
  function armarVista(datos, estado, opciones) {
    var e = base().normalizarEstado(estado, datos, 0);
    var hipotesis = armarHipotesis(datos);
    return {
      h: e.h,
      hipotesis: hipotesis,
      zonas: armarZonas(datos, opciones && opciones.filtroCultivo),
      cobertura: armarCobertura(datos, e.h, hipotesis),
      sorpresa: armarSorpresa(datos)
    };
  }

  // ---------------------------------------------------------------------------------------
  // Pintado
  // ---------------------------------------------------------------------------------------

  var nodos = null; // se arma en montar()

  // Nodos de una frase: el texto va como texto y cada celda como número con su origen.
  function nodosDeFrase(frase) {
    return frase.map(function (parte) {
      return typeof parte === "string" ? parte : numeroDe(parte);
    });
  }

  // Frase en simple para la ventanita «De dónde sale este número» (el archivo y la celda siguen en data-origen y en «Datos y fuentes»).
  var EXPLICA_GENERAL = "Lo calculamos con los datos de las seis campañas, de 2020/21 a 2025/26.";
  var EXPLICAS = [
    [/^1 − \(promedio de zonas/, "Cuánto baja el riesgo al cubrir el 100 %: se compara cuánto se alejaba el resultado de lo proyectado sin cubrir y cubriendo, promediando las zonas."],
    [/^Desvío estándar muestral/, "Cuánto se alejó el margen real del proyectado, en general, de una campaña a otra."],
    [/^1 − riesgo con cobertura/, "Cuánto baja el riesgo con la cobertura."],
    [/^La peor caída de rinde/, "La peor caída del rinde frente al esperado entre las seis campañas."],
    [/^Campaña de la peor caída/, "La campaña en la que más cayó el rinde frente al esperado."],
    [/^«subió»/, "Compara el riesgo con cobertura y sin cobertura."],
    [/^Cantidad de pares de cultivo y zona$/, "Las combinaciones de cultivo y zona que se analizaron."],
    [/^Cantidad de pares de cultivo y zona/, "Cuántas combinaciones de cultivo y zona cumplen esa condición."],
    [/^Promedio de las zonas del desvío estándar muestral de la sorpresa sin cobertura/, "Cuánto se alejó, en promedio de las zonas, el margen real del proyectado sin cubrirse."],
    [/^Promedio de las zonas del desvío estándar muestral/, "Cuánto se alejó, en promedio de las zonas, el margen real del proyectado con la parte elegida cubierta."],
    [/^riesgo con h ÷ riesgo/, "Qué parte del riesgo que tenías sin cubrir queda con la cobertura elegida."],
    [/^Promedio de todos los casos del cultivo del margen real sin cobertura/, "El margen promedio por hectárea sin cubrirte."],
    [/^Promedio de todos los casos del cultivo de/, "El margen promedio por hectárea con la parte elegida cubierta."],
    [/^margen real medio con h/, "El margen promedio con la parte elegida cubierta menos el que tendrías sin cubrirte."],
    [/^− Σ covarianza|^− covarianza/, "La parte cubierta con la que el resultado queda más estable, calculada con las seis campañas."],
    [/^rinde esperado ÷ 10 × \(spot/, "Lo que sumó o restó el cambio del precio entre la siembra y la cosecha."],
    [/^\(rinde real − rinde esperado\) ÷ 10 × \(futuro/, "Lo que sumó o restó que el rinde fuera distinto del esperado."],
    [/^\(rinde real − rinde esperado\) ÷ 10 × \(spot/, "Lo que sumaron o restaron juntos el cambio de precio y el de rinde."]
  ];
  function explicaRH(origen) {
    if (typeof origen !== "string" || origen === "") return null;
    if (origen.indexOf("Parametros › B9") >= 0) return "La meta que se planteó: bajar el riesgo más del 50 %.";
    if (origen.indexOf("procesamiento estadístico") >= 0) return "Cuánto baja el riesgo de la rentabilidad al cubrir con rinde fijo, tomando los 114 casos del estudio.";
    if (origen.indexOf(" — parte de: ") < 0) return base().explicarOrigen(origen);
    var formula = origen.slice(0, origen.indexOf(" — parte de: "));
    for (var i = 0; i < EXPLICAS.length; i++) if (EXPLICAS[i][0].test(formula)) return EXPLICAS[i][1];
    return EXPLICA_GENERAL;
  }
  function numeroDe(c, opciones) {
    var o = { explica: explicaRH(c.origen) };
    if (opciones && opciones.enfocable === false) o.enfocable = false;
    return base().numero(c.v, c.formato, c.origen, o);
  }

  // Filtro de «Zona por zona»: se recuerda acá (no es parte del estado compartido de la página).
  var filtroCultivo = "todos";

  function montar(contenedor) {
    var a = base();
    var el = a.el;
    nodos = {};
    pintado = { datos: null, estaticos: false };
    filtroCultivo = "todos";
    contenedor.appendChild(el("p", { "class": "rh-intro" },
      "La hipótesis era que cubrirse con futuros baja el riesgo más del 50 %. Acá ves qué pasó con los datos de 2020/21 a 2025/26."));
    nodos.hipotesis = el("div", { id: "rh-hipotesis-resultados" });
    contenedor.appendChild(el("section", { id: "rh-hipotesis", "class": "rh-bloque" }, [
      el("h3", null, "¿Se cumple la hipótesis?"),
      el("p", { "class": "rh-explicacion" }, QUE_SE_PROBO),
      el("p", { "class": "ayuda" }, AVISO),
      nodos.hipotesis
    ]));

    nodos.filtro = el("select", { id: "rh-filtro-cultivo" }, [
      el("option", { value: "todos" }, "Todos los cultivos")
    ].concat(CULTIVOS.map(function (cultivo) { return el("option", { value: cultivo }, cultivo); })));
    nodos.filtro.addEventListener("change", alCambiarFiltro);
    nodos.zonas = el("div", { id: "rh-zonas-resultados" });
    contenedor.appendChild(el("section", { id: "rh-zonas", "class": "rh-bloque" }, [
      el("h3", null, "Zona por zona"),
      el("p", { "class": "ayuda" },
        "Con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto. Riesgo: cuánto se aleja el margen real del proyectado de una campaña a otra."),
      el("div", { "class": "rh-filtro" }, [el("label", { "for": "rh-filtro-cultivo" }, "Cultivo"), nodos.filtro]),
      nodos.zonas
    ]));

    // ¿Cuánto cubrir?: el deslizador comparte la h con «Mi campo» (estado.h). Se crea UNA vez: al moverlo
    // se rehace sólo lo que está debajo (#rh-cobertura-resultados), así no se pierde el foco ni el arrastre.
    nodos.h = el("input", { type: "range", id: "rh-h", min: "0", max: "100", step: "5" });
    nodos.hValor = el("output", { id: "rh-h-valor", "for": "rh-h" });
    nodos.h.addEventListener("input", function () { a.cambiar({ h: Number(nodos.h.value) / 100 }); });
    nodos.cobertura = el("div", { id: "rh-cobertura-resultados" });
    // Cuántos pares de cultivo y zona bajaron, subieron o no cambiaron con el 100 % cubierto: sale de los datos (no depende de h).
    nodos.balance = el("p", { "class": "ayuda", id: "rh-balance" });
    contenedor.appendChild(el("section", { id: "rh-cobertura", "class": "rh-bloque" }, [
      el("h3", null, "¿Cuánto cubrir?"),
      el("label", { "for": "rh-h" }, "Parte cubierta con futuros"),
      el("div", { "class": "mc-campo-entrada" }, [nodos.h, nodos.hValor]),
      el("p", { "class": "ayuda" }, "Es la misma parte cubierta de «Probá variantes»: si la cambiás acá, cambia allá."),
      nodos.balance,
      nodos.cobertura
    ]));

    nodos.sorpresa = el("div", { id: "rh-sorpresa-resultados" });
    contenedor.appendChild(el("section", { id: "rh-sorpresa", "class": "rh-bloque" }, [
      el("h3", null, "Por qué el margen se alejó de lo proyectado"),
      el("p", { "class": "ayuda" }, AYUDA_SORPRESA),
      nodos.sorpresa
    ]));
  }

  // Tabla de la tesis: reducción del desvío con rinde fijo, con el 100 % y con el 50 % cubierto.
  function pintarTablaTesis(h) {
    var a = base();
    var el = a.el;
    var celdaNumero = function (c) { return el("td", null, numeroDe(c)); };
    return el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla rh-tabla" }, [
      el("caption", null, "Cuánto baja el riesgo de la rentabilidad con rinde fijo (114 casos)"),
      el("thead", null, el("tr", null, ["Cultivo", "Con el 100 % cubierto", "Con el 50 % cubierto"].map(function (t) { return el("th", { scope: "col" }, t); }))),
      el("tbody", null, h.filasTesis.map(function (f) {
        return el("tr", null, [el("th", { scope: "row" }, f.nombre), celdaNumero(f.cien), celdaNumero(f.cincuenta)]);
      }))
    ]));
  }

  // Tabla del análisis complementario (rinde real).
  function pintarTablaHipotesis(h) {
    var a = base();
    var el = a.el;
    var columnas = ["Cultivo", "Con rinde real, en rentabilidad", "Con rinde real, en USD/ha"];
    var celdaNumero = function (c) { return el("td", null, numeroDe(c)); };
    return el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla rh-tabla" }, [
      el("caption", null, "Con rinde real: cuánto riesgo sacó la cobertura con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto"),
      el("thead", null, el("tr", null, columnas.map(function (texto) { return el("th", { scope: "col" }, texto); }))),
      el("tbody", null, h.cultivos.map(function (c) {
        return el("tr", null, [el("th", { scope: "row" }, c.cultivo), celdaNumero(c.real), celdaNumero(c.realUsd)]);
      }))
    ]));
  }

  // Gráfico de barras con la línea de la hipótesis y su leyenda en texto (los colores solos no alcanzan).
  function pintarGrafico(grafico) {
    var a = base();
    var el = a.el;
    if (!grafico) return el("p", { "class": "ayuda" }, AVISO_SIN_GRAFICO);
    var etiquetarEje = function (valor) { return a.formato.numero(valor * 100, 0) + NBSP + "%"; };
    var svg = raiz.TESIS_GRAFICOS.barrasAgrupadas(raiz.document, Object.assign({ formatear: a.formato.porcentaje, etiquetarEje: etiquetarEje }, grafico));
    var items = grafico.series.map(function (serie) {
      return el("li", null, [el("span", { "class": "muestra-serie " + serie.clase, "aria-hidden": "true" }), serie.nombre]);
    });
    items.push(el("li", null, [el("span", { "class": "muestra-referencia", "aria-hidden": "true" }), grafico.referencia.nombre]));
    return el("figure", { "class": "rh-grafico" }, [
      a.encabezadoDeGrafico(grafico.titulo, "reducción del riesgo, en porcentaje"),
      svg,
      el("figcaption", null, [el("ul", { "class": "leyenda" }, items), el("p", { "class": "ayuda" }, "Los valores exactos están en la tabla de abajo.")])
    ]);
  }

  function pintarHipotesis(h) {
    var a = base();
    var el = a.el;
    a.vaciar(nodos.hipotesis);
    nodos.hipotesis.appendChild(el("p", { "class": "rh-conclusion" }, nodosDeFrase(h.conclusion)));
    nodos.hipotesis.appendChild(pintarGrafico(h.grafico));
    nodos.hipotesis.appendChild(el("p", { "class": "rh-explicacion" }, h.explicacionFijo));
    nodos.hipotesis.appendChild(pintarTablaTesis(h));
    var c = h.complementario;
    var hijos = [el("h4", null, c.titulo)];
    if (c.texto.length) hijos.push(el("p", { "class": "rh-explicacion" }, nodosDeFrase(c.texto)));
    hijos.push(el("p", { "class": "rh-explicacion" }, c.explicacion));
    hijos.push(pintarGrafico(c.grafico));
    hijos.push(pintarTablaHipotesis(h));
    nodos.hipotesis.appendChild(el("div", { "class": "rh-complementario", id: "rh-complementario" }, hijos));
  }

  // Un texto con origen (campaña, «subió»): se toca igual que un número con el mouse o el dedo. Como los números de las
  // tablas largas, no es una parada de tabulador: el teclado llega a su origen por el botón «Ver orígenes» de la fila.
  function textoConOrigen(clase, celdaTexto, explica) {
    return base().el("span", { "class": clase, "data-origen": celdaTexto.origen, "data-explica": explica, title: explica }, celdaTexto.texto);
  }
  var EXPLICA_ESTADO = "Compara el riesgo con cobertura y sin cobertura.";
  var EXPLICA_CAMPANA_PEOR = "La campaña en la que más cayó el rinde frente al esperado.";
  var EXPLICA_PESO = "Si pesó más el cambio del precio o el del rinde en lo que se alejó el margen.";

  // Un número de una tabla larga: con origen (se toca) pero sin ser parada de tabulador.
  function numeroSinTabulador(c) {
    return numeroDe(c, { enfocable: false });
  }

  // El botón «Ver orígenes» de una fila: UNA parada de tabulador por fila en vez de una por número. Abre la lista de
  // orígenes de todos los números y textos de la fila (se arma recién al tocarlo).
  function botonOrigenes(nombre, aria, items) {
    var a = base();
    var boton = a.el("button", { type: "button", "class": "df-ver-origenes", "aria-label": aria }, "Ver orígenes");
    a.vincularOrigenes(boton, function () { return { titulo: nombre, items: items() }; });
    return boton;
  }

  // Encabezado de columna; la de «Orígenes» (el botón «Ver orígenes» de cada fila) va aparte y compacta.
  function encabezadoDeColumna(texto) {
    return base().el("th", texto === "Orígenes" ? { scope: "col", "class": "col-origenes" } : { scope: "col" }, texto);
  }

  function pintarFilaZona(fila) {
    var a = base();
    var el = a.el;
    var numeroEn = function (c) { return el("td", null, numeroSinTabulador(c)); };
    // Sólo la fila donde cubrirse subió el riesgo lleva color; además dice «subió» con letras (no sólo color).
    var estado = fila.subio ? textoConOrigen("rh-estado", fila.estado, EXPLICA_ESTADO) : textoConOrigen("dato-texto", fila.estado, EXPLICA_ESTADO);
    var boton = botonOrigenes(fila.cultivo + " · " + fila.zona,
      "Ver orígenes de los números de " + fila.cultivo + ", " + fila.zona, function () {
        var num = function (etiqueta, c) { return { etiqueta: etiqueta, v: c.v, formato: c.formato, origen: c.origen, explica: explicaRH(c.origen) }; };
        return [
          num("Riesgo sin cobertura (USD/ha)", fila.sdSin), num("Riesgo con cobertura (USD/ha)", fila.sdCon), num("Reducción", fila.reduccion),
          num("Riesgo en rentabilidad sin cobertura", fila.sdRSin), num("Riesgo en rentabilidad con cobertura", fila.sdRCon),
          num("Reducción en rentabilidad", fila.reduccionR), num("Peor caída de rinde", fila.peorDesvio),
          { etiqueta: "Campaña de la peor caída", texto: fila.campanaPeor.texto, origen: fila.campanaPeor.origen, explica: EXPLICA_CAMPANA_PEOR },
          { etiqueta: "Con cobertura el riesgo…", texto: fila.estado.texto, origen: fila.estado.origen, explica: EXPLICA_ESTADO }
        ];
      });
    return el("tr", fila.subio ? { "class": "rh-subio" } : null, [
      el("th", { scope: "row" }, [el("span", { "class": "rh-cultivo" }, fila.cultivo), el("span", { "class": "rh-zona" }, fila.zona)]),
      numeroEn(fila.sdSin), numeroEn(fila.sdCon), numeroEn(fila.reduccion),
      numeroEn(fila.sdRSin), numeroEn(fila.sdRCon), numeroEn(fila.reduccionR),
      numeroEn(fila.peorDesvio),
      el("td", null, textoConOrigen("dato-texto", fila.campanaPeor, EXPLICA_CAMPANA_PEOR)),
      el("td", null, estado),
      el("td", { "class": "col-origenes" }, boton)
    ]);
  }

  function pintarZonas(zonas) {
    var a = base();
    var el = a.el;
    var columnas = ["Cultivo y zona", "Riesgo sin cobertura (USD/ha)", "Riesgo con cobertura (USD/ha)", "Reducción",
      "Riesgo en rentabilidad sin cobertura", "Riesgo en rentabilidad con cobertura", "Reducción en rentabilidad",
      "Peor caída de rinde", "Campaña", "Con cobertura el riesgo…", "Orígenes"];
    a.vaciar(nodos.zonas);
    nodos.filtro.value = zonas.filtro;
    nodos.zonas.appendChild(el("p", { "class": "rh-resumen-zonas" }, nodosDeFrase(zonas.resumen)));
    nodos.zonas.appendChild(el("p", { "class": "rh-resumen-zonas" }, nodosDeFrase(zonas.contraste)));
    nodos.zonas.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla rh-tabla rh-tabla-zonas" }, [
      el("caption", null, "Riesgo por zona con el " + enteroConPorcentaje(H_HIPOTESIS) + " cubierto"),
      el("thead", null, el("tr", null, columnas.map(encabezadoDeColumna))),
      el("tbody", null, zonas.filas.map(pintarFilaZona))
    ])));
  }

  // Tabla de «¿Cuánto cubrir?»: por cultivo, el riesgo y el margen medio con la parte elegida.
  function pintarTablaCobertura(c) {
    var a = base();
    var el = a.el;
    var columnas = ["Cultivo", "Riesgo sin cubrirse", "Riesgo con la parte elegida", "Queda del riesgo sin cubrir (en USD/ha)",
      "Margen real medio", "Diferencia contra no cubrirse"];
    var celdaNumero = function (x) { return el("td", null, numeroDe(x)); };
    return el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla rh-tabla" }, [
      el("caption", null, "Riesgo y margen medio por cultivo con " + enteroConPorcentaje(c.h) + " cubierto (promedio de las zonas, USD/ha)"),
      el("thead", null, el("tr", null, columnas.map(function (texto) { return el("th", { scope: "col" }, texto); }))),
      el("tbody", null, c.cultivos.map(function (x) {
        return el("tr", null, [
          el("th", { scope: "row" }, x.cultivo),
          celdaNumero(x.riesgoSin), celdaNumero(x.riesgo), celdaNumero(x.relativo), celdaNumero(x.margen), celdaNumero(x.diferencia)
        ]);
      }))
    ]));
  }

  // Gráfico de líneas con el riesgo de cada cultivo de 0 a 100 % cubierto y un punto en la parte elegida.
  // La leyenda dice en texto qué línea es cada cultivo (los colores solos no alcanzan).
  function pintarGraficoCobertura(c) {
    var a = base();
    var el = a.el;
    var svg = raiz.TESIS_GRAFICOS.lineas(raiz.document, Object.assign({
      formatear: a.formato.usd,
      etiquetarX: function (valor) { return a.formato.numero(valor * 100, 0) + NBSP + "%"; }
    }, c.grafico));
    var items = c.grafico.series.map(function (serie) {
      return el("li", null, [el("span", { "class": "muestra-serie " + serie.clase, "aria-hidden": "true" }), serie.nombre]);
    });
    return el("figure", { "class": "rh-grafico" }, [
      a.encabezadoDeGrafico(c.grafico.titulo, "riesgo (cuánto se alejó el margen real del proyectado, promedio de las zonas), en USD por hectárea", "parte cubierta con futuros, en porcentaje"),
      svg,
      el("figcaption", null, [
        el("ul", { "class": "leyenda" }, items),
        el("p", { "class": "ayuda" }, "El eje empieza en 0 para que se vea cuánto baja de verdad el riesgo. El punto marca la parte elegida; los valores exactos están en la tabla.")
      ])
    ]);
  }

  function pintarCobertura(c) {
    var a = base();
    var el = a.el;
    a.vaciar(nodos.cobertura);
    nodos.cobertura.appendChild(pintarGraficoCobertura(c));
    nodos.cobertura.appendChild(pintarTablaCobertura(c));
    if (c.conexion.length) nodos.cobertura.appendChild(el("p", { "class": "ayuda" }, nodosDeFrase(c.conexion)));
    nodos.cobertura.appendChild(el("p", { "class": "ayuda" }, c.ayudaDiferencia));
    nodos.cobertura.appendChild(el("ul", { "class": "rh-minima" }, c.cultivos.map(function (x) {
      return el("li", null, nodosDeFrase(x.fraseMinima));
    })));
    nodos.cobertura.appendChild(el("p", { "class": "ayuda" }, c.aviso));
  }

  // «De dónde vino la sorpresa»: la lectura y una fila por cultivo y campaña. Las filas donde pesó el rinde llevan
  // `rh-peso-rinde` (letra más gruesa) y, además, lo dicen con la palabra «Rinde» en la última columna.
  function pintarFilaSorpresa(fila) {
    var a = base();
    var el = a.el;
    var numeroEn = function (c) { return el("td", null, numeroSinTabulador(c)); };
    var boton = botonOrigenes(fila.cultivo + " · campaña " + fila.campana,
      "Ver orígenes de los números de " + fila.cultivo + ", campaña " + fila.campana, function () {
        var num = function (etiqueta, c) { return { etiqueta: etiqueta, v: c.v, formato: c.formato, origen: c.origen, explica: explicaRH(c.origen) }; };
        return [
          num("Efecto precio (USD/ha)", fila.efectoPrecio), num("Efecto rinde (USD/ha)", fila.efectoRinde), num("Los dos juntos (USD/ha)", fila.interaccion),
          { etiqueta: "Pesó más", texto: fila.pesoMas.texto, origen: fila.pesoMas.origen, explica: EXPLICA_PESO }
        ];
      });
    return el("tr", fila.pesoMas.texto === "Rinde" ? { "class": "rh-peso-rinde" } : null, [
      el("th", { scope: "row" }, [el("span", { "class": "rh-cultivo" }, fila.cultivo), el("span", { "class": "rh-campana" }, fila.campana)]),
      numeroEn(fila.efectoPrecio), numeroEn(fila.efectoRinde), numeroEn(fila.interaccion),
      el("td", null, textoConOrigen("dato-texto", fila.pesoMas, EXPLICA_PESO)),
      el("td", { "class": "col-origenes" }, boton)
    ]);
  }

  function pintarSorpresa(sorpresa) {
    var a = base();
    var el = a.el;
    var columnas = ["Cultivo y campaña", "Efecto precio", "Efecto rinde", "Los dos juntos", "Pesó más", "Orígenes"];
    a.vaciar(nodos.sorpresa);
    nodos.sorpresa.appendChild(el("div", { "class": "rh-lectura" }, sorpresa.lectura.map(function (frase) { return el("p", null, textoDeFrase(frase)); })));
    nodos.sorpresa.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla rh-tabla rh-tabla-sorpresa" }, [
      el("caption", null, "Diferencia con lo proyectado, por cultivo y campaña, partida en precio y rinde (USD/ha)"),
      el("thead", null, el("tr", null, columnas.map(encabezadoDeColumna))),
      el("tbody", null, sorpresa.filas.map(pintarFilaSorpresa))
    ])));
  }

  function pintarBalance(frase) {
    var a = base();
    a.vaciar(nodos.balance);
    nodosDeFrase(frase).forEach(function (parte) {
      nodos.balance.appendChild(typeof parte === "string" ? raiz.document.createTextNode(parte) : parte);
    });
  }

  // Qué se pintó ya: los bloques que no dependen de h («¿Se cumple la hipótesis?» y «Zona por zona») se
  // arman una vez por `datos` y no se rehacen al mover el deslizador; sólo «¿Cuánto cubrir?» depende de h.
  var pintado = { datos: null, estaticos: false, hipotesis: null };

  function sincronizarDeslizador(h) {
    var texto = String(Math.round(h * 100));
    if (nodos.h.value !== texto) nodos.h.value = texto; // el mismo input: no se recrea ni se le pisa el valor que ya tiene
    nodos.hValor.textContent = base().formato.numero(h * 100, 0) + NBSP + "%";
  }

  function actualizar(estado) {
    var datos = raiz.TESIS_DATOS;
    var e = base().normalizarEstado(estado, datos, 0);
    if (pintado.datos !== datos) pintado = { datos: datos, estaticos: false };
    if (!pintado.estaticos) {
      pintado.hipotesis = armarHipotesis(datos);
      pintarHipotesis(pintado.hipotesis);
      var zonas = armarZonas(datos, filtroCultivo);
      pintarZonas(zonas);
      pintarBalance(zonas.balance);
      pintarSorpresa(armarSorpresa(datos));
      pintado.estaticos = true;
    }
    sincronizarDeslizador(e.h);
    pintarCobertura(armarCobertura(datos, e.h, pintado.hipotesis));
  }

  // Al elegir otro cultivo sólo se rehace «Zona por zona»; si falla, se avisa como lo hace la base.
  function alCambiarFiltro() {
    var a = base();
    filtroCultivo = nodos.filtro.value;
    a.cerrarOrigen(false); // la ventanita abierta apuntaba a una fila que se va a repintar
    var aviso = seccion.nodoError;
    try {
      pintarZonas(armarZonas(raiz.TESIS_DATOS, filtroCultivo));
      if (aviso) { aviso.textContent = ""; aviso.hidden = true; }
    } catch (e) {
      limpiar();
      if (aviso) { aviso.textContent = "No se pudo calcular: " + e.message; aviso.hidden = false; }
    }
  }

  // Deja los resultados vacíos (la base lo pide si el cálculo falla: no pueden quedar cifras viejas).
  // Y se acuerda de que no hay nada pintado, para que el próximo cálculo que ande lo vuelva a pintar todo.
  function limpiar() {
    pintado = { datos: null, estaticos: false };
    if (!nodos) return;
    base().vaciar(nodos.hipotesis);
    base().vaciar(nodos.zonas);
    base().vaciar(nodos.balance);
    base().vaciar(nodos.sorpresa);
    base().vaciar(nodos.cobertura);
  }

  var seccion = { id: "riesgo", titulo: "Riesgo e hipótesis", grupo: "historico", montar: montar, actualizar: actualizar, limpiar: limpiar };

  var api = {
    armarVista: armarVista,
    textoDeFrase: textoDeFrase,
    veredicto: veredicto,
    armarCobertura: armarCobertura,
    armarSorpresa: armarSorpresa,
    seccion: seccion,
    H_HIPOTESIS: H_HIPOTESIS,
    PASOS_H: PASOS_H,
    FORMULAS: FORMULAS
  };
  raiz.TESIS_RIESGO = api;
  // Sin la base común la sección desaparecería sin decir nada: mejor un error claro en la consola.
  if (!raiz.TESIS_APP) throw new Error("riesgo.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
