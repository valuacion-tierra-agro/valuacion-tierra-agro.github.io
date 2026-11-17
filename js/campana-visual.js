// Impacto visual de los resultados de «Simulá tu campaña»: silos, medidor de riesgo y recta de los seis años, más los
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

  // Silo: techo en punta y cuerpo recto (coordenadas del trazado; liquidfill lo escala).
  var FORMA_SILO = "path://M8,52 L50,8 L92,52 L92,196 L8,196 Z";
  var ANCHO_SILO = 120;
  var ALTO_SILO = 170;
  var LARGO_ARCO = Math.PI * 90;     // semicircunferencia del medidor (radio 90)
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

  function fijarImpresion(valor) {
    imprimiendo = !!valor;
    if (imprimiendo) terminar();
  }

  // ---------------------------------------------------------------------------------------
  // Silos (liquidfill de ECharts; sin él, una barra CSS que se llena igual)
  // ---------------------------------------------------------------------------------------

  function crearSilo(cultivo) {
    var ec = el("div", { "class": "sc-silo-ec" });
    var relleno = el("div", { "class": "sc-silo-relleno" });
    var caja = el("div", { "class": "sc-silo-caja", role: "img" }, [ec, el("div", { "class": "sc-silo-cuerpo" }, relleno)]);
    var texto = el("figcaption", { "class": "sc-silo-texto" });
    var nodo = el("figure", { "class": "sc-silo sc-cultivo-" + cultivo.toLowerCase().replace("í", "i"), "data-cultivo": cultivo }, [caja, texto]);
    return { nodo: nodo, caja: caja, ec: ec, relleno: relleno, texto: texto, chart: null, listo: false, cultivo: cultivo };
  }

  function opcionSilo(d, c, anim) {
    return {
      animation: anim, animationDuration: anim ? 900 : 0, animationDurationUpdate: anim ? 900 : 0, animationEasing: "cubicOut", animationEasingUpdate: "cubicOut",
      series: [{
        type: "liquidFill", data: [d.h], shape: FORMA_SILO, radius: "96%", center: ["50%", "50%"],
        color: [d.color], amplitude: anim ? 5 : 0, waveLength: "90%", period: 4200, waveAnimation: anim, direction: "right",
        phase: 0, animationDuration: anim ? 900 : 0, animationDurationUpdate: anim ? 900 : 0,
        backgroundStyle: { color: c.superficie, borderColor: c.borde, borderWidth: 0 },
        outline: { show: true, borderDistance: 0, itemStyle: { borderWidth: 3, borderColor: c.bordeFuerte, shadowBlur: 0 } },
        itemStyle: { opacity: 0.92, shadowBlur: 0 }, emphasis: { itemStyle: { opacity: 1 } },
        label: { show: false }, tooltip: { show: false }
      }]
    };
  }

  // Dibuja o actualiza un silo: la primera vez arma el gráfico; después sólo cambia el valor y ECharts anima la subida.
  function pintarSilo(silo, d, c) {
    var anim = !sinMovimiento();
    silo.caja.setAttribute("aria-label", "Silo de " + d.cultivo.toLowerCase() + ": " + d.etiqueta);
    silo.relleno.setAttribute("style", "height:" + Math.round(d.h * 100) + "%");
    var E = raiz.echarts;
    if (!E || typeof E.init !== "function") return;
    try {
      if (!silo.chart) {
        silo.chart = E.init(silo.ec, null, { renderer: "svg", width: ANCHO_SILO, height: ALTO_SILO });
        silo.listo = false;
      }
      if (!silo.listo || imprimiendo || !anim) {
        silo.chart.setOption(opcionSilo(d, c, anim), true);
        // Si liquidfill no está cargado, ECharts descarta la serie: se queda la barra CSS.
        var cargado = silo.chart.getModel && silo.chart.getModel().getSeries().length > 0;
        silo.ec.setAttribute("data-liquido", cargado ? "1" : "0");
        silo.caja.setAttribute("data-modo", cargado ? "liquido" : "barra");
        silo.listo = cargado;
        if (imprimiendo && cargado && typeof silo.chart.getZr === "function") silo.chart.getZr().refreshImmediately();
      } else {
        silo.chart.setOption({ series: [{ data: [d.h], color: [d.color] }] });
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
  // Medidor de «Riesgo que sacás» (arco SVG con la marca del umbral de la hipótesis)
  // ---------------------------------------------------------------------------------------

  function svg(tag, atributos) {
    var n = raiz.document.createElementNS(NS, tag);
    Object.keys(atributos || {}).forEach(function (k) { n.setAttribute(k, atributos[k]); });
    return n;
  }

  function punto(f, radio) {
    var ang = Math.PI * (1 - f);
    return { x: 110 + radio * Math.cos(ang), y: 120 - radio * Math.sin(ang) };
  }

  function crearMedidor() {
    var arco = "M20,120 A90,90 0 0 1 200,120";
    var pista = svg("path", { d: arco, "class": "sc-medidor-pista", fill: "none" });
    var valor = svg("path", { d: arco, "class": "sc-medidor-valor", fill: "none", "stroke-dasharray": String(LARGO_ARCO), "stroke-dashoffset": String(LARGO_ARCO) });
    var marca = svg("line", { "class": "sc-medidor-marca" });
    var rotulo = svg("text", { "class": "sc-medidor-rotulo", "text-anchor": "middle" });
    var cero = svg("text", { "class": "sc-medidor-extremo", x: "20", y: "140", "text-anchor": "middle" });
    cero.textContent = "0 %";
    var cien = svg("text", { "class": "sc-medidor-extremo", x: "200", y: "140", "text-anchor": "middle" });
    cien.textContent = "100 %";
    var dibujo = svg("svg", { viewBox: "0 -14 220 164", "class": "sc-medidor-svg", "aria-hidden": "true", focusable: "false" });
    [pista, valor, marca, rotulo, cero, cien].forEach(function (n) { dibujo.appendChild(n); });
    var numero = el("p", { "class": "sc-medidor-numero" });
    var caja = el("div", { "class": "sc-medidor", role: "img" }, [dibujo, numero]);
    return { nodo: caja, valor: valor, marca: marca, rotulo: rotulo, numero: numero, listo: false };
  }

  // valor: reducción del desvío (0 a 1, o null si no se puede calcular); umbral: la marca de la hipótesis (0 a 1).
  function pintarMedidor(m, valor, umbral, textoMarca, ariaLabel) {
    var a = punto(umbral, 76), b = punto(umbral, 104), t = punto(umbral, 116);
    m.marca.setAttribute("x1", a.x.toFixed(1)); m.marca.setAttribute("y1", a.y.toFixed(1));
    m.marca.setAttribute("x2", b.x.toFixed(1)); m.marca.setAttribute("y2", b.y.toFixed(1));
    m.rotulo.setAttribute("x", t.x.toFixed(1)); m.rotulo.setAttribute("y", (t.y - 2).toFixed(1));
    m.rotulo.textContent = textoMarca;
    m.nodo.setAttribute("aria-label", ariaLabel);
    var f = typeof valor === "number" && isFinite(valor) ? Math.max(0, Math.min(1, valor)) : 0;
    var final = String(LARGO_ARCO * (1 - f));
    // La primera vez el arco parte vacío y se llena (la transición está en el CSS y se apaga con «menos movimiento»).
    if (!m.listo && !sinMovimiento() && typeof raiz.requestAnimationFrame === "function") {
      m.listo = true;
      raiz.requestAnimationFrame(function () { raiz.requestAnimationFrame(function () { m.valor.setAttribute("stroke-dashoffset", final); }); });
    } else {
      m.listo = true;
      m.valor.setAttribute("stroke-dashoffset", final);
    }
  }

  // ---------------------------------------------------------------------------------------
  // Los seis años como puntos sobre una recta
  // ---------------------------------------------------------------------------------------

  function crearRecta() {
    var linea = el("div", { "class": "sc-recta-linea" });
    var puntos = el("div", { "class": "sc-recta-puntos" });
    var nodo = el("div", { "class": "sc-recta", role: "img" }, [linea, puntos]);
    var leyenda = el("ul", { "class": "sc-recta-leyenda" }, [
      el("li", null, [el("span", { "class": "sc-muestra-punto", "aria-hidden": "true" }), "Con tu cobertura"]),
      el("li", null, [el("span", { "class": "sc-muestra-punto sc-muestra-sin", "aria-hidden": "true" }), "Sin cubrirte"])
    ]);
    var extremos = el("p", { "class": "sc-recta-extremos", "aria-hidden": "true" }, [el("span", null, "Menos resultado"), el("span", null, "Más resultado")]);
    return { nodo: nodo, puntos: puntos, leyenda: leyenda, extremos: extremos, items: [] };
  }

  // d: { campanas, con: [0..1], sin: [0..1], peor: índice, mejor: índice, aria } (posiciones ya escaladas, iguales en toda la recta)
  function pintarRecta(r, d) {
    r.nodo.setAttribute("aria-label", d.aria);
    if (r.items.length !== d.campanas.length) {
      base().vaciar(r.puntos);
      r.items = d.campanas.map(function (campana) {
        var sin = el("span", { "class": "sc-punto-sin", title: campana + ", sin cubrirte" });
        var etiqueta = el("span", { "class": "sc-punto-etiqueta" });
        var con = el("span", { "class": "sc-punto-con", title: campana }, etiqueta);
        r.puntos.appendChild(sin);
        r.puntos.appendChild(con);
        return { sin: sin, con: con, etiqueta: etiqueta };
      });
    }
    d.campanas.forEach(function (campana, i) {
      var it = r.items[i];
      it.sin.setAttribute("style", "left:" + (d.sin[i] * 100).toFixed(2) + "%");
      it.con.setAttribute("style", "left:" + (d.con[i] * 100).toFixed(2) + "%");
      var rol = i === d.peor ? "peor" : i === d.mejor ? "mejor" : "";
      // «Peor» va arriba de la recta y «Mejor» abajo (nunca a la misma altura), y el punto de más a la izquierda lleva su etiqueta hacia la
      // izquierda y el otro hacia la derecha: aunque los puntos estén pegados, las etiquetas no se pisan.
      var otro = i === d.peor ? d.mejor : d.peor;
      var aLaIzquierda = d.con[i] < d.con[otro] || (d.con[i] === d.con[otro] && rol === "peor");
      var lado = rol ? (aLaIzquierda ? " sc-punto-izq" : " sc-punto-der") : "";
      it.con.setAttribute("class", "sc-punto-con" + (rol ? " sc-punto-" + rol + lado : ""));
      it.con.setAttribute("title", campana + ": " + d.textos[i]);
      it.etiqueta.textContent = rol ? (rol === "peor" ? "Peor: " : "Mejor: ") + campana : "";
    });
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
    silos.cuerpo.setAttribute("class", "sc-visual-cuerpo sc-silos");
    var medidor = bloque("sc-bloque-medidor", "Riesgo que sacás");
    var m = crearMedidor();
    medidor.cuerpo.appendChild(m.nodo);
    var recta = bloque("sc-bloque-recta", "Tus seis años de la tesis");
    var r = crearRecta();
    [r.nodo, r.extremos, r.leyenda].forEach(function (n) { recta.cuerpo.appendChild(n); });
    var nodo = el("div", { "class": "sc-visual", id: "sc-visual" }, [silos.nodo, medidor.nodo, recta.nodo]);
    var panel = { nodo: nodo, silos: [], medidor: m, recta: r, frases: { silos: silos.frase, medidor: medidor.frase, recta: recta.frase },
      cuerpoSilos: silos.cuerpo, clave: "", entradasListas: false };
    return panel;
  }

  // datos: { colores: { superficie, borde, bordeFuerte }, silos: [{ cultivo, h, color, etiqueta }], medidor: { valor, umbral, textoMarca, aria }, recta: {...} }
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
      silo.texto.textContent = s.cultivo + " · " + s.etiqueta;
      pintarSilo(silo, s, datos.colores);
    });
    pintarMedidor(panel.medidor, datos.medidor.valor, datos.medidor.umbral, datos.medidor.textoMarca, datos.medidor.aria);
    pintarRecta(panel.recta, datos.recta);
    if (!panel.entradasListas) {
      panel.entradasListas = true;
      Array.prototype.slice.call(panel.nodo.childNodes).forEach(function (n) { entrada(n); });
    }
  }

  function redimensionarPanel(panel) {
    (panel.silos || []).forEach(function (s) {
      try { if (s.chart) s.chart.resize({ width: ANCHO_SILO, height: ALTO_SILO }); } catch (e) { /* ya liberado */ }
    });
  }

  raiz.TESIS_VISUAL = {
    sinMovimiento: sinMovimiento, fijarImpresion: fijarImpresion, terminar: terminar,
    entrada: entrada, contar: contar, scrollSuave: scrollSuave,
    crearPanel: crearPanel, actualizarPanel: actualizarPanel, redimensionarPanel: redimensionarPanel,
    FORMA_SILO: FORMA_SILO, LARGO_ARCO: LARGO_ARCO
  };
  if (!raiz.TESIS_APP) throw new Error("campana-visual.js tiene que cargarse después de app.js");
  if (typeof module !== "undefined" && module.exports) module.exports = raiz.TESIS_VISUAL;
})(typeof window !== "undefined" ? window : globalThis);
