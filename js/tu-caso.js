// Pestaña «Lo que pasó» › «Tu caso»: qué hubiera pasado, entre 2020/21 y 2025/26, en la zona y con los cultivos y hectáreas del productor,
// vendiendo a cosecha (0 %), cubriendo la mitad (50 %) o cubriendo todo (100 %). Mide como la tesis: con el RINDE FIJO de planteo de cada zona
// (el rinde real no se usa) y comisión de 0,5 %. Por hectárea sale de motor.calcularCaso (margen proyectado + efecto precio + futuro cubierto);
// acá se multiplica por las hectáreas de cada cultivo y se compara. Además explica, campaña por campaña, por qué fue como fue (precio de
// siembra Fs contra precio de cosecha Sc, base, costos) y qué habría pasado con 25, 50, 75 y 100 % cubierto. Es una explicación, no una recomendación.
(function (raiz) {
  "use strict";

  var nodos = {};
  var NIVELES = [0, 0.5, 1];                 // las tres estrategias de la tesis
  var NIVELES_DET = [0, 0.25, 0.5, 0.75, 1]; // «si hubieras cubierto»
  var AVISO = "Esto describe lo que hubiera pasado con los datos de la tesis. No es asesoramiento financiero.";

  function base() { return raiz.TESIS_APP; }
  function el(e, a, c) { return base().el(e, a, c); }
  function num(v, f, o) { return base().numero(v, f, o); }
  function V() { return raiz.TESIS_VISUAL || null; }
  function numA(clave, valor, formato, origen) {
    var nodo = num(valor, formato, origen);
    return V() ? V().contar(nodo, clave, valor, function (n) { return base().formato.aplicar(formato, n); }) : nodo;
  }

  function contexto() {
    return raiz.TESIS_CAMPANA_UI && raiz.TESIS_CAMPANA_UI.contexto ? raiz.TESIS_CAMPANA_UI.contexto() : null;
  }
  function vistaCargada() {
    var ui = raiz.TESIS_CAMPANA_UI, v = ui && ui.vista ? ui.vista() : null;
    return v && v.cultivos ? v : null;
  }
  // Hectáreas de cada cultivo cargado ({ Soja: 600, … }), o null si no hay campaña cargada.
  function hectareasCargadas() {
    var v = vistaCargada();
    if (!v) return null;
    var ha = {};
    v.nombres.forEach(function (c) { ha[c] = v.cultivos[c].ha; });
    return ha;
  }

  function porCampana(casos) { return casos.slice().sort(function (a, b) { return a.campana < b.campana ? -1 : a.campana > b.campana ? 1 : 0; }); }

  // Función pura (no toca el DOM). ha: { cultivo: hectáreas }. Devuelve:
  //   estrategias[h] (h = 0, 0,5, 1): margen bruto total de cada campaña (hectáreas × margen por hectárea de la tesis a rinde fijo),
  //     promedio, peor, mejor, desvío y en cuántas campañas la cobertura le ganó a vender a cosecha;
  //   detalle[t]: por campaña, el margen total con 0, 25, 50, 75 y 100 % y, por cultivo, Fs, Sc, Fc, la variación del precio, su efecto
  //     en el margen (rinde fijo × (Sc − Fs) × hectáreas), la base (Sc − Fc) y cuánto del ingreso esperado se llevaban los costos.
  function calcular(datos, zona, ha) {
    datos = datos || raiz.TESIS_DATOS;
    var m = raiz.TESIS_MOTOR;
    var comision = datos.parametros.comision.v;
    var cultivos = Object.keys(ha);
    var casos = {};
    cultivos.forEach(function (c) { casos[c] = porCampana(m.casosDe(datos, c, zona)); });
    var campanas = casos[cultivos[0]].map(function (c) { return c.campana; });
    var hectareas = cultivos.reduce(function (s, c) { return s + ha[c]; }, 0);
    function total(h, t) {
      return cultivos.reduce(function (s, c) {
        var r = m.calcularCaso(casos[c][t], { h: h, comision: comision, datos: datos });
        return s + ha[c] * (r.mbProyectado + r.soloPrecioCon);
      }, 0);
    }
    var estrategias = {};
    NIVELES.forEach(function (h) {
      var totales = campanas.map(function (camp, t) { return total(h, t); });
      var iPeor = totales.indexOf(Math.min.apply(null, totales)), iMejor = totales.indexOf(Math.max.apply(null, totales));
      estrategias[h] = { h: h, totales: totales, media: m.promedio(totales), desvio: totales.length >= 2 ? m.desvioMuestral(totales) : 0,
        peor: totales[iPeor], campanaPeor: campanas[iPeor], iPeor: iPeor, mejor: totales[iMejor], campanaMejor: campanas[iMejor], iMejor: iMejor, conviene: 0 };
    });
    NIVELES.forEach(function (h) {
      estrategias[h].conviene = estrategias[h].totales.filter(function (v, t) { return v > estrategias[0].totales[t]; }).length;
    });
    var detalle = campanas.map(function (camp, t) {
      var filas = cultivos.map(function (c) {
        var caso = casos[c][t], r = m.calcularCaso(caso, { h: 0, comision: comision, datos: datos });
        var ye = caso.rindeEsperado / 10;
        var ingresoEsperado = ye * caso.fs * ha[c];
        return { cultivo: c, ha: ha[c], rinde: ye, fs: caso.fs, sc: caso.sc, fc: caso.fc, variacion: caso.sc / caso.fs - 1,
          efectoPrecio: ye * (caso.sc - caso.fs) * ha[c], base: caso.sc - caso.fc, ingresoEsperado: ingresoEsperado,
          costos: ingresoEsperado - r.mbProyectado * ha[c], origen: [m.origen(caso, "rindeEsperado", datos), m.origen(caso, "fs", datos), m.origen(caso, "sc", datos), m.origen(caso, "fc", datos)] };
      });
      var ingreso = filas.reduce(function (s, f) { return s + f.ingresoEsperado; }, 0);
      var efecto = filas.reduce(function (s, f) { return s + f.efectoPrecio; }, 0);
      var costos = filas.reduce(function (s, f) { return s + f.costos; }, 0);
      var niveles = {};
      NIVELES_DET.forEach(function (h) { niveles[h] = total(h, t); });
      // Cascada del margen con la cobertura h: ingreso al precio esperado + escalón del precio ((1 − h)·(Sc − Fs) + h·(Sc − Fc), con rinde fijo)
      // − comisión − costos = margen final (igual a niveles[h]).
      var cascada = {};
      NIVELES.forEach(function (h) {
        var precio = filas.reduce(function (s, x) { return s + x.rinde * x.ha * ((1 - h) * (x.sc - x.fs) + h * (x.sc - x.fc)); }, 0);
        var com = filas.reduce(function (s, x) { return s + h * comision * x.rinde * x.fs * x.ha; }, 0);
        cascada[h] = { ingreso: ingreso, precio: precio, comision: com, costos: costos, margen: ingreso + precio - com - costos };
      });
      return { cascada: cascada, campana: camp, filas: filas, efectoPrecio: efecto, variacion: efecto / ingreso, ingresoEsperado: ingreso, costos: costos,
        pctCostos: costos / ingreso, niveles: niveles };
    });
    var aporte = cultivos.map(function (c) {
      return { cultivo: c, media: m.promedio(campanas.map(function (camp, t) {
        var x = m.calcularCaso(casos[c][t], { h: 0, comision: comision, datos: datos });
        return ha[c] * (x.mbProyectado + x.soloPrecioCon);
      })) };
    });
    var sumaAporte = aporte.reduce(function (a, x) { return a + x.media; }, 0);
    aporte.forEach(function (x) { x.parte = x.media / sumaAporte; });
    var celdas = [];
    detalle.forEach(function (d) { d.filas.forEach(function (f) { f.origen.forEach(function (o) { celdas.push(o); }); }); });
    var origen = base().origenCalculado("Σ hectáreas × [rinde fijo × (precio con cobertura h − gastos de comercialización) − costos directos − cosecha − comisión], con P = h·[Fs + (Sc − Fc)] + (1 − h)·Sc",
      celdas, null, ["comisión " + String(comision * 100).replace(".", ",") + " %", "rinde de planteo de la zona (no el real)"]);
    return { zona: zona, hectareas: hectareas, comision: comision, campanas: campanas, estrategias: estrategias, detalle: detalle, aporte: aporte, origen: origen,
      cultivos: cultivos.map(function (c) { return { cultivo: c, ha: ha[c], rinde: casos[c][0].rindeEsperado / 10 }; }) };
  }

  // Puente al presente (2026/27): con los futuros cargados, qué precio se fija hoy y por cuántas toneladas si se cubre la proporción h.
  // vista: la de la campaña cargada (campana.calcular). Sólo queda abierta la base (Sc − Fc) y el rinde.
  function puente(vista, h) {
    var filas = vista.nombres.map(function (c) {
      var i = vista.cultivos[c], toneladas = i.ha * i.rinde * h;
      return { cultivo: c, h: h, toneladas: toneladas, precio: i.f27, ingreso: toneladas * i.f27 };
    });
    return { h: h, filas: filas, toneladas: filas.reduce(function (s, f) { return s + f.toneladas; }, 0), ingreso: filas.reduce(function (s, f) { return s + f.ingreso; }, 0) };
  }

  function signo(x) { return (x >= 0 ? "+" : "−") + base().formato.aplicar("usd", Math.abs(x)); }
  function subeCae(v) { return (v >= 0 ? "subió " : "cayó ") + pctTxt(v); }
  function etiquetaH(h) { return h === 0 ? "Vender a cosecha (0 %)" : "Cubrir el " + Math.round(h * 100) + " %"; }
  function miles(x) { if (Math.round(Math.abs(x) / 1000) === 0) return "0"; return (x < 0 ? "−" : "") + Math.round(Math.abs(x) / 1000).toLocaleString("es-AR") + " mil"; }
  function pctTxt(x) { return base().formato.aplicar("porcentaje", Math.abs(x)); }

  // Frases del relato: salen de las diferencias campaña por campaña entre cubrir todo y vender a cosecha.
  function relato(r) {
    var e0 = r.estrategias[0], e1 = r.estrategias[1];
    var dif = e1.totales.map(function (v, t) { return v - e0.totales[t]; });
    var iSube = dif.indexOf(Math.min.apply(null, dif)), iCae = dif.indexOf(Math.max.apply(null, dif));
    var o = r.origen;
    var frases = [];
    if (dif[iSube] < 0) frases.push(["En ", r.campanas[iSube], " el precio de cosecha terminó por encima de lo que pagaba el futuro: vender a cosecha te dejó ", num(-dif[iSube], "usd", o), " USD más que cubrirte del todo."]);
    if (dif[iCae] > 0) frases.push(["En ", r.campanas[iCae], " pasó lo contrario: el precio cayó y cubrirte del todo te hubiera dado ", num(dif[iCae], "usd", o), " USD más."]);
    frases.push(["Sin cubrirte, tu margen bruto total fue de ", num(e0.peor, "usd", o), " USD en ", e0.campanaPeor, " a ", num(e0.mejor, "usd", o), " USD en ", e0.campanaMejor,
      ": una distancia de ", num(e0.mejor - e0.peor, "usd", o), " USD. Cubriéndote del todo, esa distancia habría sido de ", num(e1.mejor - e1.peor, "usd", o), " USD."]);
    var costo = e0.media - e1.media;
    frases.push(["En promedio de las " + r.campanas.length + " campañas, cubrir todo ", costo >= 0 ? "te habría dejado " : "te habría sumado ", num(Math.abs(costo), "usd", o),
      " USD por año " + (costo >= 0 ? "menos" : "más") + " que vender a cosecha: es lo que cuesta tener el año asegurado."]);
    return frases;
  }

  var PARA_QUIEN = {
    1: "Tiene sentido si lo que más te importa es que un año malo no te golpee.",
    0.5: "Tiene sentido si querés bajar el riesgo a la mitad sin resignar toda la suba."
  };

  // Lleva a «Simulá tu campaña» con tus datos y esa cobertura aplicada a todos los cultivos (reusa el link de la propia campaña).
  function irASimula(h) {
    var ui = raiz.TESIS_CAMPANA_UI, link = ui && ui.armarLink ? ui.armarLink() : null;
    if (!link || !raiz.location) return;
    var hash = link.slice(link.indexOf("#"));
    var nuevo = "h=" + Math.round(h * 100);
    hash = /([?&])h=[^&]*/.test(hash) ? hash.replace(/([?&])h=[^&]*/, "$1" + nuevo) : hash + "&" + nuevo;
    raiz.location.hash = hash;
  }

  function dato(etiqueta, hijos) {
    return el("div", { "class": "tc-dato" }, [el("dt", null, etiqueta), el("dd", null, hijos)]);
  }

  function tarjeta(r, h) {
    var e = r.estrategias[h], o = r.origen, n = r.campanas.length;
    var pct = Math.round(h * 100);
    var boton = el("button", { type: "button", "class": "tc-boton", "data-h": String(pct) }, "Probala en Simulá tu campaña");
    boton.addEventListener("click", function () { irASimula(h); });
    return el("article", { "class": "tarjeta tc-estrategia", "data-h": String(pct) }, [
      el("p", { "class": "tc-etiqueta" }, h === 1 ? "La que mide la hipótesis" : "La cobertura parcial"),
      el("h4", null, "Cubrir el " + pct + " % de la cosecha"),
      el("dl", { "class": "tc-datos" }, [
        dato("Margen bruto total promedio", [numA("tc-media-" + pct, e.media, "usd", o), " USD"]),
        dato("Peor año", [num(e.peor, "usd", o), " USD (" + e.campanaPeor + ")"]),
        dato("Mejor año", [num(e.mejor, "usd", o), " USD (" + e.campanaMejor + ")"]),
        dato("Desvío entre campañas", [num(e.desvio, "usd", o), " USD"]),
        dato("Frente a vender a cosecha", ["Te convino en " + e.conviene + " de " + n + " campañas"])
      ]),
      el("p", { "class": "tc-para" }, PARA_QUIEN[h]),
      boton
    ]);
  }

  function colores2() { return colores(); }

  function opcionGrafico(r) {
    var EC = raiz.TESIS_EC, t = EC.tema();
    var colores = { 0: EC.colorDe("color-sin", "#b28600"), 0.5: EC.colorDe("color-acento", "#4589ff"), 1: EC.colorDe("color-con", "#009d9a") };
    var series = NIVELES.map(function (h) {
      return { nombre: etiquetaH(h), color: colores[h], valores: r.estrategias[h].totales.map(function (v) { return Math.round(v); }),
        simbolo: h === 0.5 ? "diamond" : h === 1 ? "rect" : "circle", simboloTam: 9, grosor: h === 1 ? 4 : 3 };
    });
    var o = EC.opcionDeLineas(t, r.campanas, series, function (x) { return base().formato.aplicar("usd", x) + " USD"; }, { escalar: true });
    o.yAxis.axisLabel.formatter = function (x) { return miles(x); };
    o.xAxis.boundaryGap = true;
    NIVELES.forEach(function (h, i) { o.series[i].areaStyle = { color: degradado(colores[h], 0.16) }; });
    o.series[2].markArea = bandas(r, t, colores2(), t);
    o.grid.left = 72;
    o.animationDuration = 1100;
    o.animationEasing = "cubicOut";
    return o;
  }

  function tabla(r) {
    var filas = r.campanas.map(function (camp, t) {
      return el("tr", null, [el("th", { scope: "row" }, camp)].concat(NIVELES.map(function (h) { return el("td", null, num(r.estrategias[h].totales[t], "usd", r.origen)); })));
    });
    var cab = [el("th", null, "Campaña")].concat(NIVELES.map(function (h) { return el("th", null, etiquetaH(h)); }));
    return el("details", { "class": "tc-tabla" }, [el("summary", null, "Ver los números del gráfico (USD)"),
      el("table", null, [el("thead", null, el("tr", null, cab)), el("tbody", null, filas)])]);
  }

  // Explicación de una campaña: por qué dio lo que dio y cómo habría cambiado con más o menos cobertura.
  function explicacion(r, t, rotulo, abierta) {
    var d = r.detalle[t], o = r.origen, f = base().formato;
    var sube = d.efectoPrecio >= 0;
    var frase = sube
      ? ["Ganaste porque el precio a cosecha subió ", pctTxt(d.variacion), " frente al que esperabas al sembrar: eso sumó ", num(d.efectoPrecio, "usd", o), " USD a tu margen."]
      : ["Perdiste porque el precio a cosecha cayó ", pctTxt(d.variacion), " frente al que esperabas al sembrar: eso te restó ", num(-d.efectoPrecio, "usd", o), " USD de margen."];
    var filas = d.filas.map(function (x) {
      return el("tr", null, [el("th", { scope: "row" }, x.cultivo), el("td", null, num(x.fs, "usd2", o)), el("td", null, num(x.sc, "usd2", o)),
        el("td", null, num(x.variacion, "porcentaje", o)), el("td", null, num(x.efectoPrecio, "usd", o)), el("td", null, num(x.base, "usd2", o))]);
    });
    var cab = ["Cultivo", "Esperabas al sembrar (Fs, USD/t)", "Cobraste (Sc, USD/t)", "Variación del precio", "Efecto en tu margen (USD)", "Base si cubrías (Sc − Fc, USD/t)"];
    var cobertura = NIVELES_DET.slice(1).map(function (h) {
      var dif = d.niveles[h] - d.niveles[0];
      var txt = dif >= 0 ? " más que vendiendo a cosecha)" : " menos que vendiendo a cosecha)";
      return el("li", null, ["Cubriendo el " + Math.round(h * 100) + " % hubieras terminado con ", num(d.niveles[h], "usd", o), " USD (", num(Math.abs(dif), "usd", o), " USD" + txt + "."]);
    });
    var costos = ["Aun al precio esperado, los costos (directos, de cosecha y de comercialización) se llevaban el ", pctTxt(d.pctCostos), " del ingreso."];
    return el("details", { "class": "tc-campana tc-linea", open: abierta ? "" : null, "data-campana": d.campana }, [
      el("summary", null, [el("span", { "class": "tc-camp-n" }, d.campana), rotulo ? el("span", { "class": "tc-camp-rotulo" }, rotulo) : null,
        el("span", { "class": "tc-camp-v" }, [num(d.niveles[0], "usd", o), " USD sin cubrir"]),
        el("span", { "class": "tc-camp-f" }, "El precio " + subeCae(d.variacion) + " frente a lo esperado")]),
      el("div", { "class": "tc-camp-cuerpo" }, [
        el("p", { "class": "tc-relato" }, frase),
        el("div", { "class": "tc-scroll" }, el("table", null, [el("thead", null, el("tr", null, cab.map(function (c) { return el("th", null, c); }))), el("tbody", null, filas)])),
        el("p", { "class": "tc-relato" }, costos),
        el("h5", null, "Si hubieras cubierto"),
        el("ul", { "class": "tc-cobertura" }, cobertura),
        el("p", { "class": "tc-nota" }, "Cuenta con el rinde fijo de planteo, tus " + f.aplicar("entero", r.hectareas) + " ha y la comisión de la tesis. Al cubrir queda la base (Sc − Fc), que no se cubre.")
      ])]);
  }

  function seccionPuente(vista, o) {
    var f = base().formato;
    var tarjetas = [1, 0.5].map(function (h) {
      var p = puente(vista, h), pct = Math.round(h * 100);
      var lineas = p.filas.map(function (x) {
        return el("li", null, [x.cultivo + ": " + f.aplicar("entero", x.toneladas) + " t a ", num(x.precio, "usd2", o), " USD/t = ", num(x.ingreso, "usd", o), " USD"]);
      });
      return el("article", { "class": "tarjeta tc-puente-t", "data-h": String(pct) }, [
        el("h5", null, "Si este año cubrís el " + pct + " %"),
        el("p", { "class": "tc-relato" }, ["Fijás hoy un precio por ", f.aplicar("entero", p.toneladas), " t de tu cosecha. Ese ingreso de ", num(p.ingreso, "usd", o),
          " USD ya no depende de lo que pase con el precio hasta la cosecha: solo queda la base (la diferencia entre el precio de tu zona y el del contrato) y tu rinde."]),
        el("ul", { "class": "tc-cobertura" }, lineas)
      ]);
    });
    return el("section", { "class": "tc-bloque tc-puente" }, [
      el("h3", { "class": "tc-seccion" }, "Y para esta campaña (2026/27)"),
      el("p", { "class": "tc-nota" }, "Con los futuros 2026/27 de la Bolsa de Comercio de Rosario que usa el simulador y tu rinde esperado. Es lo que significaría cubrir, no un consejo."),
      el("div", { "class": "tc-estrategias" }, tarjetas)
    ]);
  }

  // ---------------------------------------------------------------------------------------
  // La historia: precio esperado contra precio cobrado, cascada del margen y cuánto del golpe se evitaba
  // ---------------------------------------------------------------------------------------

  function colores() {
    var EC = raiz.TESIS_EC;
    return { esperado: EC.colorDe("color-proyectado", "#a8a8a8"), cobrado: EC.colorDe("color-acento", "#4589ff"), gana: EC.colorDe("color-con", "#009d9a"),
      pierde: EC.colorDe("color-alerta", "#ff8389"), aviso: EC.colorDe("color-aviso", "#f1c21b"), logro: EC.colorDe("color-logro", "#42be65"), neutro: EC.colorDe("color-borde-fuerte", "#6f6f6f"), cobertura: EC.colorDe("color-acento-fuerte", "#0f62fe") };
  }

  // Hex (#rrggbb) con transparencia, y relleno degradado de arriba (suave) hacia abajo (transparente).
  function alfa(hex, a) {
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex).trim());
    return m ? "rgba(" + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) + "," + a + ")" : hex;
  }
  function degradado(hex, a) {
    return { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: alfa(hex, a) }, { offset: 1, color: alfa(hex, 0) }] };
  }
  function bandas(r, t, c, tm) {
    var e0 = r.estrategias[0];
    var una = function (i, color, texto) {
      return [{ xAxis: r.campanas[i], name: texto, itemStyle: { color: alfa(color, 0.14) }, label: { show: true, position: "insideTop", color: tm.texto, fontFamily: tm.fuente, fontSize: 11 } }, { xAxis: r.campanas[i] }];
    };
    return { silent: true, data: [una(e0.iMejor, c.gana, "Mejor"), una(e0.iPeor, c.pierde, "Peor")] };
  }

  function bloque(titulo, lectura, hijos) {
    return el("section", { "class": "tarjeta tc-bloque tc-historia" }, [el("h4", null, titulo)].concat(hijos || [], [el("p", { "class": "tc-lectura" }, lectura)]));
  }

  // 1. Fs contra Sc de cada cultivo, con tu mejor y tu peor campaña marcadas y el % de sorpresa.
  function opcionPrecio(r, iCultivo) {
    var EC = raiz.TESIS_EC, t = EC.tema(), c = colores(), e0 = r.estrategias[0];
    var fs = r.detalle.map(function (d) { return Math.round(d.filas[iCultivo].fs * 100) / 100; });
    var sc = r.detalle.map(function (d) { return Math.round(d.filas[iCultivo].sc * 100) / 100; });
    var marca = function (i, color) {
      var v = r.detalle[i].filas[iCultivo].variacion;
      return { coord: [r.campanas[i], sc[i]], value: (v >= 0 ? "+" : "−") + base().formato.aplicar("porcentaje", Math.abs(v)), itemStyle: { color: color } };
    };
    var o = EC.opcionDeLineas(t, r.campanas, [
      { nombre: "Esperado (Fs)", color: c.esperado, valores: fs, trazo: "dashed", simbolo: "circle", simboloTam: 7, grosor: 2 },
      { nombre: "Cobrado (Sc)", color: c.cobrado, valores: sc, simbolo: "circle", simboloTam: 9, grosor: 4 }
    ], function (x) { return base().formato.aplicar("usd", x) + " USD/t"; }, { escalar: true });
    o.series[1].markPoint = { symbol: "pin", symbolSize: 62, label: { color: "#161616", fontFamily: t.fuente, fontWeight: 600, fontSize: 12 },
      data: [marca(e0.iMejor, c.gana), marca(e0.iPeor, c.pierde)] };
    o.xAxis.boundaryGap = true;
    o.series[0].areaStyle = { color: degradado(c.esperado, 0.2) };
    o.series[1].areaStyle = { color: degradado(c.cobrado, 0.38) };
    o.series[1].markArea = bandas(r, t, c, t);
    o.legend = { top: 0, type: "plain", itemWidth: 16, textStyle: { color: t.texto, fontFamily: t.fuente, fontSize: 11 }, inactiveColor: t.bordeFuerte };
    o.yAxis.axisLabel.formatter = function (x) { return base().formato.aplicar("usd", x); };
    o.grid = { left: 52, right: 16, top: 56, bottom: 28 };
    o.animationDuration = 1000;
    return o;
  }

  function seccionPrecio(r) {
    var e0 = r.estrategias[0], dm = r.detalle[e0.iMejor], dp = r.detalle[e0.iPeor];
    var titulo = "El precio explica tus años: en " + e0.campanaMejor + " " + (dm.variacion >= 0 ? "subió " : "cayó ") + pctTxt(dm.variacion) + " frente a lo que esperabas y en " +
      e0.campanaPeor + " " + (dp.variacion >= 0 ? "subió " : "cayó ") + pctTxt(dp.variacion);
    var graficos = r.cultivos.map(function (c, i) {
      var nodo = el("div", { "class": "tc-grafico tc-grafico-chico", role: "img", "aria-label": "Precio de " + c.cultivo + " esperado al sembrar y cobrado a cosecha, campaña por campaña" });
      nodos.pendientes.push({ clave: "precio-" + c.cultivo, nodo: nodo, opcion: function () { return opcionPrecio(r, i); } });
      return el("div", { "class": "tc-multiple" }, [el("h5", null, c.cultivo + " (USD por tonelada)"), nodo]);
    });
    return bloque(titulo, "Cómo se lee: la línea punteada es el precio que esperabas al sembrar (Fs) y la azul el que cobraste a cosecha (Sc). Los globos marcan tu mejor campaña (verde) y tu peor (rojo) con la sorpresa de precio de cada cultivo. Cuanto más separadas las líneas, más pesó el precio.",
      [el("div", { "class": "tc-multiples" }, graficos)]);
  }

  // 2. Cascada del margen de una campaña: ingreso al precio esperado, escalón del precio, comisión, costos y margen final.
  function opcionCascada(r, t, h) {
    var EC = raiz.TESIS_EC, tm = EC.tema(), c = colores(), k = r.detalle[t].cascada[h], f = base().formato;
    var cats = ["Ingreso al precio esperado", "Sorpresa de precio", "Comisión", "Costos", "Margen final"];
    var a = k.ingreso, b = a + k.precio, d = b - k.comision, e = d - k.costos;
    var filas = [[0, 0, a, c.neutro, f.aplicar("usd", a)], [1, a, b, k.precio >= 0 ? c.gana : c.pierde, signo(k.precio)], [2, b, d, c.neutro, k.comision ? "−" + f.aplicar("usd", k.comision) : "0"],
      [3, d, e, c.neutro, "−" + f.aplicar("usd", k.costos)], [4, 0, e, c.cobertura, f.aplicar("usd", e)]];
    return {
      animation: tm.animar, animationDuration: 900, textStyle: EC.estiloTexto(tm), grid: { left: 64, right: 16, top: 36, bottom: 56 },
      tooltip: EC.tooltipDelTema(tm, { trigger: "item", formatter: function (p) { return cats[p.value[0]] + ": " + p.value[4] + " USD"; } }),
      xAxis: { type: "category", data: cats, axisLabel: { color: tm.texto, interval: 0, fontSize: 11, width: 90, overflow: "break" }, axisLine: { lineStyle: { color: tm.bordeFuerte } }, axisTick: { show: false } },
      yAxis: { type: "value", axisLabel: { color: tm.suave, formatter: function (x) { return miles(x); } }, splitLine: { lineStyle: { color: tm.borde } } },
      series: [{ type: "custom", data: filas.map(function (x) { return { value: x }; }),
        renderItem: function (params, api) {
          var i = api.value(0), p0 = api.coord([i, api.value(1)]), p1 = api.coord([i, api.value(2)]);
          var ancho = Math.min(api.size([1, 0])[0] * 0.55, 110), arriba = Math.min(p0[1], p1[1]);
          return { type: "group", children: [
            { type: "rect", shape: { x: p0[0] - ancho / 2, y: arriba, width: ancho, height: Math.max(Math.abs(p1[1] - p0[1]), 2) }, style: { fill: filas[i][3] } },
            { type: "text", style: { text: filas[i][4], x: p0[0], y: arriba - 6, textAlign: "center", textVerticalAlign: "bottom", fill: tm.texto, font: "600 12px " + tm.fuente } }] };
        } }]
    };
  }

  function seccionCascada(r, estado, camposH) {
    var e0 = r.estrategias[0], f = base().formato;
    var elegidas = [{ t: e0.iPeor, rotulo: "Tu peor campaña" }, { t: e0.iMejor, rotulo: "Tu mejor campaña" }];
    var lecturas = [];
    var pintarLecturas = function () {
      elegidas.forEach(function (x, i) {
        var k = r.detalle[x.t].cascada, h = estado.h, a = k[0].precio, b = k[h].precio;
        lecturas[i].textContent = h === 0
          ? "Sin cubrir, la sorpresa de precio de " + r.detalle[x.t].campana + " movió tu margen " + signo(a) + " USD y terminaste con " + f.aplicar("usd", k[0].margen) + " USD."
          : "Cubriendo el " + Math.round(h * 100) + " %, ese escalón pasa de " + signo(a) + " a " + signo(b) + " USD (más una comisión de " + f.aplicar("usd", k[h].comision) + " USD) y terminás con " + f.aplicar("usd", k[h].margen) + " USD, " +
            signo(k[h].margen - k[0].margen) + " USD frente a vender a cosecha.";
      });
    };
    var redibujar = function () {
      elegidas.forEach(function (x) { nodos.ec.dibujar("cascada-" + x.t, estado.nodos[x.t], opcionCascada(r, x.t, estado.h)); });
      pintarLecturas();
    };
    var botones = NIVELES.map(function (h) {
      var b = el("button", { type: "button", "class": "tc-interruptor", "aria-pressed": h === estado.h ? "true" : "false", "data-h": String(Math.round(h * 100)) }, h === 0 ? "Sin cubrir" : "Cubriendo " + Math.round(h * 100) + " %");
      b.addEventListener("click", function () {
        estado.h = h;
        botones.forEach(function (x, j) { x.setAttribute("aria-pressed", NIVELES[j] === h ? "true" : "false"); });
        redibujar();
      });
      return b;
    });
    var tarjetas = elegidas.map(function (x, i) {
      var nodo = el("div", { "class": "tc-grafico tc-grafico-chico", role: "img", "aria-label": "Cascada del margen de " + r.detalle[x.t].campana });
      estado.nodos[x.t] = nodo;
      nodos.pendientes.push({ clave: "cascada-" + x.t, nodo: nodo, opcion: function () { return opcionCascada(r, x.t, estado.h); } });
      lecturas[i] = el("p", { "class": "tc-nota" });
      var d = r.detalle[x.t];
      return el("div", { "class": "tc-multiple" }, [el("h5", null, x.rotulo + ": " + d.campana), nodo, lecturas[i]]);
    });
    pintarLecturas();
    var dp = r.detalle[e0.iPeor];
    var titulo = "En " + dp.campana + " la sorpresa de precio te " + (dp.cascada[0].precio < 0 ? "restó " + f.aplicar("usd", -dp.cascada[0].precio) : "sumó " + f.aplicar("usd", dp.cascada[0].precio)) + " USD; cubriéndote, ese escalón se achica";
    return bloque(titulo, "Cómo se lee: se parte del ingreso que esperabas al sembrar, se suma o resta lo que movió el precio, se descuentan la comisión (si cubrías) y los costos, y queda el margen. Tocá los botones: al cubrir más, el escalón del precio se achica, porque queda solo la base (Sc − Fc).",
      [el("div", { "class": "tc-interruptores", role: "group", "aria-label": "Cuánto cubrir" }, botones), el("div", { "class": "tc-multiples" }, tarjetas)]);
  }

  // ---------------------------------------------------------------------------------------
  // Volatilidad que asumís: sorpresa del margen (frente al proyectado) de cada campaña, con 0, 50, 100 % y tu cobertura.
  // Todo sale de motor.calcularCaso (soloPrecioCon = sorpresa con rinde fijo; sorpresaCon = con el rinde cosechado) y de motor.desvioMuestral:
  // el mismo desvío que muestra «Probá variantes» (motor.mezcla). Ninguna fórmula nueva.
  // ---------------------------------------------------------------------------------------
  var UMBRAL_HIPOTESIS = 0.5; // la hipótesis de la tesis pide bajar el riesgo más de 50 %

  // hs: lista de { rotulo, h } donde h es un número (todos los cultivos) o { cultivo: h }.
  function volatilidad(datos, zona, ha, hs) {
    datos = datos || raiz.TESIS_DATOS;
    var m = raiz.TESIS_MOTOR, comision = datos.parametros.comision.v, cultivos = Object.keys(ha);
    var casos = {};
    cultivos.forEach(function (c) { casos[c] = porCampana(m.casosDe(datos, c, zona)); });
    var campanas = casos[cultivos[0]].map(function (c) { return c.campana; });
    var celdas = [];
    cultivos.forEach(function (c) {
      casos[c].forEach(function (caso) {
        ["rindeEsperado", "rindeReal", "fs", "sc", "fc"].forEach(function (k) { celdas.push(m.origen(caso, k, datos)); });
      });
    });
    var hDe = function (h, c) { return typeof h === "number" ? h : (h && h[c]) || 0; };
    var niveles = hs.map(function (x) {
      var fijo = [], real = [];
      campanas.forEach(function (camp, t) {
        var a = 0, b = 0;
        cultivos.forEach(function (c) {
          var r = m.calcularCaso(casos[c][t], { h: hDe(x.h, c), comision: comision, datos: datos });
          a += ha[c] * r.soloPrecioCon; b += ha[c] * r.sorpresaCon;
        });
        fijo.push(a); real.push(b);
      });
      var iPeor = fijo.indexOf(Math.min.apply(null, fijo)), iMejor = fijo.indexOf(Math.max.apply(null, fijo));
      return { rotulo: x.rotulo, h: x.h, sorpresas: fijo, media: m.promedio(fijo), desvio: m.desvioMuestral(fijo), desvioReal: m.desvioMuestral(real),
        peor: fijo[iPeor], campanaPeor: campanas[iPeor], mejor: fijo[iMejor], campanaMejor: campanas[iMejor], rango: fijo[iMejor] - fijo[iPeor] };
    });
    var sin = niveles[0];
    niveles.forEach(function (n, i) {
      n.reduccion = sin.desvio > 0 ? 1 - n.desvio / sin.desvio : null;
      n.reduccionReal = sin.desvioReal > 0 ? 1 - n.desvioReal / sin.desvioReal : null;
      n.nivel = i === 0 || n.reduccion === null || n.reduccion <= 0 ? "alto" : n.reduccion >= UMBRAL_HIPOTESIS ? "bajo" : "medio";
    });
    var origen = base().origenCalculado("Desvío muestral, entre campañas, de la sorpresa del margen (margen con cobertura − margen proyectado) de tus hectáreas, con P = h·[Fs + (Sc − Fc)] + (1 − h)·Sc",
      celdas, null, ["rinde fijo de planteo de la zona", "comisión " + String(comision * 100).replace(".", ",") + " %"]);
    return { campanas: campanas, niveles: niveles, origen: origen, umbral: UMBRAL_HIPOTESIS };
  }

  var NOMBRE_NIVEL = { alto: "riesgo alto", medio: "riesgo medio", bajo: "riesgo bajo" };
  var BARRAS_NIVEL = { alto: 3, medio: 2, bajo: 1 };

  // Niveles de cobertura de la fila: 0, 50 y 100 %, más «Tu cobertura» si es distinta de esas.
  function niveles3(ctx) {
    var lista = [{ rotulo: "Sin cubrir (0 %)", h: 0 }, { rotulo: "Cubriendo 50 %", h: 0.5 }, { rotulo: "Cubriendo 100 %", h: 1 }];
    var h = ctx && ctx.h, claves = h && typeof h === "object" ? Object.keys(h) : [];
    if (!claves.length) return lista;
    var vals = claves.map(function (c) { return h[c]; });
    var uniforme = vals.every(function (v) { return Math.abs(v - vals[0]) < 1e-9; });
    if (uniforme && [0, 0.5, 1].some(function (s) { return Math.abs(s - vals[0]) < 1e-9; })) return lista;
    var txt = uniforme ? "Tu cobertura (" + Math.round(vals[0] * 100) + " %)"
      : "Tu cobertura (" + claves.map(function (c) { return c + " " + Math.round(h[c] * 100) + " %"; }).join(", ") + ")";
    lista.push({ rotulo: txt, h: h });
    return lista;
  }

  function colorNivel(c) { return { alto: c.pierde, medio: c.aviso, bajo: c.logro }; }

  // Símbolo de riesgo: tres barritas (cuántas llenas = qué tan alto) y el nombre del nivel.
  function simboloRiesgo(nivel) {
    var barras = [1, 2, 3].map(function (i) { return el("span", { "class": "tc-barra" + (i <= BARRAS_NIVEL[nivel] ? " llena" : "") }); });
    return el("span", { "class": "tc-riesgo", "data-nivel": nivel }, [el("span", { "class": "tc-barras", "aria-hidden": "true" }, barras), el("span", { "class": "tc-riesgo-t" }, NOMBRE_NIVEL[nivel])]);
  }

  function opcionVolatilidad(v) {
    var EC = raiz.TESIS_EC, tm = EC.tema(), c = colores(), col = colorNivel(c), filas = v.niveles;
    var franja = filas.map(function (n, i) {
      return { value: [n.peor, n.mejor, i], itemStyle: { color: alfa(col[n.nivel], 0.22), borderColor: col[n.nivel] } };
    });
    var puntos = [];
    filas.forEach(function (n, i) {
      n.sorpresas.forEach(function (s, t) { puntos.push({ value: [Math.round(s), i, v.campanas[t]], itemStyle: { color: col[n.nivel], borderColor: tm.superficie, borderWidth: 1 } }); });
    });
    var rich = { n: { color: tm.texto, fontSize: 12, fontWeight: 600, lineHeight: 18 } };
    ["alto", "medio", "bajo"].forEach(function (k) { rich[k] = { color: col[k], fontSize: 11, lineHeight: 16 }; });
    return {
      animation: tm.animar, animationDuration: 900, textStyle: EC.estiloTexto(tm), grid: { left: 118, right: 20, top: 16, bottom: 44 },
      tooltip: EC.tooltipDelTema(tm, { trigger: "item", formatter: function (p) {
        if (p.seriesType === "scatter") return filas[p.value[1]].rotulo + "<br/>" + p.value[2] + ": " + signo(p.value[0]) + " USD frente a lo proyectado";
        var n = filas[p.value[2]];
        return n.rotulo + "<br/>Peor año (" + n.campanaPeor + "): " + signo(n.peor) + " USD<br/>Mejor año (" + n.campanaMejor + "): " + signo(n.mejor) + " USD";
      } }),
      xAxis: { type: "value", scale: true, name: "Margen real − margen proyectado (USD)", nameLocation: "middle", nameGap: 28, nameTextStyle: { color: tm.suave, fontSize: 11 },
        axisLabel: { color: tm.suave, formatter: function (x) { return miles(x); } }, splitLine: { lineStyle: { color: tm.borde } } },
      yAxis: { type: "category", inverse: true, data: filas.map(function (n) { return n.rotulo; }), axisTick: { show: false }, axisLine: { lineStyle: { color: tm.bordeFuerte } },
        axisLabel: { interval: 0, rich: rich, formatter: function (val, i) { return "{n|" + val.replace(" (", "\n(").replace(", ", ",\n") + "}\n{" + filas[i].nivel + "|" + NOMBRE_NIVEL[filas[i].nivel] + "}"; } } },
      series: [
        { type: "custom", z: 1, data: franja, encode: { x: [0, 1], y: 2 }, renderItem: function (params, api) {
          var a = api.coord([api.value(0), api.value(2)]), b = api.coord([api.value(1), api.value(2)]), alto = Math.max(api.size([0, 1])[1] * 0.5, 14);
          return { type: "rect", shape: { x: a[0], y: a[1] - alto / 2, width: Math.max(b[0] - a[0], 2), height: alto }, style: api.style({ lineWidth: 1 }) };
        } },
        { type: "scatter", z: 3, symbolSize: 13, data: puntos,
          markLine: { silent: true, symbol: "none", lineStyle: { color: c.esperado, type: "dashed" }, label: { formatter: "Lo proyectado", position: "start", distance: 6, color: tm.suave, fontSize: 11 }, data: [{ xAxis: 0 }] } }
      ]
    };
  }

  function seccionVolatilidad(r, ctx, ha) {
    var f = base().formato;
    var v = volatilidad(raiz.TESIS_DATOS, r.zona, ha, niveles3(ctx)), o = v.origen, sin = v.niveles[0];
    var cien = v.niveles.filter(function (n) { return n.h === 1; })[0] || v.niveles[v.niveles.length - 1];
    var cuanto = function (n) { return n.reduccion === null ? "—" : n.reduccion > 0 ? "Baja " + f.aplicar("porcentaje", n.reduccion) : "No baja"; };
    var nodo = el("div", { "class": "tc-grafico tc-grafico-volatilidad", role: "img",
      "aria-label": "Sorpresa del margen de cada campaña frente a lo proyectado, una fila por nivel de cobertura: " + v.niveles.map(function (n) { return n.rotulo + ", " + NOMBRE_NIVEL[n.nivel]; }).join("; ") });
    nodos.pendientes.push({ clave: "volatilidad", nodo: nodo, opcion: function () { return opcionVolatilidad(v); } });
    var idea = function (t, d) { return el("div", null, [el("dt", null, t), el("dd", null, d)]); };
    var significa = el("aside", { "class": "tc-significa" }, [
      el("h5", null, "Qué significa"),
      el("dl", { "class": "tc-significa-lista" }, [
        idea("Volatilidad", "Cuánto puede moverse tu margen de un año a otro por el precio."),
        idea("Riesgo (en la tesis)", "El desvío del margen real respecto del proyectado entre campañas: cuánto se aleja, en general, lo que cobrás de lo que planeaste."),
        idea("Sorpresa de precio", "La diferencia entre el precio que cobrás a cosecha (Sc) y el que esperabas al sembrar (Fs)."),
        idea("Base", "Sc − Fc: lo único del precio que queda abierto cuando te cubrís.")
      ]),
      el("p", { "class": "tc-nota" }, ["Con tus números: sin cubrir, tu margen se movió ", num(sin.rango, "usd", o), " USD entre el peor año (", sin.campanaPeor, ", ", num(sin.peor, "usd", o), " USD frente a lo proyectado) y el mejor (",
        sin.campanaMejor, ", ", num(sin.mejor, "usd", o), " USD). Cubriendo " + (cien.h === 1 ? "el 100 %" : cien.rotulo.toLowerCase()) + ", ese recorrido fue de ", num(cien.rango, "usd", o), " USD."])
    ]);
    var meta = Math.round(v.umbral * 100) + " %";
    var leyenda = el("p", { "class": "tc-leyenda" }, [el("span", null, "Cómo se lee el riesgo:"), simboloRiesgo("alto"), el("span", null, "sin cubrir, o cubrir no bajó el desvío"),
      simboloRiesgo("medio"), el("span", null, "bajó el desvío, pero menos de " + meta), simboloRiesgo("bajo"), el("span", null, "bajó " + meta + " o más (la meta de la hipótesis de la tesis)")]);
    var filasTabla = v.niveles.map(function (n) {
      return el("tr", { "data-nivel": n.nivel }, [el("th", { scope: "row" }, [n.rotulo, el("br"), simboloRiesgo(n.nivel)]), el("td", null, [num(n.desvio, "usd", o), " USD"]),
        el("td", null, n === sin ? "—" : cuanto(n)), el("td", null, [num(n.peor, "usd", o), " a ", num(n.mejor, "usd", o)]), el("td", null, num(n.media, "usd", o))]);
    });
    var cab = ["Cobertura y riesgo", "Desvío de la sorpresa (USD)", "Frente a sin cubrir", "Peor a mejor año (USD)", "Sorpresa promedio (USD)"];
    return el("section", { "class": "tarjeta tc-bloque tc-historia tc-volatilidad" }, [el("h4", null, "Cuánto se movió tu margen: la volatilidad que asumís"),
      el("p", { "class": "tc-relato" }, "Para vos, no cubrir es depender del precio que haya el día de la cosecha: cada año tu margen se mueve con la sorpresa de precio. Cubrir es fijar una parte del precio de antemano y tener un resultado más previsible. Esto es lo que pasó en tu zona con tus cultivos."),
      significa, nodo, leyenda,
      el("div", { "class": "tc-scroll" }, el("table", { "class": "tc-tabla-vol" }, [el("thead", null, el("tr", null, cab.map(function (t) { return el("th", null, t); }))), el("tbody", null, filasTabla)])),
      el("p", { "class": "tc-lectura" }, "Cómo se lee: cada punto es una campaña (" + v.campanas[0] + " a " + v.campanas[v.campanas.length - 1] + ") y la franja va del peor al mejor año. Sin cubrir asumís toda la sorpresa de precio de cada año, por eso los puntos están dispersos (volatilidad alta). Al cubrir fijás parte del precio y solo queda la base (Sc − Fc), por eso los resultados se amontonan. Cubrir no necesariamente te hace ganar más en promedio (mirá la sorpresa promedio): te hace depender menos de cómo venga el precio. El desvío usa el rinde fijo de planteo, como el resto de «Tu caso» y la hipótesis de la tesis; en «Probá variantes» se usa el rinde que se cosechó, que también se mueve y no se cubre, por eso ahí la baja es menor. Es una explicación de lo que pasó, no una recomendación.")]);
  }

  // 3. Por campaña: cuánto más (o menos) habrías tenido cubriendo la mitad o todo, frente a vender a cosecha.
  function opcionBarras(r) {
    var EC = raiz.TESIS_EC, t = EC.tema(), c = colores();
    var dif = function (h) { return r.estrategias[h].totales.map(function (v, i) { return Math.round(v - r.estrategias[0].totales[i]); }); };
    var serie = function (h, opacidad) {
      return { name: etiquetaH(h), type: "bar", barMaxWidth: 34, itemStyle: { color: c.gana, opacity: opacidad }, data: dif(h).map(function (v) { return { value: v, itemStyle: { color: v >= 0 ? c.gana : c.pierde, opacity: opacidad } }; }),
        label: { show: h === 1, position: "top", color: t.texto, fontFamily: t.fuente, fontSize: 11, formatter: function (p) { return miles(p.value); } } };
    };
    return { animation: t.animar, animationDuration: 900, textStyle: EC.estiloTexto(t), grid: { left: 64, right: 16, top: 40, bottom: 32 },
      legend: { top: 0, textStyle: { color: t.texto, fontFamily: t.fuente }, inactiveColor: t.bordeFuerte },
      tooltip: EC.tooltipDelTema(t, { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: function (x) { return signo(x) + " USD"; } }),
      xAxis: { type: "category", data: r.campanas, axisLabel: { color: t.texto }, axisLine: { lineStyle: { color: t.bordeFuerte } }, axisTick: { show: false } },
      yAxis: { type: "value", axisLabel: { color: t.suave, formatter: function (x) { return miles(x); } }, splitLine: { lineStyle: { color: t.borde } } },
      series: [serie(0.5, 0.55), serie(1, 1)] };
  }

  // 4. Peso de cada cultivo en el margen promedio sin cubrir (sólo con más de un cultivo y márgenes positivos).
  function opcionDona(r) {
    var EC = raiz.TESIS_EC, t = EC.tema();
    return { animation: t.animar, animationDuration: 900, textStyle: EC.estiloTexto(t),
      tooltip: EC.tooltipDelTema(t, { trigger: "item", formatter: function (p) { return p.name + ": " + base().formato.aplicar("usd", p.value) + " USD (" + base().formato.aplicar("porcentaje", p.value / r.estrategias[0].media * 1) + ")"; } }),
      series: [{ type: "pie", radius: ["44%", "72%"], center: ["50%", "52%"], avoidLabelOverlap: true, itemStyle: { borderColor: t.superficie, borderWidth: 3 },
        label: { color: t.texto, fontFamily: t.fuente, fontSize: 13, formatter: function (p) { return p.name + " " + base().formato.aplicar("porcentaje", p.percent / 100); } },
        labelLine: { lineStyle: { color: t.bordeFuerte } },
        data: r.aporte.map(function (x) { return { name: x.cultivo, value: Math.round(x.media), itemStyle: { color: t.cultivos[x.cultivo] } }; }) }] };
  }

  function seccionDona(r) {
    var mayor = r.aporte.slice().sort(function (a, b) { return b.parte - a.parte; })[0];
    var nodo = el("div", { "class": "tc-grafico tc-grafico-chico", role: "img", "aria-label": "Peso de cada cultivo en tu margen bruto promedio" });
    nodos.pendientes.push({ clave: "dona", nodo: nodo, opcion: function () { return opcionDona(r); } });
    return bloque(mayor.cultivo + " aporta el " + base().formato.aplicar("porcentaje", mayor.parte) + " de tu margen bruto promedio",
      "Cómo se lee: cada porción es lo que aporta un cultivo al margen bruto promedio de las seis campañas sin cubrir, con tus hectáreas y el rinde fijo de la tesis.", [nodo]);
  }

  function seccionBarras(r) {
    var e0 = r.estrategias[0], e1 = r.estrategias[1], f = base().formato;
    var dif = e1.totales.map(function (v, i) { return v - e0.totales[i]; });
    var iEvita = dif.indexOf(Math.max.apply(null, dif)), iResigna = dif.indexOf(Math.min.apply(null, dif));
    var partes = [];
    if (dif[iEvita] > 0) partes.push("en " + r.campanas[iEvita] + " cubrirte del todo te evitaba perder " + f.aplicar("usd", dif[iEvita]) + " USD");
    if (dif[iResigna] < 0) partes.push("en " + r.campanas[iResigna] + " te hacía resignar " + f.aplicar("usd", -dif[iResigna]) + " USD de suba");
    var titulo = partes.length ? partes[0].charAt(0).toUpperCase() + partes[0].slice(1) + (partes[1] ? " y " + partes[1] : "") : "Cubrirte no cambió el resultado de ninguna campaña";
    var nodo = el("div", { "class": "tc-grafico", role: "img", "aria-label": "Diferencia de margen de cada campaña entre cubrir y vender a cosecha" });
    nodos.pendientes.push({ clave: "barras", nodo: nodo, opcion: function () { return opcionBarras(r); } });
    return bloque(titulo, "Cómo se lee: cada barra es lo que habrías tenido de más (verde, hacia arriba) o de menos (rojo, hacia abajo) cubriendo, frente a vender a cosecha. Las barras verdes son el golpe que evitabas; las rojas, la suba que resignabas.", [nodo]);
  }

  function disponer() {
    if (nodos.ec) Object.keys(nodos.ec.instancias).forEach(function (k) {
      try { nodos.ec.instancias[k].dispose(); } catch (e) { /* ya liberado */ }
      delete nodos.ec.instancias[k];
    });
  }

  function pintar() {
    var cont = nodos.cuerpo;
    disponer();
    nodos.pendientes = [];
    base().vaciar(cont);
    var ctx = contexto(), ha = hectareasCargadas(), vista = vistaCargada();
    if (!ctx || !ha) {
      cont.appendChild(el("p", { "class": "mensaje" }, "Cargá los datos de tu campaña en «Simulá tu campaña» y acá te mostramos qué pasó en tu zona con tus cultivos."));
      return;
    }
    var f = base().formato;
    var r = calcular(raiz.TESIS_DATOS, ctx.zona, ha), o = r.origen, e0 = r.estrategias[0];
    var anim = function (n) { return V() ? V().entrada(n) : n; };
    var grande = function (titulo, clave, valor) {
      return el("div", { "class": "tc-grande" }, [el("p", { "class": "tc-grande-t" }, titulo), el("p", { "class": "tc-grande-n" }, [numA(clave, valor, "usd", o), " USD"])]);
    };

    cont.appendChild(anim(el("section", { "class": "tc-encabezado" }, [
      el("p", { "class": "tc-etiqueta" }, "Tu caso"),
      el("h3", null, ctx.zona),
      el("p", { "class": "tc-lista" }, r.cultivos.map(function (c) {
        return el("span", { "class": "tc-cultivo" }, c.cultivo + " · " + f.aplicar("entero", c.ha) + " ha · " + f.aplicar("usd2", c.rinde) + " t/ha");
      })),
      el("p", { "class": "tc-nota" }, "Son " + f.aplicar("entero", r.hectareas) + " ha en total. Los rindes son los de planteo de la zona (rinde fijo), como mide la tesis."),
      el("div", { "class": "tc-grandes" }, [
        grande("Margen bruto total promedio, sin cubrir", "tc-prom", e0.media),
        grande("Mejor campaña: " + e0.campanaMejor, "tc-mejor", e0.mejor),
        grande("Peor campaña: " + e0.campanaPeor, "tc-peor", e0.peor)
      ])
    ])));

    nodos.grafico = el("div", { "class": "tc-grafico", role: "img",
      "aria-label": "Margen bruto total de cada campaña, de " + r.campanas[0] + " a " + r.campanas[r.campanas.length - 1] + ", vendiendo a cosecha, cubriendo el 50 % y cubriendo el 100 %" });
    cont.appendChild(anim(el("section", { "class": "tarjeta tc-bloque" }, [
      el("h4", null, "El margen de cada campaña según cuánto cubrís"),
      el("p", { "class": "tc-nota" }, "Eje vertical: margen bruto total de tu campo (USD). Eje horizontal: campaña. Mirá cómo la línea del 100 % queda más chata: los años malos pierden menos y los buenos ganan menos."),
      nodos.grafico, tabla(r)
    ])));
    nodos.ec.dibujar("tc", nodos.grafico, opcionGrafico(r));

    cont.appendChild(anim(el("section", { "class": "tarjeta tc-bloque" },
      [el("h4", null, "Qué pasó en tu caso")].concat(relato(r).map(function (fr) { return el("p", { "class": "tc-relato" }, fr); })))));

    cont.appendChild(anim(el("div", { "class": "tc-bloque" }, [el("h3", { "class": "tc-seccion" }, "La historia: qué movió tus resultados"), seccionPrecio(r)])));
    nodos.cascada = nodos.cascada || { h: 0, nodos: {} };
    nodos.cascada.nodos = {};
    cont.appendChild(anim(seccionCascada(r, nodos.cascada)));
    cont.appendChild(anim(seccionVolatilidad(r, ctx, ha)));
    cont.appendChild(anim(seccionBarras(r)));
    if (r.aporte.length > 1 && r.aporte.every(function (x) { return x.media > 0; })) cont.appendChild(anim(seccionDona(r)));
    nodos.pendientes.forEach(function (x) { nodos.ec.dibujar(x.clave, x.nodo, x.opcion()); });

    cont.appendChild(anim(el("section", { "class": "tc-bloque" }, [
      el("h3", { "class": "tc-seccion" }, "Línea de tiempo, campaña por campaña"),
      el("p", { "class": "tc-nota" }, "Abrí cada campaña para ver el precio que esperabas al sembrar, el que cobraste y qué hubiera pasado cubriendo 25, 50, 75 o 100 %.")
    ].concat(r.campanas.map(function (camp, t) {
      return explicacion(r, t, t === e0.iMejor ? "Tu mejor campaña" : t === e0.iPeor ? "Tu peor campaña" : "", t === e0.iMejor || t === e0.iPeor);
    })))));

    cont.appendChild(anim(el("section", { "class": "tc-bloque" }, [
      el("h3", { "class": "tc-seccion" }, "Dos estrategias para tu campo"),
      el("p", { "class": "tc-nota" }, "Con tus hectáreas, tus cultivos y tu zona, y los datos de la tesis. Todo frente a vender a cosecha."),
      el("div", { "class": "tc-estrategias" }, [tarjeta(r, 1), tarjeta(r, 0.5)])
    ])));
    if (vista) cont.appendChild(anim(seccionPuente(vista, o)));
    cont.appendChild(el("p", { "class": "sc-aviso", role: "note" }, [el("strong", null, AVISO), " Los márgenes son brutos, con rinde fijo y comisión de " + String(r.comision * 100).replace(".", ",") + " %."]));
  }

  function montar(contenedor) {
    nodos.cuerpo = el("div", { "class": "sc-tu-caso tc" });
    nodos.ec = raiz.TESIS_EC ? raiz.TESIS_EC.crear(function () { pintar(); }) : { dibujar: function () {}, instancias: {} };
    contenedor.appendChild(nodos.cuerpo);
    pintar();
  }
  function actualizar() { if (nodos.cuerpo) pintar(); }
  function limpiar() {
    if (nodos.cuerpo) base().vaciar(nodos.cuerpo);
    disponer();
  }

  var api = { calcular: calcular, volatilidad: volatilidad, niveles3: niveles3, puente: puente, relato: relato, AVISO: AVISO };
  var seccion = { id: "tu-caso", titulo: "Tu caso", grupo: "historico", montar: montar, actualizar: actualizar, limpiar: limpiar };
  api.seccion = seccion;
  raiz.TESIS_TU_CASO = api;
  if (!raiz.TESIS_APP) throw new Error("tu-caso.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
