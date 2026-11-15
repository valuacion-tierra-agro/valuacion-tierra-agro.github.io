// Motor de cálculo del simulador de la tesis (funciones puras, sin DOM).
// Las cuentas son las mismas que hace CLIMA_RINDE/modelo.py y que hace el Excel.
// Script clásico: anda con una etiqueta <script> (doble clic, file://) y con require en Node.
(function (raiz) {
  "use strict";

  // Tolerancias de las pruebas contra el Excel (D-16).
  var TOLERANCIA_USD = 1e-6;         // USD/ha
  var TOLERANCIA_PROPORCION = 1e-9;  // rentabilidades y proporciones

  // Costo de cosecha (USD/ha) al rinde yQq (qq/ha), según la tabla de Márgenes.
  // tabla = { rindeBajo, rindeAlto, costoBajo, costoAlto, piso }
  function cosecha(yQq, tabla) {
    var rb = tabla.rindeBajo, ra = tabla.rindeAlto;
    var cb = tabla.costoBajo, ca = tabla.costoAlto;
    if (yQq < rb) return Math.max(tabla.piso, cb * yQq / rb);
    if (yQq > ra) return ca * yQq / ra;
    if (ra === rb) return cb;
    return cb + (ca - cb) * (yQq - rb) / (ra - rb);
  }

  // Lee un campo con punto ("tabla.piso", "excel.mbProyectado"); undefined si no existe.
  function valorDe(caso, campo) {
    var actual = caso;
    var partes = String(campo).split(".");
    for (var i = 0; i < partes.length; i++) {
      if (actual === null || actual === undefined || typeof actual !== "object") return undefined;
      actual = actual[partes[i]];
    }
    return actual;
  }

  function nombreDelCaso(caso) {
    return caso.cultivo + " · " + caso.zona + " · " + caso.campana;
  }

  function esNumeroFinito(x) {
    return typeof x === "number" && isFinite(x);
  }

  // a ÷ b, o null si el divisor es 0 (o la cuenta no da un número finito): nunca Infinity ni NaN.
  function dividir(a, b) {
    if (b === 0) return null;
    var c = a / b;
    return esNumeroFinito(c) ? c : null;
  }

  // h de mínima varianza = −covarianza ÷ varianza del futuro, o null si el futuro no varía.
  function hMinimaVarianza(covarianza, varianzaFuturo) {
    var h = dividir(-covarianza, varianzaFuturo);
    return h === null ? null : h;
  }

  // Reducción del riesgo: 1 − con ÷ sin, o null si el riesgo sin cobertura es 0.
  function reduccion(con, sin) {
    var c = dividir(con, sin);
    return c === null ? null : 1 - c;
  }

  // h y comisión: los que vengan en opciones o, si no, los parámetros del `datos` que se pasa
  // (o, en su defecto, el de opciones.datos y, al final, el global TESIS_DATOS).
  function resolverHyComision(opciones, datos) {
    datos = datos || (opciones && opciones.datos) || raiz.TESIS_DATOS;
    var h = opciones && opciones.h;
    var comision = opciones && opciones.comision;
    if (h === undefined || h === null) {
      if (datos && datos.parametros && datos.parametros.h) h = datos.parametros.h.v;
    }
    if (comision === undefined || comision === null) {
      if (datos && datos.parametros && datos.parametros.comision) comision = datos.parametros.comision.v;
    }
    if (h === undefined || h === null) {
      throw new Error("Falta la proporción cubierta h: pasarla en las opciones o cargar datos/datos.js");
    }
    if (comision === undefined || comision === null) {
      throw new Error("Falta la comisión: pasarla en las opciones o cargar datos/datos.js");
    }
    // h puede ser mayor que 1 (sobrecobertura: la h de mínima varianza de la soja es 1,094).
    if (!esNumeroFinito(h) || h < 0) {
      throw new Error("La proporción cubierta h tiene que ser un número mayor o igual a 0 (llegó " + h + ")");
    }
    if (!esNumeroFinito(comision) || comision < 0) {
      throw new Error("La comisión tiene que ser un número mayor o igual a 0 (llegó " + comision + ")");
    }
    return { h: h, comision: comision };
  }

  // Nombre en español de cada entrada, para los mensajes de error.
  var NOMBRES_ENTRADAS = {
    rindeEsperado: "el rinde esperado", rindeReal: "el rinde real", fs: "el precio de siembra (fs)",
    sc: "el precio de cosecha (sc)", fc: "el precio del futuro en cosecha (fc)", gc: "el gasto de comercialización (gc)",
    cd: "los costos directos (cd)", v: "el valor de la tierra"
  };

  var CLAVES_AJUSTABLES = ["rindeEsperado", "rindeReal", "fs", "sc", "fc", "gc", "cd", "v", "tabla"];
  var CLAVES_TABLA = ["rindeBajo", "rindeAlto", "costoBajo", "costoAlto", "piso"];

  // Arma las entradas del caso pisadas por los ajustes (no modifica el caso).
  function entradasConAjustes(caso, ajustes) {
    var e = {
      rindeEsperado: caso.rindeEsperado, rindeReal: caso.rindeReal,
      fs: caso.fs, sc: caso.sc, fc: caso.fc, gc: caso.gc, cd: caso.cd, v: caso.v,
      tabla: {
        rindeBajo: caso.tabla.rindeBajo, rindeAlto: caso.tabla.rindeAlto,
        costoBajo: caso.tabla.costoBajo, costoAlto: caso.tabla.costoAlto, piso: caso.tabla.piso
      }
    };
    if (ajustes) {
      Object.keys(ajustes).forEach(function (clave) {
        if (CLAVES_AJUSTABLES.indexOf(clave) < 0) {
          throw new Error("Ajuste desconocido «" + clave + "»: se puede pisar " + CLAVES_AJUSTABLES.join(", "));
        }
        if (clave === "tabla") {
          Object.keys(ajustes.tabla || {}).forEach(function (k) {
            if (CLAVES_TABLA.indexOf(k) < 0) {
              throw new Error("Ajuste desconocido «tabla." + k + "» en " + nombreDelCaso(caso));
            }
            e.tabla[k] = ajustes.tabla[k];
          });
        } else {
          e[clave] = ajustes[clave];
        }
      });
    }
    var obligatorias = ["rindeEsperado", "rindeReal", "fs", "sc", "fc", "gc", "cd", "v"];
    obligatorias.forEach(function (k) {
      if (!esNumeroFinito(e[k])) {
        throw new Error("Entrada no numérica en " + nombreDelCaso(caso) + ": " + NOMBRES_ENTRADAS[k] + " (" + k + ") = " + e[k]);
      }
    });
    CLAVES_TABLA.forEach(function (k) {
      if (!esNumeroFinito(e.tabla[k])) {
        throw new Error("Entrada no numérica en " + nombreDelCaso(caso) + ": tabla." + k + " = " + e.tabla[k]);
      }
    });
    // Dominio: un valor finito pero sin sentido (V = 0, rinde esperado 0) daría Infinity más adelante.
    var dominio = [
      ["v", "el valor de la tierra", e.v > 0, "mayor que 0"],
      ["rindeEsperado", "el rinde esperado", e.rindeEsperado > 0, "mayor que 0"],
      ["rindeReal", "el rinde real", e.rindeReal >= 0, "mayor o igual a 0"],
      ["tabla.rindeBajo", "el rinde bajo de la tabla de cosecha", e.tabla.rindeBajo > 0, "mayor que 0"]
    ];
    dominio.forEach(function (d) {
      if (!d[2]) {
        throw new Error("Entrada fuera de rango en " + nombreDelCaso(caso) + ": " + d[1] + " (" + d[0] +
          ") tiene que ser " + d[3] + " (llegó " + valorDe(e, d[0]) + ")");
      }
    });
    return e;
  }

  // Cuentas de un caso (rindes en qq/ha, precios en USD/t, márgenes en USD/ha).
  // opciones (opcional): { h, comision, ajustes, datos }. Sin h o comisión explícitas se toman de
  // opciones.datos.parametros y, si tampoco hay datos, del global TESIS_DATOS.
  function calcularCaso(caso, opciones) {
    var hc = resolverHyComision(opciones);
    var h = hc.h, comision = hc.comision;
    var e = entradasConAjustes(caso, opciones && opciones.ajustes);
    var ye = e.rindeEsperado / 10;   // t/ha
    var yr = e.rindeReal / 10;
    var cosechaEsperado = cosecha(e.rindeEsperado, e.tabla);
    var cosechaReal = cosecha(e.rindeReal, e.tabla);
    var mbProyectado = ye * (e.fs - e.gc) - e.cd - cosechaEsperado;
    var mbRealSin = yr * (e.sc - e.gc) - e.cd - cosechaReal;
    var futuro100 = ye * (e.fs - e.fc) - comision * ye * e.fs;
    var futuro = h * futuro100;
    var mbRealCon = mbRealSin + futuro;
    var sorpresaSin = mbRealSin - mbProyectado;
    var sorpresaCon = mbRealCon - mbProyectado;
    var soloPrecioSin = ye * (e.sc - e.fs);
    return {
      rindeEsperadoQq: e.rindeEsperado,
      rindeRealQq: e.rindeReal,
      desvioRinde: yr / ye - 1,
      cosechaEsperado: cosechaEsperado,
      cosechaReal: cosechaReal,
      mbProyectado: mbProyectado,
      mbRealSin: mbRealSin,
      futuro100: futuro100,
      futuro: futuro,
      mbRealCon: mbRealCon,
      sorpresaSin: sorpresaSin,
      sorpresaCon: sorpresaCon,
      soloPrecioSin: soloPrecioSin,
      soloPrecioCon: soloPrecioSin + futuro,
      efectoPrecio: soloPrecioSin,
      efectoRinde: (yr - ye) * (e.fs - e.gc) - (cosechaReal - cosechaEsperado),
      interaccion: (yr - ye) * (e.sc - e.fs),
      rProyectada: mbProyectado / e.v,
      rRealSin: mbRealSin / e.v,
      rRealCon: mbRealCon / e.v,
      sorpresaRSin: sorpresaSin / e.v,
      sorpresaRCon: sorpresaCon / e.v,
      h: h,
      comision: comision
    };
  }

  // MB con cobertura y MB spot al rinde de planteo, para reproducir Datos_Completos!Q:S (D-15, D-17 b).
  // opciones (opcional): { h, comision, datos } (igual que en calcularCaso)
  function calcularPlanteo(caso, opciones) {
    var hc = resolverHyComision(opciones);
    var h = hc.h, comision = hc.comision;
    var entradas = ["rindePlanteo", "fs", "sc", "fc", "gc", "cd", "cosechaPlanteo"];
    entradas.forEach(function (k) {
      if (!esNumeroFinito(caso[k])) {
        throw new Error("Entrada no numérica en " + nombreDelCaso(caso) + ": " + k + " = " + caso[k]);
      }
    });
    var yp = caso.rindePlanteo / 10;   // t/ha
    var comisionUsd = comision * h * yp * caso.fs;
    // El Excel (Datos_Completos!V) tiene el costo de cosecha cargado como valor y R y S lo restan
    // tal cual; igual que modelo.py. La regla de la tabla se calcula aparte, sólo como control.
    var cosechaPlanteo = caso.cosechaPlanteo;
    var mbSpot = yp * (caso.sc - caso.gc) - caso.cd - cosechaPlanteo;
    var mbCobertura = mbSpot + h * yp * (caso.fs - caso.fc) - comisionUsd;
    return {
      rindePlanteoQq: caso.rindePlanteo,
      comisionUsd: comisionUsd,
      cosechaPlanteo: cosechaPlanteo,
      cosechaPlanteoTabla: cosecha(caso.rindePlanteo, caso.tabla),
      mbSpot: mbSpot,
      mbCobertura: mbCobertura
    };
  }

  // De qué celda sale un campo del caso: «archivo › hoja › celda» (D-06).
  function origen(caso, campo, datos) {
    datos = datos || raiz.TESIS_DATOS;
    var c = datos && datos.campos && datos.campos[campo];
    if (!c) throw new Error("Campo desconocido «" + campo + "»: no está en el mapa de origen de datos.js");
    var archivo = datos.meta.archivos[c.archivo].nombre;
    return archivo + " › " + c.hoja + " › " + c.columna + caso[c.fila];
  }

  // Campos que se comparan contra el Excel (14 de RR_Margenes y 3 de Datos_Completos):
  // [campo del Excel, función que lo calcula con el motor, tolerancia, ¿es USD/ha?].
  function camposDeControl() {
    var directo = function (nombre) { return function (r) { return r[nombre]; }; };
    return [
      ["desvioRinde", directo("desvioRinde"), TOLERANCIA_PROPORCION, false],
      ["rProyectada", directo("rProyectada"), TOLERANCIA_PROPORCION, false],
      ["rRealSin", directo("rRealSin"), TOLERANCIA_PROPORCION, false],
      ["rRealCon", directo("rRealCon"), TOLERANCIA_PROPORCION, false],
      ["sorpresaRSin", directo("sorpresaRSin"), TOLERANCIA_PROPORCION, false],
      ["sorpresaRCon", directo("sorpresaRCon"), TOLERANCIA_PROPORCION, false],
      ["cosechaEsperado", directo("cosechaEsperado"), TOLERANCIA_USD, true],
      ["cosechaReal", directo("cosechaReal"), TOLERANCIA_USD, true],
      ["mbProyectado", directo("mbProyectado"), TOLERANCIA_USD, true],
      ["mbRealSin", directo("mbRealSin"), TOLERANCIA_USD, true],
      ["futuro", directo("futuro"), TOLERANCIA_USD, true],
      ["mbRealCon", directo("mbRealCon"), TOLERANCIA_USD, true],
      ["sorpresaSin", directo("sorpresaSin"), TOLERANCIA_USD, true],
      ["sorpresaCon", directo("sorpresaCon"), TOLERANCIA_USD, true],
      // Datos_Completos, con el rinde de planteo
      ["mbCoberturaPlanteo", function (r, p) { return p.mbCobertura; }, TOLERANCIA_USD, true],
      ["mbSpotPlanteo", function (r, p) { return p.mbSpot; }, TOLERANCIA_USD, true],
      ["comisionPlanteo", function (r, p) { return p.comisionUsd; }, TOLERANCIA_USD, true]
    ];
  }

  // La celda de origen de un campo, o un texto si el mapa no la tiene (no tiene que tirar el control).
  function celdaSegura(caso, campo, datos) {
    try { return origen(caso, campo, datos); } catch (e) { return "sin celda de origen para " + campo; }
  }

  // Compara el motor con los valores que trae el Excel en todos los casos (D-15).
  // No modifica datos. Devuelve { casos, coinciden, diferenciaMaxima, diferenciaMaximaProporcion,
  // sinComparar, detalle }. Un valor del Excel faltante o no numérico, un valor del motor no finito o
  // un caso que no se puede calcular son diferencias (nunca coincidencias): van al detalle, con
  // `motivo` (y `error` si el cálculo lanzó). sinComparar cuenta los campos que no se pudieron comparar;
  // diferenciaMaxima sólo mide los que sí.
  function verificarContraExcel(datos) {
    datos = datos || raiz.TESIS_DATOS;
    var opciones = { h: datos.parametros.h.v, comision: datos.parametros.comision.v };
    var controles = camposDeControl();
    var detalle = [];
    var coinciden = 0;
    var sinComparar = 0;
    var maxUsd = 0, maxProp = 0;
    datos.casos.forEach(function (caso) {
      var calculado, planteo;
      try {
        calculado = calcularCaso(caso, opciones);
        planteo = calcularPlanteo(caso, opciones);
      } catch (e) {
        sinComparar += controles.length;
        detalle.push({
          cultivo: caso.cultivo, zona: caso.zona, campana: caso.campana, campo: "(cálculo del caso)",
          motor: null, excel: null, diferencia: null,
          celda: "RR_Margenes fila " + caso.fila,
          motivo: "el motor no pudo calcular el caso", error: e.message
        });
        return;
      }
      var ok = true;
      controles.forEach(function (ctl) {
        var campo = ctl[0], tol = ctl[2], esUsd = ctl[3];
        var motor = ctl[1](calculado, planteo);
        var excel = caso.excel ? caso.excel[campo] : undefined;
        var motivo = null;
        if (!esNumeroFinito(excel)) motivo = "el valor del Excel falta o no es un número";
        else if (!esNumeroFinito(motor)) motivo = "el valor del motor no es un número finito";
        if (motivo) {
          ok = false;
          sinComparar++;
          detalle.push({
            cultivo: caso.cultivo, zona: caso.zona, campana: caso.campana, campo: campo,
            motor: motor, excel: excel === undefined ? null : excel, diferencia: null,
            celda: celdaSegura(caso, "excel." + campo, datos), motivo: motivo
          });
          return;
        }
        var diferencia = Math.abs(motor - excel);
        if (esUsd) { if (diferencia > maxUsd) maxUsd = diferencia; }
        else { if (diferencia > maxProp) maxProp = diferencia; }
        if (!(diferencia <= tol)) {
          ok = false;
          detalle.push({
            cultivo: caso.cultivo, zona: caso.zona, campana: caso.campana, campo: campo,
            motor: motor, excel: excel, diferencia: diferencia,
            celda: celdaSegura(caso, "excel." + campo, datos)
          });
        }
      });
      if (ok) coinciden++;
    });
    return {
      casos: datos.casos.length,
      coinciden: coinciden,
      diferenciaMaxima: maxUsd,
      diferenciaMaximaProporcion: maxProp,
      sinComparar: sinComparar,
      detalle: detalle
    };
  }

  // ---------------------------------------------------------------------------------------
  // Estadística muestral (n − 1), igual que STDEV, VAR y COVARIANCE.S de Excel (D-14).
  // ---------------------------------------------------------------------------------------
  function revisarLista(xs, nombre, minimo) {
    if (!Array.isArray(xs)) throw new Error(nombre + ": se esperaba una lista de números");
    if (xs.length < minimo) {
      throw new Error(nombre + ": hacen falta al menos " + minimo + " valores y hay " + xs.length);
    }
    xs.forEach(function (x, i) {
      if (!esNumeroFinito(x)) throw new Error(nombre + ": el valor " + (i + 1) + " no es un número (" + x + ")");
    });
  }

  function suma(xs) {
    var t = 0;
    for (var i = 0; i < xs.length; i++) t += xs[i];
    return t;
  }

  function esConstante(xs) {
    for (var i = 1; i < xs.length; i++) if (xs[i] !== xs[0]) return false;
    return true;
  }

  function promedio(xs) {
    revisarLista(xs, "promedio", 1);
    return suma(xs) / xs.length;
  }

  function varianzaMuestral(xs) {
    revisarLista(xs, "varianzaMuestral", 2);
    if (esConstante(xs)) return 0;   // el promedio de n valores iguales puede no dar el mismo valor (redondeo)
    var m = promedio(xs);
    var t = 0;
    for (var i = 0; i < xs.length; i++) t += (xs[i] - m) * (xs[i] - m);
    return t / (xs.length - 1);
  }

  function desvioMuestral(xs) {
    revisarLista(xs, "desvioMuestral", 2);
    return Math.sqrt(varianzaMuestral(xs));
  }

  function covarianzaMuestral(xs, ys) {
    revisarLista(xs, "covarianzaMuestral (primera lista)", 2);
    revisarLista(ys, "covarianzaMuestral (segunda lista)", 2);
    if (xs.length !== ys.length) {
      throw new Error("covarianzaMuestral: las listas tienen largos distintos (" + xs.length + " y " + ys.length + ")");
    }
    if (esConstante(xs) || esConstante(ys)) return 0;
    var mx = promedio(xs), my = promedio(ys);
    var t = 0;
    for (var i = 0; i < xs.length; i++) t += (xs[i] - mx) * (ys[i] - my);
    return t / (xs.length - 1);
  }

  // ---------------------------------------------------------------------------------------
  // Acceso a los casos por cultivo y zona.
  // ---------------------------------------------------------------------------------------
  var ORDEN_CULTIVOS = ["Trigo", "Soja", "Maíz"];

  // Cultivos con casos en esa zona, en el orden Trigo, Soja, Maíz.
  function cultivosDe(datos, zona) {
    datos = datos || raiz.TESIS_DATOS;
    return ORDEN_CULTIVOS.filter(function (cultivo) {
      return datos.casos.some(function (c) { return c.cultivo === cultivo && c.zona === zona; });
    });
  }

  // Zonas del cultivo, en el orden en que aparecen en datos.casos.
  function zonasDe(datos, cultivo) {
    datos = datos || raiz.TESIS_DATOS;
    var zonas = [];
    datos.casos.forEach(function (c) {
      if (c.cultivo === cultivo && zonas.indexOf(c.zona) < 0) zonas.push(c.zona);
    });
    return zonas;
  }

  // Las campañas de un cultivo en una zona, en el orden de datos.casos.
  function casosDe(datos, cultivo, zona) {
    datos = datos || raiz.TESIS_DATOS;
    var casos = datos.casos.filter(function (c) { return c.cultivo === cultivo && c.zona === zona; });
    if (casos.length === 0) {
      throw new Error("No hay casos de " + cultivo + " en la zona «" + zona + "»");
    }
    return casos;
  }

  function resultadosDe(datos, cultivo, zona, opciones) {
    return casosDe(datos, cultivo, zona).map(function (caso) {
      var r = calcularCaso(caso, opciones);
      r.campana = caso.campana;
      return r;
    });
  }

  function listaDe(resultados, clave) {
    return resultados.map(function (r) { return r[clave]; });
  }

  // ---------------------------------------------------------------------------------------
  // Riesgo por zona y por cultivo (D-14, D-15).
  // ---------------------------------------------------------------------------------------

  // Riesgo de una zona: desvío muestral de la sorpresa entre sus campañas, sin y con cobertura.
  // opciones (opcional): { h, comision }
  function riesgoZona(datos, cultivo, zona, opciones) {
    datos = datos || raiz.TESIS_DATOS;
    var hc = resolverHyComision(opciones, datos);
    var resultados = resultadosDe(datos, cultivo, zona, { h: hc.h, comision: hc.comision });
    var desvios = listaDe(resultados, "desvioRinde");
    var peor = Math.min.apply(null, desvios);
    var campanaPeor = resultados[desvios.indexOf(peor)].campana;
    var sdSinUsd = desvioMuestral(listaDe(resultados, "sorpresaSin"));
    var sdConUsd = desvioMuestral(listaDe(resultados, "sorpresaCon"));
    var sdPrecioSin = desvioMuestral(listaDe(resultados, "soloPrecioSin"));
    var sdPrecioCon = desvioMuestral(listaDe(resultados, "soloPrecioCon"));
    var sdRSin = desvioMuestral(listaDe(resultados, "sorpresaRSin"));
    var sdRCon = desvioMuestral(listaDe(resultados, "sorpresaRCon"));
    var covarianza = covarianzaMuestral(listaDe(resultados, "sorpresaSin"), listaDe(resultados, "futuro100"));
    var varianzaFuturo = varianzaMuestral(listaDe(resultados, "futuro100"));
    return {
      cultivo: cultivo,
      zona: zona,
      campanas: resultados.length,
      desvioRindePromedio: promedio(desvios),
      peorDesvio: peor,
      campanaPeorDesvio: campanaPeor,
      sdSinUsd: sdSinUsd,
      sdConUsd: sdConUsd,
      reduccionUsd: reduccion(sdConUsd, sdSinUsd),
      sdPrecioSin: sdPrecioSin,
      sdPrecioCon: sdPrecioCon,
      reduccionPrecio: reduccion(sdPrecioCon, sdPrecioSin),
      sdRSin: sdRSin,
      sdRCon: sdRCon,
      reduccionR: reduccion(sdRCon, sdRSin),
      riesgoRinde: desvioMuestral(listaDe(resultados, "efectoRinde")),
      bajoElRiesgo: sdConUsd < sdSinUsd,
      covarianza: covarianza,
      varianzaFuturo: varianzaFuturo,
      hMinimaVarianza: hMinimaVarianza(covarianza, varianzaFuturo),
      resultados: resultados
    };
  }

  // Riesgo de un cultivo: promedio simple de los desvíos de sus zonas.
  // opciones (opcional): { h, comision }
  function riesgoCultivo(datos, cultivo, opciones) {
    datos = datos || raiz.TESIS_DATOS;
    var zonas = zonasDe(datos, cultivo);
    if (zonas.length === 0) throw new Error("No hay zonas con casos de " + cultivo);
    var hc = resolverHyComision(opciones, datos);
    var porZona = zonas.map(function (zona) {
      return riesgoZona(datos, cultivo, zona, { h: hc.h, comision: hc.comision });
    });
    var media = function (clave) { return promedio(listaDe(porZona, clave)); };
    var subio = porZona.filter(function (z) { return z.sdConUsd > z.sdSinUsd; });
    return {
      cultivo: cultivo,
      zonas: porZona.length,
      desvioRindePromedio: media("desvioRindePromedio"),
      peorDesvio: Math.min.apply(null, listaDe(porZona, "peorDesvio")),
      sdSinUsd: media("sdSinUsd"),
      sdConUsd: media("sdConUsd"),
      reduccionUsd: reduccion(media("sdConUsd"), media("sdSinUsd")),
      sdPrecioSin: media("sdPrecioSin"),
      sdPrecioCon: media("sdPrecioCon"),
      reduccionPrecio: reduccion(media("sdPrecioCon"), media("sdPrecioSin")),
      sdRSin: media("sdRSin"),
      sdRCon: media("sdRCon"),
      reduccionR: reduccion(media("sdRCon"), media("sdRSin")),
      riesgoRinde: media("riesgoRinde"),
      hMinimaVarianza: hMinimaVarianza(suma(listaDe(porZona, "covarianza")), suma(listaDe(porZona, "varianzaFuturo"))),
      zonasDondeSubio: subio.length,
      zonasDondeSubioNombres: subio.map(function (z) { return z.zona; }),
      porZona: porZona
    };
  }

  // ---------------------------------------------------------------------------------------
  // Curva de riesgo y de margen según la proporción cubierta h (D-15, D-17 e).
  // ---------------------------------------------------------------------------------------

  // Para cada h de hs: el riesgo (desvío muestral de la sorpresa, promediado entre las zonas del
  // cultivo) y el margen real medio. La sorpresa con cobertura h es: sorpresa sin cobertura +
  // h × resultado del futuro al 100 %.
  // opciones (opcional): { comision }
  function curvaCobertura(datos, cultivo, hs, opciones) {
    datos = datos || raiz.TESIS_DATOS;
    if (!Array.isArray(hs) || hs.length === 0) {
      throw new Error("curvaCobertura: hs tiene que ser una lista con al menos una proporción cubierta");
    }
    hs.forEach(function (h, i) {
      if (!esNumeroFinito(h)) {
        throw new Error("curvaCobertura: la proporción cubierta " + (i + 1) + " no es un número (" + h + ")");
      }
      if (h < 0) {
        throw new Error("curvaCobertura: la proporción cubierta " + (i + 1) + " no puede ser negativa (" + h + ")");
      }
    });
    var zonas = zonasDe(datos, cultivo);
    if (zonas.length === 0) throw new Error("No hay zonas con casos de " + cultivo);
    // sorpresaSin, futuro100 y mbRealSin no dependen de h: se calculan con h = 0.
    var comision = resolverHyComision({ h: 0, comision: opciones && opciones.comision }, datos).comision;
    var base = { h: 0, comision: comision };

    var porZona = zonas.map(function (zona) {
      var resultados = resultadosDe(datos, cultivo, zona, base);
      var sorpresaSin = listaDe(resultados, "sorpresaSin");
      var futuro100 = listaDe(resultados, "futuro100");
      var covarianza = covarianzaMuestral(sorpresaSin, futuro100);
      var varianzaFuturo = varianzaMuestral(futuro100);
      return {
        zona: zona,
        resultados: resultados,
        riesgoSinCobertura: desvioMuestral(sorpresaSin),
        riesgo: hs.map(function (h) {
          return desvioMuestral(resultados.map(function (r) { return r.sorpresaSin + h * r.futuro100; }));
        }),
        covarianza: covarianza,
        varianzaFuturo: varianzaFuturo,
        hMinimaVarianza: hMinimaVarianza(covarianza, varianzaFuturo)
      };
    });

    var riesgoSin = promedio(listaDe(porZona, "riesgoSinCobertura"));
    var riesgo = hs.map(function (h, i) { return promedio(porZona.map(function (z) { return z.riesgo[i]; })); });
    var todos = [];
    porZona.forEach(function (z) { todos = todos.concat(z.resultados); });
    return {
      cultivo: cultivo,
      hs: hs.slice(),
      riesgo: riesgo,
      riesgoRelativo: riesgo.map(function (x) { return dividir(x, riesgoSin); }),
      margenRealMedio: hs.map(function (h) {
        return promedio(todos.map(function (r) { return r.mbRealSin + h * r.futuro100; }));
      }),
      hMinimaVarianza: hMinimaVarianza(suma(listaDe(porZona, "covarianza")), suma(listaDe(porZona, "varianzaFuturo"))),
      porZona: porZona.map(function (z) {
        return { zona: z.zona, riesgo: z.riesgo, hMinimaVarianza: z.hMinimaVarianza, varianzaFuturo: z.varianzaFuturo };
      })
    };
  }

  // ---------------------------------------------------------------------------------------
  // Mezcla de cultivos de una zona, ponderada por hectáreas (D-15, MOT-04). La usa «Mi campo».
  // ---------------------------------------------------------------------------------------

  // Agrega varios cultivos de una zona. Cada cultivo pesa por sus hectáreas.
  // opciones: { hectareasPorCultivo: { Trigo: 100, Soja: 200 }, h, comision } (h y comisión, de datos.parametros).
  // Con un solo cultivo da lo mismo que el caso del Excel (RR_Margenes) y que el riesgo de su zona.
  function mezcla(datos, zona, opciones) {
    datos = datos || raiz.TESIS_DATOS;
    var hayCasos = datos.casos.some(function (c) { return c.zona === zona; });
    if (!hayCasos) throw new Error("La zona \"" + zona + "\" no está en los datos");
    var hectareas = opciones && opciones.hectareasPorCultivo;
    if (hectareas === null || typeof hectareas !== "object" || Array.isArray(hectareas)) {
      throw new Error("Cargá hectáreas en al menos un cultivo de la zona: hectareasPorCultivo tiene que ser un objeto, por ejemplo { Trigo: 100 }");
    }
    Object.keys(hectareas).forEach(function (cultivo) {
      var ha = hectareas[cultivo];
      if (!esNumeroFinito(ha) || ha < 0) {
        throw new Error("Las hectáreas de " + cultivo + " tienen que ser un número mayor o igual a 0 (llegó " + ha + ")");
      }
    });
    var disponibles = cultivosDe(datos, zona);
    var conHectareas = ORDEN_CULTIVOS.filter(function (cultivo) { return hectareas[cultivo] > 0; });
    Object.keys(hectareas).forEach(function (cultivo) {
      if (hectareas[cultivo] > 0 && conHectareas.indexOf(cultivo) < 0) {
        throw new Error("No hay datos de " + cultivo + " en la zona \"" + zona + "\" (la zona tiene " + disponibles.join(", ") + ")");
      }
    });
    conHectareas.forEach(function (cultivo) {
      if (disponibles.indexOf(cultivo) < 0) {
        throw new Error("El cultivo " + cultivo + " no se siembra en la zona \"" + zona + "\" (la zona tiene " + disponibles.join(", ") + ")");
      }
    });
    var hectareasTotales = suma(conHectareas.map(function (cultivo) { return hectareas[cultivo]; }));
    if (conHectareas.length === 0 || !(hectareasTotales > 0)) {
      throw new Error("Cargá hectáreas en al menos un cultivo de la zona");
    }

    var hc = resolverHyComision(opciones, datos);
    // Casos de cada cultivo, en el orden de campañas del primero (los 6 años son los mismos en todos).
    var casosPorCultivo = {};
    conHectareas.forEach(function (cultivo) { casosPorCultivo[cultivo] = casosDe(datos, cultivo, zona); });
    var campanas = casosPorCultivo[conHectareas[0]].map(function (c) { return c.campana; });

    var porCampana = campanas.map(function (campana) {
      var t = { usdProyectado: 0, usdRealSin: 0, usdRealCon: 0, sorpresaSinUsd: 0, sorpresaConUsd: 0, valorTierra: 0 };
      var anio = null;
      conHectareas.forEach(function (cultivo) {
        var caso = casosPorCultivo[cultivo].filter(function (c) { return c.campana === campana; })[0];
        if (!caso) throw new Error("No hay datos de " + cultivo + " en " + zona + " para la campaña " + campana);
        var ha = hectareas[cultivo];
        var r = calcularCaso(caso, { h: hc.h, comision: hc.comision });
        t.usdProyectado += ha * r.mbProyectado;
        t.usdRealSin += ha * r.mbRealSin;
        t.usdRealCon += ha * r.mbRealCon;
        t.sorpresaSinUsd += ha * r.sorpresaSin;
        t.sorpresaConUsd += ha * r.sorpresaCon;
        t.valorTierra += ha * caso.v;
        if (anio === null) anio = caso.anioCosecha;
      });
      return {
        campana: campana,
        anioCosecha: anio,
        usdProyectado: t.usdProyectado,
        usdRealSin: t.usdRealSin,
        usdRealCon: t.usdRealCon,
        usdHaProyectado: t.usdProyectado / hectareasTotales,
        usdHaRealSin: t.usdRealSin / hectareasTotales,
        usdHaRealCon: t.usdRealCon / hectareasTotales,
        valorTierra: t.valorTierra,
        rProyectada: t.usdProyectado / t.valorTierra,
        rRealSin: t.usdRealSin / t.valorTierra,
        rRealCon: t.usdRealCon / t.valorTierra,
        sorpresaSinUsd: t.sorpresaSinUsd,
        sorpresaConUsd: t.sorpresaConUsd,
        sorpresaRSin: t.sorpresaSinUsd / t.valorTierra,
        sorpresaRCon: t.sorpresaConUsd / t.valorTierra
      };
    });

    var sdSinUsdHa = desvioMuestral(porCampana.map(function (p) { return p.sorpresaSinUsd / hectareasTotales; }));
    var sdConUsdHa = desvioMuestral(porCampana.map(function (p) { return p.sorpresaConUsd / hectareasTotales; }));
    var sdRSin = desvioMuestral(listaDe(porCampana, "sorpresaRSin"));
    var sdRCon = desvioMuestral(listaDe(porCampana, "sorpresaRCon"));
    var soloConHectareas = {};
    conHectareas.forEach(function (cultivo) { soloConHectareas[cultivo] = hectareas[cultivo]; });
    return {
      zona: zona,
      cultivos: conHectareas,
      hectareasPorCultivo: soloConHectareas,
      hectareasTotales: hectareasTotales,
      h: hc.h,
      comision: hc.comision,
      porCampana: porCampana,
      riesgo: {
        sdSinUsdHa: sdSinUsdHa,
        sdConUsdHa: sdConUsdHa,
        reduccionUsdHa: reduccion(sdConUsdHa, sdSinUsdHa),
        sdRSin: sdRSin,
        sdRCon: sdRCon,
        reduccionR: reduccion(sdRCon, sdRSin)
      }
    };
  }

  var motor = {
    TOLERANCIA_USD: TOLERANCIA_USD,
    TOLERANCIA_PROPORCION: TOLERANCIA_PROPORCION,
    cosecha: cosecha,
    valorDe: valorDe,
    calcularCaso: calcularCaso,
    calcularPlanteo: calcularPlanteo,
    origen: origen,
    verificarContraExcel: verificarContraExcel,
    promedio: promedio,
    desvioMuestral: desvioMuestral,
    varianzaMuestral: varianzaMuestral,
    covarianzaMuestral: covarianzaMuestral,
    cultivosDe: cultivosDe,
    zonasDe: zonasDe,
    casosDe: casosDe,
    riesgoZona: riesgoZona,
    riesgoCultivo: riesgoCultivo,
    curvaCobertura: curvaCobertura,
    mezcla: mezcla
  };

  raiz.TESIS_MOTOR = motor;
  if (typeof module !== "undefined" && module.exports) module.exports = motor;
})(typeof window !== "undefined" ? window : globalThis);
