// Ayudas comunes para los gráficos de Apache ECharts de las secciones 2, 3 y 4 (precios, valor de la tierra y
// costo de oportunidad): colores del tema de la página (oscuro en pantalla), animación y redibujado.
// Si ECharts no está cargado (por ejemplo en las pruebas, con el DOM falso) no dibuja nada: cada sección igual
// muestra todas sus cifras en tablas y en texto.
(function (raiz) {
  "use strict";

  // Lee una variable CSS de :root (el tema vigente); si no hay estilos calculados, usa el respaldo (los colores de Carbon en oscuro).
  function colorDe(nombre, respaldo) {
    try {
      if (typeof raiz.getComputedStyle === "function" && raiz.document.documentElement) {
        var v = raiz.getComputedStyle(raiz.document.documentElement).getPropertyValue("--" + nombre);
        if (v && String(v).trim()) return String(v).trim();
      }
    } catch (e) { /* sin estilos calculados: se usa el respaldo */ }
    return respaldo;
  }

  function sinAnimacion() {
    try { return typeof raiz.matchMedia === "function" && raiz.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }

  // Colores y tipografía del tema vigente, listos para el `option` de ECharts.
  function tema() {
    return {
      texto: colorDe("color-texto", "#f4f4f4"),
      suave: colorDe("color-texto-suave", "#c6c6c6"),
      borde: colorDe("color-borde", "#393939"),
      bordeFuerte: colorDe("color-borde-fuerte", "#6f6f6f"),
      superficie: colorDe("color-superficie", "#262626"),
      superficie2: colorDe("color-superficie-2", "#393939"),
      fuente: colorDe("fuente-texto", "sans-serif"),
      animar: !sinAnimacion(),
      cultivos: { Trigo: colorDe("color-trigo", "#f1c21b"), Soja: colorDe("color-soja", "#08bdba"), "Maíz": colorDe("color-maiz", "#eb6200") }
    };
  }

  function estiloTexto(t) {
    return { color: t.texto, fontFamily: t.fuente, fontSize: 13 };
  }

  // Aviso flotante del tema: capa más clara que la página, línea fina y sin esquinas redondas ni sombra
  // (si no, ECharts lo dibuja como una caja blanca).
  function tooltipDelTema(t, extra) {
    var o = {
      backgroundColor: t.superficie2, borderColor: t.bordeFuerte, borderWidth: 1,
      textStyle: { color: t.texto, fontFamily: t.fuente },
      extraCssText: "border-radius:0;box-shadow:none;"
    };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }

  // Un gráfico de líneas con los ejes y la leyenda del tema. `formatoY` pinta el eje vertical y el aviso flotante.
  function opcionDeLineas(t, categorias, series, formatoY, opciones) {
    opciones = opciones || {};
    return {
      animation: t.animar, textStyle: estiloTexto(t), grid: { left: 64, right: 16, top: 48, bottom: 32 },
      legend: {
        top: 0, type: "scroll", textStyle: { color: t.texto, fontFamily: t.fuente }, inactiveColor: t.bordeFuerte,
        pageTextStyle: { color: t.texto }, pageIconColor: t.texto, pageIconInactiveColor: t.bordeFuerte
      },
      tooltip: tooltipDelTema(t, { trigger: "axis", axisPointer: { lineStyle: { color: t.bordeFuerte } }, valueFormatter: function (x) { return x === null || x === undefined ? "—" : formatoY(x); } }),
      xAxis: { type: "category", data: categorias, boundaryGap: false, axisLabel: { color: t.texto }, axisLine: { lineStyle: { color: t.bordeFuerte } }, axisTick: { lineStyle: { color: t.bordeFuerte } } },
      yAxis: { type: "value", scale: !!opciones.escalar, axisLabel: { color: t.suave, formatter: function (x) { return formatoY(x); } }, splitLine: { lineStyle: { color: t.borde } } },
      series: series.map(function (s) {
        return {
          name: s.nombre, type: "line", symbol: s.simbolo || "circle", symbolSize: s.simboloTam || 7, connectNulls: false,
          itemStyle: { color: s.color }, lineStyle: { color: s.color, width: s.grosor || 3, type: s.trazo || "solid" }, data: s.valores
        };
      })
    };
  }

  // Un conjunto de gráficos de una sección: cada uno se dibuja en su nodo y se vuelve a ajustar si cambia el tamaño
  // de la ventana, si la sección pasa de oculta a visible o si cambia el tema (claro/oscuro).
  function crear(repintar) {
    var graficos = {};
    function redimensionar() {
      Object.keys(graficos).forEach(function (k) { try { graficos[k].resize(); } catch (e) { /* instancia ya liberada */ } });
    }
    function dibujar(clave, nodo, opcion) {
      if (!raiz.echarts || !nodo) return;
      try {
        var g = graficos[clave];
        if (!g) {
          g = graficos[clave] = raiz.echarts.init(nodo, null, { renderer: "svg" });
          // La sección arranca oculta (tamaño 0): cuando se muestra, el contenedor cambia de tamaño y el gráfico se ajusta.
          if (typeof raiz.ResizeObserver === "function") new raiz.ResizeObserver(function () { try { g.resize(); } catch (e) { /* ya liberado */ } }).observe(nodo);
        }
        g.setOption(opcion, true);
        g.resize();
      } catch (e) {
        nodo.setAttribute("data-error", String(e && e.message ? e.message : e));
      }
    }
    if (typeof raiz.addEventListener === "function") {
      raiz.addEventListener("resize", redimensionar);
      raiz.addEventListener("hashchange", function () { if (typeof raiz.setTimeout === "function") raiz.setTimeout(redimensionar, 0); });
    }
    try {
      var oscuro = typeof raiz.matchMedia === "function" ? raiz.matchMedia("(prefers-color-scheme: dark)") : null;
      if (oscuro && typeof oscuro.addEventListener === "function" && repintar) oscuro.addEventListener("change", repintar);
    } catch (e) { /* sin matchMedia: los gráficos se repintan con la próxima actualización */ }
    return { dibujar: dibujar, redimensionar: redimensionar, instancias: graficos };
  }

  var api = { colorDe: colorDe, tema: tema, estiloTexto: estiloTexto, tooltipDelTema: tooltipDelTema, opcionDeLineas: opcionDeLineas, crear: crear };
  raiz.TESIS_EC = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
