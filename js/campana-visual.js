// Impacto visual de los resultados de «Simulá tu campaña»: silos, medidor de riesgo y línea de tiempo de los seis años, más los
// movimientos (números que cuentan, entradas al hacer scroll y scroll suave). No calcula nada: recibe los números ya
// calculados por campana.js y los dibuja. Todo es opcional: si falta una biblioteca de vendor/ (anime.js, countUp.js,
// Lenis, ECharts con liquidfill) o la persona pidió «menos movimiento», la página muestra igual las mismas cifras, quietas.
(function (raiz) {
  "use strict";

  var imprimiendo = false;
  var previos = {};      // último valor mostrado de cada número que cuenta (clave → valor): al cambiar la cobertura cuenta desde ahí
  var pendientes = [];   // números que todavía no empezaron a contar o terminaron de contar: [{ nodo, texto }]
  var vigias = [];       // [{ nodo, accion }] a la espera de entrar en pantalla
  var observador = null;
  var lenis = null;

  // Silo de chapa: techo cónico con alero y cuerpo cilíndrico (coordenadas del trazado; liquidfill lo escala a un cuadrado).
  var FORMA_SILO = "path://M2,52 L50,8 L98,52 L90,52 L90,184 L10,184 L10,52 Z";
  var LADO_SILO = 320;               // px del cuadrado donde se dibuja cada silo (en pantalla se escala al ancho que haya)
  var SEGMENTOS = 20;                // tramos del arco del medidor (de 5 % cada uno)
  var R_FUERA = 102, R_DENTRO = 68;  // radios del arco grueso
  var ANCHO_LINEA_IMPRESA = 400;     // px de la línea de tiempo en la hoja A4
  var ALTO_LINEA_IMPRESA = 170;
  var NS = "http://www.w3.org/2000/svg";

  function base() { return raiz.TESIS_APP; }
  function el(e, a, c) { return base().el(e, a, c); }

  // ¿Hay que quedarse quieto? Lo pide el sistema (prefers-reduced-motion) o se está armando la hoja impresa.
  function sinMovimiento() {
    if (imprimiendo) return true;
    try { return typeof raiz.matchMedia === "function" && raiz.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }

  function anime() { return raiz.anime && typeof raiz.anime.animate === "function" ? raiz.anime : null; }
  function conVigia() { return typeof raiz.IntersectionObserver === "function"; }

  // Una sola escucha para todo: ejecuta la acción de cada nodo la primera vez que entra en pantalla.
  function cuandoSeVea(nodo, accion) {
    if (!observador) {
      observador = new raiz.IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          observador.unobserve(e.target);
          vigias = vigias.filter(function (v) {
            if (v.nodo !== e.target) return true;
            try { v.accion(); } catch (err) { /* un movimiento que falla no puede romper la cifra */ }
            return false;
          });
        });
      }, { threshold: 0.12 });
    }
    vigias.push({ nodo: nodo, accion: accion });
    observador.observe(nodo);
  }

  // --- Entradas suaves de cada bloque al hacer scroll ---
  function entrada(nodo) {
    var a = anime();
    if (!nodo || !a || !conVigia() || sinMovimiento() || nodo.getAttribute("data-entrada")) return nodo;
    nodo.setAttribute("data-entrada", "1");
    nodo.setAttribute("style", "opacity:0;transform:translateY(20px)");
    cuandoSeVea(nodo, function () {
      a.animate(nodo, { opacity: [0, 1], translateY: [20, 0], duration: 650, ease: "outCubic",
        onComplete: function () { nodo.removeAttribute("style"); } });
    });
    return nodo;
  }

  // --- Números que cuentan hasta su valor ---
  // `nodo` ya trae el texto final (con su origen); si algo falla se queda así. `formatear` es el mismo formato de la página,
  // así cada cuadro del conteo se escribe igual que el valor final.
  function contar(nodo, clave, valor, formatear) {
    var previo = previos[clave];
    previos[clave] = valor;
    var CU = raiz.countUp && raiz.countUp.CountUp;
    if (!nodo || !CU || !conVigia() || sinMovimiento() || typeof valor !== "number" || !isFinite(valor)) return nodo;
    var desde = typeof previo === "number" ? previo : 0;
    if (desde === valor) return nodo;
    var texto = nodo.textContent;
    var conteo;
    try {
      conteo = new CU(nodo, valor, { startVal: desde, duration: 1.1, useEasing: true, formattingFn: formatear });
      if (conteo.error) return nodo;
    } catch (e) { nodo.textContent = texto; return nodo; }
    var item = { nodo: nodo, texto: texto };
    pendientes.push(item);
    cuandoSeVea(nodo, function () {
      conteo.start(function () { nodo.textContent = texto; });
    });
    return nodo;
  }

  // --- Navegación por bloques: marca en la barra el bloque que se está mirando ---
  function espiar(items) {
    if (!items || !items.length) return;
    var activar = function (i) {
      items.forEach(function (it, k) {
        if (k === i) { it.boton.setAttribute("aria-current", "true"); it.boton.setAttribute("data-activo", "1"); }
        else { it.boton.removeAttribute("aria-current"); it.boton.removeAttribute("data-activo"); }
      });
    };
    activar(0);
    if (!conVigia()) return;
    try {
      var obs = new raiz.IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          for (var k = 0; k < items.length; k++) if (items[k].seccion === e.target) activar(k);
        });
      }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
      items.forEach(function (it) { obs.observe(it.seccion); });
    } catch (err) { /* sin vigía, queda marcado el primero */ }
  }

  // Deja todo quieto y en su valor final (para imprimir o si la persona pide menos movimiento).
  function terminar() {
    pendientes.forEach(function (p) { p.nodo.textContent = p.texto; });
    pendientes = [];
    vigias.forEach(function (v) {
      try { observador.unobserve(v.nodo); } catch (e) { /* ya no se mira */ }
      if (v.nodo.getAttribute("data-entrada")) v.nodo.removeAttribute("style");
    });
    vigias = [];
  }

  // --- Scroll suave ---
  function scrollSuave() {
    if (lenis || typeof raiz.Lenis !== "function" || sinMovimiento()) return null;
    try { lenis = new raiz.Lenis({ autoRaf: true, lerp: 0.12, allowNestedScroll: true }); } catch (e) { lenis = null; }
    return lenis;
  }

  // Deja la página en la posición vertical y (sin animación), también para el scroll suave, que guarda su propia posición.
  function fijarScroll(y) {
    try { if (lenis && typeof lenis.scrollTo === "function") lenis.scrollTo(y, { immediate: true, force: true }); } catch (e) { /* sin scroll suave */ }
    try { if (typeof raiz.scrollTo === "function" && Math.abs((raiz.pageYOffset || 0) - y) > 1) raiz.scrollTo(0, y); } catch (e) { /* sin scroll */ }
  }

  function fijarImpresion(valor) {
    imprimiendo = !!valor;
    if (imprimiendo) terminar();
  }

  // ---------------------------------------------------------------------------------------
  // Silos de chapa (liquidfill de ECharts; sin él, una barra CSS que se llena igual)
  // ---------------------------------------------------------------------------------------

  function svg(tag, atributos) {
    var n = raiz.document.createElementNS(NS, tag);
    Object.keys(atributos || {}).forEach(function (k) { n.setAttribute(k, atributos[k]); });
    return n;
  }

  // Dibujo del silo sobre el líquido: anillos de chapa corrugada, nervios del techo cónico, escalera, boca de descarga y zócalo.
  // Mismas coordenadas que FORMA_SILO (100 × 190), recuadradas igual que lo hace liquidfill (el trazado ocupa el 96 % del lado).
  function dibujoSilo() {
    var d = svg("svg", { "class": "sc-silo-dibujo", viewBox: "-41.67 4.33 183.33 183.33", "aria-hidden": "true", focusable: "false" });
    var g = function (clase) { var n = svg("g", { "class": clase }); d.appendChild(n); return n; };
    var linea = function (padre, x1, y1, x2, y2) { padre.appendChild(svg("line", { x1: x1, y1: y1, x2: x2, y2: y2 })); };
    var anillos = g("sc-silo-anillos");
    for (var y = 64; y < 184; y += 12) linea(anillos, 10, y, 90, y);
    var nervios = g("sc-silo-nervios");
    [8, 22, 36, 50, 64, 78, 92].forEach(function (x) { linea(nervios, 50, 8, x, 52); });
    d.appendChild(svg("path", { "class": "sc-silo-contorno", d: FORMA_SILO.slice(7), fill: "none" }));
    d.appendChild(svg("rect", { "class": "sc-silo-tapa", x: 45, y: 4.5, width: 10, height: 5 }));
    d.appendChild(svg("rect", { "class": "sc-silo-boca", x: 40, y: 168, width: 20, height: 16 }));
    var escalera = g("sc-silo-escalera");
    linea(escalera, 77, 58, 77, 184); linea(escalera, 83, 58, 83, 184);
    for (var r = 64; r < 184; r += 8) linea(escalera, 77, r, 83, r);
    d.appendChild(svg("rect", { "class": "sc-silo-zocalo", x: 4, y: 184, width: 92, height: 3 }));
    return d;
  }

  function crearSilo(cultivo) {
    var ec = el("div", { "class": "sc-silo-ec" });
    var relleno = el("div", { "class": "sc-silo-relleno" });
    var pct = el("span", { "class": "sc-silo-pct" });
    var caja = el("div", { "class": "sc-silo-caja", role: "img" }, [ec, el("div", { "class": "sc-silo-cuerpo" }, relleno), dibujoSilo()]);
    // Todo en una tarjeta: el silo arriba y, debajo, el porcentaje cubierto y las toneladas (no encima del silo, para que se vea el llenado).
    var lado = el("div", { "class": "sc-silo-lado" }, [pct, el("span", { "class": "sc-silo-lado-rotulo" }, "cubierto")]);
    var texto = el("figcaption", { "class": "sc-silo-texto" });
    var nodo = el("figure", { "class": "sc-silo sc-cultivo-" + cultivo.toLowerCase().replace("í", "i"), "data-cultivo": cultivo },
      [caja, el("div", { "class": "sc-silo-datos" }, [el("strong", { "class": "sc-silo-nombre" }, cultivo), lado, texto])]);
    return { nodo: nodo, caja: caja, ec: ec, relleno: relleno, pct: pct, texto: texto, chart: null, listo: false, visto: false, esperando: false, pendiente: null, cultivo: cultivo };
  }

  function opcionSilo(d, c, anim, h) {
    var dur = anim ? 1800 : 0;
    var nivel = h === undefined ? d.h : h;
    return {
      animation: anim, animationDuration: dur, animationDurationUpdate: dur, animationEasing: "cubicOut", animationEasingUpdate: "cubicInOut",
      series: [{
        type: "liquidFill", data: nivel > 0 ? [nivel, nivel * 0.92] : [0], shape: FORMA_SILO, radius: "96%", center: ["50%", "50%"],
        color: [d.color, d.color], amplitude: anim ? 3 : 0, waveLength: "90%", period: function (v, i) { return i ? 6400 : 4600; },
        waveAnimation: anim, direction: "right", phase: 0, animationDuration: dur, animationDurationUpdate: dur,
        backgroundStyle: { color: c.metal, borderWidth: 0 },
        outline: { show: false },
        itemStyle: { opacity: 0.95, shadowBlur: 0 }, emphasis: { itemStyle: { opacity: 1 } },
        label: { show: false }, tooltip: { show: false }
      }]
    };
  }

  // Sube el líquido (y la barra de respaldo) hasta el nivel pedido; con movimiento, ECharts lo anima con su ola.
  function subirSilo(silo, d) {
    silo.relleno.setAttribute("style", "height:" + Math.round(d.h * 100) + "%");
    try {
      if (silo.chart) silo.chart.setOption({ series: [{ data: d.h > 0 ? [d.h, d.h * 0.92] : [0], color: [d.color, d.color] }] });
    } catch (e) { silo.ec.setAttribute("data-error", String(e && e.message ? e.message : e)); }
  }

  // Dibuja o actualiza un silo. Con movimiento, el primer dibujo arranca vacío y el líquido sube desde 0 cuando el silo entra en pantalla;
  // después, cada cambio de cobertura sólo mueve el nivel. Sin movimiento (o al imprimir) se dibuja de una vez, quieto.
  // El dibujo de ECharts mide LADO_SILO px fijos: con un viewBox el SVG se escala al ancho de la tarjeta (el CSS le da 100 %).
  function ajustarSvgSilo(silo) {
    try {
      var s = silo.ec.querySelector ? silo.ec.querySelector("svg") : null;
      if (s) { s.setAttribute("viewBox", "0 0 " + LADO_SILO + " " + LADO_SILO); s.setAttribute("preserveAspectRatio", "xMidYMid meet"); }
    } catch (e) { /* queda a su tamaño */ }
  }

  function pintarSilo(silo, d, c) {
    var anim = !sinMovimiento();
    var esperar = anim && conVigia() && !silo.visto;
    silo.caja.setAttribute("aria-label", "Silo de " + d.cultivo.toLowerCase() + ": " + d.etiqueta);
    silo.relleno.setAttribute("style", "height:" + (esperar ? 0 : Math.round(d.h * 100)) + "%");
    silo.pct.textContent = d.pctTexto || "";
    silo.pendiente = d;
    var E = raiz.echarts;
    if (esperar && !silo.esperando) {
      silo.esperando = true;
      cuandoSeVea(silo.nodo, function () { silo.visto = true; silo.esperando = false; subirSilo(silo, silo.pendiente); });
    }
    if (!E || typeof E.init !== "function") return;
    try {
      if (!silo.chart) {
        silo.chart = E.init(silo.ec, null, { renderer: "svg", width: LADO_SILO, height: LADO_SILO });
        silo.listo = false;
      }
      ajustarSvgSilo(silo);
      if (!silo.listo || imprimiendo || !anim) {
        silo.chart.setOption(opcionSilo(d, c, anim, esperar ? 0 : d.h), true);
        // Si liquidfill no está cargado, ECharts descarta la serie: se queda la barra CSS.
        var cargado = silo.chart.getModel && silo.chart.getModel().getSeries().length > 0;
        silo.ec.setAttribute("data-liquido", cargado ? "1" : "0");
        silo.caja.setAttribute("data-modo", cargado ? "liquido" : "barra");
        silo.listo = cargado;
        if (imprimiendo && cargado && typeof silo.chart.getZr === "function") silo.chart.getZr().refreshImmediately();
      } else if (!esperar) {
        silo.chart.setOption({ series: [{ data: d.h > 0 ? [d.h, d.h * 0.92] : [0], color: [d.color, d.color] }] });
      }
    } catch (e) {
      silo.ec.setAttribute("data-error", String(e && e.message ? e.message : e));
      silo.caja.setAttribute("data-modo", "barra");
    }
  }

  function liberarSilo(silo) {
    try { if (silo.chart) silo.chart.dispose(); } catch (e) { /* ya liberado */ }
    silo.chart = null;
  }

  // ---------------------------------------------------------------------------------------
  // Íconos de los cultivos: espiga (trigo), chaucha (soja) y choclo (maíz), en SVG propio; toman el color del texto (currentColor)
  // ---------------------------------------------------------------------------------------

  function iconoCultivo(cultivo) {
    var d = svg("svg", { "class": "sc-icono sc-icono-" + String(cultivo).toLowerCase().replace("í", "i"), viewBox: "0 0 24 24", width: "24", height: "24", "aria-hidden": "true", focusable: "false" });
    var f = function (dd, extra) { var a = { d: dd, fill: "currentColor" }; Object.keys(extra || {}).forEach(function (k) { a[k] = extra[k]; }); d.appendChild(svg("path", a)); };
    var l = function (dd, ancho) { d.appendChild(svg("path", { d: dd, fill: "none", stroke: "currentColor", "stroke-width": String(ancho || 1.6), "stroke-linecap": "round", "stroke-linejoin": "round" })); };
    if (cultivo === "Trigo") {
      // Espiga: tallo, granos en pares y un grano en la punta
      l("M12 22V8");
      f("M12 1.6C10.6 3.2 10.6 5.4 12 7.2C13.4 5.4 13.4 3.2 12 1.6Z");
      [9, 14].forEach(function (y) {
        f("M12 " + (y + 2) + "C8.6 " + (y + 2) + " 7 " + (y - 0.5) + " 6.6 " + (y - 3.2) + "C10 " + (y - 3.2) + " 12 " + (y - 0.8) + " 12 " + (y + 2) + "Z");
        f("M12 " + (y + 2) + "C15.4 " + (y + 2) + " 17 " + (y - 0.5) + " 17.4 " + (y - 3.2) + "C14 " + (y - 3.2) + " 12 " + (y - 0.8) + " 12 " + (y + 2) + "Z");
      });
      f("M12 18.5C8.6 18.5 7 16 6.6 13.5C10 13.5 12 15.8 12 18.5Z");
      f("M12 18.5C15.4 18.5 17 16 17.4 13.5C14 13.5 12 15.8 12 18.5Z");
    } else if (cultivo === "Soja") {
      // Chaucha: vaina curva con tres porotos
      l("M4.5 19.5C2.8 11.5 9 4 19.5 4.2C19.8 12.8 13 20.6 4.5 19.5Z", 1.7);
      [[8.6, 14.6], [12.2, 11.4], [15.6, 8.2]].forEach(function (c) { d.appendChild(svg("circle", { cx: String(c[0]), cy: String(c[1]), r: "1.8", fill: "currentColor" })); });
      l("M19.5 4.2C20.6 3.4 21.4 3 22 2.8", 1.5);
    } else {
      // Choclo: la mazorca con sus granos y dos hojas de chala
      f("M12 2C8.6 2 7.6 6.6 7.6 11C7.6 15 9.4 18.5 12 18.5C14.6 18.5 16.4 15 16.4 11C16.4 6.6 15.4 2 12 2Z");
      d.appendChild(svg("path", { d: "M12 3V17M9.4 6.5H14.6M8.6 10H15.4M8.8 13.5H15.2", fill: "none", stroke: "#262626", "stroke-width": "0.9", "stroke-linecap": "round" }));
      f("M12 22.2C6.2 21.4 4.4 15.4 5.8 10.4C8.6 12.6 11.2 16 12 22.2Z", { "fill-opacity": "0.78" });
      f("M12 22.2C17.8 21.4 19.6 15.4 18.2 10.4C15.4 12.6 12.8 16 12 22.2Z", { "fill-opacity": "0.78" });
    }
    return d;
  }

  // ---------------------------------------------------------------------------------------
  // Parcela en hectáreas: el campo visto desde arriba. Una franja por cultivo, tan ancha como sus hectáreas, con surcos del color del
  // cultivo; la parte cubierta con futuros sube desde abajo con un tramado de «precio fijado» y un candado. Reutilizable en otras pestañas.
  // ---------------------------------------------------------------------------------------

  // Dibujito de una parcela con surcos, para el casillero de hectáreas.
  function dibujoParcelaChica() {
    var d = svg("svg", { "class": "sc-parcela-mini", viewBox: "0 0 40 28", width: "40", height: "28", "aria-hidden": "true", focusable: "false" });
    d.appendChild(svg("path", { "class": "sc-parcela-mini-suelo", d: "M6 3H34L38 25H2Z", fill: "currentColor", "fill-opacity": "0.18", stroke: "currentColor", "stroke-width": "1.2", "stroke-linejoin": "round" }));
    [[11, 3, 9, 25], [16, 3, 15, 25], [21, 3, 21, 25], [26, 3, 27, 25], [31, 3, 33, 25]].forEach(function (l) {
      d.appendChild(svg("path", { d: "M" + l[0] + " " + l[1] + "L" + l[2] + " " + l[3], stroke: "currentColor", "stroke-width": "1.3", "stroke-linecap": "round", fill: "none" }));
    });
    return d;
  }

  function candado() {
    var d = svg("svg", { "class": "sc-parcela-candado", viewBox: "0 0 16 16", width: "14", height: "14", "aria-hidden": "true", focusable: "false" });
    d.appendChild(svg("path", { d: "M5 7V5a3 3 0 0 1 6 0v2", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" }));
    d.appendChild(svg("rect", { x: "3", y: "7", width: "10", height: "7", rx: "1.4", fill: "currentColor" }));
    return d;
  }

  function entero(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  // Texto de la franja (tooltip y lectores de pantalla): hectáreas, y si se pasan, toneladas y USD de la parte con precio fijado.
  function textoFranja(c, ha, h, extra) {
    var partes = [c + ": " + entero(ha) + " ha", Math.round(h * 100) + " % con precio fijado"];
    if (extra && typeof extra.toneladas === "number") partes.push(entero(extra.toneladas) + (typeof extra.producidas === "number" ? " t fijadas de " + entero(extra.producidas) : " t fijadas"));
    if (extra && typeof extra.usd === "number") partes.push(entero(extra.usd) + " USD fijados");
    return partes.join(" · ");
  }

  // datos: { cultivos: ["Soja", ...], hectareas: { Soja: 300 }, h: { Soja: 0.5 }, toneladas?: { c: t cubiertas }, producidas?: { c: t }, usd?: { c: USD fijados } }
  // Devuelve { nodo, actualizar(datos) }: llamar a actualizar cuando cambie la cobertura (la transición es animada, salvo «menos movimiento»).
  function crearParcela(datos) {
    var campo = el("div", { "class": "sc-parcela-campo" });
    var leyenda = el("ul", { "class": "sc-parcela-leyenda" });
    var tip = el("div", { "class": "sc-parcela-tip", role: "status" });
    tip.hidden = true;
    var nodo = el("figure", { "class": "sc-parcela", role: "img" }, [
      el("figcaption", { "class": "sc-parcela-titulo" }, "Tu campo visto desde arriba"),
      el("div", { "class": "sc-parcela-marco" }, [campo, tip]), leyenda,
      el("p", { "class": "sc-parcela-pie" }, "Cada franja es un cultivo, tan ancha como sus hectáreas. Lo rayado y con candado es lo que ya tiene precio fijado.")
    ]);
    var p = { nodo: nodo, campo: campo, leyenda: leyenda, tip: tip, clave: "", franjas: {}, items: {}, visto: false, esperando: false, pendiente: null };

    function extraDe(d, c) { return { toneladas: d.toneladas && d.toneladas[c], producidas: d.producidas && d.producidas[c], usd: d.usd && d.usd[c] }; }
    function mostrar(c) {
      var d = p.pendiente || datos;
      tip.textContent = textoFranja(c, d.hectareas[c] || 0, d.h[c] || 0, extraDe(d, c));
      tip.hidden = false;
      tip.setAttribute("data-cultivo", c);
    }
    function ocultar() { tip.hidden = true; }

    function armar(d) {
      base().vaciar(campo); base().vaciar(leyenda);
      p.franjas = {}; p.items = {};
      d.cultivos.forEach(function (c) {
        var cls = "sc-cultivo-" + c.toLowerCase().replace("í", "i");
        var cubierta = el("div", { "class": "sc-parcela-cubierta" }, [el("span", { "class": "sc-parcela-sello" }, [candado()])]);
        var f = el("div", { "class": "sc-parcela-franja " + cls, "data-cultivo": c, tabindex: "0" }, [cubierta]);
        f.addEventListener("mouseenter", function () { mostrar(c); });
        f.addEventListener("focus", function () { mostrar(c); });
        f.addEventListener("mouseleave", ocultar);
        f.addEventListener("blur", ocultar);
        campo.appendChild(f);
        var dato = el("span", { "class": "sc-parcela-dato" });
        var item = el("li", { "class": "sc-parcela-item " + cls, "data-cultivo": c }, [el("span", { "class": "sc-parcela-punto" }), el("strong", null, c), dato]);
        leyenda.appendChild(item);
        p.franjas[c] = { franja: f, cubierta: cubierta };
        p.items[c] = dato;
      });
    }

    function pintar(d, conCobertura) {
      d.cultivos.forEach(function (c) {
        var fr = p.franjas[c], ha = d.hectareas[c] || 0, h = d.h[c] || 0;
        fr.franja.setAttribute("style", "flex:" + Math.max(ha, 1) + " 1 0");
        fr.franja.setAttribute("data-ha", String(ha));
        fr.franja.setAttribute("data-h", String(h));
        fr.franja.setAttribute("data-cubierta", h > 0 ? "1" : "0");
        fr.cubierta.setAttribute("style", "height:" + (conCobertura ? Math.round(h * 100) : 0) + "%");
        p.items[c].textContent = entero(ha) + " ha · " + Math.round(h * 100) + " % fijado";
      });
    }

    p.actualizar = function (d) {
      var clave = d.cultivos.join("|");
      if (clave !== p.clave) { armar(d); p.clave = clave; p.visto = false; }
      p.pendiente = d;
      nodo.setAttribute("data-quieto", sinMovimiento() ? "1" : "0");
      var esperar = !sinMovimiento() && conVigia() && !p.visto;
      pintar(d, !esperar);
      var total = d.cultivos.reduce(function (s, c) { return s + (d.hectareas[c] || 0); }, 0);
      nodo.setAttribute("aria-label", "Parcela de " + entero(total) + " hectáreas. " + d.cultivos.map(function (c) { return textoFranja(c, d.hectareas[c] || 0, d.h[c] || 0, extraDe(d, c)); }).join(". "));
      if (esperar && !p.esperando) {
        p.esperando = true;
        cuandoSeVea(nodo, function () { p.visto = true; p.esperando = false; pintar(p.pendiente, true); });
      }
    };
    if (datos) p.actualizar(datos);
    return p;
  }

  // ---------------------------------------------------------------------------------------
  // Medidor de «Riesgo que sacás»: arco grueso por segmentos, aguja y la marca del umbral de la hipótesis
  // ---------------------------------------------------------------------------------------

  function punto(f, radio) {
    var ang = Math.PI * (1 - f);
    return { x: 110 + radio * Math.cos(ang), y: 120 - radio * Math.sin(ang) };
  }

  // Un tramo del arco grueso entre las fracciones f0 y f1 (0 = izquierda, 1 = derecha).
  function trazoSegmento(f0, f1) {
    var a = punto(f0, R_FUERA), b = punto(f1, R_FUERA), c = punto(f1, R_DENTRO), d = punto(f0, R_DENTRO);
    var p = function (q) { return q.x.toFixed(2) + "," + q.y.toFixed(2); };
    return "M" + p(a) + " A" + R_FUERA + "," + R_FUERA + " 0 0 1 " + p(b) + " L" + p(c) + " A" + R_DENTRO + "," + R_DENTRO + " 0 0 0 " + p(d) + " Z";
  }

  function crearMedidor() {
    var dibujo = svg("svg", { viewBox: "0 -24 220 172", "class": "sc-medidor-svg", "aria-hidden": "true", focusable: "false" });
    var segmentos = [];
    for (var i = 0; i < SEGMENTOS; i++) {
      var s = svg("path", { d: trazoSegmento(i / SEGMENTOS + 0.004, (i + 1) / SEGMENTOS - 0.004), "class": "sc-seg" });
      dibujo.appendChild(s);
      segmentos.push(s);
    }
    var marca = svg("line", { "class": "sc-medidor-marca" });
    var rotulo = svg("text", { "class": "sc-medidor-rotulo", "text-anchor": "middle" });
    var aguja = svg("g", { "class": "sc-aguja" });
    aguja.appendChild(svg("polygon", { points: "105.5,120 110,40 114.5,120", "class": "sc-aguja-cuerpo" }));
    aguja.appendChild(svg("circle", { cx: "110", cy: "120", r: "9", "class": "sc-aguja-eje" }));
    var cero = svg("text", { "class": "sc-medidor-extremo", x: "30", y: "140", "text-anchor": "middle" });
    cero.textContent = "0 %";
    var cien = svg("text", { "class": "sc-medidor-extremo", x: "190", y: "140", "text-anchor": "middle" });
    cien.textContent = "100 %";
    [marca, aguja, rotulo, cero, cien].forEach(function (n) { dibujo.appendChild(n); });
    var numero = el("p", { "class": "sc-medidor-numero" });
    var supera = el("p", { "class": "sc-medidor-supera", role: "status" }, "Superás el umbral de la hipótesis");
    supera.setAttribute("hidden", "");
    var ec = el("div", { "class": "sc-medidor-ec" });
    var caja = el("div", { "class": "sc-medidor", role: "img" }, [ec, dibujo, numero, supera]);
    return { nodo: caja, ec: ec, chart: null, visto: false, esperando: false, pendiente: null, segmentos: segmentos, aguja: aguja, marca: marca, rotulo: rotulo, numero: numero, supera: supera, listo: false };
  }

  // Medidor de aguja de ECharts (serie gauge) con tres bandas: rojo hasta cerca del umbral, amarillo alrededor y verde por encima.
  function opcionAguja(m, c, valor, umbral, textoMarca, anim) {
    return {
      animation: anim, animationDuration: anim ? 1600 : 0, animationDurationUpdate: anim ? 1100 : 0, animationEasing: "cubicOut", animationEasingUpdate: "cubicOut",
      graphic: [{ type: "text", left: "center", top: 4, style: { text: "Umbral de la hipótesis: " + textoMarca, fill: c.texto, fontFamily: c.fuente, fontSize: 12, fontWeight: 600 } }],
      series: [{
        type: "gauge", startAngle: 180, endAngle: 0, min: 0, max: 100, splitNumber: 2, radius: "118%", center: ["50%", "86%"],
        axisLine: { lineStyle: { width: 28, color: [[Math.max(0.05, umbral * 0.9), c.alerta], [Math.min(0.95, umbral * 1.1), c.aviso], [1, c.logro]] } },
        pointer: { width: 8, length: "72%", itemStyle: { color: c.texto } },
        anchor: { show: true, size: 18, itemStyle: { color: c.texto, borderColor: c.superficie, borderWidth: 4 } },
        axisTick: { show: false }, minorTick: { show: false },
        splitLine: { length: 38, distance: -33, lineStyle: { color: c.texto, width: 4 } },
        axisLabel: { distance: 24, color: c.suave, fontFamily: c.fuente, fontSize: 12, formatter: function (x) { return x + " %"; } },
        title: { show: false }, detail: { show: false }, data: [{ value: Math.round(valor * 1000) / 10 }]
      }]
    };
  }

  function dibujarAguja(m) {
    var E = raiz.echarts, d = m.pendiente;
    if (!E || typeof E.init !== "function" || !d) return;
    if (m.ec.clientWidth === 0 && !imprimiendo) { m.visto = false; m.esperando = false; m.faltaDibujar = true; return; }
    m.faltaDibujar = false;
    try {
      if (!m.chart) m.chart = E.init(m.ec, null, { renderer: "svg" });
      m.chart.setOption(opcionAguja(m, d.colores, d.f, d.umbral, d.textoMarca, !sinMovimiento()), true);
      m.chart.resize(imprimiendo ? { width: 250, height: 115 } : undefined);
      if (imprimiendo && typeof m.chart.getZr === "function") m.chart.getZr().refreshImmediately();
      m.nodo.setAttribute("data-modo", "aguja");
    } catch (e) { m.ec.setAttribute("data-error", String(e && e.message ? e.message : e)); m.nodo.setAttribute("data-modo", "segmentos"); }
  }

  // valor: reducción del desvío (0 a 1, o null si no se puede calcular); umbral: la marca de la hipótesis (0 a 1).
  // modo: «con» (el valor de tu cobertura) o «sin» (sin cubrirte no sacás riesgo: aguja en 0 %).
  function pintarMedidor(m, valor, umbral, textoMarca, ariaLabel, colores, modo) {
    var sinCubrir = modo === "sin";
    var a = punto(umbral, R_DENTRO - 8), b = punto(umbral, R_FUERA + 8), t = punto(umbral, R_FUERA + 14);
    m.marca.setAttribute("x1", a.x.toFixed(1)); m.marca.setAttribute("y1", a.y.toFixed(1));
    m.marca.setAttribute("x2", b.x.toFixed(1)); m.marca.setAttribute("y2", b.y.toFixed(1));
    m.rotulo.setAttribute("x", t.x.toFixed(1)); m.rotulo.setAttribute("y", (t.y - 2).toFixed(1));
    m.rotulo.textContent = "Umbral de la hipótesis: " + textoMarca;
    m.nodo.setAttribute("aria-label", sinCubrir ? "Riesgo que sacás sin cubrirte: 0 %. Marca del " + textoMarca + ": umbral de la hipótesis." : ariaLabel);
    var valido = typeof valor === "number" && isFinite(valor);
    var f = valido && !sinCubrir ? Math.max(0, Math.min(1, valor)) : 0;
    var supera = valido && !sinCubrir && valor > umbral;
    m.nodo.setAttribute("data-valor", f.toFixed(4));
    m.nodo.setAttribute("data-supera", supera ? "1" : "0");
    if (supera) m.supera.removeAttribute("hidden"); else m.supera.setAttribute("hidden", "");
    var encendidos = Math.round(f * SEGMENTOS);
    var animar = m.listo || !sinMovimiento();
    m.segmentos.forEach(function (s, i) {
      var pasa = (i + 0.5) / SEGMENTOS >= umbral;
      var on = i < encendidos;
      s.setAttribute("class", "sc-seg" + (pasa ? " sc-seg-pasa" : "") + (on ? " sc-seg-on" : ""));
      s.setAttribute("style", "transition-delay:" + (animar ? (on ? i * 40 : (SEGMENTOS - i) * 15) : 0) + "ms");
    });
    if (raiz.echarts && colores) {
      m.pendiente = { f: f, umbral: umbral, textoMarca: textoMarca, colores: colores };
      if (!m.nodo.getAttribute("data-modo")) m.nodo.setAttribute("data-modo", "aguja");
      if (imprimiendo || sinMovimiento() || !conVigia() || m.visto) { m.visto = true; dibujarAguja(m); }
      else if (!m.esperando) { m.esperando = true; cuandoSeVea(m.nodo, function () { m.visto = true; m.esperando = false; dibujarAguja(m); }); }
    } else m.nodo.setAttribute("data-modo", "segmentos");
    var grados = (f - 0.5) * 180;
    var poner = function () { m.aguja.setAttribute("style", "transform:rotate(" + grados.toFixed(1) + "deg)"); };
    // La primera vez la aguja parte del cero y recorre el arco (la transición está en el CSS y se apaga con «menos movimiento»).
    if (!m.listo && !sinMovimiento() && typeof raiz.requestAnimationFrame === "function") {
      m.aguja.setAttribute("style", "transform:rotate(-90deg)");
      m.listo = true;
      raiz.requestAnimationFrame(function () { raiz.requestAnimationFrame(poner); });
    } else {
      m.listo = true;
      poner();
    }
  }

  // El número grande del medidor: con tu cobertura es el que armó la página (con su origen); sin cubrirte, 0 %.
  // Al cambiar de estado cuenta de un valor al otro (countUp), salvo «menos movimiento».
  function ponerNumero(m, modo, animar) {
    var cero = m.cero || (m.cero = el("span", { "class": "numero" }, base().formato.aplicar("porcentaje", 0)));
    var final = modo === "sin" || !m.numeroNodo ? cero : m.numeroNodo;
    var token = m.ficha = (m.ficha || 0) + 1;
    var poner = function (n) { base().vaciar(m.numero); m.numero.appendChild(n); };
    poner(final);
    var CU = raiz.countUp && raiz.countUp.CountUp;
    var v = m.valorNumero;
    if (!animar || !CU || sinMovimiento() || typeof v !== "number" || !isFinite(v) || !m.numeroNodo) return;
    var tope = Math.max(0, Math.min(1, v)) * 100;
    var desde = modo === "sin" ? tope : 0, hasta = modo === "sin" ? 0 : tope;
    var t = el("span", { "class": "numero" }, base().formato.aplicar("porcentaje", desde / 100));
    try {
      var conteo = new CU(t, hasta, { startVal: desde, decimalPlaces: 1, duration: 1.1, useEasing: true,
        formattingFn: function (n) { return base().formato.aplicar("porcentaje", n / 100); } });
      if (conteo.error) return;
      poner(t);
      conteo.start(function () { if (token === m.ficha) poner(final); });
    } catch (e) { poner(final); }
  }

  // ---------------------------------------------------------------------------------------
  // Línea de tiempo de los seis años: cada campaña con dos marcas (sin cubrirte y con tu cobertura) unidas por una mancuerna vertical
  // ---------------------------------------------------------------------------------------

  function crearLinea() {
    var ec = el("div", { "class": "sc-linea-ec" });
    var lista = el("ol", { "class": "sc-linea-lista" });
    var nodo = el("div", { "class": "sc-linea", role: "img" }, [ec, lista]);
    var leyenda = el("ul", { "class": "sc-linea-leyenda" }, [
      el("li", { "class": "sc-linea-ley-con" }, [el("span", { "class": "sc-muestra-punto", "aria-hidden": "true" }), "Con tu cobertura"]),
      el("li", null, [el("span", { "class": "sc-muestra-punto sc-muestra-sin", "aria-hidden": "true" }), "Sin cubrirte"])
    ]);
    return { nodo: nodo, ec: ec, lista: lista, leyenda: leyenda, modo: "con", chart: null, visto: false, esperando: false, pendiente: null, items: [] };
  }

  // modo «sin»: los puntos de «con tu cobertura» pasan a la posición (y el aspecto) de los de «sin cubrirte»; la mancuerna se cierra.
  function opcionLinea(d, anim, modo) {
    var c = d.colores;
    var sinCubrir = modo === "sin";
    var conV = sinCubrir ? d.sin : d.con, peorI = sinCubrir ? d.peorSin : d.peor, mejorI = sinCubrir ? d.mejorSin : d.mejor;
    var texto = { color: c.texto, fontFamily: c.fuente };
    var etiqueta = function (clase, fondo, color) {
      var rich = {};
      rich[clase] = { backgroundColor: fondo, color: color, padding: [5, 9, 4, 9], fontFamily: c.fuente, fontSize: d.impreso ? 11 : 12, fontWeight: 600 };
      return { show: true, formatter: "{" + clase + "|" + (clase === "peor" ? "Peor año" : "Mejor año") + "}", rich: rich };
    };
    var datosCon = conV.map(function (v, i) {
      if (i === peorI && i !== mejorI) return { value: v, symbolSize: d.impreso ? 18 : 26, label: Object.assign({ position: conV[i] >= d.sin[i] ? "top" : "bottom", distance: 8, offset: [16, 0] }, etiqueta("peor", c.alerta, c.sobreAlerta)) };
      if (i === mejorI) return { value: v, symbolSize: d.impreso ? 18 : 26, label: Object.assign({ position: conV[i] >= d.sin[i] ? "top" : "bottom", distance: 8, offset: [-16, 0] }, etiqueta("mejor", c.logro, c.sobreLogro)) };
      return v;
    });
    return {
      animation: anim, animationDuration: anim ? 1000 : 0, animationDurationUpdate: anim ? 800 : 0, animationEasing: "cubicOut", animationEasingUpdate: "cubicOut",
      textStyle: texto, grid: { left: 64, right: 24, top: 36, bottom: 32 },
      tooltip: {
        trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: c.sombra } },
        backgroundColor: c.superficie2, borderColor: c.bordeFuerte, borderWidth: 1, textStyle: texto, extraCssText: "border-radius:0;box-shadow:none;",
        formatter: function (ps) {
          var i = ps && ps.length ? ps[0].dataIndex : 0;
          var fila = function (color, hueco, nombre, valor) {
            return '<div style="display:flex;justify-content:space-between;gap:18px;align-items:center"><span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px;box-sizing:border-box;border:3px solid '
              + color + ";background:" + (hueco ? c.superficie2 : color) + '"></span>' + nombre + "</span><b>" + valor + " USD</b></div>";
          };
          var rol = i === peorI ? " · peor año" : i === mejorI ? " · mejor año" : "";
          return '<div style="min-width:230px"><div style="font-weight:600;margin-bottom:5px">' + d.campanas[i] + rol + "</div>"
            + fila(c.con, false, "Con tu cobertura", d.usdCon[i]) + fila(c.sin, true, "Sin cubrirte", d.usdSin[i]) + "</div>";
        }
      },
      xAxis: { type: "category", data: d.campanas, boundaryGap: true, axisLine: { lineStyle: { color: c.bordeFuerte } }, axisTick: { show: false }, axisLabel: { color: c.texto, fontSize: d.impreso ? 11 : 13, margin: 12, interval: 0 } },
      yAxis: { type: "value", min: d.min, max: d.max, name: "USD", nameTextStyle: { color: c.suave, align: "right" }, splitNumber: 4,
        axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: c.borde } }, axisLabel: { color: c.suave, fontSize: d.impreso ? 11 : 12, formatter: d.formatoEje } },
      series: [
        { id: "dif", type: "custom", name: "Diferencia", silent: true, z: 1, tooltip: { show: false }, data: d.campanas.map(function (x, i) { return [i, d.sin[i], conV[i]]; }),
          renderItem: function (params, api) {
            var a = api.coord([api.value(0), api.value(1)]), b = api.coord([api.value(0), api.value(2)]);
            return { type: "line", shape: { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, transition: ["shape"],
              style: { stroke: c.con, lineWidth: d.impreso ? 5 : 8, lineCap: "round", opacity: 0.45 } };
          } },
        { id: "sin", type: "scatter", name: "Sin cubrirte", z: 3, symbolSize: d.impreso ? 14 : 18, data: d.sin, itemStyle: { color: c.superficie, borderColor: c.sin, borderWidth: 3 } },
        { id: "con", type: "scatter", name: sinCubrir ? "Sin cubrirte" : "Con tu cobertura", z: 4, symbolSize: d.impreso ? 14 : sinCubrir ? 18 : 20, data: datosCon,
          itemStyle: sinCubrir ? { color: c.superficie, borderColor: c.sin, borderWidth: 3 } : { color: c.con, borderColor: c.superficie, borderWidth: 2 } }
      ]
    };
  }

  function dibujarLinea(l, d) {
    var E = raiz.echarts;
    if (!E || typeof E.init !== "function") return;
    // Si el bloque todavía no tiene lugar en la página (resultados ocultos), no se dibuja: se vuelve a intentar al mostrarlos.
    if (l.ec.clientWidth === 0 && !imprimiendo) { l.visto = false; l.esperando = false; l.faltaDibujar = true; return; }
    l.faltaDibujar = false;
    try {
      if (!l.chart) l.chart = E.init(l.ec, null, { renderer: "svg" });
      // Al cambiar entre «sin cubrirte» y «con tu cobertura» se mezcla con lo dibujado: los puntos se desplazan de una posición a la otra.
      var cambio = !!l.modoDibujado && l.modoDibujado !== l.modo;
      l.chart.setOption(opcionLinea(d, !sinMovimiento(), l.modo), !cambio);
      l.modoDibujado = l.modo;
      l.chart.resize(imprimiendo ? { width: ANCHO_LINEA_IMPRESA, height: ALTO_LINEA_IMPRESA } : undefined);
      if (imprimiendo && typeof l.chart.getZr === "function") l.chart.getZr().refreshImmediately();
      l.nodo.setAttribute("data-modo", "grafico");
    } catch (e) {
      l.ec.setAttribute("data-error", String(e && e.message ? e.message : e));
      l.nodo.setAttribute("data-modo", "lista");
    }
  }

  // d: { campanas, sin: [USD], con: [USD], usdSin, usdCon (textos), peor, mejor, min, max (eje común a todas las proporciones), formatoEje, colores, impreso, aria }
  function pintarLinea(l, d, modo) {
    l.modo = modo === "sin" ? "sin" : "con";
    var peorI = l.modo === "sin" ? d.peorSin : d.peor, mejorI = l.modo === "sin" ? d.mejorSin : d.mejor;
    l.nodo.setAttribute("data-modo-linea", l.modo);
    l.nodo.setAttribute("aria-label", d.aria);
    // Respaldo en texto (y lectura para quien no ve el dibujo): una fila por campaña, en orden cronológico.
    if (l.items.length !== d.campanas.length) {
      base().vaciar(l.lista);
      l.items = d.campanas.map(function (campana) {
        var li = el("li", { "class": "sc-linea-item", "data-campana": campana });
        l.lista.appendChild(li);
        return li;
      });
    }
    d.campanas.forEach(function (campana, i) {
      var rol = i === peorI ? "peor" : i === mejorI ? "mejor" : "";
      l.items[i].setAttribute("class", "sc-linea-item" + (rol ? " sc-linea-" + rol : ""));
      l.items[i].textContent = campana + (rol ? " (" + (rol === "peor" ? "peor año" : "mejor año") + ")" : "") + ": con tu cobertura " + d.usdCon[i] + " USD, sin cubrirte " + d.usdSin[i] + " USD";
    });
    if (!raiz.echarts) { l.nodo.setAttribute("data-modo", "lista"); return; }
    if (!l.nodo.getAttribute("data-modo")) l.nodo.setAttribute("data-modo", "grafico");   // el contenedor tiene que verse para que ECharts le mida el tamaño
    l.pendiente = d;
    if (imprimiendo || sinMovimiento() || !conVigia() || l.visto) { l.visto = true; dibujarLinea(l, d); return; }
    // Con movimiento: el dibujo se arma recién cuando el bloque entra en pantalla (así se ve crecer); después, cada cambio de cobertura mueve los puntos.
    if (!l.esperando) {
      l.esperando = true;
      cuandoSeVea(l.nodo, function () { l.visto = true; l.esperando = false; dibujarLinea(l, l.pendiente); });
    }
  }

  // ---------------------------------------------------------------------------------------
  // El panel completo: tres bloques, cada uno con una sola idea (título, dibujo y una frase)
  // ---------------------------------------------------------------------------------------

  function bloque(clase, titulo) {
    var frase = el("p", { "class": "sc-frase sc-visual-frase" });
    var cuerpo = el("div", { "class": "sc-visual-cuerpo" });
    var nodo = el("section", { "class": "tarjeta sc-visual-bloque " + clase }, [el("h4", null, titulo), cuerpo, frase]);
    return { nodo: nodo, cuerpo: cuerpo, frase: frase };
  }

  function crearPanel() {
    var silos = bloque("sc-bloque-silos", "Cuánto de tu cosecha ya tiene precio");
    silos.cuerpo.setAttribute("class", "sc-visual-cuerpo sc-silos-y-parcela");
    var cuerpoSilos = el("div", { "class": "sc-silos" });
    var parcela = crearParcela(null);
    // Los silos y, justo debajo, el total de toneladas con precio fijado, en una misma columna (al lado de la parcela).
    silos.cuerpo.appendChild(el("div", { "class": "sc-silos-columna" }, [cuerpoSilos, silos.frase]));
    silos.cuerpo.appendChild(parcela.nodo);
    var medidor = bloque("sc-bloque-medidor", "Riesgo que sacás");
    var m = crearMedidor();
    medidor.cuerpo.appendChild(m.nodo);
    var selector = crearSelector();
    var linea = bloque("sc-bloque-linea", "Tus seis años de la tesis");
    var r = crearLinea();
    [r.leyenda, r.nodo].forEach(function (n) { linea.cuerpo.appendChild(n); });
    var nodo = el("div", { "class": "sc-visual", id: "sc-visual", "data-modo": "con" }, [silos.nodo, selector.nodo, medidor.nodo, linea.nodo]);
    var panel = { nodo: nodo, silos: [], medidor: m, linea: r, modo: "con", hayCobertura: true, selector: selector, ultimos: null, frases: { silos: silos.frase, medidor: medidor.frase, linea: linea.frase },
      cuerpoSilos: cuerpoSilos, parcela: parcela, clave: "", entradasListas: false };
    selector.botones.forEach(function (b) { b.boton.addEventListener("click", function () { elegirModo(panel, b.modo); }); });
    return panel;
  }

  // Selector compartido por el medidor y la línea de los seis años: «Sin cubrirte» / «Con tu cobertura».
  function crearSelector() {
    var botones = [["sin", "Sin cubrirte"], ["con", "Con tu cobertura"]].map(function (x) {
      return { modo: x[0], boton: el("button", { type: "button", "class": "sc-chip", "aria-pressed": x[0] === "con" ? "true" : "false" }, x[1]) };
    });
    var nodo = el("div", { "class": "sc-modo", role: "toolbar", "aria-label": "Comparar sin cubrirte y con tu cobertura" },
      [el("span", { "class": "sc-modo-rotulo" }, "Mirá la comparación:")].concat(botones.map(function (b) { return b.boton; })));
    return { nodo: nodo, botones: botones };
  }

  function modoEfectivo(panel) { return imprimiendo || !panel.hayCobertura ? "con" : panel.modo; }

  // Pone el medidor, su número y la línea de los seis años en el estado elegido (los textos de abajo cambian por CSS según data-modo).
  function aplicarModo(panel, animar) {
    var d = panel.ultimos;
    if (!d) return;
    var modo = modoEfectivo(panel);
    panel.nodo.setAttribute("data-modo", modo);
    if (panel.hayCobertura) panel.selector.nodo.removeAttribute("hidden"); else panel.selector.nodo.setAttribute("hidden", "");
    panel.selector.botones.forEach(function (b) { b.boton.setAttribute("aria-pressed", b.modo === modo ? "true" : "false"); });
    panel.medidor.numeroNodo = d.medidor.numeroNodo || null;
    panel.medidor.valorNumero = d.medidor.valor;
    pintarMedidor(panel.medidor, d.medidor.valor, d.medidor.umbral, d.medidor.textoMarca, d.medidor.aria, d.medidor.colores, modo);
    ponerNumero(panel.medidor, modo, animar);
    pintarLinea(panel.linea, d.linea, modo);
  }

  function elegirModo(panel, modo) {
    if (panel.modo === modo) return;
    panel.modo = modo;
    aplicarModo(panel, true);
  }

  // Vuelve el selector a «Con tu cobertura» (lo usa la página cuando la persona cambia su cobertura).
  function reiniciarModo(panel) { if (panel) panel.modo = "con"; }

  // datos: { colores: { metal }, silos: [{ cultivo, h, color, etiqueta, pctTexto, toneladasTexto }], medidor: { valor, umbral, textoMarca, aria }, linea: {...} }
  function actualizarPanel(panel, datos) {
    var clave = datos.silos.map(function (s) { return s.cultivo; }).join("|");
    if (clave !== panel.clave) {
      panel.silos.forEach(liberarSilo);
      base().vaciar(panel.cuerpoSilos);
      panel.silos = datos.silos.map(function (s) {
        var silo = crearSilo(s.cultivo);
        panel.cuerpoSilos.appendChild(silo.nodo);
        return silo;
      });
      panel.clave = clave;
    }
    datos.silos.forEach(function (s, i) {
      var silo = panel.silos[i];
      base().vaciar(silo.texto);
      silo.texto.appendChild(raiz.document.createTextNode(s.toneladasTexto));
      pintarSilo(silo, s, datos.colores);
    });
    if (datos.parcela) panel.parcela.actualizar(datos.parcela);
    panel.ultimos = datos;
    panel.hayCobertura = datos.hayCobertura !== false;
    aplicarModo(panel, false);
    if (!panel.entradasListas) {
      panel.entradasListas = true;
      Array.prototype.slice.call(panel.nodo.childNodes).forEach(function (n) { entrada(n); });
    }
  }

  function redimensionarPanel(panel) {
    (panel.silos || []).forEach(function (s) {
      try { if (s.chart) s.chart.resize({ width: LADO_SILO, height: LADO_SILO }); } catch (e) { /* ya liberado */ }
    });
    if (panel.linea && panel.linea.faltaDibujar && panel.linea.pendiente) pintarLinea(panel.linea, panel.linea.pendiente);
    var me = panel.medidor;
    if (me && me.faltaDibujar && me.pendiente) dibujarAguja(me);
    try { if (me && me.chart) me.chart.resize(imprimiendo ? { width: 250, height: 115 } : undefined); } catch (e) { /* ya liberado */ }
    try { if (panel.linea && panel.linea.chart) panel.linea.chart.resize(imprimiendo ? { width: ANCHO_LINEA_IMPRESA, height: ALTO_LINEA_IMPRESA } : undefined); } catch (e) { /* ya liberado */ }
  }

  raiz.TESIS_VISUAL = {
    sinMovimiento: sinMovimiento, fijarImpresion: fijarImpresion, terminar: terminar,
    entrada: entrada, espiar: espiar, contar: contar, scrollSuave: scrollSuave, fijarScroll: fijarScroll,
    crearPanel: crearPanel, crearParcela: crearParcela, iconoCultivo: iconoCultivo, dibujoParcelaChica: dibujoParcelaChica, actualizarPanel: actualizarPanel, redimensionarPanel: redimensionarPanel, reiniciarModo: reiniciarModo, elegirModo: elegirModo,
    FORMA_SILO: FORMA_SILO, SEGMENTOS: SEGMENTOS
  };
  if (!raiz.TESIS_APP) throw new Error("campana-visual.js tiene que cargarse después de app.js");
  if (typeof module !== "undefined" && module.exports) module.exports = raiz.TESIS_VISUAL;
})(typeof window !== "undefined" ? window : globalThis);
