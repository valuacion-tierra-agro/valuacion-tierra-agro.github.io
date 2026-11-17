// Sección 2 · «Precios»: para cada cultivo, el futuro al sembrar (Fs), el disponible a cosecha (Sc) y el futuro a cosecha (Fc)
// de las campañas 2020/21 a 2025/26, la sorpresa de precio (Sc − Fs) y la base (Sc − Fc), con una lectura en palabras.
// Todo sale de TESIS_DATOS (hoja Precios_A3 y RR_Margenes de los Excels de la tesis): acá sólo se restan y se promedian precios.
// armar() es una función pura, sin DOM; el resto pinta la pantalla. Los gráficos son de Apache ECharts si está cargado.
(function (raiz) {
  "use strict";

  var CULTIVO_INICIAL = "Soja";
  var AYUDA = [
    "El productor siembra con un precio en la cabeza y cosecha con otro. Esta pantalla muestra, para cada cultivo, tres precios de cada campaña:",
    "Fs es el precio del contrato a futuro cuando se siembra (lo que se podía fijar de antemano), Sc es lo que valía la mercadería disponible a la hora de cosechar y Fc es el precio del mismo contrato a futuro llegada la cosecha."
  ];
  var AYUDA_TABLA = "La sorpresa de precio (Sc − Fs) es cuánto se movió el mercado entre la siembra y la cosecha respecto de lo que se podía fijar al sembrar: si es positiva, quien no se cubrió terminó vendiendo mejor que quien fijó el precio de siembra. La base (Sc − Fc) es la diferencia, en la cosecha, entre el disponible y el futuro.";

  var estado = { cultivo: CULTIVO_INICIAL };
  var nodos = {};
  var ec = null;
  var ultima = null;

  function base() { return raiz.TESIS_APP; }
  function C() { return raiz.TESIS_CAMPANA; }
  function M() { return raiz.TESIS_MOTOR; }
  function el(e, a, c) { return base().el(e, a, c); }
  function num(v, f, o) { return base().numero(v, f, o); }

  // ---------------------------------------------------------------------------------------
  // Cálculo (sin DOM)
  // ---------------------------------------------------------------------------------------

  // Casos de un cultivo en orden de campaña. Fs, Sc y Fc son los mismos en todas las zonas: se toma la primera que lo tiene.
  function casosDelCultivo(datos, cultivo) {
    var zonas = M().zonasDe(datos, cultivo);
    if (!zonas.length) throw new Error("La tesis no tiene precios de " + cultivo + ".");
    return { zona: zonas[0], casos: M().casosDe(datos, cultivo, zonas[0]).slice().sort(function (a, b) { return a.campana < b.campana ? -1 : a.campana > b.campana ? 1 : 0; }) };
  }

  function armar(datos, cultivo) {
    datos = datos || raiz.TESIS_DATOS;
    var base_ = casosDelCultivo(datos, cultivo);
    var m = M();
    var filas = base_.casos.map(function (c) {
      var o = { fs: m.origen(c, "fs", datos), sc: m.origen(c, "sc", datos), fc: m.origen(c, "fc", datos) };
      return {
        campana: c.campana, fs: c.fs, sc: c.sc, fc: c.fc,
        sorpresa: c.sc - c.fs, sorpresaPct: (c.sc - c.fs) / c.fs, base: c.sc - c.fc, origen: o
      };
    });
    var supera = filas.filter(function (f) { return f.sorpresa > 0; });
    var mayor = filas.reduce(function (acc, f) { return !acc || Math.abs(f.sorpresa) > Math.abs(acc.sorpresa) ? f : acc; }, null);
    var f27 = C().futuro2627(datos, cultivo, base_.zona);
    return {
      cultivo: cultivo,
      zonaDeOrigen: base_.zona,
      campanas: filas.map(function (f) { return f.campana; }),
      filas: filas,
      lectura: {
        campanas: filas.length,
        superaron: supera.length,
        mayor: mayor,
        baseMedia: m.promedio(filas.map(function (f) { return f.base; })),
        sorpresaMedia: m.promedio(filas.map(function (f) { return f.sorpresa; }))
      },
      referencia: f27
    };
  }

  // Datos del gráfico: una serie por precio y, aparte, el futuro de referencia 2026/27 (un solo punto, rotulado como referencia).
  function armarGrafico(vista) {
    var cats = vista.campanas.concat(["2026/27"]);
    var relleno = function (valores) { return valores.concat([null]); };
    var vacios = vista.campanas.map(function () { return null; });
    return {
      categorias: cats,
      series: [
        { nombre: "Fs · futuro al sembrar", clave: "fs", valores: relleno(vista.filas.map(function (f) { return f.fs; })) },
        { nombre: "Sc · disponible a cosecha", clave: "sc", valores: relleno(vista.filas.map(function (f) { return f.sc; })) },
        { nombre: "Fc · futuro a cosecha", clave: "fc", valores: relleno(vista.filas.map(function (f) { return f.fc; })) },
        { nombre: vista.referencia.esReferencia ? "Referencia 2026/27 (no es una cotización)" : "Futuro 2026/27 (al sembrar)", clave: "ref", valores: vacios.concat([vista.referencia.valor]) }
      ]
    };
  }

  // ---------------------------------------------------------------------------------------
  // Pantalla
  // ---------------------------------------------------------------------------------------

  function origenDif(formula, a, b) { return base().origenCalculado(formula, [a, b]); }

  function pintarTabla(v) {
    var cont = nodos.tabla;
    base().vaciar(cont);
    var cab = el("tr", null, ["Campaña", "Fs (USD/t)", "Sc (USD/t)", "Fc (USD/t)", "Sorpresa Sc − Fs (USD/t)", "Sorpresa Sc − Fs (%)", "Base Sc − Fc (USD/t)"].map(function (t) { return el("th", { scope: "col" }, t); }));
    var filas = v.filas.map(function (f) {
      return el("tr", null, [
        el("th", { scope: "row" }, f.campana),
        el("td", null, num(f.fs, "usd2", f.origen.fs)),
        el("td", null, num(f.sc, "usd2", f.origen.sc)),
        el("td", null, num(f.fc, "usd2", f.origen.fc)),
        el("td", null, num(f.sorpresa, "usd2", origenDif("Sc − Fs", f.origen.sc, f.origen.fs))),
        el("td", null, num(f.sorpresaPct, "porcentaje", origenDif("(Sc − Fs) ÷ Fs", f.origen.sc, f.origen.fs))),
        el("td", null, num(f.base, "usd2", origenDif("Sc − Fc", f.origen.sc, f.origen.fc)))
      ]);
    });
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sec-tabla" }, [
      el("caption", null, "Precios de " + v.cultivo + " por campaña, con la sorpresa de precio y la base"),
      el("thead", null, cab), el("tbody", null, filas)])));
    cont.appendChild(el("p", { "class": "ayuda" }, AYUDA_TABLA));
  }

  function pintarLectura(v) {
    var cont = nodos.lectura;
    base().vaciar(cont);
    var l = v.lectura;
    var m = l.mayor;
    var oSup = base().origenCalculado("campañas con Sc − Fs > 0", v.filas.map(function (f) { return f.origen.sc; }).concat(v.filas.map(function (f) { return f.origen.fs; })));
    var oBase = base().origenCalculado("promedio de (Sc − Fc) de las campañas", v.filas.map(function (f) { return f.origen.sc; }).concat(v.filas.map(function (f) { return f.origen.fc; })));
    var arriba = m.sorpresa >= 0;
    cont.appendChild(el("h3", null, "En palabras"));
    cont.appendChild(el("p", null, ["En ", num(l.superaron, "entero", oSup), " de las ", num(l.campanas, "entero", "Cantidad de campañas con precios en los Excels de la tesis (2020/21 a 2025/26): " + v.filas[0].origen.fs),
      " campañas, el precio de " + v.cultivo.toLowerCase() + " a cosecha (Sc) superó al futuro que se podía fijar al sembrar (Fs). ",
      "En promedio, la sorpresa fue de ", num(l.sorpresaMedia, "usd2", base().origenCalculado("promedio de (Sc − Fs)", v.filas.map(function (f) { return f.origen.sc; }).concat(v.filas.map(function (f) { return f.origen.fs; })))), " USD/t."]));
    cont.appendChild(el("p", null, ["La mayor sorpresa fue la de la campaña " + m.campana + ": el disponible a cosecha quedó ",
      num(Math.abs(m.sorpresa), "usd2", origenDif("|Sc − Fs|", m.origen.sc, m.origen.fs)), " USD/t (", num(Math.abs(m.sorpresaPct), "porcentaje", origenDif("|Sc − Fs| ÷ Fs", m.origen.sc, m.origen.fs)),
      arriba ? ") por encima" : ") por debajo", " del futuro de siembra."]));
    cont.appendChild(el("p", null, ["La base promedio (Sc − Fc) fue de ", num(l.baseMedia, "usd2", oBase), " USD/t: en la cosecha, el disponible cotizó en promedio ",
      l.baseMedia < 0 ? "por debajo" : "por encima", " del futuro de ese mismo mes."]));
  }

  function pintarReferencia(v) {
    var cont = nodos.referencia;
    base().vaciar(cont);
    var r = v.referencia;
    var detalle = r.esReferencia ? " (" + r.contrato + " · " + C().ROTULO_REFERENCIA + ")" : " (" + r.contrato + " · " + r.fecha + " · " + r.fuente + ")";
    cont.appendChild(el("p", { "class": "sec-nota" }, [(r.esReferencia ? "Futuro de referencia 2026/27 de " : "Futuro 2026/27 de ") + v.cultivo + ": ", num(r.valor, "usd2", r.origen), " USD/t" + detalle + ". ",
      r.esReferencia ? "Es el futuro de siembra de la última campaña, tomado como referencia: no es una cotización de hoy." : ""]));
  }

  function pintarGrafico(v) {
    if (!raiz.echarts || !ec) return;
    var t = raiz.TESIS_EC.tema();
    var g = armarGrafico(v);
    var colorCultivo = t.cultivos[v.cultivo];
    var estilos = {
      fs: { color: raiz.TESIS_EC.colorDe("color-proyectado", "#a8a8a8"), trazo: "dashed" },
      sc: { color: colorCultivo, grosor: 4 },
      fc: { color: raiz.TESIS_EC.colorDe("color-k-base", "#a56eff"), trazo: "dotted" },
      ref: { color: raiz.TESIS_EC.colorDe("color-acento", "#4589ff"), simbolo: "diamond", simboloTam: 11 }
    };
    var series = g.series.map(function (s) { return { nombre: s.nombre, valores: s.valores, color: estilos[s.clave].color, trazo: estilos[s.clave].trazo, grosor: estilos[s.clave].grosor, simbolo: estilos[s.clave].simbolo, simboloTam: estilos[s.clave].simboloTam }; });
    ec.dibujar("precios", nodos.grafico, raiz.TESIS_EC.opcionDeLineas(t, g.categorias, series, function (x) { return base().formato.usd(x); }, { escalar: true }));
  }

  // Si el productor ya cargó su campaña, se ofrecen sólo sus cultivos y arranca en el primero (se rehace sólo si cambió su campo).
  var contextoAplicado = null;
  function aplicarContexto() {
    var ctx = raiz.TESIS_CAMPANA_UI && raiz.TESIS_CAMPANA_UI.contexto ? raiz.TESIS_CAMPANA_UI.contexto() : null;
    var clave = ctx ? ctx.zona + "|" + ctx.cultivos.join(",") : null;
    if (clave === contextoAplicado || !nodos.select) return;
    contextoAplicado = clave;
    var cultivos = ctx ? ctx.cultivos : C().CULTIVOS;
    base().vaciar(nodos.select);
    cultivos.forEach(function (c) { nodos.select.appendChild(el("option", { value: c }, c)); });
    estado.cultivo = cultivos[0];
    nodos.select.value = estado.cultivo;
    nodos.contexto.textContent = ctx ? "Mostramos los cultivos de tu campo: " + cultivos.join(", ") + "." : "";
    nodos.contexto.hidden = !ctx;
  }

  function render() {
    var v = armar(raiz.TESIS_DATOS, estado.cultivo);
    ultima = v;
    nodos.cuadro.hidden = false;
    nodos.resumen.textContent = "Precios de " + v.cultivo + " · campañas " + v.campanas[0] + " a " + v.campanas[v.campanas.length - 1] + " · USD por tonelada";
    nodos.cuadro.setAttribute("data-cultivo", v.cultivo);
    nodos.grafico.setAttribute("aria-label", "Gráfico de líneas con el futuro de siembra, el disponible a cosecha y el futuro a cosecha de " + v.cultivo + " en cada campaña");
    pintarTabla(v);
    pintarLectura(v);
    pintarReferencia(v);
    pintarGrafico(v);
    return v;
  }

  function montar(contenedor) {
    ec = raiz.TESIS_EC ? raiz.TESIS_EC.crear(function () { if (ultima) pintarGrafico(ultima); }) : null;
    contenedor.appendChild(el("p", { "class": "mc-intro" }, AYUDA[0]));
    contenedor.appendChild(el("p", { "class": "sec-nota" }, AYUDA[1]));
    var cultivos = C().CULTIVOS;
    var select = el("select", { id: "pr-cultivo" }, cultivos.map(function (c) { return el("option", { value: c }, c); }));
    select.value = estado.cultivo;
    select.addEventListener("change", function () { estado.cultivo = select.value; render(); });
    nodos.select = select;
    nodos.contexto = el("p", { "class": "sec-nota" });
    nodos.contexto.hidden = true;
    contenedor.appendChild(nodos.contexto);
    contenedor.appendChild(el("div", { "class": "sec-selector" }, [el("label", { "for": "pr-cultivo" }, "Cultivo"), select]));
    nodos.resumen = el("p", { "class": "sc-resumen-zona" });
    nodos.grafico = el("div", { "class": "sc-grafico", role: "img" });
    nodos.tabla = el("div", { "class": "sec-tabla-bloque" });
    nodos.lectura = el("div", { "class": "tarjeta sc-lectura" });
    nodos.referencia = el("div", { "class": "sec-referencia" });
    nodos.cuadro = el("div", { "class": "sec-cuadro" }, [
      nodos.resumen,
      el("figure", { "class": "sc-figura" }, [base().encabezadoDeGrafico("Fs, Sc y Fc por campaña", "precio en USD por tonelada", "campaña (la última es el futuro 2026/27)"), nodos.grafico]),
      nodos.referencia, nodos.tabla, nodos.lectura,
      el("p", { "class": "sc-aviso", role: "note" }, [el("strong", null, "Esto describe lo que pasó. "), "No es una predicción ni un consejo de cobertura: son los precios de las campañas 2020/21 a 2025/26 de los Excels de la tesis."])
    ]);
    contenedor.appendChild(nodos.cuadro);
    render();
  }

  function actualizar() { if (nodos.cuadro) { aplicarContexto(); render(); } }
  function limpiar() { ultima = null; if (nodos.cuadro) nodos.cuadro.hidden = true; }

  var api = { armar: armar, armarGrafico: armarGrafico, estado: function () { return estado; } };
  var seccion = { id: "precios", titulo: "Precios", dentroDe: "datos-y-fuentes", icono: "wheat", montar: montar, actualizar: actualizar, limpiar: limpiar };
  api.seccion = seccion;
  raiz.TESIS_PRECIOS = api;
  if (!raiz.TESIS_APP) throw new Error("precios.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
