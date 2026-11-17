// Mapa para elegir la zona en el paso 1 de «Simulá tu campaña». Dibuja los partidos y departamentos de Buenos Aires, Santa Fe, Córdoba y
// Entre Ríos (datos/mapa-pampeana.js) con ECharts. Cada partido que figura en las fuentes de la tesis se pinta con el color de su zona;
// el resto queda en gris y no se puede elegir. Cada zona tiene además un marcador (con anillos que laten, salvo que se pidan menos
// movimientos) en el centro de sus partidos de referencia. Un clic en una zona llama a `alElegir(zona)`, igual que tocar su tarjeta.
// Sin ECharts (o sin datos del mapa) no dibuja nada: la lista de tarjetas sigue funcionando sola.
(function (raiz) {
  "use strict";

  var NOMBRE_MAPA = "pampeana";

  function clave(p) { return p.n + " · " + p.p; }

  // Partido o departamento -> zona, y zona -> sus partidos (por el nombre único que usa ECharts).
  function indice(datos) {
    var zonaDe = {}, nombresDe = {};
    if (datos && datos.geojson) datos.geojson.features.forEach(function (f) {
      var z = f.properties.z;
      if (!z) return;
      zonaDe[clave(f.properties)] = z;
      (nombresDe[z] = nombresDe[z] || []).push(clave(f.properties));
    });
    return { zonaDe: zonaDe, nombresDe: nombresDe };
  }

  // Copia del GeoJSON con `name` = nombre único (hay partidos con el mismo nombre en distintas provincias).
  function geojsonParaEcharts(datos) {
    var g = JSON.parse(JSON.stringify(datos.geojson));
    g.features.forEach(function (f) { f.properties.name = clave(f.properties); });
    return g;
  }

  function escapar(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Punto de cada zona: promedio de los centros de sus partidos de referencia ([lon, lat]).
  function centroides(datos) {
    var acum = {};
    datos.geojson.features.forEach(function (f) {
      var z = f.properties.z;
      if (!z) return;
      var polis = f.geometry.coordinates, mejor = polis[0][0];
      polis.forEach(function (p) { if (p[0].length > mejor.length) mejor = p[0]; });
      var sx = 0, sy = 0;
      mejor.forEach(function (c) { sx += c[0]; sy += c[1]; });
      var a = acum[z] = acum[z] || { x: 0, y: 0, n: 0 };
      a.x += sx / mejor.length; a.y += sy / mejor.length; a.n += 1;
    });
    var salida = {};
    Object.keys(acum).forEach(function (z) { salida[z] = [acum[z].x / acum[z].n, acum[z].y / acum[z].n]; });
    return salida;
  }

  // Rectángulo que encuadra las 4 provincias: [[oeste, norte], [este, sur]].
  function encuadre(datos) {
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    datos.provincias.features.forEach(function (f) {
      f.geometry.coordinates.forEach(function (p) {
        p[0].forEach(function (c) { x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]); y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]); });
      });
    });
    return [[x0, y1], [x1, y0]];
  }

  // opc: { nodo, zonas: [..], detalle: function (zona) -> { provincia, region, partidos }, alElegir: function (zona), elegida: function () -> zona|null }
  function montar(opc) {
    var datos = raiz.TESIS_MAPA;
    var ind = indice(datos);
    var cen = datos && datos.geojson ? centroides(datos) : {};
    var grafico = null, resaltada = null, registrado = false, pos = null;

    function colorDeZona(zona) {
      var i = opc.zonas.indexOf(zona);
      return raiz.TESIS_EC.colorDe("color-mapa-" + (i + 1), "#4589ff");
    }

    // Un partido con zona o el marcador de una zona -> la zona; lo gris -> null.
    function zonaDePunto(nombre) {
      return ind.zonaDe[nombre] || (opc.zonas.indexOf(nombre) >= 0 && cen[nombre] ? nombre : null);
    }

    function textoAviso(params) {
      var z = zonaDePunto(params.name);
      var partido = String(params.name).split(" · ");
      if (!z) return "<strong>" + escapar(partido[0]) + "</strong><br>" + escapar(partido[1] || "") + "<br>Fuera de las 8 zonas de la tesis";
      var d = opc.detalle(z);
      var t = "<strong>" + escapar(z) + "</strong><br>" + escapar(d.provincia || partido[1] || "");
      if (d.partidos && d.partidos.length) t += "<br>Partidos de referencia: " + escapar(d.partidos.join(", "));
      return t;
    }

    function opcion() {
      var t = raiz.TESIS_EC.tema();
      var elegida = opc.elegida();
      // Caja con la proporción real de las 4 provincias, centrada: así el mapa no se estira a lo ancho.
      var enc = encuadre(datos), W = opc.nodo.clientWidth, H = opc.nodo.clientHeight - 12;
      var ancho = Math.min(W, H * 0.83 * (enc[1][0] - enc[0][0]) / (enc[0][1] - enc[1][1]));
      var caja = { left: Math.round((W - ancho) / 2), width: Math.round(ancho), top: 6, height: H, boundingCoords: enc, aspectScale: 0.83, roam: false };
      var regiones = datos.geojson.features.map(function (f) {
        var nombre = clave(f.properties), z = ind.zonaDe[nombre];
        if (!z) return { name: nombre, itemStyle: { areaColor: "#3a3a3a", borderColor: "#2a2a2a", borderWidth: 0.5, cursor: "default" }, emphasis: { disabled: true } };
        var c = colorDeZona(z), sel = z === elegida;
        return {
          name: nombre,
          itemStyle: { areaColor: c, opacity: sel ? 1 : 0.65, borderColor: sel ? "#ffffff" : "#2a2a2a", borderWidth: sel ? 1.8 : 0.6, shadowBlur: sel ? 14 : 0, shadowColor: c, cursor: "pointer" },
          emphasis: { itemStyle: { areaColor: c, opacity: 1, borderColor: "#ffffff", borderWidth: 1.8, shadowBlur: 12, shadowColor: c } }
        };
      });
      var puntos = opc.zonas.filter(function (z) { return cen[z]; }).map(function (z) {
        var c = colorDeZona(z), sel = z === elegida;
        return {
          name: z, value: cen[z], symbolSize: sel ? 17 : 11,
          itemStyle: { color: c, borderColor: "#ffffff", borderWidth: sel ? 2.5 : 1 },
          label: { fontWeight: sel ? 700 : 600, color: sel ? "#ffffff" : t.texto }
        };
      });
      return {
        animation: false,
        tooltip: raiz.TESIS_EC.tooltipDelTema(t, { trigger: "item", confine: true, formatter: textoAviso }),
        geo: [
          Object.assign({ map: NOMBRE_MAPA, z: 1, label: { show: false }, emphasis: { label: { show: false } }, select: { disabled: true }, regions: regiones }, caja),
          Object.assign({
            map: "provincias", z: 2, silent: true, itemStyle: { areaColor: "rgba(0,0,0,0)", borderColor: "#8d8d8d", borderWidth: 1.5 },
            label: { show: true, color: "#8d8d8d", fontSize: 11 }
          }, caja)
        ],
        series: [{
          type: t.animar ? "effectScatter" : "scatter", coordinateSystem: "geo", geoIndex: 0, z: 5, data: puntos,
          rippleEffect: { number: 2, scale: 3.2, period: 4, brushType: "stroke" },
          label: { show: true, formatter: "{b}", fontSize: 12, color: t.texto },
          labelLine: { show: true, lineStyle: { color: "#6f6f6f", width: 1 } },
          labelLayout: function (p) {
            var L = pos && pos[puntos[p.dataIndex].name];
            if (!L) return {};
            var d = L.lado === "izq" ? 1 : -1;
            return { x: L.x, y: L.y, align: L.lado === "izq" ? "right" : "left", verticalAlign: "middle", labelLinePoints: [[L.px, L.py], [L.x + d * 18, L.y], [L.x + d * 4, L.y]] };
          }
        }]
      };
    }

    // Lugar de cada etiqueta: a un costado del mapa, de arriba abajo, sin pisarse.
    function calcularEtiquetas() {
      var e = encuadre(datos), o = grafico.convertToPixel({ geoIndex: 0 }, e[0]), s = grafico.convertToPixel({ geoIndex: 0 }, e[1]);
      var alto = opc.nodo.clientHeight, lados = { izq: [], der: [] }, res = {};
      Object.keys(cen).forEach(function (z) {
        var px = grafico.convertToPixel({ geoIndex: 0 }, cen[z]);
        var lado = px[0] < (o[0] + s[0]) / 2 ? "izq" : "der";
        lados[lado].push({ z: z, px: px[0], py: px[1], y: px[1] });
      });
      ["izq", "der"].forEach(function (lado) {
        var l = lados[lado].sort(function (a, b) { return a.y - b.y; });
        for (var i = 1; i < l.length; i++) if (l[i].y < l[i - 1].y + 28) l[i].y = l[i - 1].y + 28;
        for (var j = l.length - 1; j >= 0; j--) {
          if (l[j].y > alto - 14) l[j].y = alto - 14;
          if (j < l.length - 1 && l[j].y > l[j + 1].y - 28) l[j].y = l[j + 1].y - 28;
        }
        l.forEach(function (q) { res[q.z] = { lado: lado, x: lado === "izq" ? o[0] - 6 : s[0] + 6, y: Math.max(12, q.y), px: q.px, py: q.py }; });
      });
      return res;
    }

    function pintar() {
      pos = null;
      grafico.setOption(opcion(), true);
      pos = calcularEtiquetas();
      grafico.setOption(opcion(), true);
    }

    function dibujar() {
      var E = raiz.echarts;
      if (!E || !datos || !datos.provincias || !opc.nodo || !opc.nodo.clientWidth) return;
      try {
        if (!registrado) {
          E.registerMap(NOMBRE_MAPA, geojsonParaEcharts(datos));
          E.registerMap("provincias", datos.provincias);
          registrado = true;
        }
        if (!grafico) {
          grafico = E.init(opc.nodo, null, { renderer: "svg" });
          grafico.on("click", alClic);
          grafico.on("mouseover", function (p) { resaltar(zonaDePunto(p.name)); });
          grafico.on("mouseout", function () { resaltar(null); });
        }
        pintar();
        opc.nodo.removeAttribute("data-error");
      } catch (e) { opc.nodo.setAttribute("data-error", String(e && e.message ? e.message : e)); }
    }

    // Un clic en un partido con zona (o en su marcador) elige esa zona; en uno gris no pasa nada.
    function alClic(params) {
      var z = params && zonaDePunto(params.name);
      if (!z) return false;
      opc.alElegir(z);
      return true;
    }

    // Resalta la zona entera (desde el mapa o desde su tarjeta).
    function resaltar(zona) {
      if (!grafico) return;
      try {
        if (resaltada && ind.nombresDe[resaltada]) grafico.dispatchAction({ type: "downplay", geoIndex: 0, name: ind.nombresDe[resaltada] });
        resaltada = zona;
        if (zona && ind.nombresDe[zona]) grafico.dispatchAction({ type: "highlight", geoIndex: 0, name: ind.nombresDe[zona] });
      } catch (e) { /* el mapa es un apoyo: las tarjetas siguen sirviendo */ }
    }

    if (opc.nodo && typeof raiz.ResizeObserver === "function") {
      new raiz.ResizeObserver(function () {
        if (grafico) { try { grafico.resize(); pintar(); } catch (e) { /* ya liberado */ } } else dibujar();
      }).observe(opc.nodo);
    }

    return { dibujar: dibujar, alClic: alClic, resaltar: resaltar, zonaDe: function (nombre) { return ind.zonaDe[nombre] || null; }, nombresDe: function (z) { return (ind.nombresDe[z] || []).slice(); } };
  }

  raiz.TESIS_MAPA_UI = { montar: montar, clave: clave };
  if (typeof module !== "undefined" && module.exports) module.exports = raiz.TESIS_MAPA_UI;
})(typeof window !== "undefined" ? window : globalThis);
