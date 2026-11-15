// Sección 3 · «Valor de la tierra»: evolución del valor de la tierra en USD/ha por zona (un valor por año de cosecha, 2021 a 2026,
// del Excel de rentabilidad) y la valorización anual compuesta de cada zona, calculada acá con los años que toma.
// El valor de la tierra es el denominador de la rentabilidad (R = margen ÷ V): su valorización NO entra en R.
// armar() es una función pura, sin DOM; el resto pinta la pantalla. Los gráficos son de Apache ECharts si está cargado.
(function (raiz) {
  "use strict";

  var NOTA_R = "El valor de la tierra es el denominador de la rentabilidad: R = margen bruto ÷ valor de la tierra. " +
    "Cuando la tierra se valoriza, la rentabilidad medida así baja (porque se divide por un número más grande), pero esa valorización no se suma a R: R mide sólo lo que deja la campaña por cada dólar de tierra.";
  var AYUDA = "Cada línea es el valor de una hectárea de tierra en una zona, en dólares, año a año. " +
    "La valorización anual compuesta es el porcentaje por año que habría que sumar, año tras año, para pasar del primer valor al último.";

  var estado = { zonas: null }; // lista de zonas elegidas (null hasta montar)
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

  // Valor de la tierra de una zona por año de cosecha. V es el mismo en todos los cultivos de la zona: se toma el primer caso de cada año.
  function serieDeZona(datos, zona) {
    var porAnio = {};
    datos.casos.forEach(function (c) { if (c.zona === zona && !porAnio[c.anioCosecha]) porAnio[c.anioCosecha] = c; });
    var anios = Object.keys(porAnio).map(Number).sort(function (a, b) { return a - b; });
    if (anios.length < 2) throw new Error("No hay valor de la tierra de al menos dos años en la zona «" + zona + "».");
    var puntos = anios.map(function (a) { return { anio: a, v: porAnio[a].v, origen: M().origen(porAnio[a], "v", datos) }; });
    var primero = puntos[0], ultimo = puntos[puntos.length - 1];
    var n = ultimo.anio - primero.anio;
    return {
      zona: zona, puntos: puntos, desde: primero.anio, hasta: ultimo.anio, anios: n,
      valorizacion: Math.pow(ultimo.v / primero.v, 1 / n) - 1,
      origen: [primero.origen, ultimo.origen]
    };
  }

  // Zonas con exactamente la misma serie (en los datos hay zonas que comparten el mismo valor): se dibujan como una sola línea.
  function agruparIguales(series) {
    var grupos = [];
    series.forEach(function (s) {
      var clave = s.puntos.map(function (p) { return p.anio + ":" + p.v; }).join("|");
      var g = grupos.filter(function (x) { return x.clave === clave; })[0];
      if (!g) { g = { clave: clave, zonas: [], serie: s }; grupos.push(g); }
      g.zonas.push(s.zona);
    });
    return grupos;
  }

  function enumerar(lista) {
    if (lista.length <= 1) return lista.join("");
    return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
  }

  // zonasElegidas: nombres de zona (en el orden de la lista de zonas). Sin elegir ninguna, la lectura queda en null.
  function armar(datos, zonasElegidas) {
    datos = datos || raiz.TESIS_DATOS;
    var todas = C().zonas(datos).map(function (z) { return serieDeZona(datos, z); });
    var elegidas = todas.filter(function (s) { return zonasElegidas.indexOf(s.zona) >= 0; });
    var anios = [];
    todas.forEach(function (s) { s.puntos.forEach(function (p) { if (anios.indexOf(p.anio) < 0) anios.push(p.anio); }); });
    anios.sort(function (a, b) { return a - b; });
    var vista = { anios: anios, todas: todas, elegidas: elegidas, grupos: agruparIguales(elegidas), lectura: null, promedioTodas: M().promedio(todas.map(function (s) { return s.valorizacion; })) };
    if (elegidas.length) {
      var mayor = elegidas.reduce(function (a, s) { return s.valorizacion > a.valorizacion ? s : a; });
      var menor = elegidas.reduce(function (a, s) { return s.valorizacion < a.valorizacion ? s : a; });
      vista.lectura = { promedio: M().promedio(elegidas.map(function (s) { return s.valorizacion; })), mayor: mayor, menor: menor, repetidas: vista.grupos.filter(function (g) { return g.zonas.length > 1; }) };
    }
    return vista;
  }

  // Datos del gráfico: una línea por grupo de zonas con la misma serie (null donde la zona no tiene el año).
  function armarGrafico(vista) {
    return {
      categorias: vista.anios.map(String),
      series: vista.grupos.map(function (g) {
        return {
          nombre: enumerar(g.zonas),
          valores: vista.anios.map(function (a) { var p = g.serie.puntos.filter(function (x) { return x.anio === a; })[0]; return p ? p.v : null; })
        };
      })
    };
  }

  // ---------------------------------------------------------------------------------------
  // Pantalla
  // ---------------------------------------------------------------------------------------

  function pintarTabla(v) {
    var cont = nodos.tabla;
    base().vaciar(cont);
    if (!v.elegidas.length) return;
    var cab = el("tr", null, [el("th", { scope: "col" }, "Zona")].concat(v.anios.map(function (a) { return el("th", { scope: "col" }, String(a)); }),
      [el("th", { scope: "col" }, "Años que toma"), el("th", { scope: "col" }, "Valorización anual compuesta")]));
    var filas = v.elegidas.map(function (s) {
      var celdas = v.anios.map(function (a) {
        var p = s.puntos.filter(function (x) { return x.anio === a; })[0];
        return el("td", null, p ? num(p.v, "usd", p.origen) : num(null, "usd"));
      });
      var formula = "(V " + s.hasta + " ÷ V " + s.desde + ")^(1 ÷ " + s.anios + ") − 1";
      return el("tr", null, [el("th", { scope: "row" }, s.zona)].concat(celdas, [
        el("td", null, s.desde + " a " + s.hasta + " (" + s.anios + (s.anios === 1 ? " año)" : " años)")),
        el("td", null, num(s.valorizacion, "porcentaje", base().origenCalculado(formula, s.origen)))]));
    });
    cont.appendChild(el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla sec-tabla" }, [
      el("caption", null, "Valor de la tierra (USD/ha) por zona y año de cosecha, y su valorización anual compuesta"),
      el("thead", null, cab), el("tbody", null, filas)])));
  }

  function pintarLectura(v) {
    var cont = nodos.lectura;
    base().vaciar(cont);
    cont.appendChild(el("h3", null, "En palabras"));
    if (!v.lectura) {
      cont.appendChild(el("p", null, "Elegí al menos una zona para ver su evolución y su valorización."));
      return;
    }
    var l = v.lectura;
    var origenes = [];
    v.elegidas.forEach(function (s) { s.origen.forEach(function (o) { origenes.push(o); }); });
    var anios = function (s) { return s.desde + " a " + s.hasta; };
    cont.appendChild(el("p", null, [v.elegidas.length === 1 ? "La zona " + v.elegidas[0].zona + " se valorizó " : "Las " + v.elegidas.length + " zonas elegidas se valorizaron en promedio ",
      num(l.promedio, "porcentaje", base().origenCalculado("promedio simple de las valorizaciones anuales compuestas de las zonas elegidas", origenes)),
      " por año entre " + anios(v.elegidas[0]) + "."]));
    if (v.elegidas.length > 1) {
      cont.appendChild(el("p", null, ["La que más se valorizó fue " + l.mayor.zona + " (", num(l.mayor.valorizacion, "porcentaje", base().origenCalculado("valorización anual compuesta", l.mayor.origen)),
        " por año, de " + anios(l.mayor) + ") y la que menos, " + l.menor.zona + " (", num(l.menor.valorizacion, "porcentaje", base().origenCalculado("valorización anual compuesta", l.menor.origen)),
        " por año, de " + anios(l.menor) + ")."]));
    }
    if (l.repetidas.length) {
      cont.appendChild(el("p", null, "En los datos de la tesis hay zonas con exactamente el mismo valor de la tierra año a año (" +
        l.repetidas.map(function (g) { return enumerar(g.zonas); }).join("; ") + "), por eso cada grupo comparte una sola línea en el gráfico."));
    }
  }

  function pintarGrafico(v) {
    if (!raiz.echarts || !ec) return;
    var t = raiz.TESIS_EC.tema();
    var g = armarGrafico(v);
    var colores = [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return raiz.TESIS_EC.colorDe("color-zona-" + i, "#7a3e1d"); });
    var series = g.series.map(function (s, i) { return { nombre: s.nombre, valores: s.valores, color: colores[i % colores.length], trazo: i >= 4 ? "dashed" : "solid" }; });
    ec.dibujar("tierra", nodos.grafico, raiz.TESIS_EC.opcionDeLineas(t, g.categorias, series, function (x) { return base().formato.usd(x); }, { escalar: true }));
  }

  function sincronizarChips() {
    Object.keys(nodos.chips).forEach(function (z) { nodos.chips[z].setAttribute("aria-pressed", estado.zonas.indexOf(z) >= 0 ? "true" : "false"); });
  }

  // Si el productor ya cargó su campaña, el gráfico arranca en su zona (se rehace sólo si cambió su campo; «Todas» muestra el resto).
  var contextoAplicado = null;
  function aplicarContexto() {
    var ctx = raiz.TESIS_CAMPANA_UI && raiz.TESIS_CAMPANA_UI.contexto ? raiz.TESIS_CAMPANA_UI.contexto() : null;
    var clave = ctx ? ctx.zona : null;
    if (clave === contextoAplicado || !nodos.contexto) return;
    contextoAplicado = clave;
    estado.zonas = ctx ? [ctx.zona] : C().zonas();
    nodos.contexto.textContent = ctx ? "Tu zona: " + ctx.zona + ". Tocá «Todas» para compararla con las demás." : "";
    nodos.contexto.hidden = !ctx;
  }

  function render() {
    sincronizarChips();
    var v = armar(raiz.TESIS_DATOS, estado.zonas);
    ultima = v;
    nodos.cuadro.hidden = false;
    nodos.resumen.textContent = v.elegidas.length ? v.elegidas.length + (v.elegidas.length === 1 ? " zona elegida" : " zonas elegidas") + " · USD por hectárea · años de cosecha " + v.anios[0] + " a " + v.anios[v.anios.length - 1]
      : "Ninguna zona elegida";
    nodos.figura.hidden = !v.elegidas.length;
    pintarTabla(v);
    pintarLectura(v);
    pintarGrafico(v);
    return v;
  }

  function alternar(zona) {
    var i = estado.zonas.indexOf(zona);
    if (i >= 0) estado.zonas.splice(i, 1); else estado.zonas.push(zona);
    estado.zonas = C().zonas().filter(function (z) { return estado.zonas.indexOf(z) >= 0; });
    render();
  }

  function montar(contenedor) {
    ec = raiz.TESIS_EC ? raiz.TESIS_EC.crear(function () { if (ultima) pintarGrafico(ultima); }) : null;
    var zonas = C().zonas();
    estado.zonas = zonas.slice();
    contenedor.appendChild(el("p", { "class": "mc-intro" }, AYUDA));
    nodos.chips = {};
    var fila = el("div", { "class": "sc-chips", role: "group", "aria-labelledby": "ti-zonas-titulo" });
    zonas.forEach(function (z) {
      var chip = el("button", { type: "button", "class": "sc-chip", "aria-pressed": "true", "data-zona": z }, z);
      chip.addEventListener("click", function () { alternar(z); });
      nodos.chips[z] = chip;
      fila.appendChild(chip);
    });
    var todas = el("button", { type: "button", "class": "sc-chip sec-accion", id: "ti-todas" }, "Todas");
    todas.addEventListener("click", function () { estado.zonas = zonas.slice(); render(); });
    var ninguna = el("button", { type: "button", "class": "sc-chip sec-accion", id: "ti-ninguna" }, "Ninguna");
    ninguna.addEventListener("click", function () { estado.zonas = []; render(); });
    contenedor.appendChild(el("div", { "class": "sc-grupo sec-selector-zonas" }, [
      el("p", { "class": "sc-titulo-grupo", id: "ti-zonas-titulo" }, "Zonas (elegí una o varias)"), fila, el("div", { "class": "sc-chips" }, [todas, ninguna])]));
    nodos.contexto = el("p", { "class": "sec-nota" });
    nodos.contexto.hidden = true;
    contenedor.appendChild(nodos.contexto);
    nodos.resumen = el("p", { "class": "sc-resumen-zona", role: "status" });
    nodos.grafico = el("div", { "class": "sc-grafico", role: "img", "aria-label": "Gráfico de líneas con el valor de la tierra en USD por hectárea de las zonas elegidas, año a año" });
    nodos.figura = el("figure", { "class": "sc-figura" }, [base().encabezadoDeGrafico("Valor de la tierra por zona", "USD por hectárea", "año de cosecha"), nodos.grafico]);
    nodos.tabla = el("div", { "class": "sec-tabla-bloque" });
    nodos.lectura = el("div", { "class": "tarjeta sc-lectura" });
    nodos.cuadro = el("div", { "class": "sec-cuadro" }, [
      nodos.resumen, nodos.figura, nodos.tabla, nodos.lectura,
      el("p", { "class": "sc-aviso", role: "note" }, [el("strong", null, "Ojo con la rentabilidad. "), NOTA_R])
    ]);
    contenedor.appendChild(nodos.cuadro);
    render();
  }

  function actualizar() { if (nodos.cuadro) { aplicarContexto(); render(); } }
  function limpiar() { ultima = null; if (nodos.cuadro) nodos.cuadro.hidden = true; }

  var api = { armar: armar, armarGrafico: armarGrafico, serieDeZona: serieDeZona, estado: function () { return estado; }, NOTA_R: NOTA_R };
  var seccion = { id: "tierra", titulo: "Valor de la tierra", dentroDe: "datos-y-fuentes", icono: "map-pin", montar: montar, actualizar: actualizar, limpiar: limpiar };
  api.seccion = seccion;
  raiz.TESIS_TIERRA = api;
  if (!raiz.TESIS_APP) throw new Error("tierra.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
