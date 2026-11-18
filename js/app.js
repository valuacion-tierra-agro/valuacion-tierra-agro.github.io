// Base común de la página del simulador: secciones, estado compartido, formato de números
// y origen de cada número. Cada sección (js/<seccion>.js) se registra con registrarSeccion.
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
// Contrato de DOM (el DOM falso de pruebas/dom-falso.js trae justo esto, sellado): createElement,
// createTextNode, getElementById (ids estáticos), addEventListener, appendChild, removeChild,
// setAttribute, removeAttribute, firstChild, parentNode, textContent, value, hidden, scrollLeft,
// focus y getBoundingClientRect; nunca HTML en texto (ni innerHTML, ni classList, ni la propiedad style).
(function (raiz) {
  "use strict";

  var CLAVE_ESTADO = "simulador-tesis:estado";
  var ZONA_INICIAL = "Norte BA / Sur SF";
  var UNIDADES = ["USD/ha", "USD totales"];
  var HECTAREAS_INICIALES = 100;
  var HECTAREAS_MAXIMAS = 100000;
  var MENOS = "−"; // signo menos (U+2212), no el guion
  var NBSP = "\u00a0"; // espacio duro: «p.p.» nunca queda solo en la línea siguiente
  var SIN_DATO = "—"; // raya

  // Barra de navegación (PLAN-v2): las secciones que traen `grupo` comparten una sola pestaña de la barra superior
  // y se reparten en subpestañas (nav#subnavegacion). La URL (#id) sigue siendo la de cada sección.
  var GRUPOS = {
    historico: { titulo: "Histórico (2020–2026)", rotulo: "Histórico", icono: "clock",
      intro: "Lo que habría pasado con tu campo en las campañas 2020/21 a 2025/26." }
  };
  // Estructura de la fase 4: antes de cargar los datos sólo se ve el asistente de «Simulá tu campaña» (y un link a «Datos y fuentes»);
  // después aparece la barra con las 4 pestañas. Las secciones con `sinDatos` se pueden abrir sin haber cargado datos.
  // Las secciones con `dentroDe: "<id>"` no tienen pestaña: se muestran adentro de un desplegable de esa sección (la anfitriona
  // define `alojar(hija, nodo)` para armarlo).

  var app = {
    secciones: [],
    grupos: {},
    estado: null,
    cargado: false   // true cuando el productor ya cargó sus datos (aparece la barra de pestañas)
  };

  var datos = null;     // TESIS_DATOS, desde arrancar()
  var arrancado = false;
  var incorporando = false;
  var escuchaHash = false;

  // ---------------------------------------------------------------------------------------
  // Formato de números (D-15): es-AR, signo menos real, sin «−0».
  // ---------------------------------------------------------------------------------------

  var cacheFormatos = {};
  function formateador(decimales) {
    if (!cacheFormatos[decimales]) {
      cacheFormatos[decimales] = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
      });
    }
    return cacheFormatos[decimales];
  }

  // Número con coma decimal y punto de miles; si redondea a cero no lleva signo.
  function formatoNumero(valor, decimales) {
    var texto = formateador(decimales).format(Math.abs(valor));
    var negativo = valor < 0 && /[1-9]/.test(texto);
    return (negativo ? MENOS : "") + texto;
  }

  function formatoPorcentaje(valor) {
    return formatoNumero(valor * 100, 1) + " %";
  }

  // Diferencia entre dos porcentajes, en puntos porcentuales: «−15,6 p.p.» (no «−15,6 %», que se leería como relativo).
  function formatoPuntos(valor) {
    return formatoNumero(valor * 100, 1) + NBSP + "p.p.";
  }

  function formatoFecha(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso));
    return m ? m[3] + "/" + m[2] + "/" + m[1] : String(iso);
  }

  // Fecha y hora tal como vienen en el texto ISO (sin pasar por Date, que la correría de huso).
  function formatoFechaHora(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(String(iso));
    return m ? m[3] + "/" + m[2] + "/" + m[1] + " " + m[4] + ":" + m[5] : formatoFecha(iso);
  }

  // Número con todas sus cifras (hasta 17 significativas, lo que guarda un double): para auditar.
  var formateadorExacto = null;
  function formatoExacto(valor) {
    if (!formateadorExacto) {
      formateadorExacto = new Intl.NumberFormat("es-AR", { maximumSignificantDigits: 17 });
    }
    var texto = formateadorExacto.format(Math.abs(valor));
    return (valor < 0 && /[1-9]/.test(texto) ? MENOS : "") + texto;
  }

  // Diferencia entre dos cifras: 0 es «0»; de 0,01 para arriba, 2 decimales; más chica, 2 cifras
  // significativas (así «0,00000000000023» no se ve como cero).
  var formateadorDiferencia = null;
  function formatoDiferencia(valor) {
    if (valor === 0) return "0";
    if (Math.abs(valor) >= 0.01) return formatoNumero(valor, 2);
    if (!formateadorDiferencia) {
      formateadorDiferencia = new Intl.NumberFormat("es-AR", { maximumSignificantDigits: 2 });
    }
    var texto = formateadorDiferencia.format(Math.abs(valor));
    return (valor < 0 && /[1-9]/.test(texto) ? MENOS : "") + texto;
  }

  // Hectáreas escritas por una persona (D-… WR-02). Vale un entero de 0 a 100.000 en dígitos
  // («1500») o con puntos de miles bien puestos («1.500», «100.000»). Todo lo demás es inválido
  // y cuenta como 0, sin reinterpretarlo: «1.5», «100.0», «1,5», «abc», «100001» y los negativos.
  // Un campo vacío son 0 hectáreas (válido). Un número (estado guardado) se redondea y se acota.
  // Devuelve { valido, valor } para poder avisar en pantalla.
  function leerHectareas(texto) {
    var n;
    if (typeof texto === "number") {
      if (!isFinite(texto) || texto <= 0) return { valido: texto === 0, valor: 0 };
      n = Math.min(HECTAREAS_MAXIMAS, Math.round(texto));
      return { valido: Number.isInteger(texto) && texto <= HECTAREAS_MAXIMAS, valor: n };
    }
    if (typeof texto !== "string") return { valido: false, valor: 0 };
    var limpio = texto.trim();
    if (limpio === "") return { valido: true, valor: 0 };
    if (!/^\d+$/.test(limpio) && !/^\d{1,3}(\.\d{3})+$/.test(limpio)) return { valido: false, valor: 0 };
    n = Number(limpio.replace(/\./g, ""));
    if (n > HECTAREAS_MAXIMAS) return { valido: false, valor: 0 };
    return { valido: true, valor: n };
  }

  function leerEntero(texto) {
    return leerHectareas(texto).valor;
  }

  var CLAVES_DE_FORMATO = ["ratio", "usd", "usd2", "porcentaje", "rinde", "entero", "exacto", "diferencia", "beta", "puntos"];

  var formato = {
    numero: formatoNumero,
    // Cociente sin unidad (por ejemplo el Sharpe adaptado): dos decimales.
    ratio: function (valor) { return formatoNumero(valor, 2); },
    usd: function (valor) { return formatoNumero(valor, 0); },
    usd2: function (valor) { return formatoNumero(valor, 2); },
    porcentaje: formatoPorcentaje,
    // Diferencia de porcentajes (la brecha R − K): puntos porcentuales, «−15,6 p.p.».
    puntos: formatoPuntos,
    rinde: function (valor) { return formatoNumero(valor, 1); },
    entero: function (valor) { return formatoNumero(valor, 0); },
    exacto: formatoExacto,
    diferencia: formatoDiferencia,
    // β del CAPM: tres decimales («0,217»).
    beta: function (valor) { return formatoNumero(valor, 3); },
    // Aplica el formato por nombre; un valor que falta o no es finito se muestra como «—».
    aplicar: function (clave, valor) {
      if (typeof valor !== "number" || !isFinite(valor)) return SIN_DATO;
      if (CLAVES_DE_FORMATO.indexOf(clave) < 0) {
        throw new Error("Formato desconocido: «" + clave + "»");
      }
      return formato[clave](valor);
    },
    fecha: formatoFecha,
    fechaHora: formatoFechaHora,
    leerEntero: leerEntero,
    leerHectareas: leerHectareas
  };

  // ---------------------------------------------------------------------------------------
  // DOM: helpers mínimos (sólo la API permitida).
  // ---------------------------------------------------------------------------------------

  function agregar(nodo, contenido) {
    if (contenido === undefined || contenido === null) return;
    if (Array.isArray(contenido)) {
      contenido.forEach(function (c) { agregar(nodo, c); });
    } else if (typeof contenido === "object") {
      nodo.appendChild(contenido);
    } else {
      nodo.appendChild(raiz.document.createTextNode(String(contenido)));
    }
  }

  // el("p", {class: "ayuda"}, "texto") o con una lista de nodos y textos.
  function el(etiqueta, atributos, contenido) {
    var nodo = raiz.document.createElement(etiqueta);
    if (atributos) {
      Object.keys(atributos).forEach(function (clave) {
        var valor = atributos[clave];
        if (valor === undefined || valor === null || valor === false) return;
        nodo.setAttribute(clave, valor === true ? "" : String(valor));
      });
    }
    if (typeof contenido === "string" || typeof contenido === "number") {
      nodo.textContent = String(contenido);
    } else {
      agregar(nodo, contenido);
    }
    return nodo;
  }

  function vaciar(nodo) {
    while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
  }

  // Encabezado visible de un gráfico: su título y, en texto, qué mide el eje vertical (y el horizontal si
  // hace falta). No alcanza con el aria-label del dibujo: quien mira la página tiene que poder leerlos.
  function encabezadoDeGrafico(titulo, ejeVertical, ejeHorizontal) {
    var partes = [el("p", { "class": "grafico-titulo" }, titulo),
      el("p", { "class": "grafico-eje" }, "Eje vertical: " + ejeVertical + (ejeHorizontal ? ". Eje horizontal: " + ejeHorizontal : "") + ".")];
    return el("div", { "class": "grafico-encabezado" }, partes);
  }

  // ---------------------------------------------------------------------------------------
  // Origen de cada número (D-14).
  // ---------------------------------------------------------------------------------------

  // Número pintado: <span class="numero" data-origen="…" data-valor="…" title="…" tabindex="0">.
  // Todo número que sale de los Excels se muestra con esta función. Con origen, un clic (o Enter /
  // Espacio, porque es una parada de tabulador) abre la ventanita con su valor exacto y su celda.
  // data-valor guarda el número entero, sin redondear, para mostrarlo en la ventanita.
  // opciones.enfocable === false saca el tabindex: lo usa la tabla de los 114 casos, donde habría
  // más de 1.500 paradas de tabulador; ahí cada fila trae un botón «Ver orígenes» (vincularOrigenes).
  function numero(valor, clave, origen, opciones) {
    var texto = formato.aplicar(clave, valor);
    var clases = "numero";
    if (texto.charAt(0) === MENOS) clases += " negativo";
    if (texto === SIN_DATO) clases += " sin-dato";
    // opciones.explica: explicación en simple para el productor. Si está, es lo que muestran el cartelito y la ventanita
    // (sin archivos ni celdas); el origen técnico queda igual en data-origen.
    var explica = opciones && typeof opciones.explica === "string" && opciones.explica !== "" ? opciones.explica : null;
    // Versión resumida: ningún número muestra archivo, hoja ni celda; si la pestaña no trae su frase, va la general.
    if (!explica && app.resumido) explica = explicarOrigen(origen);
    var atributos = { "class": clases, "data-origen": origen || null, title: explica || origen || null };
    if (explica) atributos["data-explica"] = explica;
    if (typeof valor === "number" && isFinite(valor)) atributos["data-valor"] = String(valor);
    if (origen && !(opciones && opciones.enfocable === false)) {
      // Parada de tabulador que abre la ventanita: se anuncia como botón que abre un diálogo.
      atributos.tabindex = "0";
      atributos.role = "button";
      atributos["aria-haspopup"] = "dialog";
    }
    var nodo = el("span", atributos);
    nodo.textContent = texto;
    return nodo;
  }

  // «T5, T6, T7, T47» → «T5:T7, T47» (filas seguidas de una columna se juntan).
  function compactarCeldas(celdas) {
    var columnas = [];
    var filasPorColumna = Object.create(null);
    var otras = [];
    celdas.forEach(function (celda) {
      var m = /^([A-Z]+)(\d+)$/.exec(celda);
      if (!m) { otras.push(celda); return; }
      if (!(m[1] in filasPorColumna)) { filasPorColumna[m[1]] = []; columnas.push(m[1]); }
      filasPorColumna[m[1]].push(Number(m[2]));
    });
    var partes = [];
    columnas.forEach(function (col) {
      var filas = filasPorColumna[col].slice().sort(function (a, b) { return a - b; });
      var i = 0;
      while (i < filas.length) {
        var j = i;
        while (j + 1 < filas.length && filas[j + 1] === filas[j] + 1) j++;
        partes.push(j > i ? col + filas[i] + ":" + col + filas[j] : col + filas[i]);
        i = j + 1;
      }
    });
    return partes.concat(otras).join(", ");
  }

  // Junta orígenes «archivo › hoja › celda» sin repetidos: una vez por «archivo › hoja»,
  // con las celdas juntas; los grupos van separados por « · ».
  function unirOrigenes(lista) {
    var grupos = [];
    var indice = Object.create(null);
    var vistos = Object.create(null);
    (lista || []).forEach(function (origen) {
      if (typeof origen !== "string" || origen === "" || vistos[origen]) return;
      vistos[origen] = true;
      var corte = origen.lastIndexOf(" › ");
      var prefijo = corte < 0 ? origen : origen.slice(0, corte);
      var celda = corte < 0 ? "" : origen.slice(corte + 3);
      if (!(prefijo in indice)) { indice[prefijo] = grupos.length; grupos.push({ prefijo: prefijo, celdas: [] }); }
      if (celda) grupos[indice[prefijo]].celdas.push(celda);
    });
    return grupos.map(function (g) {
      return g.celdas.length ? g.prefijo + " › " + compactarCeldas(g.celdas) : g.prefijo;
    }).join(" · ");
  }

  // Origen de un número calculado: la fórmula y las celdas de las que parte.
  // notas (opcional): textos propios que no son celdas, por ejemplo «proporción cubierta elegida:
  // 50 %» o «promedio de AB5:AB10». enExcel: sólo si la cifra es IGUAL a esa celda del Excel
  // (un promedio de varias celdas no es igual a ninguna: va en notas).
  function origenCalculado(formula, origenes, enExcel, notas) {
    var texto = formula + " — parte de: " + unirOrigenes(origenes);
    (notas || []).forEach(function (nota) {
      if (typeof nota === "string" && nota !== "") texto += " — " + nota;
    });
    if (enExcel && enExcel.length) texto += " — en el Excel: " + unirOrigenes(enExcel);
    return texto;
  }

  // ---------------------------------------------------------------------------------------
  // Ventanita de origen de toda la página (D-03). Se implementa una sola vez, acá: un escuchador
  // delegado en `document` abre la ventanita al tocar o hacer clic en CUALQUIER elemento con
  // data-origen (de «Mi campo», de «Datos y fuentes» o de las secciones que vengan). Las secciones
  // no tienen que hacer nada más que pintar sus números con numero().
  // ---------------------------------------------------------------------------------------

  var PARTE_DE = " — parte de: ";
  var EN_EXCEL = " — en el Excel: ";
  var MARGEN_VENTANITA = 8; // px que la ventanita deja libres contra el borde de la pantalla

  function leerGrupo(texto) {
    var partes = texto.split(" › ");
    return partes.length === 3 ? { archivo: partes[0], hoja: partes[1], celda: partes[2] } : { texto: texto };
  }

  function leerGrupos(texto) {
    return texto.trim() === "" ? [] : texto.split(" · ").map(leerGrupo);
  }

  // Frase en simple para la ventanita de un número (sin archivos ni celdas). Si el origen es un dato suelto («archivo › hoja › celda»)
  // dice que es un dato de referencia; si es un cálculo, usa la frase general que le pasa cada pestaña. El origen técnico queda en data-origen.
  function explicarOrigen(origen, general) {
    if (typeof origen !== "string" || origen === "") return null;
    if (origen.indexOf(PARTE_DE) < 0 && origen.indexOf(" › ") >= 0) return "Es un dato de referencia que usa el simulador.";
    return general || "Lo calculamos con los datos de referencia que usa el simulador.";
  }

  // Parte un texto de origen en sus piezas (es la inversa de origenCalculado / unirOrigenes):
  //   «archivo › hoja › celda»                       → un grupo con su celda;
  //   «fórmula — parte de: G1 · G2 — en el Excel: G3» → fórmula, grupos de partida y celdas del Excel
  //     (si el texto trae notas propias entre medio, quedan en `notas`, que sólo existe si hay);
  //   cualquier otro texto («Lo cargaste vos»)        → texto.
  function leerOrigen(texto) {
    texto = typeof texto === "string" ? texto : "";
    var corte = texto.indexOf(PARTE_DE);
    if (corte >= 0) {
      var formula = texto.slice(0, corte);
      var resto = texto.slice(corte + PARTE_DE.length);
      var enExcel = [];
      var posExcel = resto.lastIndexOf(EN_EXCEL);
      if (posExcel >= 0) {
        enExcel = leerGrupos(resto.slice(posExcel + EN_EXCEL.length));
        resto = resto.slice(0, posExcel);
      }
      var trozos = resto.split(" — ");
      var origen = { formula: formula, grupos: leerGrupos(trozos[0]), enExcel: enExcel, texto: null };
      if (trozos.length > 1) origen.notas = trozos.slice(1);
      return origen;
    }
    var grupos = leerGrupos(texto);
    var todosCeldas = grupos.length > 0 && grupos.every(function (g) { return g.texto === undefined; });
    return todosCeldas
      ? { formula: null, grupos: grupos, enExcel: [], texto: null }
      : { formula: null, grupos: [], enExcel: [], texto: texto };
  }

  function textoDeGrupo(g) {
    return g.texto !== undefined ? g.texto : g.archivo + " › " + g.hoja + " › " + g.celda;
  }

  // Dónde poner la ventanita (coordenadas del documento, enteros). Pura.
  //   rectNumero: getBoundingClientRect() del número; rectPanel: {width, height} de la ventanita;
  //   vista: {ancho, alto} de la pantalla visible y {x, y} cuánto se desplazó la página.
  // Va debajo del número (si entra) o arriba, y nunca se sale por los costados.
  function posicionPanel(rectNumero, rectPanel, vista) {
    var ancho = vista.ancho > 0 ? vista.ancho : 0;
    var izquierda = Math.max(MARGEN_VENTANITA, rectNumero.left);
    if (ancho > 0) izquierda = Math.min(izquierda, ancho - rectPanel.width - MARGEN_VENTANITA);
    izquierda = Math.max(MARGEN_VENTANITA, izquierda);
    var abajo = rectNumero.bottom + 6;
    var entraAbajo = !(vista.alto > 0) || abajo + rectPanel.height <= vista.alto - MARGEN_VENTANITA;
    var arriba = entraAbajo ? abajo : Math.max(MARGEN_VENTANITA, rectNumero.top - 6 - rectPanel.height);
    return { top: Math.round(arriba + (vista.y || 0)), left: Math.round(izquierda + (vista.x || 0)) };
  }

  var panelOrigen = null;       // el div#origen-panel (lo crea arrancar)
  var botonCerrarOrigen = null; // su botón «Cerrar» (se rehace cada vez que se abre)
  var documentoConOrigen = null; // el documento al que ya se le pusieron los escuchadores
  var abridores = typeof WeakMap === "function" ? new WeakMap() : null; // nodo → función que arma su lista

  function tieneAtributo(nodo, atributo) {
    return nodo && nodo.nodeType === 1 && typeof nodo.getAttribute === "function" && nodo.getAttribute(atributo) !== null;
  }

  // El elemento más cercano (él mismo o un ancestro) que tiene origen: un número, un texto con
  // data-origen o un botón de lista de orígenes.
  function conOrigen(nodo) {
    while (nodo) {
      if (tieneAtributo(nodo, "data-origen") || tieneAtributo(nodo, "data-origenes")) return nodo;
      nodo = nodo.parentNode;
    }
    return null;
  }

  function dentroDelPanel(nodo) {
    while (nodo) {
      if (nodo === panelOrigen) return true;
      nodo = nodo.parentNode;
    }
    return false;
  }

  // Lo que dice el origen de un número, en bloques de texto: fórmula, celdas de partida, celda del
  // Excel. Todo con el() y textContent: nunca HTML.
  function detalleDeOrigen(textoOrigen) {
    var o = leerOrigen(textoOrigen);
    var lista = function (grupos) {
      return el("ul", { "class": "origen-celdas" }, grupos.map(function (g) { return el("li", null, textoDeGrupo(g)); }));
    };
    var bloques = [];
    if (o.formula !== null) {
      bloques.push(el("p", null, "Se calcula así: " + o.formula));
      if (o.grupos.length) bloques.push(el("p", null, "Parte de estas celdas:"), lista(o.grupos));
      if (o.notas) {
        bloques.push(el("p", null, "Además:"), el("ul", { "class": "origen-celdas" },
          o.notas.map(function (nota) { return el("li", null, nota); })));
      }
      if (o.enExcel.length) bloques.push(el("p", null, "En el Excel, el resultado está en:"), lista(o.enExcel));
    } else if (o.grupos.length) {
      var unaCelda = o.grupos.length === 1 && !/[,:]/.test(o.grupos[0].celda);
      bloques.push(el("p", null, unaCelda ? "Sale de esta celda:" : "Sale de estas celdas:"), lista(o.grupos));
    } else {
      bloques.push(el("p", null, "Origen: " + o.texto));
    }
    return bloques;
  }

  // «Valor exacto: …» a partir del data-valor (null si el nodo no lo trae o no es un número).
  function textoValorExacto(crudo) {
    if (crudo === null || crudo === undefined || crudo === "") return null;
    var n = Number(crudo);
    return isFinite(n) ? "Valor exacto: " + formatoExacto(n) : null;
  }

  // Muestra la ventanita junto a `nodo`. Se mide con la esquina arriba a la izquierda (así el ancho
  // es el natural) y después se ubica. Guarda el nodo, y pasa el foco al botón «Cerrar».
  // Ancho de la pantalla visible, sin la barra de desplazamiento: si no, la ventanita la taparía y la
  // página se desplazaría a lo ancho.
  function anchoVisible() {
    var docEl = raiz.document && raiz.document.documentElement;
    return docEl && docEl.clientWidth > 0 ? docEl.clientWidth : (raiz.innerWidth || 0);
  }

  var anchoAlAbrir = 0; // el ancho de la pantalla cuando se abrió la ventanita

  function mostrarPanel(nodo) {
    var w = raiz;
    var ancho = anchoVisible();
    anchoAlAbrir = ancho;
    panelOrigen.setAttribute("style", "top: 0px; left: 0px");
    panelOrigen.hidden = false;
    var pos = posicionPanel(nodo.getBoundingClientRect(), panelOrigen.getBoundingClientRect(), {
      ancho: ancho,
      alto: w.innerHeight || 0,
      x: w.scrollX || w.pageXOffset || 0,
      y: w.scrollY || w.pageYOffset || 0
    });
    panelOrigen.setAttribute("style", "top: " + pos.top + "px; left: " + pos.left + "px");
    app.origenAbierto = nodo;
    if (botonCerrarOrigen && typeof botonCerrarOrigen.focus === "function") botonCerrarOrigen.focus({ preventScroll: true });
  }

  function botonCerrar() {
    var boton = el("button", { type: "button", "class": "origen-cerrar" }, "Cerrar");
    boton.addEventListener("click", function () { cerrarOrigen(true); });
    return boton;
  }

  // Arma el contenido de la ventanita (título, bloques y «Cerrar») y la muestra junto a `nodo`.
  function abrirPanel(nodo, titulo, bloques) {
    vaciar(panelOrigen);
    botonCerrarOrigen = botonCerrar();
    panelOrigen.appendChild(el("p", { id: "origen-titulo", "class": "origen-titulo" }, titulo));
    agregar(panelOrigen, bloques);
    panelOrigen.appendChild(botonCerrarOrigen);
    mostrarPanel(nodo);
  }

  // Abre la ventanita de un elemento con data-origen: valor exacto y de dónde sale.
  function abrirOrigen(nodo) {
    if (!panelOrigen || !nodo) return;
    // Con explicación en simple (los números de «Simulá tu campaña»): sólo esa frase, sin valor exacto ni celdas.
    var explica = nodo.getAttribute("data-explica");
    if (explica) { abrirPanel(nodo, "De dónde sale este número", [el("p", { "class": "origen-simple" }, explica)]); return; }
    var exacto = textoValorExacto(nodo.getAttribute("data-valor"));
    var visto = "Se ve: " + nodo.textContent + (exacto ? " · " + exacto : "");
    abrirPanel(nodo, exacto ? "De dónde sale este número" : "De dónde sale este dato",
      [el("p", { "class": "origen-valor" }, visto)].concat(detalleDeOrigen(nodo.getAttribute("data-origen") || "")));
  }

  // Abre la ventanita con una lista de números (la fila de una tabla): para cada uno, su nombre,
  // su valor exacto y su origen. datosLista = { titulo, items: [{ etiqueta, v, formato, origen }] }.
  // Un ítem que no es un número (una campaña, «subió») trae `texto` en vez de v y formato.
  function abrirOrigenes(nodo, datosLista) {
    if (!panelOrigen || !nodo || !datosLista) return;
    var items = (datosLista.items || []).map(function (item) {
      var visto = typeof item.texto === "string" ? item.texto : formato.aplicar(item.formato, item.v);
      // item.explica: frase en simple (sin archivos ni celdas); con ella la lista no muestra el valor exacto ni el origen técnico.
      if (typeof item.explica === "string" && item.explica !== "") {
        return el("li", { "class": "origen-item" }, [el("p", { "class": "origen-valor" }, item.etiqueta + ": " + visto),
          el("p", { "class": "origen-simple" }, item.explica)]);
      }
      var exacto = textoValorExacto(typeof item.v === "number" && isFinite(item.v) ? String(item.v) : null);
      return el("li", { "class": "origen-item" }, [
        el("p", { "class": "origen-valor" }, item.etiqueta + ": " + visto + (exacto ? " · " + exacto : ""))
      ].concat(detalleDeOrigen(item.origen || "")));
    });
    abrirPanel(nodo, "De dónde sale cada número de esta fila", [
      el("p", { "class": "origen-valor" }, datosLista.titulo || ""),
      // tabindex 0: la lista se desplaza dentro de la ventanita y, sin esto, no se la puede recorrer con el teclado.
      el("ul", { "class": "origen-lista", tabindex: "0", "aria-label": "Números de la fila, con su valor exacto y su origen" }, items)
    ]);
  }

  // Un botón que abre la lista de orígenes de varios números (por ejemplo, una fila de tabla sin
  // números enfocables). `obtener()` devuelve { titulo, items } cuando se toca el botón.
  function vincularOrigenes(nodo, obtener) {
    if (!abridores || typeof obtener !== "function") throw new Error("vincularOrigenes: falta la función que arma la lista");
    nodo.setAttribute("data-origenes", "");
    abridores.set(nodo, obtener);
  }

  function abrirDesde(nodo) {
    if (tieneAtributo(nodo, "data-origen")) abrirOrigen(nodo);
    else if (abridores && abridores.has(nodo)) abrirOrigenes(nodo, abridores.get(nodo)());
  }

  // ¿El navegador movería el foco a este nodo con focus()? Sólo a botones, campos, selects, enlaces
  // con href o cualquier cosa con tabindex (un <span> sin tabindex no recibe el foco).
  function esEnfocable(nodo) {
    if (!nodo || nodo.nodeType !== 1 || typeof nodo.focus !== "function") return false;
    if (nodo.getAttribute("tabindex") !== null) return true;
    if (nodo.getAttribute("disabled") !== null) return false;
    var etiqueta = String(nodo.tagName || "").toUpperCase();
    if (etiqueta === "BUTTON" || etiqueta === "INPUT" || etiqueta === "SELECT" || etiqueta === "TEXTAREA") return true;
    return etiqueta === "A" && nodo.getAttribute("href") !== null;
  }

  function buscarBotonDeOrigenes(nodo) {
    var hijos = nodo.childNodes || [];
    for (var i = 0; i < hijos.length; i++) {
      if (tieneAtributo(hijos[i], "data-origenes")) return hijos[i];
      var dentro = buscarBotonDeOrigenes(hijos[i]);
      if (dentro) return dentro;
    }
    return null;
  }

  // A dónde vuelve el foco al cerrar: al elemento que abrió la ventanita si el navegador puede
  // enfocarlo; si es un número que no es parada de tabulador (los de las tablas grandes), al botón
  // «Ver orígenes» de su fila. Si no hay ninguno, null (el foco se queda donde está).
  function destinoDeFoco(nodo) {
    if (esEnfocable(nodo)) return nodo;
    var fila = nodo;
    while (fila && String(fila.tagName || "").toUpperCase() !== "TR") fila = fila.parentNode;
    var boton = fila ? buscarBotonDeOrigenes(fila) : null;
    return esEnfocable(boton) ? boton : null;
  }

  // Cierra la ventanita. Con devolverFoco, el foco vuelve al número desde el que se abrió (o al
  // botón «Ver orígenes» de su fila si el número no se puede enfocar).
  function cerrarOrigen(devolverFoco) {
    var nodo = app.origenAbierto;
    app.origenAbierto = null;
    if (panelOrigen) {
      panelOrigen.hidden = true;
      vaciar(panelOrigen);
      botonCerrarOrigen = null;
    }
    var destino = devolverFoco && nodo ? destinoDeFoco(nodo) : null;
    if (destino) destino.focus({ preventScroll: true });
  }

  function alternarOrigen(nodo) {
    if (app.origenAbierto === nodo) cerrarOrigen(true);
    else abrirDesde(nodo);
  }

  function alHacerClic(evento) {
    var blanco = evento.target;
    if (dentroDelPanel(blanco)) return;
    var nodo = conOrigen(blanco);
    if (nodo) alternarOrigen(nodo);
    else if (app.origenAbierto) cerrarOrigen(false);
  }

  var esperaEspacio = null; // el número sobre el que se apretó Espacio (se abre al soltarlo)

  // Lo que recibe el foco dentro de la ventanita, en orden: la lista desplazable (tabindex 0) y «Cerrar».
  function enfocablesDelPanel() {
    var lista = [];
    (function recorrer(nodo) {
      (nodo.childNodes || []).forEach(function (hijo) {
        if (hijo.nodeType === 1 && (hijo.getAttribute("tabindex") === "0" || String(hijo.tagName).toUpperCase() === "BUTTON")) lista.push(hijo);
        recorrer(hijo);
      });
    })(panelOrigen);
    return lista;
  }

  // Tab o Mayús+Tab desde el último o el primer elemento de la ventanita sacarían el foco a cualquier
  // parte de la página (la ventanita está al final del documento). En cambio se cierra y el foco vuelve
  // al número desde el que se abrió (WR-05).
  function alTabular(evento) {
    if (!app.origenAbierto || !panelOrigen || !dentroDelPanel(evento.target)) return;
    var enfocables = enfocablesDelPanel();
    if (!enfocables.length) return;
    var sale = evento.shiftKey ? evento.target === enfocables[0] : evento.target === enfocables[enfocables.length - 1];
    if (!sale) return;
    evento.preventDefault();
    cerrarOrigen(true);
  }

  // Enter sobre un número enfocado abre la ventanita al apretarlo. El Espacio, como en un botón nativo,
  // la abre al SOLTARLO (keyup): si se abriera al apretarlo, el foco pasaría a «Cerrar» y el keyup
  // cae sobre ese botón, que en Firefox lo activa y cierra la ventanita en el acto (WR-03).
  // Los botones (el de «Cerrar», el de «Ver orígenes») ya reaccionan solos a esas teclas.
  function alTeclear(evento) {
    if (evento.key === "Escape") {
      if (app.origenAbierto) cerrarOrigen(true);
      return;
    }
    if (evento.key === "Tab") {
      alTabular(evento);
      return;
    }
    var blanco = evento.target;
    if (evento.key === " " || evento.key === "Spacebar") {
      if (!tieneAtributo(blanco, "data-origen") || dentroDelPanel(blanco)) return;
      evento.preventDefault(); // el Espacio no tiene que desplazar la página
      esperaEspacio = blanco;
      return;
    }
    if (evento.key !== "Enter") return;
    if (!tieneAtributo(blanco, "data-origen") || dentroDelPanel(blanco)) return;
    evento.preventDefault();
    alternarOrigen(blanco);
  }

  function alSoltar(evento) {
    if (evento.key !== " " && evento.key !== "Spacebar") return;
    var blanco = evento.target;
    var espera = esperaEspacio;
    esperaEspacio = null;
    if (espera === null || blanco !== espera || dentroDelPanel(blanco)) return;
    evento.preventDefault();
    alternarOrigen(blanco);
  }

  // Si el foco se va a otra parte, la ventanita ya no corresponde.
  function alEnfocar(evento) {
    var abierto = app.origenAbierto;
    if (!abierto) return;
    var blanco = evento.target;
    if (dentroDelPanel(blanco) || blanco === abierto) return;
    cerrarOrigen(false);
  }

  // Si algo se desplaza por dentro (una tabla), el número se movió de lugar: se cierra. El
  // desplazamiento de la página entera no cierra nada (la ventanita se desplaza con ella).
  function alDesplazar(evento) {
    if (!app.origenAbierto) return;
    var blanco = evento.target;
    if (blanco === documentoConOrigen || dentroDelPanel(blanco)) return;
    cerrarOrigen(false);
  }

  // Crea la ventanita (div#origen-panel, oculta, al final de la página) y pone los escuchadores,
  // una sola vez por documento.
  function prepararOrigen(doc) {
    if (documentoConOrigen === doc) return;
    var contenido = doc.getElementById("contenido");
    var pagina = contenido ? contenido.parentNode : null;
    if (!pagina || typeof doc.addEventListener !== "function") return;
    panelOrigen = el("div", { id: "origen-panel", "class": "origen-panel", role: "dialog", "aria-labelledby": "origen-titulo" });
    panelOrigen.hidden = true;
    pagina.appendChild(panelOrigen);
    documentoConOrigen = doc;
    app.origenAbierto = null;
    doc.addEventListener("click", alHacerClic);
    doc.addEventListener("keydown", alTeclear);
    doc.addEventListener("keyup", alSoltar);
    doc.addEventListener("focusin", alEnfocar);
    doc.addEventListener("scroll", alDesplazar, true); // el scroll de un elemento no sube: se lo escucha en la captura
    // Sólo un cambio de ANCHO (girar el celular, cambiar el tamaño de la ventana) mueve los números en
    // horizontal. En el celular el alto cambia al plegarse la barra de direcciones mientras se lee: ahí no se cierra.
    if (typeof raiz.addEventListener === "function") {
      raiz.addEventListener("resize", function () {
        if (app.origenAbierto && anchoVisible() !== anchoAlAbrir) cerrarOrigen(false);
      });
    }
  }

  // ---------------------------------------------------------------------------------------
  // Aviso de datos y control en vivo contra el Excel (D-04, D-05).
  // ---------------------------------------------------------------------------------------

  // Aviso de arriba de todo: de dónde salen los datos y que todavía no están en consolidado/.
  function textoAviso(meta) {
    return "Estos datos salen de los Excels definitivos del grupo (carpeta " + meta.carpeta +
      ", extraídos el " + formatoFecha(meta.extraidoEl) + "). Todavía no están integrados a consolidado/ del repo.";
  }

  // Columnas de RR_Riesgo_Zonas que se comparan con el motor, con la tolerancia que usa el motor.
  // Son las mismas que compara pruebas/motor.riesgo.test.js.
  function camposDeResumen() {
    var usd = raiz.TESIS_MOTOR.TOLERANCIA_USD;
    var prop = raiz.TESIS_MOTOR.TOLERANCIA_PROPORCION;
    return [
      ["sdSinUsd", usd], ["sdConUsd", usd], ["sdPrecioSin", usd], ["sdPrecioCon", usd], ["riesgoRinde", usd],
      ["reduccionUsd", prop], ["reduccionPrecio", prop], ["sdRSin", prop], ["sdRCon", prop], ["reduccionR", prop],
      ["desvioRindePromedio", prop], ["peorDesvio", prop]
    ];
  }

  function esFinito(x) {
    return typeof x === "number" && isFinite(x);
  }

  // Compara un valor del motor con una celda de control {v, o}; devuelve la diferencia (con la forma
  // del detalle del motor) o null si coinciden. Lo que no es un número (texto, sí/no) se compara igual.
  function compararConControl(base, campo, valorMotor, control, tolerancia) {
    var item = {
      cultivo: base.cultivo, zona: base.zona, campana: null, campo: campo,
      motor: valorMotor, excel: control && control.v !== undefined ? control.v : null,
      diferencia: null, celda: control && control.o ? control.o : "sin celda de origen para " + campo
    };
    if (!control || control.v === undefined || control.v === null) {
      item.motivo = "el valor del Excel falta";
      return item;
    }
    if (typeof control.v === "number") {
      if (!esFinito(valorMotor)) {
        item.motivo = "el valor del motor no es un número finito";
        return item;
      }
      item.diferencia = Math.abs(valorMotor - control.v);
      return item.diferencia <= tolerancia ? null : item;
    }
    return valorMotor === control.v ? null : item;
  }

  // Lista de diferencias de un control (una zona o un cultivo): vacía si todo coincide.
  function diferenciasDe(base, valores, control, campos) {
    var lista = [];
    campos.forEach(function (campo) {
      var item = compararConControl(base, campo[0], valores[campo[0]], control[campo[0]], campo[1]);
      if (item) lista.push(item);
    });
    return lista;
  }

  // Resúmenes por zona y por cultivo contra RR_Riesgo_Zonas: el motor los calcula (riesgoZona y
  // riesgoCultivo) y acá se comparan con los controles de datos.js. Una excepción o un valor que no
  // es número cuenta como diferencia (con `motivo`), nunca como coincidencia.
  function controlResumenes(datos) {
    var motor = raiz.TESIS_MOTOR;
    var campos = camposDeResumen();
    var resultado = {
      zonas: { total: datos.controles.zonas.length, coinciden: 0, detalle: [] },
      cultivos: { total: datos.controles.cultivos.length, coinciden: 0, detalle: [] }
    };
    function revisar(grupo, base, calcular, extra) {
      var lista;
      try {
        var r = calcular();
        lista = diferenciasDe(base, r, grupo.control, campos.concat(extra.numericos));
        extra.otros(r).forEach(function (o) {
          var item = compararConControl(base, o[0], o[1], grupo.control[o[0]], 0);
          if (item) lista.push(item);
        });
      } catch (e) {
        lista = [{
          cultivo: base.cultivo, zona: base.zona, campana: null, campo: extra.nombreDelCalculo,
          motor: null, excel: null, diferencia: null, celda: grupo.celda,
          motivo: "el motor no pudo calcular el resumen", error: e.message
        }];
      }
      if (lista.length === 0) grupo.destino.coinciden++;
      else grupo.destino.detalle = grupo.destino.detalle.concat(lista);
    }
    datos.controles.zonas.forEach(function (control) {
      revisar({ control: control, destino: resultado.zonas, celda: "RR_Riesgo_Zonas fila " + control.fila },
        { cultivo: control.cultivo, zona: control.zona },
        function () { return motor.riesgoZona(datos, control.cultivo, control.zona); },
        {
          numericos: [],
          otros: function (r) {
            return [["campanaPeorDesvio", r.campanaPeorDesvio], ["bajoElRiesgo", r.bajoElRiesgo ? "Sí" : "No"]];
          },
          nombreDelCalculo: "(cálculo de la zona)"
        });
    });
    datos.controles.cultivos.forEach(function (control) {
      revisar({ control: control, destino: resultado.cultivos, celda: "RR_Riesgo_Zonas fila " + control.fila },
        { cultivo: control.cultivo, zona: "promedio de zonas" },
        function () { return motor.riesgoCultivo(datos, control.cultivo); },
        {
          numericos: [["zonas", 0], ["zonasDondeSubio", 0]],
          otros: function () { return []; },
          nombreDelCalculo: "(cálculo del cultivo)"
        });
    });
    return resultado;
  }

  // Universo que declara la tesis: 114 casos (19 pares cultivo-zona × 6 campañas), 19 pares y 3 cultivos.
  // El control en vivo sólo da verde si lo que se comparó es exactamente eso: sacar o sumar casos, o
  // quedarse sin controles de zona o de cultivo, es una falla y se muestra con su detalle (D-04).
  var UNIVERSO = { casos: 114, pares: 19, cultivos: 3 };

  function itemDeUniverso(campo, motor, excel, motivo, celda, cultivo, zona) {
    return {
      cultivo: cultivo || null, zona: zona || null, campana: null, campo: campo,
      motor: motor, excel: excel, diferencia: null, celda: celda, motivo: motivo
    };
  }

  // Compara los casos que hay con los controles de RR_Riesgo_Zonas contra el universo esperado.
  // Devuelve { ok, detalle } con una diferencia por cada cosa que sobra o falta (nunca lanza).
  function controlUniverso(datos, casosComparados) {
    var detalle = [];
    var casos = datos.casos;
    var zonas = datos.controles && Array.isArray(datos.controles.zonas) ? datos.controles.zonas : [];
    var cultivos = datos.controles && Array.isArray(datos.controles.cultivos) ? datos.controles.cultivos : [];
    var CELDA_CASOS = "RR_Margenes › A5:A118";
    var CELDA_RIESGO = "RR_Riesgo_Zonas";
    if (casos.length !== UNIVERSO.casos) {
      detalle.push(itemDeUniverso("cantidad de casos", casos.length, UNIVERSO.casos,
        "la tesis tiene " + UNIVERSO.casos + " casos y acá hay " + casos.length, CELDA_CASOS));
    }
    if (casosComparados !== casos.length) {
      detalle.push(itemDeUniverso("casos comparados", casosComparados, casos.length,
        "el control comparó " + casosComparados + " casos y hay " + casos.length, CELDA_CASOS));
    }
    var paresDeCasos = [];
    var cultivosDeCasos = [];
    casos.forEach(function (caso) {
      var par = caso.cultivo + "|" + caso.zona;
      if (paresDeCasos.indexOf(par) < 0) paresDeCasos.push(par);
      if (cultivosDeCasos.indexOf(caso.cultivo) < 0) cultivosDeCasos.push(caso.cultivo);
    });
    var paresDeControles = zonas.map(function (c) { return c.cultivo + "|" + c.zona; });
    if (paresDeCasos.length !== UNIVERSO.pares) {
      detalle.push(itemDeUniverso("pares cultivo-zona", paresDeCasos.length, UNIVERSO.pares,
        "la tesis tiene " + UNIVERSO.pares + " pares cultivo-zona y los casos traen " + paresDeCasos.length, CELDA_CASOS));
    }
    if (zonas.length !== UNIVERSO.pares) {
      detalle.push(itemDeUniverso("controles por zona", zonas.length, UNIVERSO.pares,
        "la tesis tiene " + UNIVERSO.pares + " controles por zona y hay " + zonas.length, CELDA_RIESGO));
    }
    paresDeCasos.forEach(function (par) {
      if (paresDeControles.indexOf(par) < 0) {
        var p = par.split("|");
        detalle.push(itemDeUniverso("control de zona", null, null, "sin control en RR_Riesgo_Zonas", CELDA_RIESGO, p[0], p[1]));
      }
    });
    paresDeControles.forEach(function (par, i) {
      var p = par.split("|");
      if (paresDeCasos.indexOf(par) < 0) {
        detalle.push(itemDeUniverso("control de zona", null, null, "control sin casos", "RR_Riesgo_Zonas fila " + zonas[i].fila, p[0], p[1]));
      } else if (paresDeControles.indexOf(par) !== i) {
        detalle.push(itemDeUniverso("control de zona", null, null, "control repetido", "RR_Riesgo_Zonas fila " + zonas[i].fila, p[0], p[1]));
      }
    });
    var nombresDeControles = cultivos.map(function (c) { return c.cultivo; });
    if (cultivosDeCasos.length !== UNIVERSO.cultivos) {
      detalle.push(itemDeUniverso("cultivos", cultivosDeCasos.length, UNIVERSO.cultivos,
        "la tesis tiene " + UNIVERSO.cultivos + " cultivos y los casos traen " + cultivosDeCasos.length, CELDA_CASOS));
    }
    if (cultivos.length !== UNIVERSO.cultivos) {
      detalle.push(itemDeUniverso("controles por cultivo", cultivos.length, UNIVERSO.cultivos,
        "la tesis tiene " + UNIVERSO.cultivos + " controles por cultivo y hay " + cultivos.length, CELDA_RIESGO));
    }
    cultivosDeCasos.forEach(function (cultivo) {
      if (nombresDeControles.indexOf(cultivo) < 0) {
        detalle.push(itemDeUniverso("control de cultivo", null, null, "sin control en RR_Riesgo_Zonas", CELDA_RIESGO, cultivo, "promedio de zonas"));
      }
    });
    nombresDeControles.forEach(function (cultivo, i) {
      if (cultivosDeCasos.indexOf(cultivo) < 0) {
        detalle.push(itemDeUniverso("control de cultivo", null, null, "control sin casos", "RR_Riesgo_Zonas fila " + cultivos[i].fila, cultivo, "promedio de zonas"));
      } else if (nombresDeControles.indexOf(cultivo) !== i) {
        detalle.push(itemDeUniverso("control de cultivo", null, null, "control repetido", "RR_Riesgo_Zonas fila " + cultivos[i].fila, cultivo, "promedio de zonas"));
      }
    });
    return { ok: detalle.length === 0, detalle: detalle };
  }

  // Todas las celdas de «excel.*» de todos los casos: de dónde sale lo que se compara con el motor.
  function origenDelControl(datos) {
    var claves = Object.keys(datos.campos).filter(function (k) { return k.indexOf("excel.") === 0; });
    var origenes = [];
    datos.casos.forEach(function (caso) {
      claves.forEach(function (clave) { origenes.push(raiz.TESIS_MOTOR.origen(caso, clave, datos)); });
    });
    return origenCalculado("Casos en los que los " + claves.length + " resultados que calcula el motor coinciden con el Excel", origenes);
  }

  // Origen de «cantidad de casos de la tesis»: las celdas de cultivo de todos los casos. Lo usan el indicador
  // de arriba y la sección «Datos y fuentes» (una sola cuenta: si cambia, cambian las dos).
  function origenDeCantidadDeCasos(datos) {
    var celdas = datos.casos.map(function (caso) { return raiz.TESIS_MOTOR.origen(caso, "cultivo", datos); });
    return origenCalculado("Cantidad de casos de la tesis", celdas);
  }

  // Control en vivo: los casos contra RR_Margenes y Datos_Completos más los resúmenes de riesgo.
  // Nunca lanza: si algo falla devuelve { ok: false, error } y la página lo muestra.
  function correrControl(datos) {
    try {
      datos = datosActuales(datos);
      if (!datos || !Array.isArray(datos.casos)) throw new Error("los datos no traen la lista de casos");
      var casos = raiz.TESIS_MOTOR.verificarContraExcel(datos);
      var resumenes = controlResumenes(datos);
      var universo = controlUniverso(datos, casos.casos);
      var ok = casos.coinciden === casos.casos && casos.sinComparar === 0 && casos.detalle.length === 0 &&
        resumenes.zonas.coinciden === resumenes.zonas.total && resumenes.cultivos.coinciden === resumenes.cultivos.total &&
        universo.ok;
      return { casos: casos, resumenes: resumenes, universo: universo, ok: ok };
    } catch (e) {
      return { ok: false, error: String(e && e.message ? e.message : e) };
    }
  }

  // Cada nodo sólo se toca si existe en la página (las pruebas de la base no los tienen).
  function pintarAviso() {
    var nodo = raiz.document.getElementById("aviso-datos");
    if (nodo) nodo.textContent = textoAviso(datos.meta);
  }

  // Indicador corto de arriba de todo: «Control en vivo: 114 de 114 casos coinciden…» y un enlace
  // al detalle. Los números llevan su origen y nunca van dentro del enlace.
  function pintarIndicador() {
    var nodo = raiz.document.getElementById("control-vivo");
    if (!nodo) return;
    var c = app.control;
    vaciar(nodo);
    var enlace = function (texto) { return el("a", { href: "#datos-y-fuentes" }, texto); };
    if (!c || c.error || !c.casos) {
      nodo.setAttribute("class", "control-vivo control-falla");
      agregar(nodo, ["Control en vivo: no se pudo correr el control contra el Excel (" + (c && c.error ? c.error : "sin resultado") + "). ", enlace("Ver el detalle")]);
      return;
    }
    var numeros = [
      numero(c.casos.coinciden, "entero", origenDelControl(datos)),
      " de ",
      numero(c.casos.casos, "entero", origenDeCantidadDeCasos(datos))
    ];
    if (c.ok) {
      nodo.setAttribute("class", "control-vivo");
      agregar(nodo, ["Control en vivo: "].concat(numeros, [" casos coinciden con el Excel. ", enlace("Ver el control")]));
      return;
    }
    var resumenesMal = c.resumenes.zonas.coinciden !== c.resumenes.zonas.total ||
      c.resumenes.cultivos.coinciden !== c.resumenes.cultivos.total;
    var universoMal = !!(c.universo && !c.universo.ok);
    var extras = [];
    if (resumenesMal) extras.push("hay resúmenes por zona o por cultivo que no coinciden");
    if (universoMal) {
      extras.push("faltan o sobran casos o controles: se esperaban " + UNIVERSO.casos + " casos, " + UNIVERSO.pares +
        " pares cultivo-zona y " + UNIVERSO.cultivos + " cultivos");
    }
    nodo.setAttribute("class", "control-vivo control-falla");
    agregar(nodo, ["Control en vivo: hay diferencias con el Excel. "].concat(numeros, [
      " casos coinciden" + (extras.length ? " y " + extras.join(" y ") : "") + ". ",
      enlace("Ver el detalle")]));
  }

  // ---------------------------------------------------------------------------------------
  // Estado compartido (D-05, D-07).
  // ---------------------------------------------------------------------------------------

  function datosActuales(d) {
    return d || datos || raiz.TESIS_DATOS;
  }

  // Zonas en el orden de datos.casos.
  function zonasDisponibles(d) {
    d = datosActuales(d);
    var zonas = [];
    d.casos.forEach(function (c) { if (zonas.indexOf(c.zona) < 0) zonas.push(c.zona); });
    return zonas;
  }

  // Devuelve un estado nuevo y válido a partir de cualquier cosa. No modifica lo recibido.
  // El estado compartido es SÓLO la selección común: { zona, hectareas, h, unidad }. Cualquier otra
  // clave se descarta (y no se guarda en el navegador): una sección que necesite más estado lo
  // guarda en privado, dentro de su propio archivo.
  // faltantes: hectáreas de un cultivo de la zona que no venía en `crudo` (por defecto 100;
  // armarVista pasa 0 para no inventar hectáreas).
  function normalizarEstado(crudo, d, faltantes) {
    d = datosActuales(d);
    if (crudo === null || typeof crudo !== "object") crudo = {};
    if (faltantes === undefined) faltantes = HECTAREAS_INICIALES;

    var zonas = zonasDisponibles(d);
    var zona = zonas.indexOf(crudo.zona) >= 0 ? crudo.zona
      : (zonas.indexOf(ZONA_INICIAL) >= 0 ? ZONA_INICIAL : zonas[0]);

    var previo = crudo.hectareas !== null && typeof crudo.hectareas === "object" ? crudo.hectareas : {};
    var hectareas = {};
    raiz.TESIS_MOTOR.cultivosDe(d, zona).forEach(function (cultivo) {
      hectareas[cultivo] = Object.prototype.hasOwnProperty.call(previo, cultivo)
        ? leerEntero(previo[cultivo]) : faltantes;
    });

    // Proporción cubierta: de 0 a 1 en pasos de 0,05.
    var h = typeof crudo.h === "number" && isFinite(crudo.h) ? crudo.h : d.parametros.h.v;
    h = Math.round(Math.min(1, Math.max(0, h)) * 20) / 20;

    var unidad = UNIDADES.indexOf(crudo.unidad) >= 0 ? crudo.unidad : UNIDADES[0];
    return { zona: zona, hectareas: hectareas, h: h, unidad: unidad };
  }

  function estadoInicial(d) {
    return normalizarEstado({}, d);
  }

  // Almacenamiento local del navegador (D-06). En file:// algunos navegadores lo prohíben o
  // lanzan al leerlo: por eso va en try/catch y la página anda igual sin él.
  function almacenamientoLocal() {
    try {
      return raiz.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  // Estado guardado de la visita anterior, normalizado; si no hay o está roto, el inicial.
  // almacen: opcional (para las pruebas); por defecto el almacenamiento local del navegador.
  function cargarEstado(d, almacen) {
    d = datosActuales(d);
    try {
      var guardado = almacen === undefined ? almacenamientoLocal() : almacen;
      var texto = guardado ? guardado.getItem(CLAVE_ESTADO) : null;
      if (texto) return normalizarEstado(JSON.parse(texto), d);
    } catch (e) {
      // sin almacenamiento o con datos rotos: se sigue con el estado inicial
    }
    return estadoInicial(d);
  }

  function guardarEstado(estado, almacen) {
    try {
      var guardado = almacen === undefined ? almacenamientoLocal() : almacen;
      if (guardado) guardado.setItem(CLAVE_ESTADO, JSON.stringify(estado));
    } catch (e) {
      // sin lugar donde guardar: no pasa nada, sólo no se recuerda la elección
    }
  }

  // ---------------------------------------------------------------------------------------
  // Secciones y arranque (D-03).
  // ---------------------------------------------------------------------------------------

  // Secciones que ya no se muestran en el menú de «Histórico» (su código sigue en el repo): no se registran.
  app.seccionesFueraDelMenu = ["escenario", "rentabilidad", "mi-campo"];
  // Versión resumida de «Histórico», «Costo de oportunidad» y «Datos y fuentes»: cada pantalla muestra sólo lo principal (lo que se
  // explica en una exposición). El resto del código sigue en el repo y se sigue probando: con `resumido = false` se ve todo.
  app.resumido = true;

  function registrarSeccion(seccion) {
    if (seccion === null || typeof seccion !== "object") {
      throw new Error("registrarSeccion: falta la sección ({ id, titulo, montar, actualizar })");
    }
    ["id", "titulo"].forEach(function (campo) {
      if (typeof seccion[campo] !== "string" || seccion[campo] === "") {
        throw new Error("registrarSeccion: a la sección le falta «" + campo + "»");
      }
    });
    ["montar", "actualizar"].forEach(function (campo) {
      if (typeof seccion[campo] !== "function") {
        throw new Error("registrarSeccion: a la sección «" + seccion.id + "» le falta la función «" + campo + "»");
      }
    });
    if (app.seccionesFueraDelMenu.indexOf(seccion.id) >= 0) return;
    app.secciones.forEach(function (s) {
      if (s.id === seccion.id) throw new Error("registrarSeccion: ya hay una sección con el id «" + seccion.id + "»");
    });
    app.secciones.push(seccion);
    if (arrancado) {
      incorporar(seccion);
      mostrarSeccion();
      actualizarSeccion(seccion);
    }
  }

  // Muestra el error de una sección sin romper la página (mensaje vacío = sin error). El aviso
  // está siempre arriba de la sección (justo después del título): si no, quedaría al fondo, fuera de la vista.
  function avisarError(seccion, mensaje) {
    if (!seccion.nodoError) return;
    seccion.nodoError.textContent = mensaje;
    seccion.nodoError.hidden = !mensaje;
  }

  // Si falla el cálculo, la sección no puede seguir mostrando cifras de la entrada anterior:
  // se le pide limpiar (seccion.limpiar, opcional) y se avisa el error.
  function actualizarSeccion(seccion) {
    try {
      seccion.actualizar(app.estado);
      avisarError(seccion, "");
    } catch (e) {
      if (typeof seccion.limpiar === "function") {
        try { seccion.limpiar(); } catch (otro) { /* si tampoco puede limpiar, igual se avisa */ }
      }
      avisarError(seccion, "No se pudo calcular: " + e.message);
    }
  }

  function actualizarTodas() {
    cerrarOrigen(false); // los números que se ven están por cambiar: la ventanita abierta quedaría desactualizada
    app.secciones.forEach(actualizarSeccion);
  }

  // Pestaña de la barra superior: un enlace con su ícono de línea (si está cargado vendor/lucide) y el título.
  // El rótulo es el texto corto de la barra (para que entre en un renglón); el título completo queda en `title`.
  function crearPestana(href, titulo, icono, clase, rotulo) {
    var contenido = [];
    var svg = icono && raiz.TESIS_ICONOS ? raiz.TESIS_ICONOS.icono(icono, 18) : null;
    if (svg) contenido.push(svg);
    contenido.push(el("span", { "class": "pestana-texto" }, rotulo || titulo));
    var atributos = { "class": clase, href: href };
    if (rotulo && rotulo !== titulo) atributos.title = titulo;
    return el("a", atributos, contenido);
  }

  // Pestaña, contenedor y montaje de una sección.
  function incorporarDentro(seccion) {
    var doc = raiz.document;
    var anfitriona = app.secciones.filter(function (s) { return s.id === seccion.dentroDe; })[0];
    seccion.nodoSeccion = el("div", { id: "seccion-" + seccion.id, "class": "seccion-anidada" });
    seccion.nodoError = el("p", { "class": "mensaje", role: "alert" });
    seccion.nodoError.hidden = true;
    seccion.nodoSeccion.appendChild(seccion.nodoError);
    if (!anfitriona || typeof anfitriona.alojar !== "function") {
      seccion.nodoSeccion.hidden = true;
      doc.getElementById("contenido").appendChild(seccion.nodoSeccion);
    } else {
      anfitriona.alojar(seccion, seccion.nodoSeccion);
    }
    try {
      seccion.montar(seccion.nodoSeccion);
    } catch (e) {
      avisarError(seccion, "No se pudo calcular: " + e.message);
    }
  }

  function incorporar(seccion) {
    if (seccion.dentroDe) { incorporarDentro(seccion); return; }
    var doc = raiz.document;
    var navegacion = doc.getElementById("navegacion");
    var grupo = seccion.grupo && GRUPOS[seccion.grupo] ? GRUPOS[seccion.grupo] : null;
    if (grupo) {
      var g = app.grupos[seccion.grupo];
      if (!g) {
        g = app.grupos[seccion.grupo] = { nodoPestana: crearPestana("#" + seccion.id, grupo.titulo, grupo.icono, "pestana", grupo.rotulo) };
        navegacion.appendChild(g.nodoPestana);
      }
      seccion.nodoPestana = g.nodoPestana;
      seccion.nodoSubPestana = el("a", { "class": "subpestana", href: "#" + seccion.id }, seccion.titulo);
      var subnavegacion = doc.getElementById("subnavegacion");
      if (subnavegacion) subnavegacion.appendChild(seccion.nodoSubPestana);
    } else {
      seccion.nodoPestana = crearPestana("#" + seccion.id, seccion.titulo, seccion.icono, "pestana", seccion.rotulo);
      navegacion.appendChild(seccion.nodoPestana);
    }
    seccion.nodoSeccion = el("section", { id: "seccion-" + seccion.id, "class": "seccion" });
    // tabindex -1: el título puede recibir el foco por código (al seguir un enlace a la sección) sin ser parada de tabulador.
    seccion.nodoSeccion.appendChild(el("h2", { tabindex: "-1" }, seccion.titulo));
    seccion.nodoError = el("p", { "class": "mensaje", role: "alert" });
    seccion.nodoError.hidden = true;
    seccion.nodoSeccion.appendChild(seccion.nodoError);
    // La línea de presentación del grupo va después del aviso de error (el aviso sigue siendo el segundo nodo de la sección).
    if (grupo && grupo.intro) seccion.nodoSeccion.appendChild(el("p", { "class": "grupo-intro" }, grupo.intro));
    doc.getElementById("contenido").appendChild(seccion.nodoSeccion);
    try {
      seccion.montar(seccion.nodoSeccion);
    } catch (e) {
      avisarError(seccion, "No se pudo calcular: " + e.message);
    }
  }

  function idDelHash() {
    try {
      var hash = raiz.location && raiz.location.hash ? String(raiz.location.hash) : "";
      // Un enlace puede llevar datos después de «?» (por ejemplo #campana?z=...): la sección es lo que va antes.
      if (hash.charAt(0) === "#") hash = hash.slice(1);
      var corte = hash.indexOf("?");
      return corte >= 0 ? hash.slice(0, corte) : hash;
    } catch (e) {
      return "";
    }
  }

  // Una sección por vez: la del hash de la URL o, si no hay, la primera.
  function mostrarSeccion() {
    cerrarOrigen(false); // al cambiar de sección (pestaña, atrás/adelante, enlace) la ventanita ya no apunta a nada que se vea
    var id = idDelHash();
    var visibles = app.secciones.filter(function (s) { return !s.dentroDe && (app.cargado || s.sinDatos); });
    var elegida = visibles[0] || null;
    app.secciones.forEach(function (s) {
      var destino = s.dentroDe ? app.secciones.filter(function (a) { return a.id === s.dentroDe; })[0] : s;
      if (s.id === id && destino && visibles.indexOf(destino) >= 0) elegida = destino;
    });
    var navegacionNodo = raiz.document.getElementById("navegacion");
    if (navegacionNodo) navegacionNodo.hidden = !app.cargado;
    var subnavegacion = raiz.document.getElementById("subnavegacion");
    if (subnavegacion) subnavegacion.hidden = !(app.cargado && elegida && elegida.grupo);
    app.secciones.forEach(function (s) {
      if (!s.nodoSeccion || s.dentroDe) return;
      s.nodoSeccion.hidden = s !== elegida;
      s.nodoPestana.removeAttribute("aria-current");
      if (s.nodoSubPestana) {
        s.nodoSubPestana.hidden = !(elegida && elegida.grupo === s.grupo);
        if (s === elegida) s.nodoSubPestana.setAttribute("aria-current", "page");
        else s.nodoSubPestana.removeAttribute("aria-current");
      }
    });
    if (elegida && elegida.nodoPestana) elegida.nodoPestana.setAttribute("aria-current", "page");
  }

  function mensajeDe(e) {
    return String(e && e.message ? e.message : e);
  }

  // Reemplaza el contenido de un nodo fijo de la página por un error en rojo y anunciado (role=alert).
  function mostrarFalla(id, claseBase, texto) {
    try {
      var nodo = raiz.document.getElementById(id);
      if (!nodo) return;
      vaciar(nodo);
      nodo.setAttribute("class", claseBase + " control-falla");
      nodo.setAttribute("role", "alert");
      nodo.textContent = texto;
    } catch (otro) {
      // si ni eso se puede, no hay nada más que hacer: las secciones igual se arman
    }
  }

  // Al seguir un enlace que cambia de sección («Cambiarla en Mi campo», un enlace del texto, atrás/adelante) el
  // enlace queda en una sección oculta y el foco se perdería en <body>: se lo manda al título de la sección que
  // se ve. Si el foco está en una pestaña (la navegación) se deja ahí: quien navega con el teclado no pierde su lugar.
  function alCambiarElHash() {
    mostrarSeccion();
    var doc = raiz.document;
    var activo = doc && doc.activeElement;
    var barras = [doc && doc.getElementById("navegacion"), doc && doc.getElementById("subnavegacion")];
    for (var n = activo; n; n = n.parentNode) if (barras.indexOf(n) >= 0) return;
    var visible = app.secciones.filter(function (s) { return s.nodoSeccion && !s.nodoSeccion.hidden; })[0];
    var titulo = visible && visible.nodoSeccion.firstChild;
    if (titulo && typeof titulo.focus === "function") titulo.focus({ preventScroll: false });
  }

  function arrancar() {
    var doc = raiz.document;
    if (!doc || arrancado) return;
    if (!raiz.TESIS_DATOS || !raiz.TESIS_MOTOR) {
      var contenido = doc.getElementById("contenido");
      if (contenido) {
        contenido.textContent = "No se encontraron los datos: correr pagina/simulador/herramientas/extraer_datos.py";
      }
      return;
    }
    datos = raiz.TESIS_DATOS;
    prepararOrigen(doc);
    // El control corre antes de armar las secciones y no depende de ellas: si los datos están rotos el indicador lo dice en rojo
    // (en «Datos y fuentes») y la página no se cae. Cada parte va en su propio try/catch (D-04).
    app.control = correrControl(datos);
    // Si la página no llega a armarse (datos rotos), el aviso y el indicador igual se ven si sus nodos están; si no, se pintan después, dentro de «Datos y fuentes».
    try {
      pintarAviso();
    } catch (e) {
      mostrarFalla("aviso-datos", "aviso-datos", "No se pudo mostrar el aviso de los datos: " + mensajeDe(e) + ".");
    }
    try {
      pintarIndicador();
    } catch (e) {
      mostrarFalla("control-vivo", "control-vivo", "Control en vivo: no se pudo mostrar el resultado del control (" + mensajeDe(e) + ").");
    }
    try {
      app.estado = cargarEstado(datos);
    } catch (e) {
      var principal = doc.getElementById("contenido");
      if (principal) {
        principal.textContent = "No se pudo preparar la página con estos datos: " + e.message;
        // «Datos y fuentes» no se arma: el aviso y el control en vivo se muestran acá para que la falla no quede callada.
        if (!doc.getElementById("aviso-datos")) principal.appendChild(el("p", { id: "aviso-datos", "class": "aviso-datos", role: "note" }));
        if (!doc.getElementById("control-vivo")) principal.appendChild(el("p", { id: "control-vivo", "class": "control-vivo", role: "status" }));
        try { pintarAviso(); pintarIndicador(); } catch (otro) { /* sin más que mostrar */ }
      }
      return;
    }
    arrancado = true;
    // El pie ya no lleva la línea de fechas de los datos: esa información está en «Datos y fuentes» (queda sólo el enlace).
    var pie = doc.getElementById("pie-datos");
    if (pie) { pie.textContent = ""; pie.hidden = true; }
    incorporando = true;
    app.secciones.filter(function (s) { return !s.dentroDe; }).forEach(incorporar);
    app.secciones.filter(function (s) { return s.dentroDe; }).forEach(incorporar);
    incorporando = false;
    // El aviso de los Excel y el control en vivo viven en «Datos y fuentes»: se pintan cuando ya están sus nodos.
    try {
      pintarAviso();
    } catch (e) {
      mostrarFalla("aviso-datos", "aviso-datos", "No se pudo mostrar el aviso de los datos: " + mensajeDe(e) + ".");
    }
    try {
      pintarIndicador();
    } catch (e) {
      mostrarFalla("control-vivo", "control-vivo", "Control en vivo: no se pudo mostrar el resultado del control (" + mensajeDe(e) + ").");
    }
    mostrarSeccion();
    if (!escuchaHash && typeof raiz.addEventListener === "function") {
      escuchaHash = true;
      raiz.addEventListener("hashchange", alCambiarElHash);
    }
    actualizarTodas();
  }

  // Recalcula todo con un cambio parcial del estado compartido (D-06). Sólo cambia zona,
  // hectareas, h y unidad; otras claves se descartan (ver normalizarEstado).
  function cambiar(parcial) {
    app.estado = normalizarEstado(Object.assign({}, app.estado, parcial), datosActuales());
    guardarEstado(app.estado);
    actualizarTodas();
    return app.estado;
  }

  // El productor ya cargó sus datos (o los volvió a abrir): se muestran u ocultan las pestañas y se actualizan las secciones.
  function fijarCargado(valor) {
    app.cargado = !!valor;
    if (incorporando || !arrancado) return;
    mostrarSeccion();
    actualizarTodas();
  }

  function refrescar() {
    if (!arrancado) return;
    mostrarSeccion();
    actualizarTodas();
  }

  app.fijarCargado = fijarCargado;
  app.refrescar = refrescar;
  app.registrarSeccion = registrarSeccion;
  app.arrancar = arrancar;
  app.mostrarSeccion = mostrarSeccion;
  app.zonasDisponibles = zonasDisponibles;
  app.estadoInicial = estadoInicial;
  app.normalizarEstado = normalizarEstado;
  app.CLAVE_ESTADO = CLAVE_ESTADO;
  app.cargarEstado = cargarEstado;
  app.guardarEstado = guardarEstado;
  app.cambiar = cambiar;
  app.formato = formato;
  app.numero = numero;
  app.unirOrigenes = unirOrigenes;
  app.origenCalculado = origenCalculado;
  app.explicarOrigen = explicarOrigen;
  app.el = el;
  app.vaciar = vaciar;
  app.encabezadoDeGrafico = encabezadoDeGrafico;
  app.textoAviso = textoAviso;
  app.controlResumenes = controlResumenes;
  app.correrControl = correrControl;
  app.origenDelControl = origenDelControl;
  app.controlUniverso = controlUniverso;
  app.origenDeCantidadDeCasos = origenDeCantidadDeCasos;
  app.UNIVERSO = UNIVERSO;
  app.control = null; // resultado del control en vivo; lo pone arrancar()
  app.leerOrigen = leerOrigen;
  app.posicionPanel = posicionPanel;
  app.abrirOrigen = abrirOrigen;
  app.abrirOrigenes = abrirOrigenes;
  app.vincularOrigenes = vincularOrigenes;
  app.cerrarOrigen = cerrarOrigen;
  app.origenAbierto = null; // el elemento desde el que está abierta la ventanita (null si está cerrada)

  raiz.TESIS_APP = app;
  if (typeof module !== "undefined" && module.exports) module.exports = app;

  // En la página: arranca cuando el navegador terminó de leer todos los scripts.
  if (raiz.document) {
    if (raiz.document.readyState === "loading") raiz.document.addEventListener("DOMContentLoaded", arrancar);
    else arrancar();
  }
})(typeof window !== "undefined" ? window : globalThis);
