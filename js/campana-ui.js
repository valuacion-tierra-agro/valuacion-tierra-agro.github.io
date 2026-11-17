// Sección 1 · «Simulá tu campaña»: un asistente por pasos y, recién después de cargar los datos, los resultados.
// El cálculo está en js/campana.js (TESIS_CAMPANA), sin DOM; acá sólo se arma la pantalla.
// Mismo contrato de DOM que app.js (createElement, setAttribute, textContent, value, addEventListener, hidden; nunca HTML en texto).
// Los gráficos (torta, comparación y escenarios) los dibuja Apache ECharts (vendor/echarts) si está cargado; si no,
// la página igual muestra todas las cifras en tablas y texto. El estado de esta sección es privado: no toca TESIS_APP.estado.
(function (raiz) {
  "use strict";

  var CAMPOS_POR_CULTIVO = ["ha", "rinde", "cd", "cc", "gc"];
  var HECTAREAS_INICIALES = { Soja: 600, "Maíz": 400, Trigo: 300 };   // sólo para completar un link de escenario incompleto
  var PARTES_INICIALES = ["Soja", "Maíz"];
  var PASOS = 4;
  var TITULOS_PASO = ["Tu zona", "Qué sembrás", "Tu rinde esperado", "¿Hoy usás futuros?"];
  var PROPORCIONES_SI = [0.25, 0.5, 0.75, 1];
  var CAMPANA_FRIA = "2021/22";   // un año de precios en baja de lo cobrado (para la frase de riesgo)
  var CAMPANA_CALIDA = "2023/24";
  var MENOS = "−";
  var CLAVE_INFORME = "simulador-tesis:informe"; // nombres del informe: sólo en este navegador
  var MAX_NOMBRE = 60;
  var ANCHO_IMPRESION = 340;   // px de cada gráfico en la hoja A4 (dos por renglón)
  var ALTO_IMPRESION = 185;
  // Colores de los gráficos en papel blanco: fijos y oscuros, aunque la pantalla sea oscura. Son los mismos valores que
  // redefine el :root de @media print en css/estilos.css (más el fondo y las capas que usan el aviso flotante y la leyenda).
  var PALETA_IMPRESION = {
    "color-texto": "#161616", "color-texto-suave": "#525252", "color-borde": "#c6c6c6", "color-borde-fuerte": "#8d8d8d",
    "color-fondo": "#ffffff", "color-superficie": "#ffffff", "color-superficie-2": "#f4f4f4",
    "color-trigo": "#8e6a00", "color-soja": "#007d79", "color-maiz": "#ba4e00",
    "color-sin": "#8e6a00", "color-acento": "#0f62fe", "color-con": "#005d5d"
  };

  // estado: { paso, cargado, zona, cultivos: [..], usaFuturos: null|true|false, h (la del asistente: { cultivo: proporción cubierta }),
  //   hVer (la que se mira en los resultados, también por cultivo), rindeModo: { cultivo: "zona"|"propio" }, rindeQq: { cultivo: texto en qq/ha },
  //   textos: { cultivo: { ha, rinde (t/ha), cd, cc, gc } }, v, defs, vDef }
  var estado = null;
  var nodos = {};        // nodos fijos de la pantalla
  var graficos = {};     // instancias de ECharts
  var ultimaVista = null;
  var nombres = { campo: "", persona: "" };  // texto libre del informe; nunca sale del navegador
  var imprimiendo = false;

  function base() { return raiz.TESIS_APP; }
  function C() { return raiz.TESIS_CAMPANA; }
  function el(e, a, c) { return base().el(e, a, c); }
  function num(v, f, o) { return base().numero(v, f, o); }
  function fm() { return base().formato; }
  function V() { return raiz.TESIS_VISUAL || null; }
  // Número grande que cuenta hasta su valor (si falta countUp.js o se pidió menos movimiento, es el mismo número, quieto).
  function numA(clave, valor, formato, origen) {
    var nodo = num(valor, formato, origen);
    return V() ? V().contar(nodo, clave, valor, function (n) { return fm().aplicar(formato, n); }) : nodo;
  }

  function coma(n, decimales) {
    var d = Math.pow(10, decimales);
    return String(Math.round(n * d) / d).replace(".", ",");
  }

  function nombreCortoCultivo(c) { return c.toLowerCase().replace("í", "i"); }
  function idCampo(cultivo, campo) { return "sc-" + nombreCortoCultivo(cultivo) + "-" + campo; }
  function pct(h) { return Math.round(h * 100) + " %"; }

  // ---------------------------------------------------------------------------------------
  // Estado
  // ---------------------------------------------------------------------------------------

  // Valores por defecto de una zona: lo que se muestra (texto redondeado) y el valor exacto con su origen.
  function defectosDeZona(zona) {
    var defs = {};
    C().cultivosDeZona(null, zona).forEach(function (cultivo) { defs[cultivo] = C().porDefecto(null, cultivo, zona); });
    return { defs: defs, v: C().valorTierraDe(null, zona) };
  }

  function textosPorDefecto(d, ha) {
    return { ha: ha, rinde: coma(d.rinde, 2), cd: coma(d.cd, 0), cc: coma(d.cc, 1), gc: coma(d.gc, 1) };
  }


  // Estado de una zona. `previo` conserva cultivos, hectáreas y respuestas. `conEjemplo` pone cultivos y hectáreas de ejemplo
  // (sólo para abrir un link de escenario incompleto: el asistente arranca vacío).
  function estadoNuevo(zona, previo, conEjemplo) {
    var dz = defectosDeZona(zona);
    var disponibles = Object.keys(dz.defs);
    var cultivos = previo ? previo.cultivos.filter(function (c) { return disponibles.indexOf(c) >= 0; }) : [];
    if (!cultivos.length && conEjemplo) cultivos = PARTES_INICIALES.filter(function (c) { return disponibles.indexOf(c) >= 0; });
    if (!cultivos.length && conEjemplo) cultivos = disponibles.slice(0, 1);
    var textos = {};
    disponibles.forEach(function (c) {
      var ha = previo && previo.textos[c] ? previo.textos[c].ha : (conEjemplo ? String(HECTAREAS_INICIALES[c]) : "");
      textos[c] = textosPorDefecto(dz.defs[c], ha);
    });
    var rindeModo = {}, rindeQq = {};
    disponibles.forEach(function (c) {
      rindeModo[c] = previo && previo.rindeModo && previo.rindeModo[c] === "propio" ? "propio" : "zona";
      rindeQq[c] = rindeModo[c] === "propio" && previo.rindeQq[c] !== undefined ? previo.rindeQq[c] : coma(dz.defs[c].rinde * 10, 1);
    });
    return {
      paso: previo ? previo.paso : 1, cargado: false, zona: zona, cultivos: cultivos,
      usaFuturos: previo ? previo.usaFuturos : null, h: previo ? Object.assign({}, previo.h) : {}, hVer: previo ? Object.assign({}, previo.hVer) : {},
      rindeModo: rindeModo, rindeQq: rindeQq,
      textos: textos, v: coma(dz.v.v, 0), defs: dz.defs, vDef: dz.v
    };
  }

  // Estado antes de elegir la zona: nada cargado.
  function estadoVacio() {
    return { paso: 1, cargado: false, zona: null, cultivos: [], usaFuturos: null, h: {}, hVer: {}, rindeModo: {}, rindeQq: {}, textos: {}, v: "", defs: {}, vDef: null };
  }

  // --- Proporción cubierta por cultivo ---
  // Una proporción por cultivo elegido ({ Soja: 0.5, Trigo: 0 }); lo que no está se toma como no cubierto.
  function hDe(origen, cultivos) {
    var o = {};
    (cultivos || estado.cultivos).forEach(function (c) { o[c] = origen && origen[c] ? origen[c] : 0; });
    return o;
  }

  function hUniforme(hp) {
    var claves = Object.keys(hp);
    var primero = claves.length ? hp[claves[0]] : 0;
    return claves.every(function (c) { return hp[c] === primero; }) ? primero : null;
  }

  function hayCobertura(hp) { return Object.keys(hp).some(function (c) { return hp[c] > 0; }); }

  // «50 %» si es la misma para todos; si no, «soja 50 %, maíz 0 %».
  function textoH(hp) {
    var u = hUniforme(hp);
    if (u !== null) return pct(u);
    return Object.keys(hp).map(function (c) { return c.toLowerCase() + " " + pct(hp[c]); }).join(", ");
  }

  // Un campo está «tocado» si su texto ya no es el que se mostró por defecto.
  function tocadoCampo(cultivo, campo) {
    var d = estado.defs[cultivo];
    var def = textosPorDefecto(d, estado.textos[cultivo].ha)[campo];
    return estado.textos[cultivo][campo] !== def;
  }

  function valorPorDefecto(cultivo, campo) {
    return estado.defs[cultivo][campo];
  }

  // El F27 de un cultivo (contrato fijo de su mes de cosecha): sale de la tabla de cotizaciones de campana.js, nunca lo carga el productor.
  function futuroDe(cultivo) {
    return C().futuro2627(null, cultivo, estado.zona);
  }

  function comisionFija() { return C().comisionPorDefecto(); }

  // Entradas para el cálculo: lo que no se tocó va con su valor exacto (no el redondeado de la pantalla).
  function textosParaCalcular() {
    var t = { zona: estado.zona, h: hDe(estado.h), comision: comisionFija().valor * 100, v: estado.v, cultivos: {} };
    if (estado.vDef && estado.v === coma(estado.vDef.v, 0)) t.v = estado.vDef.v;
    estado.cultivos.forEach(function (c) {
      var f = { f27: futuroDe(c).valor };
      CAMPOS_POR_CULTIVO.forEach(function (campo) {
        var texto = estado.textos[c][campo];
        if (campo === "ha") f.ha = texto;
        else if (campo === "cc") f.cc = tocadoCampo(c, "cc") ? texto : "";
        else if (campo === "rinde") f.rinde = estado.rindeModo[c] === "propio" && tocadoCampo(c, "rinde") ? texto : valorPorDefecto(c, "rinde");
        else f[campo] = tocadoCampo(c, campo) ? texto : valorPorDefecto(c, campo);
      });
      t.cultivos[c] = f;
    });
    return t;
  }

  // Qué ve el resto de la página de esta campaña (zona y cultivos del productor), o null si todavía no cargó datos.
  function contexto() {
    if (!estado || !estado.cargado || !ultimaVista) return null;
    var vista = ultimaVista;
    return { zona: vista.zona, cultivos: vista.nombres.slice(), hectareas: vista.hectareasTotales, h: hDe(estado.h),
      rSinCobertura: vista.resultados[0].r, rHoy: C().evaluar(vista, hDe(estado.h, vista.nombres)).resultado.r, v: vista.v };
  }

  // ---------------------------------------------------------------------------------------
  // Asistente de carga (4 pasos)
  // ---------------------------------------------------------------------------------------

  var ETIQUETAS = {
    ha: ["Hectáreas", "ha"], rinde: ["Rinde esperado", "t/ha"], qq: ["Rinde esperado", "qq/ha"],
    cd: ["Costos directos", "USD/ha"], cc: ["Costo de cosecha", "USD/ha"], gc: ["Gastos de comercialización", "USD/t"]
  };
  var FORMATO_NOTA = { rinde: "usd2", cd: "usd", cc: "usd2", gc: "usd2" };

  function crearCampo(id, etiqueta, unidad, alCambiar) {
    var input = el("input", { type: "text", inputmode: "decimal", id: id, autocomplete: "off", spellcheck: "false" });
    var nota = el("p", { "class": "sc-nota", id: id + "-nota" });
    var error = el("p", { "class": "mc-error", id: id + "-error", role: "alert" });
    error.hidden = true;
    input.setAttribute("aria-describedby", id + "-nota " + id + "-error");
    input.addEventListener("input", function () { alCambiar(input.value); });
    var contenedor = el("div", { "class": "sc-campo" }, [
      el("label", { "for": id }, etiqueta),
      el("div", { "class": "sc-campo-fila" }, [input, el("span", { "class": "sc-unidad" }, unidad)]),
      nota, error
    ]);
    return { contenedor: contenedor, input: input, nota: nota, error: error };
  }

  function nodoDeZona(zona) {
    var d = C().detalleDeZona(zona);
    var b = el("button", { type: "button", "class": "sc-zona-tarjeta", "aria-pressed": "false", "data-zona": zona }, [
      el("span", { "class": "sc-zona-nombre" }, zona),
      el("span", { "class": "sc-zona-detalle" }, d.linea === zona ? "" : d.linea)
    ]);
    b.addEventListener("click", function () { elegirZona(zona); });
    return b;
  }

  function elegirZona(zona) {
    estado = estadoNuevo(zona, estado.zona ? estado : Object.assign(estadoVacio(), { paso: estado.paso, usaFuturos: estado.usaFuturos, h: estado.h, hVer: estado.hVer }));
    nodos.errorPaso.hidden = true;
    sincronizarTodo();
  }

  function alternarCultivo(cultivo) {
    if (!estado.zona) return;
    var i = estado.cultivos.indexOf(cultivo);
    if (i >= 0) estado.cultivos.splice(i, 1);
    else estado.cultivos.push(cultivo);
    estado.cultivos = C().CULTIVOS.filter(function (c) { return estado.cultivos.indexOf(c) >= 0; });
    sincronizarTodo();
  }

  function montarPasoZona(cont) {
    cont.appendChild(el("h3", null, "¿En qué zona está tu campo?"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, "Elegí la zona más parecida a la tuya. De ella tomamos los rindes, los costos y el valor de la tierra de referencia. Las zonas son las 8 que estudia la tesis."));
    nodos.tarjetasZona = {};
    var grilla = el("div", { "class": "sc-zonas", role: "group", "aria-label": "Zonas" });
    C().zonas().forEach(function (z) { nodos.tarjetasZona[z] = nodoDeZona(z); grilla.appendChild(nodos.tarjetasZona[z]); });
    cont.appendChild(grilla);
  }

  function montarPasoCultivos(cont) {
    cont.appendChild(el("h3", null, "¿Qué sembrás?"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, "Tocá los cultivos de esta campaña (los que la tesis tiene para tu zona) y escribí cuántas hectáreas le dedicás a cada uno."));
    cont.appendChild(el("p", { "class": "sc-nota sc-tope-ha", id: "sc-tope-ha" }, "Este simulador está pensado para pequeños y medianos productores: campos de hasta " + fmMiles(C().HECTAREAS_MAX_TOTAL) + " hectáreas en total, el tamaño de productor que estudia la tesis."));
    nodos.contadorHa = el("p", { "class": "sc-nota sc-contador-ha", id: "sc-contador-ha", "aria-live": "polite" });
    cont.appendChild(nodos.contadorHa);
    cont.appendChild(el("p", { "class": "sc-nota sc-explica-fechas", id: "sc-explica-fechas" }, "Usamos las fechas típicas de cada cultivo en la Región Pampeana, las mismas de la tesis. Cubrirte es vender hoy un contrato que vence cuando cosechás. Así, el precio que fijás hoy es el que vas a cobrar en ese momento."));
    nodos.chips = {};
    var fila = el("div", { "class": "sc-chips", role: "group", "aria-label": "Cultivos" });
    C().CULTIVOS.forEach(function (cultivo) {
      var chip = el("button", { type: "button", "class": "sc-chip", "aria-pressed": "false", "data-cultivo": cultivo }, cultivo);
      chip.addEventListener("click", function () { alternarCultivo(cultivo); });
      nodos.chips[cultivo] = chip;
      fila.appendChild(chip);
    });
    cont.appendChild(fila);
    nodos.avisoSinZona = el("p", { "class": "sc-nota" }, "Primero elegí tu zona en el paso 1.");
    cont.appendChild(nodos.avisoSinZona);
    nodos.campos = {};
    nodos.bloquesHa = {};
    nodos.calendario = {};
    C().CULTIVOS.forEach(function (cultivo) {
      var campoHa = crearCampo(idCampo(cultivo, "ha"), "Hectáreas de " + cultivo.toLowerCase(), "ha", function (valor) { estado.textos[cultivo].ha = valor; pintarContadorHa(); revalidarSiHayError(); });
      nodos.campos[cultivo] = { ha: campoHa };
      var nota = el("p", { "class": "sc-nota", id: idCampo(cultivo, "calendario-nota") });
      nodos.calendario[cultivo] = { nota: nota };
      var cal = el("div", { "class": "sc-calendario-carga" }, [
        el("p", { "class": "sc-titulo-grupo" }, "Fechas de la tesis para " + cultivo.toLowerCase()),
        nota]);
      var bloque = el("fieldset", { "class": "sc-cultivo", "data-cultivo": cultivo }, [el("legend", null, cultivo), campoHa.contenedor, cal]);
      nodos.bloquesHa[cultivo] = bloque;
      cont.appendChild(bloque);
    });
  }

  function fmMiles(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  // Hectáreas cargadas hoy (suma de los cultivos elegidos; lo que no es un número entero cuenta como 0).
  function hectareasCargadas() {
    return estado.cultivos.reduce(function (s, c) { return s + haDe(c); }, 0);
  }

  // Hectáreas válidas escritas para un cultivo (0 si el texto no es un entero válido).
  function haDe(c) {
    var t = String(estado.textos[c] ? estado.textos[c].ha : "").trim();
    return /^\d+$/.test(t) ? Number(t) : /^\d{1,3}(\.\d{3})+$/.test(t) ? Number(t.replace(/\./g, "")) : 0;
  }

  // Nota bajo las hectáreas de un cultivo: cuánto puede poner sin pasar el tope total de la tesis (1.000 ha).
  function notaHectareas(c) {
    var tope = C().HECTAREAS_MAX_TOTAL, total = hectareasCargadas();
    var libre = Math.max(0, tope - (total - haDe(c)));
    return total > tope
      ? "Te pasaste del máximo: en este cultivo podés poner hasta " + fmMiles(libre) + " ha (el campo suma " + fmMiles(tope) + " ha como máximo)."
      : "Número entero, hasta " + fmMiles(libre) + " ha en este cultivo (entre todos los cultivos, " + fmMiles(tope) + " ha como máximo).";
  }

  function pintarContadorHa() {
    if (!nodos.contadorHa || !estado) return;
    var tope = C().HECTAREAS_MAX_TOTAL, n = hectareasCargadas();
    nodos.contadorHa.textContent = "Llevás " + fmMiles(n) + " de " + fmMiles(tope) + " hectáreas." +
      (n > tope ? " Te pasás por " + fmMiles(n - tope) + ": bajá algún cultivo para poder seguir." : "");
    nodos.contadorHa.setAttribute("data-excedido", n > tope ? "true" : "false");
  }

  // Fechas fijas de la tesis de un cultivo (sólo lectura): siembra, cosecha y el contrato que corresponde.
  function pintarCalendario(cultivo) {
    var n = nodos.calendario[cultivo];
    if (!n || !estado.zona) return;
    var f = futuroDe(cultivo), cal = C().CALENDARIO[cultivo];
    n.nota.textContent = "Siembra en " + textoMes(cal.siembra) + ", cosecha en " + textoMes(cal.cosecha) + ". Contrato " + f.contrato + ", que vence en " + textoMes(f.mesUsado) + " de 2027.";
  }

  function montarPasoRinde(cont) {
    cont.appendChild(el("h3", null, "¿Cuánto rinde tu campo?"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, "El rinde es cuántos quintales (qq) cosechás por hectárea; 10 qq equivalen a 1 tonelada. Si no lo sabés con precisión, usamos el rinde típico de tu zona."));
    nodos.bloquesRinde = {};
    nodos.rinde = {};
    C().CULTIVOS.forEach(function (cultivo) {
      var campoQ = crearCampo(idCampo(cultivo, "rinde-qq"), "Tu rinde esperado de " + cultivo.toLowerCase(), "qq/ha", function (valor) {
        estado.rindeQq[cultivo] = valor;
        var n = C().leerDecimal(valor);
        estado.textos[cultivo].rinde = n === null ? "?" : coma(n / 10, 6);
        revalidarSiHayError();
      });
      nodos.campos[cultivo].rinde = campoQ;
      var botones = {};
      var fila = el("div", { "class": "sc-chips", role: "group", "aria-label": "¿Sabés cuánto rinde tu campo? " + cultivo });
      [["zona", "Usar el rinde típico de mi zona"], ["propio", "Lo sé, lo cargo yo"]].forEach(function (par) {
        var b = el("button", { type: "button", "class": "sc-chip", "aria-pressed": "false", id: idCampo(cultivo, "rinde-" + par[0]) }, par[1]);
        b.addEventListener("click", function () { elegirModoRinde(cultivo, par[0]); });
        botones[par[0]] = b;
        fila.appendChild(b);
      });
      var ref = el("p", { "class": "sc-rinde-ref", id: idCampo(cultivo, "rinde-ref") });
      var hist = el("p", { "class": "sc-nota", id: idCampo(cultivo, "rinde-hist") });
      var bloqueZona = el("div", { "class": "sc-rinde-zona" }, [ref, hist]);
      nodos.rinde[cultivo] = { botones: botones, ref: ref, hist: hist, zona: bloqueZona, propio: campoQ.contenedor };
      var bloque = el("fieldset", { "class": "sc-cultivo", "data-cultivo": cultivo }, [el("legend", null, cultivo),
        el("p", { "class": "sc-titulo-grupo" }, "¿Sabés cuánto rinde tu campo?"), fila, bloqueZona, campoQ.contenedor]);
      nodos.bloquesRinde[cultivo] = bloque;
      cont.appendChild(bloque);
    });
  }

  // Cambia entre «el típico de mi zona» y «lo cargo yo». Al volver a la zona se descarta lo escrito.
  function elegirModoRinde(cultivo, modo) {
    var d = estado.defs[cultivo];
    estado.rindeModo[cultivo] = modo;
    if (modo === "zona") {
      estado.textos[cultivo].rinde = coma(d.rinde, 2);
      estado.rindeQq[cultivo] = coma(d.rinde * 10, 1);
    }
    sincronizarRinde(cultivo);
    pintarNotas();
    revalidarSiHayError();
  }

  function sincronizarRinde(cultivo) {
    var n = nodos.rinde[cultivo];
    var propio = estado.rindeModo[cultivo] === "propio";
    n.botones.zona.setAttribute("aria-pressed", propio ? "false" : "true");
    n.botones.propio.setAttribute("aria-pressed", propio ? "true" : "false");
    n.zona.hidden = propio;
    n.propio.hidden = !propio;
    nodos.campos[cultivo].rinde.input.value = estado.rindeQq[cultivo];
  }

  // Referencia de la zona y, si los datos la tienen, la línea histórica del rinde real (sale de TESIS_DATOS: nada inventado).
  function pintarReferenciaRinde(cultivo) {
    var n = nodos.rinde[cultivo];
    var d = estado.defs[cultivo];
    base().vaciar(n.ref);
    n.ref.appendChild(raiz.document.createTextNode("Rinde típico de tu zona (campaña " + d.campana + "): "));
    n.ref.appendChild(el("strong", null, [num(d.rinde * 10, "rinde", d.origen.rinde), " qq/ha"]));
    n.ref.appendChild(el("small", { "class": "sc-rinde-t" }, " (" + coma(d.rinde, 2) + " t/ha)"));
    base().vaciar(n.hist);
    var h = C().rindeHistorico(null, cultivo, estado.zona);
    n.hist.hidden = !h;
    if (!h) return;
    [ "En las últimas " + h.campanas + " campañas, " + cultivo.toLowerCase() + " en tu zona rindió entre ", num(h.min, "rinde", h.origenMin), " y ", num(h.max, "rinde", h.origenMax), " qq/ha." ]
      .forEach(function (p) { n.hist.appendChild(typeof p === "string" ? raiz.document.createTextNode(p) : p); });
  }

  function montarPasoFuturos(cont) {
    cont.appendChild(el("h3", null, "¿Hoy usás futuros?"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, "Un futuro es un contrato para fijar hoy el precio al que vas a vender la cosecha. Así sabés cuánto vas a cobrar aunque el mercado se mueva. ¿Cubriste (o pensás cubrir) tu cosecha con futuros?"));
    nodos.botonesFuturos = {};
    var fila = el("div", { "class": "sc-chips", role: "group", "aria-label": "¿Usás futuros?" });
    [["Sí", true], ["No", false]].forEach(function (par) {
      var b = el("button", { type: "button", "class": "sc-chip", "aria-pressed": "false", id: par[1] ? "sc-futuros-si" : "sc-futuros-no" }, par[0]);
      b.addEventListener("click", function () {
        estado.usaFuturos = par[1];
        if (par[1] && !hayCobertura(hDe(estado.h))) estado.cultivos.forEach(function (c) { estado.h[c] = 0.5; });
        if (!par[1]) estado.h = {};
        estado.hVer = hDe(estado.h);
        nodos.errorPaso.hidden = true;
        sincronizarFuturos();
      });
      nodos.botonesFuturos[par[0]] = b;
      fila.appendChild(b);
    });
    cont.appendChild(fila);
    // Un desplegable por cultivo (sólo se ven los de los cultivos elegidos): «No lo cubro», 25, 50, 75 o 100 %.
    nodos.selectH = {};
    nodos.camposH = {};
    var hijosH = [el("p", { "class": "sc-nota" }, "Elegí qué parte de la cosecha de cada cultivo cubrís (la proporción de las toneladas que esperás cosechar que vendés hoy a futuro).")];
    C().CULTIVOS.forEach(function (cultivo) {
      var sel = el("select", { id: idCampo(cultivo, "h") },
        [el("option", { value: "0" }, "No lo cubro")].concat(PROPORCIONES_SI.map(function (h) { return el("option", { value: String(Math.round(h * 100)) }, pct(h)); })));
      sel.addEventListener("change", function () { estado.h[cultivo] = Number(sel.value) / 100; estado.hVer = hDe(estado.h); });
      var campo = el("div", { "class": "sc-campo", "data-cultivo": cultivo }, [el("label", { "for": idCampo(cultivo, "h") }, "¿Qué parte de tu " + cultivo.toLowerCase() + " cubrís?"), sel]);
      nodos.selectH[cultivo] = sel;
      nodos.camposH[cultivo] = campo;
      hijosH.push(campo);
    });
    nodos.bloqueH = el("div", { "class": "sc-bloque-h", id: "sc-bloque-h" }, hijosH);
    cont.appendChild(nodos.bloqueH);
    nodos.notaNo = el("p", { "class": "sc-nota" }, "Perfecto: vamos a mostrarte qué pasaría si cubrieras, sin pedirte nada más sobre futuros.");
    cont.appendChild(nodos.notaNo);

    // Opciones avanzadas (plegadas): costos y valor de la tierra. Los precios futuros y la comisión no los carga el productor.
    nodos.v = crearCampo("sc-v", "Valor de la tierra", "USD/ha", function (valor) { estado.v = valor; revalidarSiHayError(); });
    nodos.bloquesAvanzados = {};
    var detalles = el("details", { "class": "sc-avanzado", id: "sc-avanzadas" }, [el("summary", null, "Opciones avanzadas"),
      el("p", { "class": "sc-nota" }, "Costos directos, costo de cosecha, gastos de comercialización y valor de la tierra. Por defecto, los últimos de tu zona según la tesis. La comisión de la cobertura es fija: 0,5 % del valor del contrato, como en la tesis.")]);
    C().CULTIVOS.forEach(function (cultivo) {
      var bloque = el("fieldset", { "class": "sc-cultivo", "data-cultivo": cultivo }, [el("legend", null, cultivo)]);
      ["cd", "cc", "gc"].forEach(function (campo) {
        var c = crearCampo(idCampo(cultivo, campo), ETIQUETAS[campo][0], ETIQUETAS[campo][1], function (valor) { estado.textos[cultivo][campo] = valor; revalidarSiHayError(); });
        nodos.campos[cultivo][campo] = c;
        bloque.appendChild(c.contenedor);
      });
      nodos.bloquesAvanzados[cultivo] = bloque;
      detalles.appendChild(bloque);
    });
    detalles.appendChild(nodos.v.contenedor);
    cont.appendChild(detalles);

    // Nombres (opcionales, sólo para el encabezado del informe; no salen del navegador).
    var campoNombre = crearCampo("sc-nombre-campo", "Nombre del campo (opcional)", "", function (valor) { nombres.campo = recortar(valor); guardarNombres(); pintarEncabezado(); });
    var campoPersona = crearCampo("sc-nombre-persona", "Tu nombre (opcional)", "", function (valor) { nombres.persona = recortar(valor); guardarNombres(); pintarEncabezado(); });
    [campoNombre, campoPersona].forEach(function (c) {
      c.input.setAttribute("inputmode", "text");
      c.input.setAttribute("maxlength", String(MAX_NOMBRE));
      c.nota.textContent = "Hasta " + MAX_NOMBRE + " caracteres.";
    });
    nodos.nombreCampo = campoNombre;
    nodos.nombrePersona = campoPersona;
    cont.appendChild(el("div", { "class": "sc-personalizar" }, [el("p", { "class": "sc-titulo-grupo" }, "Para personalizar tu informe"),
      el("p", { "class": "sc-nota" }, "Aparecen en el encabezado del informe y de la hoja impresa. Se guardan sólo en este navegador: no van en el link para compartir ni salen de tu computadora."),
      campoNombre.contenedor, campoPersona.contenedor]));
  }

  function sincronizarFuturos() {
    nodos.botonesFuturos["Sí"].setAttribute("aria-pressed", estado.usaFuturos === true ? "true" : "false");
    nodos.botonesFuturos["No"].setAttribute("aria-pressed", estado.usaFuturos === false ? "true" : "false");
    nodos.bloqueH.hidden = estado.usaFuturos !== true;
    nodos.notaNo.hidden = estado.usaFuturos !== false;
    C().CULTIVOS.forEach(function (c) {
      nodos.camposH[c].hidden = estado.cultivos.indexOf(c) < 0;
      nodos.selectH[c].value = String(Math.round((estado.h[c] || 0) * 100));
    });
  }

  function marcarError(campoNodos, mensaje) {
    campoNodos.error.textContent = mensaje || "";
    campoNodos.error.hidden = !mensaje;
    campoNodos.input.setAttribute("aria-invalid", mensaje ? "true" : "false");
  }

  // Línea de debajo de cada campo: el valor por defecto con su origen, o «supuesto del usuario».
  function pintarNota(campoNodos, tocado, valorDef, formato, origen, prefijoSinTocar, textoExtra) {
    base().vaciar(campoNodos.nota);
    var partes = [tocado ? "Supuesto del usuario · por defecto: " : (prefijoSinTocar || "Por defecto: ")];
    if (valorDef !== null) partes.push(num(valorDef, formato, origen));
    if (textoExtra) partes.push(textoExtra);
    partes.forEach(function (p) { campoNodos.nota.appendChild(typeof p === "string" ? raiz.document.createTextNode(p) : p); });
  }

  // Errores del asistente, con mensajes amables. Devuelve { clave: mensaje } sólo de lo que corresponde al paso (0 = todos).
  function errores(paso) {
    var e = {};
    if (!estado.zona) { if (!paso || paso === 1) e.zona = "Elegí tu zona para seguir."; return e; }
    var lectura = C().leerEntradas(null, textosParaCalcular());
    var todos = lectura.errores;
    estado.cultivos.forEach(function (c) {
      if (String(estado.textos[c].ha).trim() === "") todos[c + ".ha"] = "Escribí cuántas hectáreas de " + c.toLowerCase() + " sembrás.";
    });
    if (!estado.cultivos.length) todos.cultivos = "Elegí al menos un cultivo para seguir.";
    estado.cultivos.forEach(function (c) {
      if (todos[c + ".rinde"]) {
        // Si el número se leyó, el mensaje de campana.js ya dice el máximo para la zona y el cultivo.
        if (C().leerDecimal(estado.textos[c].rinde) === null) todos[c + ".rinde"] = "Escribí el rinde con coma decimal (por ejemplo 32,7): el punto sólo separa miles.";
      }
    });
    Object.keys(todos).forEach(function (k) {
      var pasoDe = k === "cultivos" || k === "haTotal" || /\.ha$/.test(k) ? 2 : /\.rinde$/.test(k) ? 3 : 4;
      if (!paso || pasoDe === paso) e[k] = todos[k];
    });
    if ((!paso || paso === 4) && estado.usaFuturos === null) e.futuros = "Contanos si usás futuros: tocá Sí o No.";
    return e;
  }

  function pintarErrores(errs) {
    estado.cultivos.forEach(function (c) {
      CAMPOS_POR_CULTIVO.forEach(function (campo) { marcarError(nodos.campos[c][campo], errs[c + "." + campo]); });
    });
    marcarError(nodos.v, errs.v);
    var primero = Object.keys(errs)[0];
    nodos.errorPaso.textContent = primero ? "Revisá lo que está marcado: " + errs[primero] : "";
    nodos.errorPaso.hidden = !primero;
  }

  var hayErrorVisible = false;
  function revalidarSiHayError() {
    if (hayErrorVisible) { var errs = errores(estado.paso); hayErrorVisible = Object.keys(errs).length > 0; pintarErrores(errs); }
    pintarNotas();
  }

  function pintarNotas() {
    if (!estado.zona) return;
    estado.cultivos.forEach(function (c) {
      var d = estado.defs[c];
      nodos.campos[c].ha.nota.textContent = notaHectareas(c);
      nodos.campos[c].ha.nota.setAttribute("data-excedido", hectareasCargadas() > C().HECTAREAS_MAX_TOTAL ? "true" : "false");
      pintarReferenciaRinde(c);
      var tn = C().leerDecimal(estado.textos[c].rinde);
      nodos.campos[c].rinde.nota.textContent = tn === null ? "Escribilo con coma decimal, por ejemplo 32,7." : "Equivale a " + coma(tn, 2) + " t/ha (10 qq = 1 t).";
      ["cd", "cc", "gc"].forEach(function (campo) {
        pintarNota(nodos.campos[c][campo], tocadoCampo(c, campo), valorPorDefecto(c, campo), FORMATO_NOTA[campo], d.origen[campo === "cc" ? "cc" : campo],
          campo === "cc" ? "Por defecto (tabla de la tesis al rinde elegido): " : "Por defecto (" + d.campana + "): ");
      });
      pintarCalendario(c);
    });
    pintarNota(nodos.v, estado.v !== coma(estado.vDef.v, 0), estado.vDef.v, "usd", estado.vDef.origen, "Por defecto (" + estado.vDef.campana + "): ");
  }

  function sincronizarTodo() {
    var zona = estado.zona;
    Object.keys(nodos.tarjetasZona).forEach(function (z) { nodos.tarjetasZona[z].setAttribute("aria-pressed", z === zona ? "true" : "false"); });
    var ofrecidos = Object.keys(estado.defs);
    nodos.avisoSinZona.hidden = !!zona;
    C().CULTIVOS.forEach(function (c) {
      var hay = ofrecidos.indexOf(c) >= 0;
      var activo = estado.cultivos.indexOf(c) >= 0;
      nodos.chips[c].hidden = !hay;
      nodos.chips[c].setAttribute("aria-pressed", activo ? "true" : "false");
      nodos.bloquesHa[c].hidden = !(hay && activo);
      nodos.bloquesRinde[c].hidden = !(hay && activo);
      nodos.bloquesAvanzados[c].hidden = !(hay && activo);
      if (hay) {
        nodos.campos[c].ha.input.value = estado.textos[c].ha;
        sincronizarRinde(c);
        ["cd", "cc", "gc"].forEach(function (campo) { nodos.campos[c][campo].input.value = estado.textos[c][campo]; });
      }
    });
    nodos.v.input.value = estado.v;
    nodos.nombreCampo.input.value = nombres.campo;
    nodos.nombrePersona.input.value = nombres.persona;
    sincronizarFuturos();
    pintarNotas();
    pintarContadorHa();
    sincronizarPaso();
  }

  function sincronizarPaso() {
    for (var i = 1; i <= PASOS; i++) nodos.pasos[i].hidden = i !== estado.paso;
    nodos.progreso.setAttribute("value", String(estado.paso));
    nodos.progresoTexto.textContent = "Paso " + estado.paso + " de " + PASOS + " · " + TITULOS_PASO[estado.paso - 1];
    nodos.atras.hidden = estado.paso === 1;
    nodos.siguiente.hidden = estado.paso === PASOS;
    nodos.ver.hidden = estado.paso !== PASOS;
  }

  function irAlPaso(n) {
    estado.paso = Math.max(1, Math.min(PASOS, n));
    hayErrorVisible = false;
    nodos.errorPaso.hidden = true;
    sincronizarPaso();
  }

  function siguiente() {
    var errs = errores(estado.paso);
    hayErrorVisible = Object.keys(errs).length > 0;
    pintarErrores(errs);
    if (!hayErrorVisible) irAlPaso(estado.paso + 1);
  }

  // Si la página se abrió con un link de escenario, después de cambiar los datos el hash vuelve a decir lo que se está viendo (sin recargar ni
  // sumar una entrada al historial: replaceState no dispara hashchange).
  function actualizarHashDelLink() {
    if (!leerLink(hashActual())) return;
    var link = armarLink();
    if (!link) return;
    var hash = "#" + link.split("#")[1];
    try {
      if (raiz.history && typeof raiz.history.replaceState === "function") raiz.history.replaceState(null, "", hash);
      else if (raiz.location) raiz.location.hash = hash;
    } catch (e) { /* sin historial: el hash queda como estaba y el botón Compartir sigue dando el link bueno */ }
  }

  function verResultados() {
    var errs = errores(0);
    hayErrorVisible = Object.keys(errs).length > 0;
    pintarErrores(errs);
    if (hayErrorVisible) {
      var pasoDeError = errs.zona ? 1 : (errs.cultivos || errs.haTotal || Object.keys(errs).some(function (k) { return /\.ha$/.test(k); })) ? 2 : Object.keys(errs).some(function (k) { return /\.rinde$/.test(k); }) ? 3 : 4;
      if (pasoDeError !== estado.paso) { estado.paso = pasoDeError; sincronizarPaso(); pintarErrores(errs); }
      return;
    }
    // Si dijo que sí pero dejó todos los cultivos en «No lo cubro», es lo mismo que decir que no.
    if (estado.usaFuturos === true && !hayCobertura(hDe(estado.h))) estado.usaFuturos = false;
    estado.h = estado.usaFuturos ? hDe(estado.h) : {};
    estado.hVer = hDe(estado.h);
    mostrarResultados();
    actualizarHashDelLink();
  }

  function montarAsistente(cont) {
    nodos.progresoTexto = el("p", { "class": "sc-progreso-texto", id: "sc-progreso-texto", "aria-live": "polite" });
    nodos.progreso = el("progress", { "class": "sc-progreso", max: String(PASOS), value: "1", "aria-label": "Avance de la carga de datos" });
    nodos.pasos = {};
    [montarPasoZona, montarPasoCultivos, montarPasoRinde, montarPasoFuturos].forEach(function (montarPaso, i) {
      var panel = el("div", { "class": "sc-paso", id: "sc-paso-" + (i + 1) });
      montarPaso(panel);
      nodos.pasos[i + 1] = panel;
    });
    nodos.errorPaso = el("p", { "class": "mensaje", id: "sc-paso-error", role: "alert" });
    nodos.errorPaso.hidden = true;
    nodos.atras = el("button", { type: "button", "class": "sc-boton", id: "sc-atras" }, "Atrás");
    nodos.siguiente = el("button", { type: "button", "class": "sc-boton sc-boton-principal", id: "sc-siguiente" }, "Siguiente");
    nodos.ver = el("button", { type: "button", "class": "sc-boton sc-boton-principal", id: "sc-ver" }, "Ver mis resultados");
    nodos.atras.addEventListener("click", function () { irAlPaso(estado.paso - 1); });
    nodos.siguiente.addEventListener("click", siguiente);
    nodos.ver.addEventListener("click", verResultados);
    var navegacionPasos = el("div", { "class": "sc-nav-pasos" }, [nodos.atras, nodos.siguiente, nodos.ver]);
    var enlace = el("p", { "class": "sc-enlace-fuentes" }, [el("a", { href: "#datos-y-fuentes" }, "Datos y fuentes de la tesis")]);
    nodos.asistente = el("div", { "class": "sc-asistente sc-entradas tarjeta", id: "sc-asistente" }, [
      el("p", { "class": "mc-intro" }, "Pensado para pequeños y medianos productores (hasta 1.000 ha). Cargá los datos de tu campaña en cuatro pasos cortos. Con eso te mostramos cuánto esperás ganar y qué te cambiaría cubrirte con futuros."),
      nodos.progresoTexto, nodos.progreso,
      nodos.pasos[1], nodos.pasos[2], nodos.pasos[3], nodos.pasos[4], nodos.errorPaso, navegacionPasos, enlace]);
    cont.appendChild(nodos.asistente);
  }
  // ---------------------------------------------------------------------------------------
  // Informe: nombres, fecha, supuestos, imprimir y link para compartir
  // ---------------------------------------------------------------------------------------

  // Texto libre del usuario: sin saltos ni caracteres de control, de hasta 60 caracteres. Siempre se muestra con
  // textContent (nunca como HTML) y no sale del navegador: no va en el link ni a ningún otro lado.
  function recortar(t) {
    return String(t === null || t === undefined ? "" : t).replace(/[\x00-\x1f\x7f-\x9f\u2028\u2029]+/g, " ").slice(0, MAX_NOMBRE);
  }

  function limpio(t) {
    return recortar(t).replace(/\s+/g, " ").trim();
  }

  function almacen() {
    try { return raiz.localStorage || null; } catch (e) { return null; }
  }

  function leerNombresGuardados() {
    try {
      var a = almacen();
      var texto = a ? a.getItem(CLAVE_INFORME) : null;
      if (!texto) return;
      var o = JSON.parse(texto);
      if (o && typeof o === "object") { nombres.campo = recortar(o.campo); nombres.persona = recortar(o.persona); }
    } catch (e) { /* sin almacenamiento o dato roto: se sigue sin nombres */ }
  }

  function guardarNombres() {
    try {
      var a = almacen();
      if (a) a.setItem(CLAVE_INFORME, JSON.stringify({ campo: nombres.campo, persona: nombres.persona }));
    } catch (e) { /* la página anda igual: sólo no se recuerdan los nombres */ }
  }

  function textoDeEncabezado() {
    var partes = ["Campaña 2026/27"];
    if (limpio(nombres.campo)) partes.push("Campo " + limpio(nombres.campo));
    if (limpio(nombres.persona)) partes.push(limpio(nombres.persona));
    return partes.join(" · ");
  }

  function pintarEncabezado() {
    if (!nodos.encabezado) return;
    nodos.encabezado.textContent = textoDeEncabezado();
    nodos.encabezado.hidden = !(limpio(nombres.campo) || limpio(nombres.persona));
  }

  function dos(n) { return (n < 10 ? "0" : "") + n; }

  function fechaDeHoy() {
    var d = new Date();
    return dos(d.getDate()) + "/" + dos(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function pintarFecha() {
    if (nodos.fecha) nodos.fecha.textContent = "Fecha: " + fechaDeHoy();
  }

  // Supuestos cargados, para la hoja impresa (en pantalla está oculto: ya están en las entradas).
  function pintarSupuestos(v, entrada) {
    var cont = nodos.supuestos;
    if (!cont) return;
    base().vaciar(cont);
    var fm = base().formato;
    var filas = v.nombres.map(function (c) {
      var f = entrada.cultivos[c];
      return filaTabla([c, fm.entero(f.ha), coma(f.rinde * 10, 1), pct(v.hPorCultivo[c]), fm.usd2(f.f27)]);
    });
    cont.appendChild(el("h3", null, "Supuestos de este informe"));
    cont.appendChild(el("ul", { "class": "sc-lista-supuestos" }, [
      el("li", null, "Zona: " + v.zona),
      el("li", null, "Proporción cubierta con futuros: " + (hayCobertura(v.hPorCultivo) ? v.nombres.map(function (c) { return c + " " + pct(v.hPorCultivo[c]); }).join(", ") : "ninguna")),
      el("li", null, "Comisión de la cobertura: " + coma(entrada.comision * 100, 2) + " % del valor del contrato")]));
    cont.appendChild(el("table", { "class": "mc-tabla sc-tabla" }, [
      el("thead", null, filaTabla(["Cultivo", "Hectáreas", "Rinde (qq/ha)", "Cubierto", "Futuro 2026/27 (USD/t)"], true)), el("tbody", null, filas)]));
  }

  // --- Link para compartir el escenario (no lleva los nombres) ---

  var CLAVES_LINK = ["z", "c", "ha", "ri", "h"];   // ms y mc (meses) de links viejos no se leen: las fechas son fijas

  function baseDelLink() {
    var l = raiz.location;
    var h = l && l.href ? String(l.href) : "";
    if (h) return h.split("#")[0];
    return l && l.pathname ? String(l.pathname) : "";
  }

  // Parte que va después de «#campana?»: zona, cultivos, hectáreas, rindes (en t/ha), cobertura de cada cultivo (h=50,0 en el orden de «c»; si es la
  // misma para todos, un solo número, como en los links viejos) (sin meses: las fechas son fijas). Los precios futuros y la
  // comisión no van: salen de la tabla interna de cotizaciones y de la comisión fija de la tesis.
  function armarQuery(e) {
    var enc = encodeURIComponent;
    var lista = function (campo, f) { return e.cultivos.map(function (c) { return enc(f(String(e.textos[c][campo]).trim())); }).join(","); };
    var punto = function (t) { return t.replace(/,/g, "."); };
    var entero = function (t) { return /^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, "") : t; };
    return ["z=" + enc(e.zona), "c=" + e.cultivos.map(enc).join(","), "ha=" + lista("ha", entero), "ri=" + lista("rinde", punto),
      "h=" + (hUniforme(hDe(e.h, e.cultivos)) !== null ? Math.round(hUniforme(hDe(e.h, e.cultivos)) * 100) : e.cultivos.map(function (c) { return Math.round((e.h[c] || 0) * 100); }).join(","))].join("&");
  }

  // El link del escenario actual, o null si todavía no hay resultados (no hay escenario válido que compartir).
  function armarLink() {
    if (!estado || !estado.cargado || !ultimaVista) return null;
    return baseDelLink() + "#campana?" + armarQuery(estado);
  }

  // Valores crudos (sin decodificar) del hash, o null si no es un link de esta sección.
  function leerLink(hash) {
    var t = String(hash || "");
    if (t.charAt(0) === "#") t = t.slice(1);
    var i = t.indexOf("?");
    if (i < 0 || t.slice(0, i) !== "campana") return null;
    var q = {};
    Object.defineProperty(q, "_repetidos", { value: [], enumerable: false });   // claves que venían más de una vez (vale la primera)
    var hay = false;
    t.slice(i + 1).split("&").forEach(function (par) {
      var k = par.indexOf("=");
      var clave = k < 0 ? par : par.slice(0, k);
      if (CLAVES_LINK.indexOf(clave) < 0) return;
      if (q[clave] !== undefined) { if (q._repetidos.indexOf(clave) < 0) q._repetidos.push(clave); return; }
      q[clave] = k < 0 ? "" : par.slice(k + 1);
      hay = true;
    });
    return hay ? q : null;
  }

  function decodificar(t) {
    try { return decodeURIComponent(String(t).replace(/\+/g, " ")); } catch (e) { return null; }
  }

  function aComa(t) {
    return /^\d+\.\d+$/.test(t) ? t.replace(".", ",") : t;
  }

  function zonaInicial() {
    return C().zonas().indexOf("Norte BA / Sur SF") >= 0 ? "Norte BA / Sur SF" : C().zonas()[0];
  }

  function textoParaAviso(t) {
    var s = limpio(t === null ? "?" : t);
    return s.length > 30 ? s.slice(0, 30) + "…" : s;
  }

  // Carga el escenario del link en el estado. Cada valor pasa por la misma revisión que si se tipeara (leerEntradas):
  // lo que no sirve vuelve a su valor por defecto y se anota para avisarlo. Devuelve la lista de avisos.
  function aplicarEscenario(q) {
    var avisos = [];
    var frases = [];   // avisos que ya son una oración completa
    var nota = function (t) { if (avisos.indexOf(t) < 0) avisos.push(t); };
    var frase = function (t) { if (frases.indexOf(t) < 0) frases.push(t); };
    (q._repetidos || []).forEach(function (k) {
      var primero = decodificar(q[k]);
      frase("El link traía «" + k + "» repetido: usamos el primer valor" + (primero === null || primero === "" ? "" : " (" + textoParaAviso(primero) + ")") + ".");
    });
    var zonas = C().zonas();
    var zona = zonaInicial();
    if (q.z === undefined) frase("El link no traía la zona: usamos " + zona + ".");
    if (q.z !== undefined) {
      var z = decodificar(q.z);
      if (z !== null && zonas.indexOf(z) >= 0) zona = z;
      else nota("la zona «" + textoParaAviso(z === null ? q.z : z) + "» (se usó " + zona + ")");
    }
    estado = estadoNuevo(zona, null, true);
    var disponibles = Object.keys(estado.defs);
    var posicion = {};
    if (q.c !== undefined) {
      var elegidos = [];
      q.c.split(",").forEach(function (crudo, i) {
        var c = decodificar(crudo);
        if (c !== null && C().CULTIVOS.indexOf(c) >= 0 && disponibles.indexOf(c) >= 0 && elegidos.indexOf(c) < 0) { elegidos.push(c); posicion[c] = i; }
        else if (c !== null && C().CULTIVOS.indexOf(c) >= 0 && disponibles.indexOf(c) < 0) frase("Tu zona no tiene datos de " + c.toLowerCase() + " en la tesis; lo sacamos del escenario.");
        else if (c !== null && C().CULTIVOS.indexOf(c) >= 0) { /* repetido: vale el primero */ }
        else nota("el cultivo «" + textoParaAviso(c === null ? crudo : c) + "»");
      });
      // Si ningún cultivo del link sirve, se usan los de ejemplo con sus valores por defecto: las hectáreas, rindes y coberturas del link
      // pertenecían a otros cultivos y no se aplican a éstos.
      if (elegidos.length) estado.cultivos = C().CULTIVOS.filter(function (c) { return elegidos.indexOf(c) >= 0; });
      else frase("Ningún cultivo del link sirve en tu zona: usamos " + estado.cultivos.map(function (c) { return c.toLowerCase(); }).join(" y ") + " con valores por defecto.");
    } else {
      frase("El link no traía los cultivos: usamos " + estado.cultivos.map(function (c) { return c.toLowerCase(); }).join(" y ") + ".");
      estado.cultivos.forEach(function (c, i) { posicion[c] = i; });
    }
    [["ha", "ha", "las hectáreas"], ["ri", "rinde", "el rinde"]].forEach(function (par) {
      if (q[par[0]] === undefined) return;
      var lista = q[par[0]].split(",");
      estado.cultivos.forEach(function (c) {
        if (posicion[c] === undefined) return;
        var crudo = lista[posicion[c]];
        var texto = crudo === undefined ? null : decodificar(crudo);
        if (texto === null || texto.trim() === "") { nota(par[2] + " de " + c); return; }
        estado.textos[c][par[1]] = par[1] === "ha" ? texto.trim() : aComa(texto.trim());
      });
    });
    // Los meses de siembra y cosecha (ms, mc) de links viejos se ignoran: las fechas son fijas.
    if (q.h !== undefined) {
      // Un solo número (links viejos) vale para todos los cultivos; una lista va en el orden de «c».
      var lista = q.h.split(",");
      var leerH = function (crudo) {
        var ht = crudo === undefined ? null : decodificar(crudo);
        var h = ht !== null && /^\d+$/.test(ht.trim()) ? Number(ht.trim()) / 100 : -1;
        return C().PROPORCIONES.indexOf(h) >= 0 ? h : null;
      };
      estado.cultivos.forEach(function (c) {
        if (posicion[c] === undefined) return;
        var h = leerH(lista.length === 1 ? lista[0] : lista[posicion[c]]);
        if (h === null) nota("la proporción cubierta de " + c);
        else if (h > 0) estado.h[c] = h;
      });
    }
    estado.usaFuturos = hayCobertura(hDe(estado.h));
    estado.hVer = hDe(estado.h);
    // Revisión como si se hubiera tipeado: lo inválido vuelve a su valor por defecto.
    var porDefecto = function (c, campo) { return campo === "ha" ? String(HECTAREAS_INICIALES[c]) : textosPorDefecto(estado.defs[c], "")[campo]; };
    var etiquetas = { ha: "las hectáreas", rinde: "el rinde", cd: "los costos directos", cc: "el costo de cosecha", gc: "los gastos de comercialización" };
    // El rinde del link es el típico de la zona si coincide con él; si no, es uno propio (se muestra en qq/ha).
    estado.cultivos.forEach(function (c) {
      if (estado.textos[c].rinde === textosPorDefecto(estado.defs[c], "").rinde) return;
      var n = C().leerDecimal(estado.textos[c].rinde);
      estado.rindeModo[c] = "propio";
      estado.rindeQq[c] = n === null ? estado.textos[c].rinde : coma(n * 10, 1);
    });
    for (var vuelta = 0; vuelta < 3; vuelta++) {
      var errs = C().leerEntradas(null, textosParaCalcular()).errores;
      var claves = Object.keys(errs);
      if (!claves.length) break;
      claves.forEach(function (k) {
        if (k === "v") { estado.v = coma(estado.vDef.v, 0); }
        else if (k === "haTotal") { estado.cultivos.forEach(function (c) { estado.textos[c].ha = porDefecto(c, "ha"); }); nota("las hectáreas (el total pasaba de " + fmMiles(C().HECTAREAS_MAX_TOTAL) + ")"); }
        else if (k === "cultivos") { estado.cultivos.forEach(function (c) { estado.textos[c].ha = porDefecto(c, "ha"); }); nota("las hectáreas"); }
        else if (k !== "comision") {
          var partes = k.split(".");
          estado.textos[partes[0]][partes[1]] = porDefecto(partes[0], partes[1]);
          if (partes[1] === "rinde") { estado.rindeModo[partes[0]] = "zona"; estado.rindeQq[partes[0]] = coma(estado.defs[partes[0]].rinde * 10, 1); }
          nota(etiquetas[partes[1]] + " de " + partes[0]);
        }
      });
    }
    if (Object.keys(C().leerEntradas(null, textosParaCalcular()).errores).length) { estado = estadoNuevo(zonaInicial(), null, true); estado.usaFuturos = false; }
    return { leer: avisos, frases: frases };
  }

  // avisos: { leer: lo que no se pudo leer (cada ítem es un pedazo de frase), frases: oraciones completas }
  function mostrarAvisoLink(avisos) {
    if (!nodos.avisoLink) return;
    var texto = avisos.leer.length
      ? "Abrimos el escenario del link, pero no pudimos leer " + avisos.leer.join(", ") + ". Esos valores quedaron en el valor por defecto; podés cambiar tus datos con el botón de abajo."
      : avisos.frases.length ? "Abrimos el escenario del link." : "Cargamos el escenario del link. Podés cambiar tus datos cuando quieras.";
    if (avisos.frases.length) texto += " " + avisos.frases.join(" ") + (avisos.leer.length ? "" : " Podés cambiar tus datos con el botón de abajo.");
    nodos.avisoLink.textContent = texto;
    nodos.avisoLink.hidden = false;
  }

  // Si el hash es un link de escenario, lo carga y muestra los resultados. Devuelve true si cargó algo.
  function aplicarLink(hash) {
    var q = leerLink(hash);
    if (!q) return false;
    var avisos = aplicarEscenario(q);
    sincronizarTodo();
    mostrarResultados();
    mostrarAvisoLink(avisos);
    return true;
  }

  function hashActual() {
    try { return raiz.location && raiz.location.hash ? String(raiz.location.hash) : ""; } catch (e) { return ""; }
  }

  function avisoDeLink(texto) {
    nodos.estadoLink.textContent = texto;
    nodos.estadoLink.hidden = !texto;
  }

  function mostrarLinkParaCopiar(link, mensaje) {
    nodos.linkTexto.value = link;
    nodos.linkCaja.hidden = false;
    avisoDeLink(mensaje);
    try { nodos.linkTexto.focus(); nodos.linkTexto.select(); } catch (e) { /* sin foco o selección: queda a la vista para copiarlo a mano */ }
  }

  function copiarLink() {
    var link = armarLink();
    if (!link) { avisoDeLink("Cargá tus datos para poder compartir este escenario."); return; }
    var archivo = /^file:/i.test(link) ? " Ojo: este link abre la página desde un archivo de esta computadora; para que lo abra otra persona tiene que tener la página publicada." : "";
    var fallo = function () { mostrarLinkParaCopiar(link, "No pudimos copiarlo solo: copialo a mano desde acá." + archivo); };
    var listo = function () { mostrarLinkParaCopiar(link, "Link copiado. Tiene el escenario pero no tus nombres." + archivo); };
    try {
      var nav = raiz.navigator;
      if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
        var p = nav.clipboard.writeText(link);
        if (p && typeof p.then === "function") p.then(listo, fallo); else listo();
        return;
      }
    } catch (e) { /* sigue con el respaldo */ }
    fallo();
  }

  // --- Imprimir o guardar en PDF ---

  // Antes de imprimir se abre todo el detalle y los gráficos se vuelven a dibujar con colores de papel blanco y un ancho que entra en la hoja A4;
  // al terminar vuelve todo a como estaba. Son SVG: salen como vectores, sin pixelarse.
  var detalleAbiertoAntes = false;
  var detalleAbierto = [];   // si cada tabla desplegable de R estaba abierta antes de imprimir
  function antesDeImprimir() {
    if (imprimiendo) return;
    imprimiendo = true;
    if (V()) V().fijarImpresion(true);
    pintarFecha();
    if (nodos.mas) { detalleAbiertoAntes = !nodos.mas.hidden; nodos.mas.hidden = false; }
    detalleAbierto = (nodos.plegablesTabla || []).map(function (d) { return d.getAttribute("open") !== null; });
    (nodos.plegablesGraficos || []).concat(nodos.plegablesTabla || []).forEach(function (d) { d.setAttribute("open", ""); });
    if (ultimaVista) { dibujarGraficos(vistaVer()); pintarVisual(ultimaVista); }
  }

  function despuesDeImprimir() {
    if (!imprimiendo) return;
    imprimiendo = false;
    if (V()) V().fijarImpresion(false);
    if (nodos.mas) nodos.mas.hidden = !detalleAbiertoAntes;
    (nodos.plegablesGraficos || []).forEach(function (d) { d.removeAttribute("open"); });
    (nodos.plegablesTabla || []).forEach(function (d, i) { if (!detalleAbierto[i]) d.removeAttribute("open"); });
    if (ultimaVista) { dibujarGraficos(vistaVer()); pintarVisual(ultimaVista); }
  }

  function imprimir() {
    antesDeImprimir();
    try {
      if (typeof raiz.print === "function") raiz.print();
    } catch (e) { /* si el navegador no deja imprimir desde acá, queda Ctrl+P */ }
  }
  var TEXTO_FORMULA_MB = "MB = Ȳ·(P − GC) − CD − CC − COM; P = h·(F27 + base) + (1 − h)·spot proyectado; COM = comisión·Ȳ·F27·h";

  // Origen de una cifra calculada: sus fórmulas, las celdas de la tesis de las que parte y qué es supuesto del usuario.
  function origenDe(formula, vista, usa) {
    var origs = [];
    var notas = [];
    usa = usa || {};
    vista.nombres.forEach(function (c) {
      var d = estado.defs[c];
      if (usa.entradas) { origs.push(d.origen.rinde, d.origen.cd, d.origen.gc, d.origen.cc); }
      if (usa.precios) { vista.cultivos[c].precios.origenSc.forEach(function (o) { origs.push(o); }); }
      if (usa.base) { vista.cultivos[c].precios.origenBase.forEach(function (o) { origs.push(o); }); }
      if (usa.escenarios) { origs.push(raiz.TESIS_MOTOR.origen(vista.cultivos[c].casos[0], "fs", raiz.TESIS_DATOS)); }
    });
    if (usa.v) origs.push(estado.vDef.origen);
    if (usa.comision) origs.push(C().comisionPorDefecto().origen);
    notas.push("rinde, hectáreas, precio futuro 2026/27, comisión y costos: supuesto del usuario (los valores por defecto son los últimos de la zona)");
    if (usa.f27) {
      vista.nombres.forEach(function (c) {
        var f = estado.defs[c].f27;
        notas.push("F27 " + c + ": " + (f.esReferencia ? C().ROTULO_REFERENCIA : f.contrato + " al " + f.fecha + ", " + f.fuente));
      });
    }
    if (usa.spot) notas.push("spot proyectado = supuesto del grupo (no es un pronóstico)");
    return base().origenCalculado(formula, origs, null, notas);
  }

  function tarjeta(titulo, renglones, clase) {
    var hijos = [el("h4", null, titulo)];
    renglones.forEach(function (r) {
      hijos.push(el("p", { "class": "mc-renglon" }, [el("span", { "class": "mc-etiqueta" }, r.etiqueta),
        el("span", { "class": r.grande ? "mc-valor sc-grande" : "mc-valor" }, [r.nodo, r.unidad ? el("span", { "class": "mc-unidad" }, " " + r.unidad) : null])]));
    });
    return el("div", { "class": "tarjeta mc-tarjeta " + (clase || "") }, hijos);
  }

  // ---------------------------------------------------------------------------------------
  // Resultados (aparecen sólo después de cargar los datos): pocas cifras grandes y el resto en «Ver más detalle»
  // ---------------------------------------------------------------------------------------

  var TODO = { entradas: true, precios: true, base: true, comision: true, f27: true, spot: true, v: true, escenarios: true };

  // La vista con la proporción que se está mirando (la de los botones): lo que usan las tablas y gráficos del detalle.
  function vistaVer() {
    var v = ultimaVista;
    var hp = hDe(estado.hVer, v.nombres);
    var ev = C().evaluar(v, hp);
    return Object.assign({}, v, { h: ev.h, hPorCultivo: hp, usuario: ev.resultado, escenarioUsuario: ev.escenario });
  }

  // «50 %» o, si cada cultivo tiene la suya, «por cultivo».
  function etiquetaEleccion(v) {
    var u = hUniforme(v.hPorCultivo);
    return u !== null ? pct(u) : "por cultivo";
  }

  function cifraClave(titulo, nodoValor, unidad, frase, clase) {
    return el("div", { "class": "tarjeta sc-clave " + (clase || "") }, [
      el("h4", null, titulo),
      el("p", { "class": "sc-numero" }, [nodoValor, unidad ? el("span", { "class": "mc-unidad" }, " " + unidad) : null]),
      el("p", { "class": "sc-frase" }, frase)
    ]);
  }

  function totalesPorEscenario(v, escenario) {
    return escenario.mbHa.map(function (x) { return x * v.hectareasTotales; });
  }

  function indiceDeCampana(v, campana, respaldo) {
    var i = v.campanas.indexOf(campana);
    return i >= 0 ? i : respaldo;
  }

  function pintarSabemos(v) {
    var cont = nodos.sabemos;
    base().vaciar(cont);
    var u = v.resultados[0];
    var tn = v.nombres.reduce(function (s, c) { return s + v.cultivos[c].ha * v.cultivos[c].rinde; }, 0);
    var porCultivo = v.nombres.map(function (c) { return c + " " + fm().entero(v.cultivos[c].ha * v.cultivos[c].rinde) + " t"; }).join(" · ");
    var o = function (f) { return origenDe(f, v, TODO); };
    cont.appendChild(el("h3", null, "Lo que ya sabemos con tus datos"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, "Es lo que esperás para la campaña 2026/27 si vendés toda la cosecha a precio de cosecha."));
    cont.appendChild(el("div", { "class": "sc-claves" }, [
      cifraClave("Producción esperada", numA("sabemos-produccion", tn, "entero", o("Producción = Σ hectáreas × rinde esperado")), "toneladas", "Lo que esperás cosechar: hectáreas por rinde. " + porCultivo + "."),
      cifraClave("Ingreso bruto estimado", numA("sabemos-ingreso", u.ingresoTotal, "usd", o("Ingreso total = Σ hectáreas × Ȳ × P")), "USD", "Lo que cobrarías por la cosecha, antes de pagar nada."),
      cifraClave("Margen bruto estimado", numA("sabemos-margen", u.mbTotal, "usd", o("MB total = Σ hectáreas × MB por hectárea")), "USD", "Lo que te queda después de pagar semillas, insumos y cosecha.", "sc-principal")
    ]));
  }

  function pintarHoy(v) {
    var cont = nodos.hoy;
    base().vaciar(cont);
    var hp = hDe(estado.h, v.nombres);
    var ev = C().evaluar(v, hp);
    var u = ev.resultado;
    var cubre = hayCobertura(hp);
    var totales = totalesPorEscenario(v, ev.escenario);
    var peorI = totales.indexOf(Math.min.apply(null, totales));
    var mejorI = totales.indexOf(Math.max.apply(null, totales));
    var iFria = indiceDeCampana(v, CAMPANA_FRIA, peorI);
    var iCalida = indiceDeCampana(v, CAMPANA_CALIDA, mejorI);
    var o = function (f) { return origenDe(f, v, TODO); };
    cont.appendChild(el("h3", null, "Tu situación hoy"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, !cubre
      ? "Hoy vendés a la cosecha, sin cubrirte: tu ingreso depende del precio que haya ese día."
      : hUniforme(hp) !== null ? "Hoy cubrís el " + pct(hUniforme(hp)) + " de tu cosecha con futuros: esa parte ya tiene precio fijado."
        : "Hoy cubrís con futuros parte de tu cosecha (" + textoH(hp) + "): esa parte ya tiene precio fijado."));
    cont.appendChild(el("div", { "class": "sc-claves sc-claves-dos" }, [
      cifraClave("Rentabilidad sobre tu tierra", numA("hoy-r", u.r, "porcentaje", o("R = MB total ÷ (hectáreas × V)")), "",
        "Lo que te deja el campo en un año, comparado con lo que vale tu tierra."),
      el("div", { "class": "tarjeta sc-clave" }, [
        el("h4", null, "Tu riesgo, en palabras"),
        el("p", { "class": "sc-frase sc-frase-grande" }, ["En un año como ", v.campanas[iFria], " tu resultado habría sido ",
          num(totales[iFria], "usd", o("MB total del escenario " + v.campanas[iFria])), " USD; en uno como ", v.campanas[iCalida], ", ",
          num(totales[iCalida], "usd", o("MB total del escenario " + v.campanas[iCalida])), " USD."]),
        el("p", { "class": "sc-frase" }, "Son dos de los seis años que estudia la tesis. Muestran cuánto puede moverse tu resultado."
          + (!cubre ? "" : " Con tu cobertura actual."))
      ])
    ]));
  }

  function textoMes(n) { return C().MESES[n - 1]; }

  function pintarCalendarioResultado(v) {
    var cont = nodos.calendarioRes;
    base().vaciar(cont);
    var items = v.nombres.map(function (c) {
      var f = futuroDe(c);
      var m = C().CALENDARIO[c];
      return el("li", null, [el("strong", null, c + ": "), "siembra en " + textoMes(m.siembra) + ", cosecha en " + textoMes(m.cosecha) + ". Contrato " + f.contrato + "."]);
    });
    cont.appendChild(el("p", { "class": "sc-titulo-grupo" }, "Las fechas de la tesis y el contrato que te corresponde"));
    cont.appendChild(el("ul", { "class": "sc-lista-calendario" }, items));
    var hayReferencia = v.nombres.some(function (c) { return futuroDe(c).esReferencia; });
    cont.appendChild(el("p", { "class": "sc-aviso", role: "note" }, hayReferencia
      ? [el("strong", null, "Precio de referencia. "), "El precio futuro 2026/27 que usamos es el futuro de siembra 2025/26 de la tesis, no una cotización de hoy. Cuando el grupo consiga las cotizaciones reales se cargan en un único lugar y se actualiza todo."]
      : "El precio futuro 2026/27 es la cotización del contrato que vence en tu mes de cosecha."));
  }

  // Fecha y fuente del precio 2026/27 de cada cultivo, sacadas de la tabla de cotizaciones (nada tipeado a mano).
  function textoFuenteF27(v) {
    var partes = [], hayRef = false;
    v.nombres.forEach(function (c) {
      var f = futuroDe(c);
      if (f.esReferencia || !f.fecha) { hayRef = true; return; }
      var p = f.fecha.split("-"), dia = +p[2], mes = +p[1];
      var ultimo = new Date(+p[0], mes, 0).getDate();
      var corta = dia + "/" + mes;
      partes.push(c + ": " + (dia < ultimo ? textoMes(mes) + " en curso, al " + corta : textoMes(mes) + ", al cierre del " + corta));
    });
    if (!partes.length) return "";
    return "Precio futuro 2026/27: promedio de las ruedas del mes de siembra, Bolsa de Comercio de Rosario. " + partes.join(". ")
      + (hayRef ? ". Los demás cultivos usan una referencia, no una cotización." : ".");
  }

  function pintarPropuesta(v) {
    var cont = nodos.propuesta;
    base().vaciar(cont);
    var hp = hDe(estado.hVer, v.nombres);
    var cob = C().cobertura(v, hp);
    var sin = C().cobertura(v, 0);
    var cubre = hayCobertura(hp);
    var uniforme = hUniforme(hp);
    var o = function (f) { return origenDe(f, v, TODO); };
    var dif = cob.mbTotal - sin.mbTotal;
    var mejoraPeor = cob.peorMbTotal - sin.peorMbTotal;
    var evVer = C().evaluar(v, hp);
    var totalesSin = totalesPorEscenario(v, v.escenarios[0]);
    var totalesCon = totalesPorEscenario(v, evVer.escenario);
    var peorI = totalesSin.indexOf(Math.min.apply(null, totalesSin));
    var iFria = indiceDeCampana(v, CAMPANA_FRIA, peorI);

    cont.appendChild(el("h3", null, "Nuestra propuesta: cubrir con futuros"));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso" }, "Cubrir es fijar hoy el precio de una parte de tu cosecha. Probá cuánto cubrir de cada cultivo y mirá qué cambia. "
      + (estado.usaFuturos ? "Arrancamos en lo que nos contaste: " + textoH(hDe(estado.h, v.nombres)) + "." : "Arrancamos sin cubrir, como hoy.")));
    cont.appendChild(el("p", { "class": "sc-ayuda-paso", "data-fuente-f27": "1" }, textoFuenteF27(v)));
    nodos.botonesH = {};
    var filas = el("div", { "class": "sc-simulador-filas" });
    v.nombres.forEach(function (cultivo) {
      var fila = el("div", { "class": "sc-chips sc-simulador", role: "group", "aria-label": "Proporción cubierta de " + cultivo.toLowerCase() }, [el("span", { "class": "sc-simulador-cultivo" }, cultivo)]);
      nodos.botonesH[cultivo] = {};
      C().PROPORCIONES.forEach(function (x) {
        var b = el("button", { type: "button", "class": "sc-chip", "aria-pressed": x === hp[cultivo] ? "true" : "false", id: "sc-sim-" + nombreCortoCultivo(cultivo) + "-" + Math.round(x * 100) }, pct(x));
        b.addEventListener("click", function () { estado.hVer[cultivo] = x; repintarCobertura(); });
        nodos.botonesH[cultivo][x] = b;
        fila.appendChild(b);
      });
      filas.appendChild(fila);
    });
    cont.appendChild(filas);
    if (nodos.visual) { pintarVisual(v); cont.appendChild(nodos.visual.nodo); }

    cont.appendChild(el("div", { "class": "sc-claves sc-claves-cuatro" }, [
      cifraClave("Toneladas cubiertas", numA("prop-toneladas", cob.toneladasCubiertas, "entero", o("toneladas cubiertas = Σ hectáreas × rinde × proporción cubierta")), "t",
        "De " + fm().entero(cob.toneladasProducidas) + " t que esperás cosechar."),
      cifraClave("Resultado esperado", numA("prop-esperado", cob.mbTotal, "usd", o(TEXTO_FORMULA_MB)), "USD", "Margen bruto con el precio proyectado."),
      cifraClave("Peor caso", numA("prop-peor", cob.peorMbTotal, "usd", o("peor MB total de los 6 escenarios históricos")), "USD", "El peor de los seis años que estudia la tesis."),
      cifraClave("Costo de la comisión", numA("prop-comision", cob.comisionUsd, "usd", o("COM = comisión × toneladas cubiertas × F27")), "USD",
        "Comisión estimada de mercado: " + coma(v.comision * 100, 1) + " % del valor del contrato.")
    ]));

    var frases = [];
    if (!cubre) {
      frases.push(["Sin cubrirte, el precio de tu cosecha queda librado al mercado. Probá un porcentaje para ver qué cambia."]);
    } else {
      frases.push(["Frente a no cubrirte, tu resultado esperado ", dif >= 0 ? "sube " : "baja ", num(Math.abs(dif), "usd", o("diferencia de MB total contra no cubrirse")),
        " USD y tu peor caso ", mejoraPeor >= 0 ? "mejora " : "empeora ", num(Math.abs(mejoraPeor), "usd", o("diferencia entre los peores MB totales")), " USD."]);
      frases.push(["Mirando para atrás: en un año como ", v.campanas[iFria], " habrías tenido ", num(totalesCon[iFria], "usd", o("MB total del escenario " + v.campanas[iFria] + " con cobertura")),
        " USD " + (uniforme !== null ? "cubriendo el " + pct(uniforme) : "con tu cobertura") + ", contra ", num(totalesSin[iFria], "usd", o("MB total del escenario " + v.campanas[iFria] + " sin cobertura")), " USD sin cubrirte."]);
    }
    frases.forEach(function (f) { cont.appendChild(el("p", { "class": "sc-comparacion-frase" }, f)); });
    cont.appendChild(nodos.calendarioRes);
  }

  // ---------------------------------------------------------------------------------------
  // Impacto visual: silos, medidor de riesgo y los seis años sobre una recta (con los números de campana.js)
  // ---------------------------------------------------------------------------------------

  // Umbral de la hipótesis de la tesis (Parametros › B9, 50 %).
  function umbralHipotesis() {
    var d = raiz.TESIS_DATOS;
    var u = d && d.parametros && d.parametros.reduccionHipotesis ? d.parametros.reduccionHipotesis.v : 0.5;
    return typeof u === "number" ? u : 0.5;
  }

  function indiceDe(lista, mayor) {
    var mejor = 0;
    lista.forEach(function (x, i) { if (mayor ? x > lista[mejor] : x < lista[mejor]) mejor = i; });
    return mejor;
  }

  function texto(t) { return raiz.document.createTextNode(t); }

  function pintarVisual(v) {
    var panel = nodos.visual;
    if (!panel || !V()) return;
    var hp = hDe(estado.hVer, v.nombres);
    var cob = C().cobertura(v, hp);
    var sin = C().cobertura(v, 0);
    var ev = C().evaluar(v, hp);
    var cubre = hayCobertura(hp);
    var umbral = umbralHipotesis();
    var o = function (f) { return origenDe(f, v, TODO); };
    var colorCultivo = { Trigo: colorDe("color-trigo", "#f1c21b"), Soja: colorDe("color-soja", "#08bdba"), "Maíz": colorDe("color-maiz", "#eb6200") };

    // Silos: cada uno se llena con la proporción cubierta de su cultivo.
    var silos = v.nombres.map(function (c) {
      var x = cob.porCultivo[c];
      return { cultivo: c, h: x.h, color: colorCultivo[c], etiqueta: pct(x.h) + " cubierto" };
    });

    // Medidor: cuánto baja el desvío de tu rentabilidad con tu cobertura, contra no cubrirte.
    var reduccion = sin.desvio > 0 ? 1 - cob.desvio / sin.desvio : null;
    var origenRed = o("reducción del riesgo = 1 − desvío de R con tu cobertura ÷ desvío de R sin cubrir, en los 6 escenarios históricos");

    // Recta: los seis años con tu cobertura y sin cubrirte, en una escala común a todas las proporciones.
    var totalesCon = totalesPorEscenario(v, ev.escenario);
    var totalesSin = totalesPorEscenario(v, v.escenarios[0]);
    var todos = totalesCon.concat(totalesSin);
    C().PROPORCIONES.forEach(function (h) { todos = todos.concat(totalesPorEscenario(v, v.escenarios[h])); });
    var min = Math.min.apply(null, todos), max = Math.max.apply(null, todos);
    var margen = (max - min) * 0.08 || 1;
    var pos = function (t) { return (t - (min - margen)) / ((max - min) + 2 * margen); };
    var peor = indiceDe(totalesCon, false), mejor = indiceDe(totalesCon, true);
    var rango = totalesCon[mejor] - totalesCon[peor];
    var rangoSin = Math.max.apply(null, totalesSin) - Math.min.apply(null, totalesSin);

    V().actualizarPanel(panel, {
      colores: { superficie: colorDe("color-superficie", "#262626"), borde: colorDe("color-borde", "#393939"), bordeFuerte: colorDe("color-borde-fuerte", "#6f6f6f") },
      silos: silos,
      medidor: {
        valor: reduccion, umbral: umbral, textoMarca: pct(umbral),
        aria: reduccion === null ? "Riesgo que sacás: no se puede calcular" : "Riesgo que sacás: " + Math.round(Math.max(0, reduccion) * 100) + " %. Marca del " + pct(umbral) + ": umbral de la hipótesis."
      },
      recta: {
        campanas: v.campanas, con: totalesCon.map(pos), sin: totalesSin.map(pos), peor: peor, mejor: mejor,
        textos: totalesCon.map(function (t) { return fm().usd(t) + " USD"; }),
        aria: "Los seis años de la tesis aplicados a tu campaña. Peor: " + v.campanas[peor] + ", " + fm().usd(totalesCon[peor]) + " USD. Mejor: " + v.campanas[mejor] + ", " + fm().usd(totalesCon[mejor]) + " USD."
      }
    });

    var f = panel.frases;
    base().vaciar(f.silos);
    f.silos.appendChild(el("span", { "class": "sc-visual-grande" }, [numA("silos-toneladas", cob.toneladasCubiertas, "entero", o("toneladas cubiertas = Σ hectáreas × rinde × proporción cubierta")), " t"]));
    f.silos.appendChild(texto(cubre
      ? " con el precio ya fijado, de las " + fm().entero(cob.toneladasProducidas) + " t que esperás cosechar."
      : " con el precio fijado: todavía no cubriste nada. Elegí un porcentaje en los botones de arriba."));

    base().vaciar(panel.medidor.numero);
    panel.medidor.numero.appendChild(reduccion === null ? texto("—") : numA("medidor", reduccion, "porcentaje", origenRed));
    base().vaciar(f.medidor);
    var marca = " La marca del " + pct(umbral) + " es el umbral de la hipótesis de la tesis.";
    if (reduccion === null) f.medidor.appendChild(texto("No se puede calcular: sin cubrirte, tu rentabilidad no se mueve entre los seis años."));
    else if (!cubre) f.medidor.appendChild(texto("Sin cubrirte no sacás riesgo. Con cobertura, el arco se llena según cuánto menos se mueve tu rentabilidad de un año a otro." + marca));
    else if (reduccion < 0) f.medidor.appendChild(texto("Con esta cobertura tu rentabilidad se mueve más que sin cubrirte entre los seis años." + marca));
    else {
      f.medidor.appendChild(texto("Con tu cobertura, tu rentabilidad se mueve "));
      f.medidor.appendChild(num(reduccion, "porcentaje", origenRed));
      f.medidor.appendChild(texto(" menos de un año a otro que sin cubrirte." + marca));
    }

    base().vaciar(f.recta);
    f.recta.appendChild(texto("Entre el peor año (" + v.campanas[peor] + ", "));
    f.recta.appendChild(num(totalesCon[peor], "usd", o("MB total del escenario " + v.campanas[peor])));
    f.recta.appendChild(texto(" USD) y el mejor (" + v.campanas[mejor] + ", "));
    f.recta.appendChild(num(totalesCon[mejor], "usd", o("MB total del escenario " + v.campanas[mejor])));
    f.recta.appendChild(texto(" USD) hay "));
    f.recta.appendChild(num(rango, "usd", o("diferencia entre el mejor y el peor MB total de los 6 escenarios")));
    f.recta.appendChild(texto(" USD de diferencia" + (cubre ? "; sin cubrirte serían " : ".")));
    if (cubre) {
      f.recta.appendChild(num(rangoSin, "usd", o("diferencia entre el mejor y el peor MB total sin cubrir")));
      f.recta.appendChild(texto(" USD."));
    }
  }

  // Cambió la proporción que se mira: se repinta sólo lo que depende de ella.
  function repintarCobertura() {
    if (!ultimaVista) return;
    pintarPropuesta(ultimaVista);
    pintarDetalle(vistaVer());
    dibujarGraficos(vistaVer());
  }

  // Las cinco proporciones lado a lado: toneladas, comisión, esperado y riesgo (va en «Ver más detalle»).
  function pintarCoberturas(v) {
    var cont = nodos.coberturas;
    base().vaciar(cont);
    var o = function (f) { return origenDe(f, v, TODO); };
    var cols = C().PROPORCIONES.map(function (h) { return C().cobertura(v, h); });
    var filas = [
      filaTabla(["Toneladas cubiertas"].concat(cols.map(function (c) { return num(c.toneladasCubiertas, "entero", o("toneladas cubiertas")); }))),
      filaTabla(["Comisión (USD)"].concat(cols.map(function (c) { return num(c.comisionUsd, "usd", o("COM = comisión × toneladas cubiertas × F27")); }))),
      filaTabla(["Resultado esperado (USD)"].concat(cols.map(function (c) { return num(c.mbTotal, "usd", o(TEXTO_FORMULA_MB)); }))),
      filaTabla(["Peor caso (USD)"].concat(cols.map(function (c) { return num(c.peorMbTotal, "usd", o("peor MB total")); })))
    ];
    var actual = C().cobertura(v, v.hPorCultivo);
    var filasC = v.nombres.map(function (c) {
      var x = actual.porCultivo[c];
      return filaTabla([c, pct(x.h), num(x.toneladas, "entero", o("toneladas cubiertas = hectáreas × rinde × proporción cubierta")),
        num(x.comisionUsd, "usd", o("COM = comisión × toneladas cubiertas × F27")), num(x.mbTotal, "usd", o(TEXTO_FORMULA_MB))]);
    });
    if (v.nombres.length > 1) {
      filasC.push(filaTabla(["Total de la campaña", etiquetaEleccion(v), num(actual.toneladasCubiertas, "entero", o("toneladas cubiertas")),
        num(actual.comisionUsd, "usd", o("COM = comisión × toneladas cubiertas × F27")), num(actual.mbTotal, "usd", o("MB total = Σ hectáreas × MB por hectárea"))]));
    }
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sc-tabla sc-tabla-cultivos" }, [
      el("caption", null, "Tu cobertura, cultivo por cultivo"),
      el("thead", null, filaTabla(["Cultivo", "Cubierto", "Toneladas cubiertas", "Comisión (USD)", "Resultado esperado (USD)"], true)), el("tbody", null, filasC)])));
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sc-tabla" }, [
      el("caption", null, "Qué cambia si cubrís la misma proporción en todos los cultivos"),
      el("thead", null, filaTabla([""].concat(C().PROPORCIONES.map(pct)), true)), el("tbody", null, filas)])));
    cont.appendChild(el("p", { "class": "ayuda" }, "Desvío: cuánto se mueve tu rentabilidad de un año a otro (más bajo = más previsible). Sharpe adaptado: cuánta rentabilidad obtenés por cada punto de riesgo (más alto = mejor). El peor caso es el peor de los seis años de la tesis. No calculamos cantidad de contratos porque el tamaño del contrato no está en las fuentes de la tesis."));
  }

  function pintarDetalle(vv) {
    pintarCoberturas(vv);
    pintarProporciones(vv);
    pintarComparacion(vv);
    pintarRiesgo(vv);
    pintarLectura(vv);
  }

  function mostrarVacio(mensaje) {
    nodos.vacio.textContent = mensaje;
    nodos.vacio.hidden = !mensaje;
    nodos.ok.hidden = !!mensaje;
  }
  function filaTabla(celdas, cabecera) {
    return el("tr", null, celdas.map(function (c, i) { return el(i === 0 || cabecera ? "th" : "td", i === 0 && !cabecera ? { scope: "row" } : (cabecera ? { scope: "col" } : null), c); }));
  }

  function pintarProporciones(v) {
    var cont = nodos.proporciones;
    base().vaciar(cont);
    var items = v.nombres.map(function (c) {
      var i = v.cultivos[c];
      return el("li", { "class": "sc-proporcion sc-cultivo-" + c.toLowerCase().replace("í", "i") }, [
        el("span", { "class": "sc-punto", "aria-hidden": "true" }), el("span", { "class": "sc-prop-nombre" }, c + ": "),
        num(i.ha, "entero", "Lo cargaste vos"), " ha · ", num(i.proporcion, "porcentaje", "Lo cargaste vos")]);
    });
    cont.appendChild(el("ul", { "class": "sc-lista-proporciones" }, items));
  }

  function pintarComparacion(v) {
    var cont = nodos.comparacion;
    base().vaciar(cont);
    var cols = [{ res: v.resultados[0], titulo: "Spot proyectado (0 % cubierto)" }, { res: v.usuario, titulo: "Tu elección (" + etiquetaEleccion(v) + ")" }, { res: v.resultados[1], titulo: "Futuro (100 % cubierto)" }];
    var o = function (f) { return origenDe(f, v, { entradas: true, precios: true, base: true, comision: true, f27: true, spot: true, v: true }); };
    var filas = [filaTabla([""].concat(cols.map(function (c) { return c.titulo; })), true)];
    filas.push(filaTabla(["Margen bruto (USD/ha)"].concat(cols.map(function (c) { return num(c.res.mbHa, "usd", o(TEXTO_FORMULA_MB)); }))));
    filas.push(filaTabla(["Margen bruto total (USD)"].concat(cols.map(function (c) { return num(c.res.mbTotal, "usd", o("MB total = Σ hectáreas × MB/ha")); }))));
    filas.push(filaTabla(["R sobre la tierra"].concat(cols.map(function (c) { return num(c.res.r, "porcentaje", o("R = MB total ÷ (hectáreas × V)")); }))));
    v.nombres.forEach(function (cultivo) {
      filas.push(filaTabla(["Precio de venta " + cultivo + " (USD/t)"].concat(cols.map(function (c) {
        return num(c.res.porCultivo[cultivo].precio, "usd2", o("P = h·(F27 + base) + (1 − h)·spot proyectado"));
      }))));
    });
    var cabecera = filas.shift();
    var tabla = el("table", { "class": "mc-tabla sc-tabla" }, [el("caption", null, "Futuro (precio fijado hoy) contra spot proyectado (supuesto)"), el("thead", null, cabecera), el("tbody", null, filas)]);
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, tabla));
    var notas = v.nombres.map(function (c) {
      var p = v.cultivos[c].precios;
      return el("li", null, [c + ": spot proyectado = último Sc (", num(p.scUltimo, "usd2", p.origenSc[1]), ") × (1 + ", num(p.crecimientoAnual, "porcentaje", p.origenSc.join(" · ") + " — crecimiento anual compuesto: (Sc " + p.ultima + " ÷ Sc " + p.primera + ")^(1/5) − 1"),
        ") = ", num(p.spotProyectado, "usd2", base().origenCalculado("último Sc × (1 + crecimiento anual compuesto)", p.origenSc, null, ["supuesto del grupo, no un pronóstico"])),
        " USD/t; base esperada = promedio de (Sc − Fc) = ", num(p.base, "usd2", base().origenCalculado("promedio de (Sc − Fc) de las 6 campañas", p.origenBase)), " USD/t."]);
    });
    cont.appendChild(el("ul", { "class": "sc-notas-precios" }, notas));
  }

  function pintarRiesgo(v) {
    var cont = nodos.riesgo;
    base().vaciar(cont);
    var o = function (f) { return origenDe(f, v, { entradas: true, escenarios: true, v: true, comision: true, f27: true }); };
    var cab = filaTabla(["Cubierto", "R media", "Desvío de R", "Sharpe adaptado", "Peor caso (R)", "Mejor caso (R)"], true);
    var uniforme = hUniforme(v.hPorCultivo);
    var lineas = C().PROPORCIONES.map(function (h) { return { nombre: Math.round(h * 100) + " %", esc: v.escenarios[h], elegida: h === uniforme }; });
    if (uniforme === null) lineas.push({ nombre: "Tu elección (por cultivo)", esc: v.escenarioUsuario, elegida: true });
    var filas = lineas.map(function (l) {
      var e = l.esc.estadisticasR;
      var tr = filaTabla([l.nombre,
        num(e.media, "porcentaje", o("promedio de R en los 6 escenarios")), num(e.desvio, "porcentaje", o("desvío muestral (n − 1) de R")),
        num(e.sharpe, "ratio", o("R media ÷ desvío de R")), num(e.peor, "porcentaje", o("mínimo de R")), num(e.mejor, "porcentaje", o("máximo de R"))]);
      if (l.elegida) tr.setAttribute("class", "sc-fila-elegida");
      return tr;
    });
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sc-tabla" }, [
      el("caption", null, "Riesgo con los 6 escenarios históricos, por proporción cubierta"), el("thead", null, cab), el("tbody", null, filas)])));
    cont.appendChild(el("p", { "class": "ayuda" }, "Sharpe adaptado: R media ÷ desvío de R entre los seis escenarios, sin tasa libre de riesgo. Si el desvío es 0, no se define (—). La fila marcada es la proporción que elegiste."));

    // Detalle por campaña (R de cada escenario).
    var cabE = filaTabla(["Cubierto"].concat(v.campanas), true);
    var filasE = lineas.map(function (l) {
      return filaTabla([l.nombre].concat(l.esc.r.map(function (r) { return num(r, "porcentaje", o("R con la sorpresa de precio de esa campaña aplicada al spot proyectado (sin cubrir) y al F27 (cubierto)")); })));
    });
    nodos.plegablesTabla = [];
    var detalleR = el("details", { "class": "sc-detalle-escenarios" }, [el("summary", null, "Ver R en cada uno de los seis escenarios"),
      el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sc-tabla" }, [el("thead", null, cabE), el("tbody", null, filasE)])),
      el("p", { "class": "ayuda" }, "Cada escenario aplica la sorpresa de precio de una campaña de la tesis. Sin cubrir: P = spot proyectado × Sc ÷ Fs. Cubierto: P = F27 × (1 + (Sc − Fc) ÷ Fs). Mezcla: según la proporción cubierta.")]);
    nodos.plegablesTabla.push(detalleR);
    cont.appendChild(detalleR);
  }

  function pintarLectura(v) {
    var cont = nodos.lectura;
    base().vaciar(cont);
    var l = v.lectura;
    var o = function (f) { return origenDe(f, v, { entradas: true, escenarios: true, v: true, comision: true, f27: true }); };
    var u = function (x) { return Math.abs(x); };
    var verbo = l.resignaMbHa >= 0 ? "resigna" : "suma";
    var p1 = ["Con estos supuestos, cubrir el 100 % con futuros ", verbo, " ", num(u(l.resignaMbHa), "usd", o("diferencia de MB/ha medio entre 0 % y 100 % cubierto")),
      " USD/ha en promedio de los seis escenarios históricos (de ", num(l.mediaMbHa0, "usd", o("MB/ha medio sin cubrir")), " a ", num(l.mediaMbHa100, "usd", o("MB/ha medio cubierto")), " USD/ha)",
      l.mejoraPeorMbHa >= 0 ? " y mejora el peor caso en " : " y empeora el peor caso en ", num(u(l.mejoraPeorMbHa), "usd", o("diferencia entre los peores MB/ha")), " USD/ha (de ",
      num(l.peorMbHa0, "usd", o("peor MB/ha sin cubrir")), " a ", num(l.peorMbHa100, "usd", o("peor MB/ha cubierto")), " USD/ha)."];
    var p2 = ["El desvío de R pasa de ", num(l.desvioR0, "porcentaje", o("desvío de R sin cubrir")), " sin cubrir a ", num(l.desvioR100, "porcentaje", o("desvío de R cubierto")),
      " con el 100 % cubierto: es el ancho de lo que varió la rentabilidad entre campañas, no una promesa de lo que vaya a pasar."];
    cont.appendChild(el("h3", null, "En palabras"));
    cont.appendChild(el("p", null, p1));
    cont.appendChild(el("p", null, p2));
  }
  // ---------------------------------------------------------------------------------------
  // Gráficos (Apache ECharts, si está cargado)
  // ---------------------------------------------------------------------------------------

  function colorDe(nombre, respaldo) {
    if (imprimiendo && PALETA_IMPRESION[nombre]) return PALETA_IMPRESION[nombre];
    try {
      if (typeof raiz.getComputedStyle === "function" && raiz.document.documentElement) {
        var v = raiz.getComputedStyle(raiz.document.documentElement).getPropertyValue("--" + nombre);
        if (v && String(v).trim()) return String(v).trim();
      }
    } catch (e) { /* sin estilos calculados: se usa el respaldo */ }
    return respaldo;
  }

  function sinAnimacion() {
    if (imprimiendo) return true;
    try { return typeof raiz.matchMedia === "function" && raiz.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }

  function dibujar(clave, nodo, opcion) {
    if (!raiz.echarts || !nodo) return;
    try {
      var g = graficos[clave];
      if (!g) { g = graficos[clave] = raiz.echarts.init(nodo, null, { renderer: "svg" }); }
      g.setOption(opcion, true);
      g.resize(imprimiendo ? { width: ANCHO_IMPRESION, height: ALTO_IMPRESION } : undefined);
      // Para imprimir el dibujo tiene que estar terminado antes de que el navegador arme la hoja: no se espera al próximo cuadro.
      if (imprimiendo && typeof g.getZr === "function") g.getZr().refreshImmediately();
    } catch (e) {
      nodo.setAttribute("data-error", String(e && e.message ? e.message : e));
    }
  }

  function textoBase() {
    return { color: colorDe("color-texto", "#f4f4f4"), fontFamily: colorDe("fuente-texto", "sans-serif"), fontSize: 13 };
  }

  // Aviso flotante del tema (en oscuro, ECharts lo dibuja blanco si no se le dice): capa, línea fina, sin esquinas redondas ni sombra.
  function tooltipDelTema(extra) {
    var t = {
      backgroundColor: colorDe("color-superficie-2", "#393939"), borderColor: colorDe("color-borde-fuerte", "#6f6f6f"), borderWidth: 1,
      textStyle: { color: colorDe("color-texto", "#f4f4f4"), fontFamily: colorDe("fuente-texto", "sans-serif") },
      extraCssText: "border-radius:0;box-shadow:none;"
    };
    Object.keys(extra).forEach(function (k) { t[k] = extra[k]; });
    return t;
  }

  function dibujarGraficos(v) {
    if (nodos.mas && nodos.mas.hidden && !imprimiendo) return;
    if (!raiz.echarts) return;
    var fm = base().formato;
    var colores = { Trigo: colorDe("color-trigo", "#f1c21b"), Soja: colorDe("color-soja", "#08bdba"), "Maíz": colorDe("color-maiz", "#eb6200") };
    var txt = textoBase();
    var suave = colorDe("color-texto-suave", "#c6c6c6");
    var borde = colorDe("color-borde", "#393939");
    var bordeFuerte = colorDe("color-borde-fuerte", "#6f6f6f");
    var anim = !sinAnimacion();

    dibujar("torta", nodos.graficoTorta, {
      animation: anim, textStyle: txt,
      tooltip: tooltipDelTema({ trigger: "item", formatter: function (p) { return p.name + ": " + fm.entero(p.value) + " ha (" + fm.porcentaje(p.percent / 100) + ")"; } }),
      series: [{ type: "pie", radius: ["42%", "70%"], avoidLabelOverlap: true, itemStyle: { borderColor: colorDe("color-fondo", "#161616"), borderWidth: 2 },
        label: { show: false, color: txt.color }, labelLine: { show: false, lineStyle: { color: bordeFuerte } },
        data: v.nombres.map(function (c) { return { name: c, value: v.cultivos[c].ha, itemStyle: { color: colores[c] } }; }) }]
    });

    var cats = ["Spot proyectado\n(0 % cubierto)", "Tu elección\n(" + etiquetaEleccion(v) + ")", "Futuro\n(100 % cubierto)"];
    var vals = [v.resultados[0].mbHa, v.usuario.mbHa, v.resultados[1].mbHa];
    var colsBarra = [colorDe("color-sin", "#b28600"), colorDe("color-acento", "#4589ff"), colorDe("color-con", "#009d9a")];
    dibujar("comparacion", nodos.graficoComparacion, {
      animation: anim, textStyle: txt, grid: { left: 56, right: 16, top: 24, bottom: 48 },
      tooltip: tooltipDelTema({ trigger: "item", formatter: function (p) { return p.name.replace("\n", " ") + ": " + fm.usd(p.value) + " USD/ha"; } }),
      xAxis: { type: "category", data: cats, axisLabel: { color: txt.color, interval: 0 }, axisLine: { lineStyle: { color: bordeFuerte } }, axisTick: { lineStyle: { color: bordeFuerte } } },
      yAxis: { type: "value", axisLabel: { color: suave, formatter: function (x) { return fm.usd(x); } }, splitLine: { lineStyle: { color: borde } } },
      series: [{ type: "bar", barMaxWidth: 64, data: vals.map(function (x, i) { return { value: x, itemStyle: { color: colsBarra[i] } }; }),
        label: { show: true, position: "top", color: txt.color, formatter: function (p) { return fm.usd(p.value); } } }]
    });

    var series = [{ h: 0, nombre: "0 % cubierto", color: colorDe("color-sin", "#b28600") }, { h: 1, nombre: "100 % cubierto", color: colorDe("color-con", "#009d9a") }];
    var uniformeG = hUniforme(v.hPorCultivo);
    if (uniformeG === null || (uniformeG > 0 && uniformeG < 1)) {
      series.splice(1, 0, { escenario: v.escenarioUsuario, nombre: uniformeG === null ? "Tu elección (por cultivo)" : Math.round(uniformeG * 100) + " % cubierto", color: colorDe("color-acento", "#4589ff"), discontinua: true });
    }
    dibujar("escenarios", nodos.graficoEscenarios, {
      animation: anim, textStyle: txt, grid: { left: 56, right: 16, top: imprimiendo ? 64 : 40, bottom: 32 },
      // En papel el gráfico es angosto: la leyenda ocupa dos renglones y el área del dibujo arranca debajo de ella, sin pisar el eje.
      legend: { top: 0, itemGap: imprimiendo ? 10 : 10, textStyle: { color: txt.color, fontFamily: txt.fontFamily, fontSize: imprimiendo ? 11 : 12 }, inactiveColor: bordeFuerte },
      tooltip: tooltipDelTema({ trigger: "axis", axisPointer: { lineStyle: { color: bordeFuerte } }, valueFormatter: function (x) { return fm.porcentaje(x); } }),
      xAxis: { type: "category", data: v.campanas, boundaryGap: false, axisLabel: { color: txt.color }, axisLine: { lineStyle: { color: bordeFuerte } } },
      yAxis: { type: "value", scale: true, axisLabel: { color: suave, formatter: function (x) { return fm.porcentaje(x); } }, splitLine: { lineStyle: { color: borde } } },
      series: series.map(function (s) {
        return { name: s.nombre, type: "line", symbolSize: 7, itemStyle: { color: s.color }, lineStyle: { color: s.color, width: 3, type: s.discontinua ? "dashed" : "solid" }, data: (s.escenario || v.escenarios[s.h]).r };
      })
    });
  }

  function redimensionar() {
    if (imprimiendo) return;
    Object.keys(graficos).forEach(function (k) { try { graficos[k].resize(); } catch (e) { /* instancia ya liberada */ } });
  }

  // ---------------------------------------------------------------------------------------
  // Calcular, mostrar y montar
  // ---------------------------------------------------------------------------------------

  // Calcula con lo cargado y pinta los resultados. Devuelve la vista, o null si los datos no alcanzan (el asistente marca qué falta).
  function recalcular() {
    var lectura = C().leerEntradas(null, textosParaCalcular());
    if (!lectura.entrada) {
      ultimaVista = null;
      var primero = Object.keys(lectura.errores)[0];
      mostrarVacio("Revisá tus datos para ver el resultado (" + lectura.errores[primero] + ")");
      return null;
    }
    var vista = C().calcular(null, lectura.entrada);
    ultimaVista = vista;
    mostrarVacio("");
    nodos.resumen.textContent = "Zona " + vista.zona + " · " + vista.nombres.join(", ") + " · " + fm().entero(vista.hectareasTotales) + " ha";
    pintarSabemos(vista);
    pintarHoy(vista);
    pintarCalendarioResultado(vista);
    pintarPropuesta(vista);
    pintarDetalle(vistaVer());
    pintarSupuestos(vista, lectura.entrada);
    pintarEncabezado();
    pintarFecha();
    dibujarGraficos(vistaVer());
    return vista;
  }

  function mostrarAsistente() {
    estado.cargado = false;
    nodos.asistente.hidden = false;
    nodos.resultados.hidden = true;
    estado.paso = 1;
    sincronizarTodo();
  }

  // Pasa de la carga a los resultados (y le avisa a la página que ya hay datos: aparecen las demás pestañas).
  function mostrarResultados() {
    var vista = recalcular();
    if (!vista) { nodos.resultados.hidden = true; nodos.asistente.hidden = false; return false; }
    estado.cargado = true;
    nodos.asistente.hidden = true;
    nodos.resultados.hidden = false;
    if (V() && nodos.visual) V().redimensionarPanel(nodos.visual);

    if (base().fijarCargado) base().fijarCargado(true);
    return true;
  }

  function cambiarMisDatos() {
    mostrarAsistente();
    nodos.avisoLink.hidden = true;
    if (base().refrescar) base().refrescar();
    try { nodos.asistente.firstChild.focus(); } catch (e) { /* sin foco */ }
  }

  function alternarDetalle() {
    var abrir = nodos.mas.hidden;
    nodos.mas.hidden = !abrir;
    nodos.botonMas.setAttribute("aria-expanded", abrir ? "true" : "false");
    nodos.botonMas.textContent = abrir ? "Ocultar el detalle" : "Ver más detalle";
    if (abrir && ultimaVista) dibujarGraficos(vistaVer());
  }

  function plegableDeGrafico(titulo, figura) {
    var d = el("details", { "class": "sc-avanzado sc-plegable-grafico" }, [el("summary", null, titulo), figura]);
    d.addEventListener("toggle", function () { if (ultimaVista) dibujarGraficos(vistaVer()); });
    nodos.plegablesGraficos.push(d);
    return d;
  }

  function contenedorDeGrafico(clave, titulo, eje, etiquetaAria) {
    var nodo = el("div", { "class": "sc-grafico", role: "img", "aria-label": etiquetaAria });
    nodos[clave] = nodo;
    var encabezado = eje ? base().encabezadoDeGrafico(titulo, eje) : el("div", { "class": "grafico-encabezado" }, el("p", { "class": "grafico-titulo" }, titulo));
    return el("figure", { "class": "sc-figura" }, [encabezado, nodo]);
  }

  function montarResultados(contenedor) {
    nodos.avisoLink = el("p", { "class": "mensaje sc-aviso-link", role: "status" });
    nodos.avisoLink.hidden = true;
    nodos.cabeceraImpresion = el("div", { "class": "sc-impresion-cabecera" }, [
      el("p", { "class": "sc-imp-titulo" }, "Simulador de cobertura con futuros · Informe de campaña 2026/27"),
      el("p", { "class": "sc-imp-detalle" }, "Región Pampeana · pequeños y medianos productores (hasta 1.000 ha) · TIF Lic. en Finanzas (UADE)")]);
    nodos.fecha = el("p", { "class": "sc-imp-fecha" });
    nodos.cabeceraImpresion.appendChild(nodos.fecha);
    nodos.encabezado = el("p", { "class": "sc-encabezado-informe" });
    nodos.encabezado.hidden = true;
    nodos.supuestos = el("div", { "class": "sc-supuestos" });
    nodos.estadoLink = el("p", { "class": "sc-estado-link", role: "status" });
    nodos.estadoLink.hidden = true;
    nodos.linkTexto = el("input", { type: "text", readonly: "readonly", id: "sc-link-texto", "aria-label": "Link de este escenario", spellcheck: "false" });
    nodos.linkCaja = el("div", { "class": "sc-link-caja" }, nodos.linkTexto);
    nodos.linkCaja.hidden = true;
    var botonCambiar = el("button", { type: "button", "class": "sc-boton", id: "sc-cambiar" }, "Cambiar mis datos");
    botonCambiar.addEventListener("click", cambiarMisDatos);
    var botonImprimir = el("button", { type: "button", "class": "sc-boton", id: "sc-imprimir" }, "Imprimir o guardar en PDF");
    botonImprimir.addEventListener("click", imprimir);
    var botonLink = el("button", { type: "button", "class": "sc-boton", id: "sc-compartir" }, "Compartir");
    botonLink.addEventListener("click", copiarLink);
    nodos.acciones = el("div", { "class": "sc-acciones" }, [el("div", { "class": "sc-acciones-botones" }, [botonCambiar, botonImprimir, botonLink]), nodos.estadoLink, nodos.linkCaja]);
    nodos.resumen = el("p", { "class": "sc-resumen-zona" });
    nodos.vacio = el("p", { "class": "mensaje", role: "status" });
    nodos.vacio.hidden = true;
    nodos.sabemos = el("div", { "class": "sc-seccion-res", id: "sc-sabemos" });
    nodos.hoy = el("div", { "class": "sc-seccion-res", id: "sc-hoy" });
    nodos.propuesta = el("div", { "class": "sc-seccion-res", id: "sc-propuesta" });
    nodos.calendarioRes = el("div", { "class": "sc-calendario-res" });
    nodos.coberturas = el("div", { "class": "sc-coberturas" });
    nodos.proporciones = el("div", { "class": "sc-proporciones" });
    nodos.comparacion = el("div", { "class": "sc-comparacion" });
    nodos.riesgo = el("div", { "class": "sc-riesgo" });
    nodos.lectura = el("div", { "class": "tarjeta sc-lectura" });
    nodos.plegablesGraficos = [];
    nodos.visual = V() ? V().crearPanel() : null;
    var figTorta = contenedorDeGrafico("graficoTorta", "Cultivos de la campaña (proporción de hectáreas)", null, "Gráfico de torta con la proporción de hectáreas de cada cultivo");
    var figComp = contenedorDeGrafico("graficoComparacion", "Futuro contra spot proyectado", "margen bruto en USD por hectárea", "Gráfico de barras: margen bruto por hectárea con spot proyectado, con la cobertura elegida y con futuro");
    var figEsc = contenedorDeGrafico("graficoEscenarios", "Rentabilidad R en los seis escenarios históricos", "R (margen bruto ÷ valor de la tierra); eje horizontal: campaña cuya sorpresa de precio se aplica", "Gráfico de líneas: rentabilidad en cada escenario histórico, sin cubrir y cubierto");
    nodos.mas = el("div", { "class": "sc-mas", id: "sc-mas" }, [
      nodos.coberturas,
      plegableDeGrafico("Ver el gráfico de cultivos", el("div", null, [figTorta, nodos.proporciones])),
      plegableDeGrafico("Ver el gráfico de futuro contra spot", figComp),
      plegableDeGrafico("Ver el gráfico de los seis escenarios", figEsc),
      nodos.comparacion, nodos.riesgo, nodos.lectura
    ]);
    nodos.mas.hidden = true;
    nodos.botonMas = el("button", { type: "button", "class": "sc-boton sc-boton-mas", id: "sc-mas-boton", "aria-expanded": "false", "aria-controls": "sc-mas" }, "Ver más detalle");
    nodos.botonMas.addEventListener("click", alternarDetalle);
    nodos.ok = el("div", { "class": "sc-ok" }, [
      nodos.cabeceraImpresion, nodos.encabezado, nodos.acciones, nodos.supuestos,
      nodos.resumen, nodos.sabemos, nodos.hoy, nodos.propuesta,
      el("div", { "class": "sc-mas-caja" }, [nodos.botonMas, nodos.mas]),
      el("p", { "class": "sc-aviso", role: "note" }, [el("strong", null, "Esto no es asesoramiento financiero. "),
        "El precio de cosecha proyectado es un supuesto del grupo (el crecimiento anual compuesto del precio disponible a cosecha entre 2020/21 y 2025/26), no un pronóstico. " +
        "Los seis escenarios aplican las sorpresas de precio de las campañas pasadas al precio de cosecha proyectado (lo que no cubrís) y la base histórica al futuro 2026/27 (lo que cubrís), con rinde fijo: describen lo que pasó, no lo que va a pasar."])
    ]);
    nodos.resultados = el("div", { "class": "mc-resultados sc-resultados", id: "sc-resultados", "aria-live": "polite" }, [nodos.avisoLink, nodos.vacio, nodos.ok]);
    nodos.resultados.hidden = true;
    contenedor.appendChild(nodos.resultados);
    if (V()) { V().entrada(nodos.sabemos); V().entrada(nodos.hoy); }
  }

  function montar(contenedor) {
    estado = estadoVacio();
    leerNombresGuardados();
    montarAsistente(contenedor);
    montarResultados(contenedor);
    if (V()) V().scrollSuave();
    sincronizarTodo();
    pintarEncabezado();
    pintarFecha();
    // Si la página se abrió con un link de escenario (#campana?z=...), se cargan los resultados directo; también si el hash cambia después.
    aplicarLink(hashActual());
    if (typeof raiz.addEventListener === "function") {
      raiz.addEventListener("hashchange", function () { if (aplicarLink(hashActual()) && base().refrescar) base().refrescar(); });
      raiz.addEventListener("beforeprint", antesDeImprimir);
      raiz.addEventListener("afterprint", despuesDeImprimir);
      raiz.addEventListener("resize", redimensionar);
      raiz.addEventListener("hashchange", function () { if (typeof raiz.setTimeout === "function") raiz.setTimeout(redimensionar, 0); });
    }
    try {
      var oscuro = typeof raiz.matchMedia === "function" ? raiz.matchMedia("(prefers-color-scheme: dark)") : null;
      if (oscuro && typeof oscuro.addEventListener === "function") oscuro.addEventListener("change", function () { if (ultimaVista && !imprimiendo) dibujarGraficos(vistaVer()); });
      // Respaldo de beforeprint/afterprint: el navegador avisa también cuando la hoja pasa a modo impresión.
      var papel = typeof raiz.matchMedia === "function" ? raiz.matchMedia("print") : null;
      if (papel && typeof papel.addEventListener === "function") papel.addEventListener("change", function (ev) { if (ev.matches) antesDeImprimir(); else despuesDeImprimir(); });
    } catch (e) { /* sin matchMedia: los gráficos se repintan con la próxima entrada */ }
  }

  function actualizar() {
    if (estado && estado.cargado) recalcular();
  }

  function limpiar() {
    ultimaVista = null;
    if (nodos.ok) { nodos.ok.hidden = true; }
  }

  var api = {
    textosParaCalcular: function () { return textosParaCalcular(); }, estado: function () { return estado; }, contexto: contexto,
    armarLink: armarLink, leerLink: leerLink, aplicarLink: function (hash) { var r = aplicarLink(hash); if (r && base().refrescar) base().refrescar(); return r; },
    nombres: function () { return { campo: nombres.campo, persona: nombres.persona }; }, CLAVE_INFORME: CLAVE_INFORME, MAX_NOMBRE: MAX_NOMBRE,
    PASOS: PASOS, vista: function () { return ultimaVista; }
  };
  var seccion = { id: "campana", titulo: "Simulá tu campaña", icono: "sprout", sinDatos: true, montar: montar, actualizar: actualizar, limpiar: limpiar };
  raiz.TESIS_CAMPANA_UI = api;
  if (!raiz.TESIS_APP) throw new Error("campana-ui.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
