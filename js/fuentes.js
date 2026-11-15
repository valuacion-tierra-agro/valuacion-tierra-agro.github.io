// Sección «Datos y fuentes»: sirve para auditar el simulador. Muestra si las cuentas del motor
// coinciden con el Excel (control en vivo) y, caso por caso, de qué celda sale cada número.
// Todas las cuentas las hace TESIS_MOTOR: acá no se repite ninguna fórmula.
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
(function (raiz) {
  "use strict";

  var SIN_DATO = "—"; // raya
  var MENSAJE_SIN_CASOS = "Ningún caso cumple esos filtros.";

  function base() { return raiz.TESIS_APP; }

  function celdaNumero(v, formato, origen) {
    return { v: v, formato: formato, origen: origen };
  }

  // ---------------------------------------------------------------------------------------
  // Control en vivo (D-04)
  // ---------------------------------------------------------------------------------------

  // Un valor de una diferencia, con todas sus cifras si es número; «—» si falta.
  function textoDeValor(x) {
    if (x === null || x === undefined) return SIN_DATO;
    if (typeof x === "number" && isFinite(x)) return base().formato.exacto(x);
    return String(x);
  }

  // Una diferencia del control en una línea: qué caso, qué campo, qué valores y en qué celda.
  function textoDiferencia(d) {
    var partes = [d.cultivo, d.zona, d.campana].filter(function (p) { return typeof p === "string" && p !== ""; });
    partes.push(d.campo);
    var cuerpo = d.motivo
      ? d.motivo + (d.error ? " (" + d.error + ")" : "")
      : "motor " + textoDeValor(d.motor) + " · Excel " + textoDeValor(d.excel) + " · diferencia " + textoDeValor(d.diferencia);
    return partes.join(" · ") + ": " + cuerpo + " — " + d.celda;
  }

  // Todas las celdas {v, o} de los controles de RR_Riesgo_Zonas: de dónde salen los resúmenes.
  function celdasDeResumenes(controles) {
    var lista = [];
    controles.forEach(function (control) {
      Object.keys(control).forEach(function (clave) {
        var c = control[clave];
        if (c !== null && typeof c === "object" && typeof c.o === "string") lista.push(c.o);
      });
    });
    return lista;
  }

  // Cuántos resúmenes coinciden: {v, total} como celdas con su origen.
  function armarResumen(datos, grupo, controles) {
    var origen = base().origenCalculado("Resúmenes de RR_Riesgo_Zonas que coinciden con el motor", celdasDeResumenes(controles));
    return {
      coinciden: celdaNumero(grupo.coinciden, "entero", origen),
      total: celdaNumero(grupo.total, "entero", origen)
    };
  }

  function armarControl(datos, control) {
    var a = base();
    var c = control === undefined ? a.correrControl(datos) : control;
    if (!c || c.error || !c.casos) {
      return {
        estado: "error",
        mensaje: "No se pudo correr el control contra el Excel: " + (c && c.error ? c.error : "sin resultado") + ".",
        coinciden: null, casos: null, diferenciaUsd: null, diferenciaProporcion: null,
        zonas: null, cultivos: null, diferencias: []
      };
    }
    var origenControl = a.origenDelControl(datos);
    var detalle = c.casos.detalle.concat(c.resumenes.zonas.detalle, c.resumenes.cultivos.detalle, c.universo ? c.universo.detalle : []);
    return {
      estado: c.ok ? "ok" : "falla",
      mensaje: c.ok ? "Todo coincide con el Excel." : "Hay diferencias con el Excel.",
      coinciden: celdaNumero(c.casos.coinciden, "entero", origenControl),
      casos: celdaNumero(c.casos.casos, "entero", a.origenDeCantidadDeCasos(datos)),
      diferenciaUsd: celdaNumero(c.casos.diferenciaMaxima, "diferencia", origenControl),
      diferenciaProporcion: celdaNumero(c.casos.diferenciaMaximaProporcion, "diferencia", origenControl),
      zonas: armarResumen(datos, c.resumenes.zonas, datos.controles.zonas),
      cultivos: armarResumen(datos, c.resumenes.cultivos, datos.controles.cultivos),
      diferencias: detalle.map(textoDiferencia)
    };
  }

  // ---------------------------------------------------------------------------------------
  // Los casos de la tesis (D-01): una fila por cultivo, zona y campaña
  // ---------------------------------------------------------------------------------------

  // Columnas de la tabla (17), en orden. «texto» son las tres primeras; el resto son números.
  // tituloCsv: el título que lleva el CSV si no es el de la tabla.
  var COLUMNAS = [
    { clave: "cultivo", titulo: "Cultivo", texto: true },
    { clave: "zona", titulo: "Zona", texto: true },
    { clave: "campana", titulo: "Campaña", texto: true },
    { clave: "rindeEsperado", titulo: "Rinde esperado (qq/ha)", formato: "rinde" },
    { clave: "rindeReal", titulo: "Rinde real (qq/ha)", formato: "rinde" },
    { clave: "fs", titulo: "Fs (USD/t)", formato: "usd2" },
    { clave: "sc", titulo: "Sc (USD/t)", formato: "usd2" },
    { clave: "fc", titulo: "Fc (USD/t)", formato: "usd2" },
    { clave: "gc", titulo: "GC (USD/t)", formato: "usd2" },
    { clave: "cd", titulo: "Costos directos (USD/ha)", formato: "usd2" },
    { clave: "v", titulo: "V: valor de la tierra (USD/ha)", formato: "usd2" },
    { clave: "mbProyectado", titulo: "Margen proyectado (USD/ha)", formato: "usd2" },
    { clave: "mbRealSin", titulo: "Margen real sin cobertura (USD/ha)", formato: "usd2" },
    { clave: "futuro", titulo: "Resultado del futuro (USD/ha)", formato: "usd2" },
    { clave: "mbRealCon", titulo: "Margen real con cobertura (USD/ha)", formato: "usd2" },
    { clave: "rRealSin", titulo: "Rentabilidad sin cobertura", formato: "porcentaje", tituloCsv: "Rentabilidad sin cobertura (proporción de V)" },
    { clave: "rRealCon", titulo: "Rentabilidad con cobertura", formato: "porcentaje", tituloCsv: "Rentabilidad con cobertura (proporción de V)" }
  ];

  // Entradas del caso que están directo en la fila de RR_Margenes.
  var CLAVES_DE_ENTRADA = ["rindeEsperado", "rindeReal", "fs", "sc", "fc", "gc", "cd", "v"];

  // Fórmulas en lenguaje simple (03-02 las reusa para la lista de fórmulas).
  var FORMULAS = {
    mbProyectado: "Margen proyectado = rinde esperado ÷ 10 × (Fs − GC) − costos directos − cosecha al rinde esperado",
    mbRealSin: "Margen real sin cobertura = rinde real ÷ 10 × (Sc − GC) − costos directos − cosecha al rinde real",
    futuro: "Resultado del futuro = h × [rinde esperado ÷ 10 × (Fs − Fc) − comisión × rinde esperado ÷ 10 × Fs]",
    mbRealCon: "Margen real con cobertura = margen real sin cobertura + resultado del futuro",
    rRealSin: "Rentabilidad sin cobertura = margen real sin cobertura ÷ V",
    rRealCon: "Rentabilidad con cobertura = margen real con cobertura ÷ V"
  };

  // De qué celdas parte cada resultado (campos del caso; «parametros.h» y «parametros.comision»
  // son las celdas de la hoja Parametros).
  var TABLA = ["tabla.rindeBajo", "tabla.rindeAlto", "tabla.costoBajo", "tabla.costoAlto", "tabla.piso"];
  var PARAMETROS = ["parametros.h", "parametros.comision"];
  var ENTRADAS = {};
  ENTRADAS.mbProyectado = ["rindeEsperado", "fs", "gc", "cd"].concat(TABLA);
  ENTRADAS.mbRealSin = ["rindeReal", "sc", "gc", "cd"].concat(TABLA);
  ENTRADAS.futuro = ["rindeEsperado", "fs", "fc"].concat(PARAMETROS);
  ENTRADAS.mbRealCon = ENTRADAS.mbRealSin.concat(ENTRADAS.futuro);
  ENTRADAS.rRealSin = ENTRADAS.mbRealSin.concat(["v"]);
  ENTRADAS.rRealCon = ENTRADAS.mbRealCon.concat(["v"]);

  // Celda de origen de una entrada: un campo del caso o una celda de Parametros.
  function origenDeEntrada(caso, clave, datos) {
    if (clave.indexOf("parametros.") === 0) return datos.parametros[clave.slice("parametros.".length)].o;
    return raiz.TESIS_MOTOR.origen(caso, clave, datos);
  }

  // Una fila: las entradas salen del caso (con su celda) y los resultados los calcula el motor con
  // la h y la comisión de Parametros, que son las del Excel: por eso cada resultado puede decir
  // «en el Excel» y apuntar a su celda de RR_Margenes.
  function armarFila(caso, datos) {
    var a = base();
    var motor = raiz.TESIS_MOTOR;
    var r = raiz.TESIS_MOTOR.calcularCaso(caso, { h: datos.parametros.h.v, comision: datos.parametros.comision.v });
    var celdas = {};
    CLAVES_DE_ENTRADA.forEach(function (clave) {
      var columna = COLUMNAS.filter(function (c) { return c.clave === clave; })[0];
      celdas[clave] = celdaNumero(caso[clave], columna.formato, motor.origen(caso, clave, datos));
    });
    Object.keys(FORMULAS).forEach(function (clave) {
      var columna = COLUMNAS.filter(function (c) { return c.clave === clave; })[0];
      celdas[clave] = celdaNumero(r[clave], columna.formato, a.origenCalculado(
        FORMULAS[clave],
        ENTRADAS[clave].map(function (entrada) { return origenDeEntrada(caso, entrada, datos); }),
        [motor.origen(caso, "excel." + clave, datos)]));
    });
    return { id: caso.id, fila: caso.fila, cultivo: caso.cultivo, zona: caso.zona, campana: caso.campana, celdas: celdas };
  }

  // Valores distintos de un campo de los casos, en el orden de datos.casos.
  function valoresDe(datos, campo) {
    var lista = [];
    datos.casos.forEach(function (caso) { if (lista.indexOf(caso[campo]) < 0) lista.push(caso[campo]); });
    return lista;
  }

  // Cada filtro es "" (todos) o un valor que existe en datos.casos; cualquier otra cosa vale "".
  // `opciones` trae los valores posibles de cada filtro. No modifica lo recibido.
  function normalizarFiltros(filtros, datos) {
    var opciones = { cultivo: valoresDe(datos, "cultivo"), zona: valoresDe(datos, "zona"), campana: valoresDe(datos, "campana") };
    var crudo = filtros !== null && typeof filtros === "object" ? filtros : {};
    var limpio = {};
    ["cultivo", "zona", "campana"].forEach(function (campo) {
      limpio[campo] = typeof crudo[campo] === "string" && opciones[campo].indexOf(crudo[campo]) >= 0 ? crudo[campo] : "";
    });
    return { filtros: limpio, opciones: opciones };
  }

  // La parte de la vista que cambia con los filtros (sin el control, que se arma una sola vez).
  function armarCasos(datos, filtros) {
    var a = base();
    var n = normalizarFiltros(filtros, datos);
    var f = n.filtros;
    var elegidos = datos.casos.filter(function (caso) {
      return (f.cultivo === "" || caso.cultivo === f.cultivo) &&
        (f.zona === "" || caso.zona === f.zona) &&
        (f.campana === "" || caso.campana === f.campana);
    });
    var celdas = function (campos, casos) {
      var lista = [];
      campos.forEach(function (campo) {
        casos.forEach(function (caso) { lista.push(raiz.TESIS_MOTOR.origen(caso, campo, datos)); });
      });
      return lista;
    };
    // El contador cuenta las filas que pasan los filtros: su origen son las celdas de ESAS filas y dice qué
    // filtros hay. Con cero casos no hay filas que citar: parte de todas (la cuenta las revisó todas).
    var filtrosActivos = [["cultivo", "cultivo"], ["zona", "zona"], ["campana", "campaña"]]
      .filter(function (par) { return f[par[0]] !== ""; })
      .map(function (par) { return par[1] + " = " + f[par[0]]; });
    var formulaCantidad = "Casos que cumplen los filtros elegidos" + (filtrosActivos.length ? " (" + filtrosActivos.join(", ") + ")" : "");
    return {
      filtros: f,
      opciones: n.opciones,
      columnas: COLUMNAS,
      total: celdaNumero(datos.casos.length, "entero", a.origenCalculado("Cantidad de casos de la tesis", celdas(["cultivo"], datos.casos))),
      cantidad: celdaNumero(elegidos.length, "entero", a.origenCalculado(formulaCantidad,
        celdas(["cultivo", "zona", "campana"], elegidos.length ? elegidos : datos.casos))),
      filas: elegidos.map(function (caso) { return armarFila(caso, datos); }),
      mensaje: elegidos.length === 0 ? MENSAJE_SIN_CASOS : ""
    };
  }

  // Modelo de vista: función pura, sin DOM y sin formatear. Cada celda es { v, formato, origen }
  // y se pinta con TESIS_APP.numero. `control` por defecto es TESIS_APP.correrControl(datos).
  function armarVista(datos, filtros, control) {
    var vista = armarCasos(datos, filtros);
    vista.control = armarControl(datos, control);
    vista.formulas = FORMULAS_EXPLICADAS;
    vista.parametros = armarParametros(datos);
    vista.limites = LIMITES;
    vista.archivos = armarArchivos(datos);
    return vista;
  }

  // ---------------------------------------------------------------------------------------
  // Fórmulas, límites del modelo y archivos de origen (D-06, D-07)
  // ---------------------------------------------------------------------------------------

  // Las fórmulas del modelo en lenguaje simple. Las cuentas las hace TESIS_MOTOR: esto sólo las
  // cuenta. Las cuatro primeras son las mismas FORMULAS que aparecen en el origen de la tabla.
  var FORMULAS_EXPLICADAS = [
    {
      nombre: "Margen proyectado", formula: FORMULAS.mbProyectado,
      explicacion: "Lo que se esperaba ganar al sembrar, con el rinde esperado (promedio de las 5 campañas anteriores, MAGyP) y el precio del futuro. El rinde va en quintales: ÷ 10 lo pasa a toneladas."
    },
    {
      nombre: "Margen real sin cobertura", formula: FORMULAS.mbRealSin,
      explicacion: "Lo que se ganó vendiendo a cosecha al precio disponible, con el rinde que se obtuvo."
    },
    {
      nombre: "Resultado del futuro", formula: FORMULAS.futuro,
      explicacion: "Al sembrar se vende a futuro la proporción h del rinde esperado y a cosecha se cierra: si el precio bajó se gana, si subió se pierde. Se descuenta la comisión."
    },
    {
      nombre: "Margen real con cobertura", formula: FORMULAS.mbRealCon,
      explicacion: "El margen sin cobertura más lo que dejó (o costó) el futuro."
    },
    {
      nombre: "Sorpresa", formula: "Sorpresa = margen real − margen proyectado",
      explicacion: "Cuánto se alejó lo que pasó de lo que se esperaba al sembrar, sin y con cobertura."
    },
    {
      nombre: "Riesgo", formula: "Riesgo = desvío estándar muestral de la sorpresa entre las campañas de una zona",
      explicacion: "El de un cultivo es el promedio de sus zonas. La reducción del riesgo es 1 − riesgo con cobertura ÷ riesgo sin cobertura."
    },
    {
      nombre: "Rentabilidad", formula: "Rentabilidad = margen ÷ V",
      explicacion: "V es el valor de la tierra en USD por hectárea."
    },
    {
      nombre: "Costo de cosecha", formula: "Costo de cosecha = según la tabla de cada caso y el rinde",
      explicacion: "Debajo del rinde bajo, proporcional al costo bajo con un piso; entre el rinde bajo y el alto, se interpola; arriba del alto, proporcional al costo alto."
    }
  ];

  // Lo que hay que decir para no engañar a nadie (D-07).
  var LIMITES = [
    "Son seis campañas (2020/21 a 2025/26): los números describen lo que pasó, no predicen lo que va a pasar.",
    "El rinde es el promedio de los departamentos de cada zona (MAGyP), no el de un campo en particular.",
    "Los costos directos son los de un planteo de Márgenes Agropecuarios, no los de un campo real.",
    "La cobertura se hace una sola vez, al sembrar, y se mantiene hasta la cosecha.",
    "El desvío del rinde no es sólo clima: también influyen el manejo, las plagas y otras causas.",
    "El valor de la tierra es el promedio provincial del año de cosecha.",
    "No se usa la hoja 6_Retorno_Total del libro de CAPM porque tiene pegada la rentabilidad calculada sin el costo de cosecha."
  ];

  // La comisión y la proporción cubierta (h) del Excel, como celdas con su origen en Parametros.
  function armarParametros(datos) {
    return {
      comision: celdaNumero(datos.parametros.comision.v, "porcentaje", datos.parametros.comision.o),
      h: celdaNumero(datos.parametros.h.v, "porcentaje", datos.parametros.h.o)
    };
  }

  // Hojas de las que sale algún número, por archivo (clave de meta.archivos): salen de los campos
  // de los casos y de todo texto «archivo › hoja › celda» de los demás datos. Sin repetidos y en
  // orden alfabético.
  function hojasPorArchivo(datos) {
    var archivos = datos.meta.archivos;
    var clavePorNombre = Object.create(null);
    var hojas = {};
    Object.keys(archivos).forEach(function (clave) {
      clavePorNombre[archivos[clave].nombre] = clave;
      hojas[clave] = [];
    });
    function sumar(clave, hoja) {
      if (clave in hojas && hojas[clave].indexOf(hoja) < 0) hojas[clave].push(hoja);
    }
    function recorrer(x) {
      if (typeof x === "string") {
        var partes = x.split(" › ");
        if (partes.length === 3 && partes[0] in clavePorNombre) sumar(clavePorNombre[partes[0]], partes[1]);
      } else if (x !== null && typeof x === "object") {
        Object.keys(x).forEach(function (k) { recorrer(x[k]); });
      }
    }
    Object.keys(datos.campos).forEach(function (nombre) {
      var campo = datos.campos[nombre];
      if (campo && typeof campo.archivo === "string" && typeof campo.hoja === "string") sumar(campo.archivo, campo.hoja);
    });
    ["parametros", "controles", "k", "porCampana", "precios", "referenciaTesis"].forEach(function (clave) { recorrer(datos[clave]); });
    Object.keys(hojas).forEach(function (clave) {
      hojas[clave].sort(function (a, b) { return a.localeCompare(b, "es"); });
    });
    return hojas;
  }

  // «AF», «AF y AG», «AF, AG y AH».
  function unirConY(lista) {
    if (lista.length < 2) return lista.join("");
    return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
  }

  // Un archivo que no se lee pero se cita: dónde están los textos que lo nombran.
  function notaSinHojas(datos) {
    var campos = Object.keys(datos.campos)
      .filter(function (k) { return k.indexOf("origenTexto.") === 0; })
      .map(function (k) { return datos.campos[k]; });
    var columnas = [];
    campos.forEach(function (c) { if (c && typeof c.columna === "string" && columnas.indexOf(c.columna) < 0) columnas.push(c.columna); });
    if (!columnas.length) return "No se lee ninguna hoja de este archivo.";
    return "No se lee ninguna hoja: se cita en los textos de origen de " + campos[0].hoja +
      " (" + (columnas.length > 1 ? "columnas " : "columna ") + unirConY(columnas) + ").";
  }

  // Los Excels de origen, en el orden de meta.archivos: nombre, fecha, huella, hojas leídas y uso.
  function armarArchivos(datos) {
    var a = base();
    var hojas = hojasPorArchivo(datos);
    return Object.keys(datos.meta.archivos).map(function (clave) {
      var archivo = datos.meta.archivos[clave];
      var fila = {
        clave: clave,
        nombre: archivo.nombre,
        modificado: a.formato.fechaHora(archivo.modificado),
        sha256: archivo.sha256,
        uso: archivo.uso,
        hojas: hojas[clave]
      };
      if (fila.hojas.length === 0) fila.nota = notaSinHojas(datos);
      return fila;
    });
  }

  // ---------------------------------------------------------------------------------------
  // CSV de los casos filtrados (D-02): punto y coma, coma decimal y BOM UTF-8, para que Excel en
  // español lo abra con las columnas separadas y las tildes bien.
  // ---------------------------------------------------------------------------------------

  var NOMBRE_CSV = "casos-simulador-tesis.csv";
  var BOM = "\uFEFF";
  var SALTO = "\r\n";
  var ESPERA_PARA_LIBERAR_MS = 30000; // cuánto se espera para liberar la dirección del Blob

  // Número con coma decimal y guion común (Excel no lee el signo menos U+2212); si no es número, vacío.
  function numeroCsv(v) {
    if (typeof v !== "number" || !isFinite(v)) return "";
    return String(v).replace(".", ",");
  }

  // Texto de una celda del CSV. Un texto que empieza con = + - @ (o con tabulador o retorno de carro,
  // que OWASP también cita) Excel lo tomaría por una fórmula: se le antepone un apóstrofo. Ojo: al abrir
  // un CSV Excel muestra ese apóstrofo como parte del texto. Con los datos actuales no se usa (cultivos
  // y zonas no empiezan así). Si trae punto y coma, comillas o saltos de línea va entre comillas.
  function textoCsv(t) {
    var texto = t === null || t === undefined ? "" : String(t);
    if (/^[=+\-@\t\r]/.test(texto)) texto = "'" + texto;
    if (/[;"\r\n]/.test(texto)) texto = '"' + texto.replace(/"/g, '""') + '"';
    return texto;
  }

  // El CSV de lo que se ve: encabezado y una fila por caso (rentabilidades como proporción de V).
  function armarCsv(vista) {
    var numericas = vista.columnas.filter(function (c) { return !c.texto; });
    var renglones = [["Cultivo", "Zona", "Campaña", "Fila en RR_Margenes"]
      .concat(numericas.map(function (c) { return c.tituloCsv || c.titulo; }))
      .map(textoCsv).join(";")];
    vista.filas.forEach(function (fila) {
      renglones.push([textoCsv(fila.cultivo), textoCsv(fila.zona), textoCsv(fila.campana), numeroCsv(fila.fila)]
        .concat(numericas.map(function (c) { return numeroCsv(fila.celdas[c.clave].v); })).join(";"));
    });
    return BOM + renglones.join(SALTO) + SALTO;
  }

  // Baja el texto como archivo desde el navegador, sin red: un Blob, un enlace con `download` y un
  // clic. Devuelve false si el navegador no sabe hacerlo. El enlace se agrega a `contenedor` y se saca.
  function descargarCsv(texto, contenedor) {
    if (typeof raiz.Blob !== "function" || !raiz.URL || typeof raiz.URL.createObjectURL !== "function") return false;
    var blob = new raiz.Blob([texto], { type: "text/csv;charset=utf-8" });
    var url = raiz.URL.createObjectURL(blob);
    var enlace = base().el("a", { href: url, download: NOMBRE_CSV });
    enlace.hidden = true;
    contenedor.appendChild(enlace);
    var liberar = function () { raiz.URL.revokeObjectURL(url); };
    try {
      enlace.click();
    } catch (e) {
      liberar(); // el clic falló: nadie va a leer el Blob
      throw e;
    } finally {
      contenedor.removeChild(enlace); // pase lo que pase el enlace no queda en la página
    }
    // Se libera la dirección mucho después del clic: Firefox y Safari pueden tardar en empezar a leer
    // el Blob y, si ya se liberó, la descarga falla o baja un archivo vacío.
    if (typeof raiz.setTimeout === "function") raiz.setTimeout(liberar, ESPERA_PARA_LIBERAR_MS);
    else liberar();
    return true;
  }

  // ---------------------------------------------------------------------------------------
  // Pintado
  // ---------------------------------------------------------------------------------------

  var nodos = null;        // se arma en montar()
  var controlPintado = null; // el control que ya está en pantalla (se pinta una sola vez)

  function num(celda) {
    return base().numero(celda.v, celda.formato, celda.origen);
  }

  function pintarControl(ctl) {
    var a = base();
    var el = a.el;
    a.vaciar(nodos.controlCuerpo);
    if (ctl.estado === "error") {
      nodos.controlCuerpo.appendChild(el("p", { "class": "control-falla", role: "alert" }, ctl.mensaje));
      return;
    }
    nodos.controlCuerpo.appendChild(el("p", { "class": "df-resultado" }, [
      num(ctl.coinciden), " de ", num(ctl.casos), " casos coinciden con el Excel · diferencia máxima: ",
      num(ctl.diferenciaUsd), " USD/ha en márgenes y ", num(ctl.diferenciaProporcion), " en rentabilidades."
    ]));
    nodos.controlCuerpo.appendChild(el("p", { "class": "df-resumenes" }, [
      "Resúmenes de riesgo (RR_Riesgo_Zonas): ", num(ctl.zonas.coinciden), " de ", num(ctl.zonas.total), " zonas y ",
      num(ctl.cultivos.coinciden), " de ", num(ctl.cultivos.total), " cultivos coinciden."
    ]));
    nodos.controlCuerpo.appendChild(el("p", { "class": "ayuda" },
      "Se corre cada vez que se abre la página, con la misma tolerancia de redondeo que las pruebas del motor."));
    if (ctl.estado === "falla") {
      nodos.controlCuerpo.appendChild(el("p", { "class": "control-falla" }, "Diferencias encontradas:"));
      nodos.controlCuerpo.appendChild(el("ul", { "class": "df-diferencias" },
        ctl.diferencias.map(function (texto) { return el("li", null, texto); })));
    }
  }

  // Los filtros viven en este módulo: el estado compartido de la base sólo tiene zona, hectáreas,
  // h y unidad (normalizarEstado descartaría una clave nueva).
  var filtrosElegidos = { cultivo: "", zona: "", campana: "" };

  var vistaActual = null; // la vista de los casos que se ve (de ahí sale el CSV)

  var FILTROS = [
    { campo: "cultivo", id: "df-cultivo", etiqueta: "Cultivo", todos: "Todos" },
    { campo: "zona", id: "df-zona", etiqueta: "Zona", todos: "Todas" },
    { campo: "campana", id: "df-campana", etiqueta: "Campaña", todos: "Todas" }
  ];

  // La última columna («Orígenes») trae un botón «Ver orígenes»: los números de esta tabla no son
  // paradas de tabulador (serían más de 1.500), así que el teclado llega a los orígenes de toda la
  // fila por ese botón. Con el mouse o el dedo, cada número se toca igual y abre su ventanita.
  // El botón va en su propia celda, no en el encabezado de la fila: así no se repite en el nombre de
  // la fila que leen los lectores de pantalla y la fila no se agranda.
  function filaDeTabla(fila, columnas) {
    var a = base();
    var nombre = fila.cultivo + " · " + fila.zona + " · " + fila.campana;
    var boton = a.el("button", {
      type: "button", "class": "df-ver-origenes",
      "aria-label": "Ver orígenes de los números de " + fila.cultivo + ", " + fila.zona + ", campaña " + fila.campana
    }, "Ver orígenes");
    a.vincularOrigenes(boton, function () {
      return {
        titulo: nombre,
        items: columnas.filter(function (c) { return !c.texto; }).map(function (c) {
          var celda = fila.celdas[c.clave];
          return { etiqueta: c.titulo, v: celda.v, formato: celda.formato, origen: celda.origen };
        })
      };
    });
    return a.el("tr", null, columnas.map(function (columna, i) {
      if (i === 0) return a.el("th", { scope: "row" }, fila.cultivo);
      if (columna.texto) return a.el("td", null, fila[columna.clave]);
      var celda = fila.celdas[columna.clave];
      return a.el("td", null, a.numero(celda.v, celda.formato, celda.origen, { enfocable: false }));
    }).concat([a.el("td", { "class": "col-origenes" }, boton)]));
  }

  function pintarTabla(vista) {
    var a = base();
    var el = a.el;
    // Se recuerda el desplazamiento horizontal y se devuelve al repintar (como en «Mi campo»).
    var desplazamiento = nodos.casos.scrollLeft;
    a.vaciar(nodos.casos);
    if (vista.filas.length === 0) {
      nodos.casos.appendChild(el("p", { "class": "mc-mensaje", role: "status" }, vista.mensaje));
      return;
    }
    nodos.casos.appendChild(el("table", { "class": "mc-tabla df-tabla" }, [
      el("caption", null, "Casos filtrados: márgenes en USD por hectárea, precios en USD por tonelada"),
      el("thead", null, el("tr", null, vista.columnas.map(function (c) { return el("th", { scope: "col" }, c.titulo); })
        .concat([el("th", { scope: "col", "class": "col-origenes" }, "Orígenes")]))),
      el("tbody", null, vista.filas.map(function (fila) { return filaDeTabla(fila, vista.columnas); }))
    ]));
    if (desplazamiento) nodos.casos.scrollLeft = desplazamiento;
  }

  // Contador y tabla: lo único que cambia al elegir un filtro.
  function pintarCasos() {
    var a = base();
    var vista = armarCasos(raiz.TESIS_DATOS, filtrosElegidos);
    filtrosElegidos = vista.filtros;
    FILTROS.forEach(function (f) { nodos.selectores[f.campo].value = vista.filtros[f.campo]; });
    a.vaciar(nodos.contador);
    [num(vista.cantidad), " de ", num(vista.total), " casos"].forEach(function (parte) {
      nodos.contador.appendChild(typeof parte === "string" ? raiz.document.createTextNode(parte) : parte);
    });
    pintarTabla(vista);
    vistaActual = vista;
    nodos.csvEstado.textContent = ""; // el aviso de la descarga anterior ya no corresponde a lo que se ve
    return vista;
  }

  // «Descargar CSV»: baja los casos que se ven y avisa qué pasó.
  function descargar() {
    var mensaje;
    try {
      mensaje = descargarCsv(armarCsv(vistaActual), nodos.casosSeccion)
        ? "Listo: se generó " + NOMBRE_CSV + " con los casos filtrados."
        : "Este navegador no permite descargar el archivo.";
    } catch (e) {
      mensaje = "No se pudo generar el archivo: " + e.message;
    }
    nodos.csvEstado.textContent = mensaje;
  }

  // «Cómo se calcula»: las fórmulas en lenguaje simple y la comisión y la h que usa el Excel.
  function pintarFormulas(datos) {
    var a = base();
    var el = a.el;
    var parametros = armarParametros(datos);
    return el("section", { id: "df-formulas", "class": "df-formulas df-bloque" }, [
      el("h3", null, "Cómo se calcula"),
      el("dl", null, FORMULAS_EXPLICADAS.map(function (f) {
        return [
          el("dt", null, f.nombre),
          el("dd", null, [el("p", { "class": "df-formula" }, f.formula), el("p", { "class": "df-explicacion" }, f.explicacion)])
        ];
      })),
      el("p", { "class": "ayuda" }, [
        "En el Excel, la comisión es ", num(parametros.comision), " del precio del futuro y la proporción cubierta (h) es ",
        num(parametros.h), "."
      ])
    ]);
  }

  function pintarLimites() {
    var el = base().el;
    return el("section", { id: "df-limites", "class": "df-bloque" }, [
      el("h3", null, "Límites del modelo"),
      el("ol", { "class": "df-limites" }, LIMITES.map(function (texto) { return el("li", null, texto); }))
    ]);
  }

  function pintarArchivos(datos) {
    var el = base().el;
    var filas = armarArchivos(datos).map(function (f) {
      return el("tr", null, [
        el("td", null, f.nombre),
        el("td", null, f.modificado),
        el("td", null, el("code", { "class": "df-huella" }, f.sha256)),
        el("td", null, f.hojas.length ? f.hojas.join(", ") : f.nota),
        el("td", null, f.uso)
      ]);
    });
    return el("section", { id: "df-archivos", "class": "df-bloque" }, [
      el("h3", null, "Archivos de origen"),
      el("p", { "class": "ayuda" },
        "Los números salen de estos Excels (carpeta " + datos.meta.carpeta + "). La huella SHA-256 sirve para comprobar que el archivo " +
        "es el mismo: si cambia una celda, cambia la huella."),
      el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla df-archivos" }, [
        el("caption", null, "Excels de los que salen los datos"),
        el("thead", null, el("tr", null, ["Archivo", "Modificado", "Huella SHA-256", "Hojas leídas", "Uso"]
          .map(function (titulo) { return el("th", { scope: "col" }, titulo); }))),
        el("tbody", null, filas)
      ]))
    ]);
  }

  function montar(contenedor) {
    var a = base();
    var el = a.el;
    var datos = raiz.TESIS_DATOS;
    nodos = { selectores: {}, casosListos: false, acordeones: {} };
    nodos.volver = el("p", { "class": "df-volver" }, el("a", { href: "#campana" }, "← Volver a cargar mis datos"));
    nodos.volver.hidden = a.cargado;
    contenedor.appendChild(nodos.volver);
    contenedor.appendChild(el("p", { "class": "df-intro" },
      "Acá está todo lo que usa el simulador: los precios, el valor de la tierra y los datos de los Excels de la tesis. Tocá un título para abrirlo. " +
      "Tocá o hacé clic en cualquier número subrayado para ver de qué archivo, hoja y celda sale."));
    // Tres desplegables, cerrados al abrir. Precios y Valor de la tierra los llenan sus módulos (alojar); «Datos y estadística» trae el resto.
    var acordeon = function (clave, titulo) {
      var cuerpo = el("div", { "class": "df-acordeon-cuerpo" });
      var d = el("details", { "class": "df-acordeon", id: "df-acordeon-" + clave }, [el("summary", null, titulo), cuerpo]);
      nodos.acordeones[clave] = { detalle: d, cuerpo: cuerpo };
      contenedor.appendChild(d);
      return cuerpo;
    };
    acordeon("precios", "Precios");
    acordeon("tierra", "Valor de la tierra");
    var estadistica = acordeon("estadistica", "Datos y estadística");
    nodos.avisoDatos = el("p", { id: "aviso-datos", "class": "aviso-datos", role: "note" });
    nodos.controlVivo = el("p", { id: "control-vivo", "class": "control-vivo", role: "status" });
    estadistica.appendChild(nodos.avisoDatos);
    estadistica.appendChild(nodos.controlVivo);
    contenedor = estadistica;
    nodos.controlCuerpo = el("div", { "class": "df-control-cuerpo" });
    contenedor.appendChild(el("section", { id: "df-control", "class": "df-control tarjeta" }, [
      el("h3", null, "Control en vivo contra el Excel"),
      nodos.controlCuerpo
    ]));

    // Casos de la tesis: filtros, contador y tabla.
    var opciones = normalizarFiltros({}, datos).opciones;
    var controles = FILTROS.map(function (f) {
      var selector = el("select", { id: f.id },
        [el("option", { value: "" }, f.todos)].concat(opciones[f.campo].map(function (valor) { return el("option", { value: valor }, valor); })));
      selector.addEventListener("change", function () {
        var nuevo = Object.assign({}, filtrosElegidos);
        nuevo[f.campo] = selector.value;
        filtrosElegidos = nuevo;
        pintarCasos();
      });
      nodos.selectores[f.campo] = selector;
      return el("div", null, [el("label", { "for": f.id }, f.etiqueta), selector]);
    });
    nodos.contador = el("p", { id: "df-contador", "class": "df-contador", role: "status" });
    var boton = el("button", { type: "button", id: "df-csv", "class": "df-csv" }, "Descargar CSV");
    boton.addEventListener("click", descargar);
    nodos.csvEstado = el("p", { id: "df-csv-estado", "class": "ayuda", role: "status" });
    nodos.casos = el("div", { id: "df-casos", "class": "tabla-contenedor df-tabla-contenedor" });
    nodos.casosSeccion = el("section", { "class": "df-casos" }, [
      el("h3", null, "Casos de la tesis"),
      el("p", { "class": "ayuda" },
        "Cada fila es un cultivo en una zona y una campaña. Los resultados los calcula el simulador con la proporción cubierta " +
        "y la comisión de la hoja Parametros y se comparan con RR_Margenes."),
      el("p", { "class": "ayuda", id: "df-siglas" },
        "Fs: precio del futuro a la siembra · Sc: precio disponible a cosecha · Fc: precio del futuro a cosecha · GC: gastos de comercialización · V: valor de la tierra."),
      el("div", { "class": "df-filtros" }, controles),
      el("div", { "class": "df-acciones" }, [nodos.contador, boton]),
      nodos.csvEstado,
      nodos.casos
    ]);
    contenedor.appendChild(nodos.casosSeccion);
    contenedor.appendChild(pintarFormulas(datos));
    contenedor.appendChild(pintarLimites());
    contenedor.appendChild(pintarArchivos(datos));
  }

  // Ni el control ni los casos dependen de «Mi campo»: se pintan una sola vez y los filtros
  // repintan sólo el contador y la tabla.
  function actualizar() {
    var a = base();
    if (nodos.volver) nodos.volver.hidden = !!a.cargado;
    var control = a.control || undefined;
    if (!nodos.casosListos || control === undefined || control !== controlPintado) {
      pintarControl(armarControl(raiz.TESIS_DATOS, control));
      controlPintado = control === undefined ? null : control;
    }
    if (!nodos.casosListos) {
      pintarCasos();
      nodos.casosListos = true;
    }
  }

  // Si el cálculo falla, la base pide vaciar lo que se ve.
  function limpiar() {
    if (!nodos) return;
    var a = base();
    a.vaciar(nodos.controlCuerpo);
    a.vaciar(nodos.contador);
    a.vaciar(nodos.casos);
    nodos.csvEstado.textContent = "";
    vistaActual = null;
    nodos.casosListos = false;
    controlPintado = null;
  }

  // Un módulo que vive dentro de un desplegable de esta sección (Precios, Valor de la tierra): se arma su lugar y se le avisa al abrirse.
  var CLAVES_ALOJADAS = { precios: "precios", tierra: "tierra" };
  function alojar(hija, nodo) {
    var clave = CLAVES_ALOJADAS[hija.id];
    var lugar = clave && nodos && nodos.acordeones ? nodos.acordeones[clave] : null;
    if (!lugar) { nodo.hidden = true; base().el && raiz.document.getElementById("contenido").appendChild(nodo); return; }
    lugar.cuerpo.appendChild(nodo);
    lugar.detalle.addEventListener("toggle", function () { try { hija.actualizar(base().estado); } catch (e) { /* el error ya lo muestra la sección */ } });
  }

  var seccion = { id: "datos-y-fuentes", titulo: "Datos y fuentes", icono: "database", sinDatos: true, alojar: alojar, montar: montar, actualizar: actualizar, limpiar: limpiar };

  var api = {
    armarVista: armarVista,
    armarFila: armarFila,
    normalizarFiltros: normalizarFiltros,
    textoDiferencia: textoDiferencia,
    armarCsv: armarCsv,
    numeroCsv: numeroCsv,
    textoCsv: textoCsv,
    descargarCsv: descargarCsv,
    NOMBRE_CSV: NOMBRE_CSV,
    seccion: seccion,
    FORMULAS: FORMULAS,
    FORMULAS_EXPLICADAS: FORMULAS_EXPLICADAS,
    LIMITES: LIMITES,
    hojasPorArchivo: hojasPorArchivo,
    armarArchivos: armarArchivos,
    armarParametros: armarParametros,
    ENTRADAS: ENTRADAS,
    COLUMNAS: COLUMNAS
  };
  raiz.TESIS_FUENTES = api;
  // Sin la base común la sección desaparecería sin decir nada: mejor un error claro en la consola.
  if (!raiz.TESIS_APP) throw new Error("fuentes.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
