// Sección 4 · «Rentabilidad y costo de oportunidad»: qué es el costo de oportunidad, el CAPM y el riesgo país (EMBI), con los
// componentes de k de cada año, y la rentabilidad R de la tesis contra k con y sin riesgo país (2021 a 2025).
// R sale de la referencia de la tesis que ya arma js/rentabilidad.js (armarReferencia: tablas de Brecha_R_vs_K, promedio de zonas con
// rinde de planteo, sin recalcular márgenes); los componentes de k salen de datos.k (libro del CAPM). Acá sólo se promedia R entre
// los tres cultivos, se arma k sin EMBI (= tasa libre + β × prima) y se compara.
// armar() es una función pura, sin DOM; el resto pinta la pantalla. Los gráficos son de Apache ECharts si está cargado.
(function (raiz) {
  "use strict";

  var EXPLICACIONES = [
    ["Costo de oportunidad", "Es lo que dejás de ganar por tener tu plata en la tierra en vez de en otra inversión de riesgo parecido. Si la tierra rinde menos que esa alternativa, el costo de oportunidad le gana. Por eso se compara la rentabilidad de la tierra (R) con una tasa de referencia, que llamamos k."],
    ["CAPM", "Es el método que usan las finanzas para calcular k, la tasa que un inversor exige por el riesgo que corre. Acá: k = tasa libre de riesgo + β × prima de mercado + riesgo país. La tasa libre de riesgo es lo que paga un bono del Tesoro de Estados Unidos; β mide cuánto se mueve el negocio agrícola respecto del mercado; la prima de mercado es el extra que pagan las acciones sobre esa tasa."],
    ["Riesgo país (EMBI)", "Es la sobretasa que paga Argentina, por encima de Estados Unidos, para que le presten plata. Lo mide el índice EMBI. En el CAPM se suma a k porque invertir en Argentina exige ese plus. Cuando el riesgo país es alto, k es alto."]
  ];

  var nodos = {};
  var ec = null;
  var ultima = null;

  function base() { return raiz.TESIS_APP; }
  function M() { return raiz.TESIS_MOTOR; }
  function el(e, a, c) { return base().el(e, a, c); }
  function num(v, f, o) { return base().numero(v, f, o); }

  // ---------------------------------------------------------------------------------------
  // Cálculo (sin DOM)
  // ---------------------------------------------------------------------------------------

  function promedioDe(celdas) { return M().promedio(celdas.map(function (c) { return c.v; })); }
  function origenesDe(celdas) { return celdas.map(function (c) { return c.origen; }); }

  // Una fila por año con R (con y sin cobertura), los componentes de k y k con y sin EMBI.
  // Las columnas de armarReferencia son, en orden: trigo con cobertura, trigo spot, soja con, soja spot, maíz con, maíz spot.
  function armar(datos) {
    datos = datos || raiz.TESIS_DATOS;
    if (!raiz.TESIS_RENTABILIDAD) throw new Error("costo-oportunidad.js necesita rentabilidad.js (referencia de la tesis).");
    var ref = raiz.TESIS_RENTABILIDAD.armarReferencia(datos);
    var filasR = ref.tablas[0].filas;
    var k = datos.k;
    var comp = k.componentes;
    var filas = k.anios.map(function (a, i) {
      var fila = filasR.filter(function (f) { return f.anio === a.v; })[0];
      if (!fila) throw new Error("La referencia de la tesis no tiene el año " + a.v + " que tiene el CAPM.");
      var con = [fila.celdas[0], fila.celdas[2], fila.celdas[4]];
      var sin = [fila.celdas[1], fila.celdas[3], fila.celdas[5]];
      var rf = comp.rf[i], beta = k.base.beta[i], erp = comp.erp[i], embi = comp.embi[i];
      var betaPorPrima = beta.v * erp.v;
      return {
        anio: a.v, campana: fila.campana,
        rCon: promedioDe(con), rSin: promedioDe(sin),
        origenRCon: origenesDe(con), origenRSin: origenesDe(sin),
        rf: rf.v, beta: beta.v, erp: erp.v, embi: embi.v, betaPorPrima: betaPorPrima,
        kSin: rf.v + betaPorPrima,
        kCon: k.base.k[i].v,
        origen: { rf: rf.o, beta: beta.o, erp: erp.o, embi: embi.o, k: k.base.k[i].o }
      };
    });
    var comparar = function (rClave, kClave) {
      var brechas = filas.map(function (f) { return f[rClave] - f[kClave]; });
      return { debajo: brechas.filter(function (b) { return b < 0; }).length, anios: filas.length, brechaMedia: M().promedio(brechas), brechas: brechas };
    };
    var lectura = {
      conEmbi: { sinCobertura: comparar("rSin", "kCon"), conCobertura: comparar("rCon", "kCon") },
      sinEmbi: { sinCobertura: comparar("rSin", "kSin"), conCobertura: comparar("rCon", "kSin") }
    };
    var n = filas.length;
    var tierraSupera = lectura.sinEmbi.sinCobertura.debajo <= n / 2 && lectura.sinEmbi.conCobertura.debajo <= n / 2;
    var noSuperaConEmbi = lectura.conEmbi.sinCobertura.debajo > n / 2 && lectura.conEmbi.conCobertura.debajo > n / 2;
    lectura.mensajeCentral = tierraSupera && noSuperaConEmbi ? "sin-riesgo-pais-supera" : "depende";
    return {
      filas: filas, anios: filas.map(function (f) { return f.anio; }), lectura: lectura,
      hCobertura: datos.parametros.h.v, betaSignificativo: k.betaSignificativo.beta[0].v, origenBetaSignificativo: k.betaSignificativo.beta[0].o, sinK: k.sinK, nota: ref.nota
    };
  }

  // Datos del gráfico: R con y sin cobertura contra k con y sin riesgo país, por año.
  function armarGrafico(vista) {
    var col = function (clave) { return vista.filas.map(function (f) { return f[clave]; }); };
    return {
      categorias: vista.anios.map(String),
      series: [
        { nombre: "R con cobertura", clave: "rCon", valores: col("rCon") },
        { nombre: "R sin cobertura", clave: "rSin", valores: col("rSin") },
        { nombre: "k con riesgo país (EMBI)", clave: "kCon", valores: col("kCon") },
        { nombre: "k sin riesgo país", clave: "kSin", valores: col("kSin") }
      ]
    };
  }

  // ---------------------------------------------------------------------------------------
  // Pantalla
  // ---------------------------------------------------------------------------------------

  function pintarComponentes(v) {
    var cont = nodos.componentes;
    base().vaciar(cont);
    var cab = el("tr", null, [el("th", { scope: "col" }, "Componente de k")].concat(v.filas.map(function (f) { return el("th", { scope: "col" }, String(f.anio)); })));
    var fila = function (titulo, clave, formato, origenDe) {
      return el("tr", null, [el("th", { scope: "row" }, titulo)].concat(v.filas.map(function (f) { return el("td", null, num(f[clave], formato, origenDe(f))); })));
    };
    var propio = function (c) { return function (f) { return f.origen[c]; }; };
    var calc = function (formula, claves) { return function (f) { return base().origenCalculado(formula, claves.map(function (c) { return f.origen[c]; })); }; };
    var filas = [
      fila("Tasa libre de riesgo", "rf", "porcentaje", propio("rf")),
      fila("β (sensibilidad al mercado)", "beta", "beta", propio("beta")),
      fila("Prima de mercado", "erp", "porcentaje", propio("erp")),
      fila("β × prima de mercado", "betaPorPrima", "porcentaje", calc("β × prima de mercado", ["beta", "erp"])),
      fila("k sin riesgo país = tasa libre + β × prima", "kSin", "porcentaje", calc("tasa libre + β × prima de mercado", ["rf", "beta", "erp"])),
      fila("Riesgo país (EMBI)", "embi", "porcentaje", propio("embi")),
      fila("k con riesgo país = k sin riesgo país + EMBI", "kCon", "porcentaje", propio("k"))
    ];
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sec-tabla" }, [
      el("caption", null, "Componentes de k por año (CAPM)"), el("thead", null, cab), el("tbody", null, filas)])));
    cont.appendChild(el("p", { "class": "ayuda" }, ["La campaña 2025/26 no tiene k: el libro del CAPM llega hasta 2025. El β usado es el base (", num(v.filas[0].beta, "beta", v.filas[0].origen.beta),
      "); en «Lo que pasó» › «Rentabilidad vs. K» está también la variante con β significativo (", num(v.betaSignificativo, "beta", v.origenBetaSignificativo), ")."]));
  }

  function pintarTablaR(v) {
    var cont = nodos.tablaR;
    base().vaciar(cont);
    var cab = el("tr", null, ["Año", "R con cobertura", "R sin cobertura", "k con riesgo país", "k sin riesgo país", "R sin cobertura − k con riesgo país", "R sin cobertura − k sin riesgo país"].map(function (t) { return el("th", { scope: "col" }, t); }));
    var filas = v.filas.map(function (f) {
      var oK = function (c) { return f.origen[c]; };
      return el("tr", null, [el("th", { scope: "row" }, String(f.anio)),
        el("td", null, num(f.rCon, "porcentaje", base().origenCalculado("promedio simple de R con cobertura de trigo, soja y maíz", f.origenRCon))),
        el("td", null, num(f.rSin, "porcentaje", base().origenCalculado("promedio simple de R sin cobertura (spot) de trigo, soja y maíz", f.origenRSin))),
        el("td", null, num(f.kCon, "porcentaje", oK("k"))),
        el("td", null, num(f.kSin, "porcentaje", base().origenCalculado("tasa libre + β × prima de mercado", [f.origen.rf, f.origen.beta, f.origen.erp]))),
        el("td", null, num(f.rSin - f.kCon, "puntos", base().origenCalculado("R sin cobertura − k con riesgo país", f.origenRSin.concat([f.origen.k])))),
        el("td", null, num(f.rSin - f.kSin, "puntos", base().origenCalculado("R sin cobertura − k sin riesgo país", f.origenRSin.concat([f.origen.rf, f.origen.beta, f.origen.erp]))))]);
    });
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sec-tabla" }, [
      el("caption", null, "Rentabilidad R de la tesis contra k, por año"), el("thead", null, cab), el("tbody", null, filas)])));
  }

  function pintarLectura(v) {
    var cont = nodos.lectura;
    base().vaciar(cont);
    var l = v.lectura;
    var n = v.filas.length;
    var o = function (formula) { return base().origenCalculado(formula, v.filas.reduce(function (acc, f) { return acc.concat(f.origenRCon, f.origenRSin, [f.origen.k, f.origen.rf, f.origen.beta, f.origen.erp]); }, [])); };
    var frase = function (titulo, bloque) {
      return el("p", null, [titulo + ", la rentabilidad quedó por debajo de k en ", num(bloque.sinCobertura.debajo, "entero", o("años con R < k")), " de los " + n + " años sin cobertura y en ",
        num(bloque.conCobertura.debajo, "entero", o("años con R < k")), " con cobertura. La brecha promedio (R − k) fue de ",
        num(bloque.sinCobertura.brechaMedia, "puntos", o("promedio de (R − k)")), " sin cobertura y de ", num(bloque.conCobertura.brechaMedia, "puntos", o("promedio de (R − k)")), " con cobertura."]);
    };
    var central = l.mensajeCentral === "sin-riesgo-pais-supera"
      ? "Sin riesgo país, la tierra suele superar a k; con el riesgo país argentino, no."
      : "El resultado depende del riesgo país: comparar R con k sin y con el EMBI da conclusiones distintas, como muestran las cifras de abajo.";
    cont.appendChild(el("h3", null, "En palabras"));
    cont.appendChild(el("p", { "class": "sec-central" }, central));
    cont.appendChild(frase("Sin riesgo país", l.sinEmbi));
    cont.appendChild(frase("Con riesgo país", l.conEmbi));
    cont.appendChild(el("p", { "class": "ayuda" }, "R es el promedio simple de los tres cultivos (trigo, soja y maíz), tomado de la referencia de la tesis: promedio de todas las zonas con el rinde de planteo. «Con cobertura» es con el " +
      base().formato.porcentaje(v.hCobertura) + " cubierto con futuros. La comparación describe lo que pasó; no es una recomendación."));
  }

  function pintarGrafico(v) {
    if (!raiz.echarts || !ec) return;
    var t = raiz.TESIS_EC.tema();
    var c = raiz.TESIS_EC.colorDe;
    var g = armarGrafico(v);
    var estilos = {
      rCon: { color: c("color-con", "#009d9a"), grosor: 4 },
      rSin: { color: c("color-sin", "#b28600"), grosor: 4 },
      kCon: { color: c("color-k-base", "#a56eff"), trazo: "dashed", simbolo: "rect" },
      kSin: { color: c("color-supuesto", "#33b1ff"), trazo: "dashed", simbolo: "triangle" }
    };
    var series = g.series.map(function (s) { var e = estilos[s.clave]; return { nombre: s.nombre, valores: s.valores, color: e.color, trazo: e.trazo, grosor: e.grosor, simbolo: e.simbolo }; });
    ec.dibujar("costo", nodos.grafico, raiz.TESIS_EC.opcionDeLineas(t, g.categorias, series, function (x) { return base().formato.porcentaje(x); }, { escalar: false }));
  }

  // «Tu campo contra k»: la rentabilidad esperada que calculó «Simulá tu campaña» frente a k del último año del CAPM (con y sin riesgo país).
  function pintarTuya(v) {
    var cont = nodos.tuya;
    base().vaciar(cont);
    var ctx = raiz.TESIS_CAMPANA_UI && raiz.TESIS_CAMPANA_UI.contexto ? raiz.TESIS_CAMPANA_UI.contexto() : null;
    cont.hidden = !ctx;
    if (!ctx) return;
    var ult = v.filas[v.filas.length - 1];
    var r = ctx.rSinCobertura;
    var origen = function (f) { return base().origenCalculado(f, [ult.origen.k, ult.origen.rf, ult.origen.beta, ult.origen.erp]); };
    cont.appendChild(el("h3", null, "Tu campo contra el costo de oportunidad"));
    cont.appendChild(el("p", { "class": "sc-frase sc-frase-grande" }, ["Con tus datos, tu campo (zona " + ctx.zona + ") te deja ", num(r, "porcentaje", "R esperada de «Simulá tu campaña», vendiendo toda la cosecha a precio de cosecha"),
      " al año sobre el valor de tu tierra. El costo de oportunidad k de " + ult.anio + " fue de ", num(ult.kSin, "porcentaje", origen("tasa libre + β × prima de mercado")), " sin riesgo país y de ",
      num(ult.kCon, "porcentaje", ult.origen.k), " con riesgo país."]));
    cont.appendChild(el("p", { "class": "sc-frase" }, r >= ult.kCon ? "Tu rentabilidad esperada supera a k incluso con el riesgo país."
      : r >= ult.kSin ? "Tu rentabilidad esperada supera a k sin riesgo país, pero no a k con riesgo país." : "Tu rentabilidad esperada queda por debajo de k, con o sin riesgo país."));
  }

  function render() {
    var v = armar(raiz.TESIS_DATOS);
    ultima = v;
    nodos.cuadro.hidden = false;
    pintarTuya(v);
    pintarComponentes(v);
    pintarTablaR(v);
    pintarLectura(v);
    pintarGrafico(v);
    return v;
  }

  function montar(contenedor) {
    ec = raiz.TESIS_EC ? raiz.TESIS_EC.crear(function () { if (ultima) pintarGrafico(ultima); }) : null;
    contenedor.appendChild(el("p", { "class": "mc-intro" }, "¿Rinde la tierra lo suficiente? Para saberlo hay que compararla con lo que exigiría un inversor por el riesgo de poner su plata en la Argentina."));
    contenedor.appendChild(el("div", { "class": "sec-explicaciones" }, EXPLICACIONES.map(function (e) {
      return el("div", { "class": "tarjeta sec-explicacion" }, [el("h3", null, e[0]), el("p", null, e[1])]);
    })));
    nodos.tuya = el("div", { "class": "tarjeta sc-lectura sec-tuya" });
    nodos.tuya.hidden = true;
    nodos.componentes = el("div", { "class": "sec-tabla-bloque" });
    nodos.grafico = el("div", { "class": "sc-grafico", role: "img", "aria-label": "Gráfico de líneas: rentabilidad R de la tierra, con y sin cobertura, contra k con riesgo país y k sin riesgo país, de 2021 a 2025" });
    nodos.tablaR = el("div", { "class": "sec-tabla-bloque" });
    nodos.lectura = el("div", { "class": "tarjeta sc-lectura" });
    nodos.cuadro = el("div", { "class": "sec-cuadro" }, [
      nodos.tuya, nodos.componentes,
      el("figure", { "class": "sc-figura" }, [base().encabezadoDeGrafico("Rentabilidad R contra k, con y sin riesgo país", "porcentaje por año", "año de cosecha"), nodos.grafico]),
      nodos.tablaR, nodos.lectura,
      el("p", { "class": "sc-aviso", role: "note" }, [el("strong", null, "Esto describe lo que pasó. "), "No es asesoramiento financiero: k y R vienen de los Excels de la tesis y la comparación no predice lo que va a pasar."])
    ]);
    contenedor.appendChild(nodos.cuadro);
    render();
  }

  function actualizar() { if (nodos.cuadro) render(); }
  function limpiar() { ultima = null; if (nodos.cuadro) nodos.cuadro.hidden = true; }

  var api = { armar: armar, armarGrafico: armarGrafico, EXPLICACIONES: EXPLICACIONES };
  var seccion = { id: "costo-oportunidad", titulo: "Rentabilidad y costo de oportunidad", rotulo: "Costo de oportunidad", icono: "scale", montar: montar, actualizar: actualizar, limpiar: limpiar };
  api.seccion = seccion;
  raiz.TESIS_COSTO = api;
  if (!raiz.TESIS_APP) throw new Error("costo-oportunidad.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
