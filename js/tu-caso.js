// Pestaña «Lo que pasó» › «Tu caso»: lo que pasó entre 2020/21 y 2025/26 en la zona y con los cultivos que cargó el productor, en una
// lectura corta. Usa los márgenes reales de los Excels de la tesis (con el rinde que hubo cada campaña): acá sólo se ordenan y se comparan.
// Lo demás de «Lo que pasó» (Mi campo, Riesgo e hipótesis, etc.) queda en las otras subpestañas, sin cambios.
(function (raiz) {
  "use strict";

  var nodos = {};

  function base() { return raiz.TESIS_APP; }
  function el(e, a, c) { return base().el(e, a, c); }
  function num(v, f, o) { return base().numero(v, f, o); }

  function contexto() {
    return raiz.TESIS_CAMPANA_UI && raiz.TESIS_CAMPANA_UI.contexto ? raiz.TESIS_CAMPANA_UI.contexto() : null;
  }

  // Por cada cultivo: las seis campañas con el margen real sin cobertura y con cobertura total (USD/ha), la mejor y la peor.
  // Función pura: no toca el DOM.
  function armar(datos, zona, cultivos) {
    datos = datos || raiz.TESIS_DATOS;
    var m = raiz.TESIS_MOTOR;
    return cultivos.map(function (cultivo) {
      var casos = m.casosDe(datos, cultivo, zona).slice().sort(function (a, b) { return a.campana < b.campana ? -1 : a.campana > b.campana ? 1 : 0; });
      if (!casos.length) throw new Error("La tesis no tiene " + cultivo + " en la zona «" + zona + "».");
      var filas = casos.map(function (c) {
        return { campana: c.campana, sin: c.excel.mbRealSin, con: c.excel.mbRealCon,
          origenSin: m.origen(c, "excel.mbRealSin", datos), origenCon: m.origen(c, "excel.mbRealCon", datos) };
      });
      var mejor = filas.reduce(function (a, f) { return !a || f.sin > a.sin ? f : a; }, null);
      var peor = filas.reduce(function (a, f) { return !a || f.sin < a.sin ? f : a; }, null);
      var peorCon = filas.reduce(function (a, f) { return !a || f.con < a.con ? f : a; }, null);
      return { cultivo: cultivo, filas: filas, mejor: mejor, peor: peor, peorCon: peorCon,
        hCubierto: datos.parametros.h.v };
    });
  }

  function pintar() {
    var cont = nodos.cuerpo;
    base().vaciar(cont);
    var ctx = contexto();
    if (!ctx) {
      cont.appendChild(el("p", { "class": "mensaje" }, "Cargá los datos de tu campaña en «Simulá tu campaña» y acá te mostramos qué pasó en tu zona con tus cultivos."));
      return;
    }
    var vistas = armar(raiz.TESIS_DATOS, ctx.zona, ctx.cultivos);
    cont.appendChild(el("p", { "class": "mc-intro" }, "Esto es lo que pasó entre 2020/21 y 2025/26 en tu zona (" + ctx.zona + ") con tus cultivos. Son márgenes brutos por hectárea con el rinde real de cada año."));
    vistas.forEach(function (v) {
      var campanas = v.filas.length;
      cont.appendChild(el("div", { "class": "tarjeta sc-clave" }, [
        el("h4", null, v.cultivo),
        el("p", { "class": "sc-frase sc-frase-grande" }, ["Sin cubrirte, tu mejor campaña fue la ", v.mejor.campana, ": ", num(v.mejor.sin, "usd", v.mejor.origenSin),
          " USD por hectárea. La peor, la ", v.peor.campana, ": ", num(v.peor.sin, "usd", v.peor.origenSin), " USD."]),
        el("p", { "class": "sc-frase" }, ["Cubriendo toda la cosecha, el peor año de las " + campanas + " campañas habría sido el ", v.peorCon.campana, ": ", num(v.peorCon.con, "usd", v.peorCon.origenCon),
          " USD por hectárea."])
      ]));
    });
    cont.appendChild(el("p", { "class": "sc-aviso", role: "note" }, [el("strong", null, "Esto describe lo que pasó. "), "No es una predicción. Más abajo, en las otras subpestañas, está el análisis completo de las zonas y los cultivos."]));
  }

  function montar(contenedor) {
    nodos.cuerpo = el("div", { "class": "sc-tu-caso" });
    contenedor.appendChild(nodos.cuerpo);
    pintar();
  }
  function actualizar() { if (nodos.cuerpo) pintar(); }
  function limpiar() { if (nodos.cuerpo) base().vaciar(nodos.cuerpo); }

  var api = { armar: armar };
  var seccion = { id: "tu-caso", titulo: "Tu caso", grupo: "historico", montar: montar, actualizar: actualizar, limpiar: limpiar };
  api.seccion = seccion;
  raiz.TESIS_TU_CASO = api;
  if (!raiz.TESIS_APP) throw new Error("tu-caso.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
