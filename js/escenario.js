// Sección «Escenario propio»: el usuario parte de un caso histórico de la tesis (cultivo, zona y campaña)
// y cambia a mano rindes, precios, costos, valor de la tierra, comisión y proporción cubierta para ver
// qué habría pasado con y sin cobertura. Lo que cambia deja de ser un dato de los Excels: se marca
// siempre como «supuesto propio».
// Todas las cuentas las hace TESIS_MOTOR.calcularCaso: acá no se repite ninguna fórmula de márgenes.
// El estado de esta sección es PRIVADO: no toca TESIS_APP.estado, no se guarda en el navegador y
// nunca modifica TESIS_DATOS (el motor trabaja con una copia de las entradas).
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
(function (raiz) {
  "use strict";

  var NBSP = " "; // espacio duro: el «%» nunca queda solo en la línea siguiente
  // Lo más grande que se acepta en cada campo (en sus unidades): topes de plausibilidad, no matemáticos. Sirven para que un
  // texto mal leído (por ejemplo «33.200» con punto de miles en vez de «33,2») no pase en silencio como un número absurdo.
  var MAXIMO_RINDE = 300;      // qq/ha
  var MAXIMO_PRECIO = 5000;    // USD/t (Fs, Sc, Fc)
  var MAXIMO_GC = 1000;        // USD/t
  var MAXIMO_COSTOS = 20000;   // USD/ha (costos directos)
  var MAXIMO_TIERRA = 200000;  // USD/ha (valor de la tierra)
  var MAXIMO = MAXIMO_TIERRA;  // el tope más alto de los campos en sus unidades (se conserva por compatibilidad)
  var TOLERANCIA_CAMBIO = 1e-9; // diferencia relativa por debajo de la cual un valor «no cambió»

  var TEXTO_SUPUESTO = "Supuesto propio: estos números no salen de los Excels de la tesis";
  var TEXTO_HISTORICO = "Caso histórico sin cambios";
  var TEXTO_CAMBIO_DE_CASO = "Cambiaste de caso: se descartaron tus cambios";
  var TEXTO_NO_FINITO = "Con estos valores la cuenta no da un número: revisá los campos.";
  var TEXTO_SENSIBILIDAD_PENDIENTE = "La tabla de sensibilidad aparece cuando todos los campos son válidos.";

  // Tabla de sensibilidad (D-06): filas = rinde real respecto del esperado, columnas = precio a cosecha (Sc)
  // respecto de Fs. Cada celda es un supuesto: se aleja del escenario en el rinde y en el precio.
  var DESVIOS_RINDE = [-0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2];
  var DESVIOS_PRECIO = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3];
  var VISTAS_SENSIBILIDAD = ["sin", "con", "diferencia"];
  var NOMBRE_DE_VISTA = {
    sin: "Margen real sin cobertura",
    con: "Margen real con cobertura",
    diferencia: "Con cobertura − sin cobertura (resultado del futuro)"
  };
  // Qué número del motor sale en cada vista (la diferencia es el resultado del futuro: con − sin).
  var CLAVE_DE_VISTA = { sin: "mbRealSin", con: "mbRealCon", diferencia: "futuro" };

  // Los diez campos, en el orden de la pantalla. escala: cuánto se multiplica el valor del motor para
  // mostrarlo (los porcentajes se escriben de 0 a 100, el motor usa de 0 a 1). regla: «positivo» (mayor
  // que 0) o «noNegativo» (0 vale). maximo: lo más grande que se acepta, en las unidades del campo.
  var CAMPOS = [
    { clave: "rindeEsperado", id: "esc-rinde-esperado", etiqueta: "Rinde esperado", unidad: "qq/ha", decimales: 1, escala: 1, formato: "rinde", regla: "positivo", maximo: MAXIMO_RINDE },
    { clave: "rindeReal", id: "esc-rinde-real", etiqueta: "Rinde real", unidad: "qq/ha", decimales: 1, escala: 1, formato: "rinde", regla: "noNegativo", maximo: MAXIMO_RINDE },
    { clave: "fs", id: "esc-fs", etiqueta: "Fs: futuro al sembrar", unidad: "USD/t", decimales: 2, escala: 1, formato: "usd2", regla: "noNegativo", maximo: MAXIMO_PRECIO },
    { clave: "sc", id: "esc-sc", etiqueta: "Sc: disponible a cosecha", unidad: "USD/t", decimales: 2, escala: 1, formato: "usd2", regla: "noNegativo", maximo: MAXIMO_PRECIO },
    { clave: "fc", id: "esc-fc", etiqueta: "Fc: futuro a cosecha", unidad: "USD/t", decimales: 2, escala: 1, formato: "usd2", regla: "noNegativo", maximo: MAXIMO_PRECIO },
    { clave: "gc", id: "esc-gc", etiqueta: "GC: gastos de comercialización", unidad: "USD/t", decimales: 2, escala: 1, formato: "usd2", regla: "noNegativo", maximo: MAXIMO_GC },
    { clave: "cd", id: "esc-cd", etiqueta: "Costos directos", unidad: "USD/ha", decimales: 2, escala: 1, formato: "usd2", regla: "noNegativo", maximo: MAXIMO_COSTOS },
    { clave: "v", id: "esc-v", etiqueta: "V: valor de la tierra", unidad: "USD/ha", decimales: 2, escala: 1, formato: "usd2", regla: "positivo", maximo: MAXIMO_TIERRA },
    { clave: "comision", id: "esc-comision", etiqueta: "Comisión del futuro", unidad: "% de Fs", decimales: 2, escala: 100, formato: "porcentaje", regla: "noNegativo", maximo: 100 },
    // El motor no acota h a 1: cubrir más de lo que se espera cosechar es un escenario válido (hasta 200 %).
    { clave: "h", id: "esc-h", etiqueta: "Proporción cubierta con futuros", unidad: "%", decimales: 0, escala: 100, formato: "porcentaje", regla: "noNegativo", maximo: 200,
      aclaracion: "100" + NBSP + "% es vender en futuros las toneladas que esperabas cosechar al sembrar" }
  ];

  // Qué campos del caso se pisan con ajustes del motor (h y la comisión van como opciones aparte).
  var CLAVES_AJUSTES = ["rindeEsperado", "rindeReal", "fs", "sc", "fc", "gc", "cd", "v"];

  var CLAVES_TABLA = ["rindeBajo", "costoBajo", "rindeAlto", "costoAlto", "piso"];

  // Los nueve resultados (D-05), en el orden de la pantalla.
  var RESULTADOS = [
    { clave: "mbProyectado", nombre: "Margen proyectado al sembrar (USD/ha)", formato: "usd2", serie: "serie-proyectado" },
    { clave: "mbRealSin", nombre: "Margen real sin cobertura (USD/ha)", formato: "usd2", serie: "serie-sin" },
    { clave: "futuro", nombre: "Resultado del futuro (USD/ha)", formato: "usd2", serie: null },
    { clave: "mbRealCon", nombre: "Margen real con cobertura (USD/ha)", formato: "usd2", serie: "serie-con" },
    { clave: "sorpresaSin", nombre: "Sorpresa sin cobertura: real − proyectado (USD/ha)", formato: "usd2", serie: null },
    { clave: "sorpresaCon", nombre: "Sorpresa con cobertura (USD/ha)", formato: "usd2", serie: null },
    { clave: "rProyectada", nombre: "Rentabilidad proyectada", formato: "porcentaje", serie: null },
    { clave: "rRealSin", nombre: "Rentabilidad real sin cobertura", formato: "porcentaje", serie: null },
    { clave: "rRealCon", nombre: "Rentabilidad real con cobertura", formato: "porcentaje", serie: null }
  ];

  var FORMULAS = {
    mbProyectado: "rinde esperado ÷ 10 × (Fs − GC) − CD − cosecha al rinde esperado",
    mbRealSin: "rinde real ÷ 10 × (Sc − GC) − CD − cosecha al rinde real",
    futuro: "h × [rinde esperado ÷ 10 × (Fs − Fc) − comisión × rinde esperado ÷ 10 × Fs]",
    mbRealCon: "real sin cobertura + resultado del futuro",
    sorpresaSin: "margen real sin cobertura − margen proyectado",
    sorpresaCon: "margen real con cobertura − margen proyectado",
    rProyectada: "margen ÷ V",
    rRealSin: "margen ÷ V",
    rRealCon: "margen ÷ V"
  };

  function union(listas) {
    var salida = [];
    listas.forEach(function (lista) {
      lista.forEach(function (x) { if (salida.indexOf(x) < 0) salida.push(x); });
    });
    return salida;
  }

  // De qué campos depende cada resultado («tabla» es la tabla de cosecha del caso, que no se edita).
  // Es un mapa CONSERVADOR: nunca deja un resultado con la etiqueta «en el Excel» si su valor pudo moverse, pero puede marcar
  // «supuesto propio» uno que no se movió. Excepción conocida (IN-01): los costos directos (cd) figuran en las dos sorpresas
  // porque entran en el margen proyectado y en el real, pero en la resta real − proyectado se cancelan: cambiar sólo cd marca
  // «supuesto propio» sorpresaSin y sorpresaCon aunque su valor sea el del Excel. pruebas/escenario.test.js recorre los
  // diez campos y lista esa excepción a la vista.
  var USA = {};
  USA.mbProyectado = ["rindeEsperado", "fs", "gc", "cd", "tabla"];
  USA.mbRealSin = ["rindeReal", "sc", "gc", "cd", "tabla"];
  USA.futuro = ["rindeEsperado", "fs", "fc", "comision", "h"];
  USA.mbRealCon = union([USA.mbRealSin, USA.futuro]);
  USA.sorpresaSin = union([USA.mbProyectado, USA.mbRealSin]);
  USA.sorpresaCon = union([USA.mbProyectado, USA.mbRealCon]);
  USA.rProyectada = union([USA.mbProyectado, ["v"]]);
  USA.rRealSin = union([USA.mbRealSin, ["v"]]);
  USA.rRealCon = union([USA.mbRealCon, ["v"]]);

  function base() { return raiz.TESIS_APP; }

  function esFinito(x) {
    return typeof x === "number" && isFinite(x);
  }

  function celda(v, formato, origen) {
    return { v: v, formato: formato, origen: origen };
  }

  function unicos(lista) {
    var salida = [];
    lista.forEach(function (x) { if (salida.indexOf(x) < 0) salida.push(x); });
    return salida;
  }

  // ---------------------------------------------------------------------------------------
  // Lectura de lo que se escribe en un campo
  // ---------------------------------------------------------------------------------------

  // Un número escrito por una persona, con la convención es-AR: la COMA es el separador decimal y el PUNTO sólo separa
  // miles, en grupos de tres bien puestos. Acepta «166,96», «6.915,49», «6915,49», «1.500», «1.000.000» y un signo menos
  // (el tipográfico «−» también: se lee y el campo dice «No puede ser negativo»). Todo lo demás es null, no se adivina:
  // un punto decimal («166.96», «1.5»), «%», notación con exponente («1e3»), un «+», espacios en el medio, vacío,
  // letras, «1,2,3», «Infinity». Un número de JavaScript pasa tal cual si es finito.
  function leerDecimal(texto) {
    if (typeof texto === "number") return isFinite(texto) ? texto : null;
    if (typeof texto !== "string") return null;
    var t = texto.trim().replace(/−/g, "-");
    var signo = 1;
    if (t.charAt(0) === "-") { signo = -1; t = t.slice(1); }
    var n;
    if (/^[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(t)) n = Number(t.replace(/\./g, "").replace(",", "."));
    else if (/^\d+(,\d+)?$/.test(t)) n = Number(t.replace(",", "."));
    else return null;
    return isFinite(n) ? signo * n : null;
  }

  // Por qué se rechazó un texto, para decirlo con claridad (null si no hay una razón más específica).
  function motivoDeRechazo(texto) {
    if (typeof texto !== "string") return null;
    var t = texto.trim();
    if (/%/.test(t)) return "Escribí el número sin el signo %.";
    if (/^\+/.test(t)) return "Escribí el número sin el signo +.";
    if (/^[\d.,]*\d[eE][-+]?\d+$/.test(t)) return "Escribí el número sin notación con exponente (nada de 1e3).";
    if (/^\d+\.\d+$/.test(t) && !/^[1-9]\d{0,2}(\.\d{3})+$/.test(t)) {
      return "Usá coma para los decimales (por ejemplo 166,96): el punto sólo separa miles, como en 1.500.";
    }
    return null;
  }

  // ---------------------------------------------------------------------------------------
  // Estado del escenario (propio de la sección)
  // ---------------------------------------------------------------------------------------

  // Devuelve un estado válido a partir de cualquier cosa: { cultivo, zona, campana, textos, vistaSensibilidad }. Lo que no
  // existe en los 114 casos vuelve al primero. `textos` guarda sólo lo escrito en cada campo (como texto).
  // No modifica lo recibido.
  function normalizarEscenario(crudo, datos) {
    datos = datos || raiz.TESIS_DATOS;
    if (crudo === null || typeof crudo !== "object") crudo = {};
    var motor = raiz.TESIS_MOTOR;
    var cultivos = unicos(datos.casos.map(function (c) { return c.cultivo; }));
    var cultivo = cultivos.indexOf(crudo.cultivo) >= 0 ? crudo.cultivo : cultivos[0];
    var zonas = motor.zonasDe(datos, cultivo);
    var zona = zonas.indexOf(crudo.zona) >= 0 ? crudo.zona : zonas[0];
    var campanas = unicos(motor.casosDe(datos, cultivo, zona).map(function (c) { return c.campana; }));
    var campana = campanas.indexOf(crudo.campana) >= 0 ? crudo.campana : campanas[0];
    var previos = crudo.textos !== null && typeof crudo.textos === "object" ? crudo.textos : {};
    var textos = {};
    CAMPOS.forEach(function (c) {
      if (Object.prototype.hasOwnProperty.call(previos, c.clave) && typeof previos[c.clave] === "string") {
        textos[c.clave] = previos[c.clave];
      }
    });
    // La vista de la sensibilidad (sin / con / diferencia) no es un cambio del escenario: se conserva al cambiar de caso.
    var vistaSensibilidad = VISTAS_SENSIBILIDAD.indexOf(crudo.vistaSensibilidad) >= 0 ? crudo.vistaSensibilidad : "sin";
    return { cultivo: cultivo, zona: zona, campana: campana, textos: textos, vistaSensibilidad: vistaSensibilidad };
  }

  // ---------------------------------------------------------------------------------------
  // Modelo de vista (puro, sin DOM)
  // ---------------------------------------------------------------------------------------

  // El valor del caso histórico de un campo y la celda de la que sale. La comisión y la proporción
  // cubierta salen de la hoja de parámetros; el resto, de la fila del caso.
  function historicoDe(campo, caso, datos) {
    if (campo.clave === "comision" || campo.clave === "h") {
      var p = datos.parametros[campo.clave];
      return { v: p.v, origen: p.o };
    }
    return { v: caso[campo.clave], origen: raiz.TESIS_MOTOR.origen(caso, campo.clave, datos) };
  }

  function textoMaximo(campo) {
    var texto = base().formato.numero(campo.maximo, 0);
    return campo.escala === 100 ? texto + NBSP + "%" : texto;
  }

  // El rango que se acepta en un campo, dicho con sus unidades: «entre 0 y 300 qq/ha» (con «más que 0» si el 0 no vale).
  function textoRango(campo) {
    var unidad = campo.unidad === "%" || campo.escala === 100 ? "" : " " + campo.unidad;
    return (campo.regla === "positivo" ? "más que 0 y hasta " : "entre 0 y ") + textoMaximo(campo) + unidad;
  }

  // El mensaje de un campo que no se puede usar, o "" si está bien. Orden: no es número, negativo,
  // cero donde tiene que ser mayor que 0, fuera de rango (con el rango permitido).
  function mensajeDeCampo(campo, texto, valor, textoHistorico) {
    if (valor === null) {
      var vacio = typeof texto !== "string" || texto.replace(/\s/g, "") === "";
      return vacio ? "Falta este dato." : (motivoDeRechazo(texto) || "Escribí un número, por ejemplo " + textoHistorico + ".");
    }
    if (valor < 0) return "No puede ser negativo.";
    if (campo.regla === "positivo" && valor === 0) return "Tiene que ser mayor que 0.";
    if (valor > campo.maximo) return "Fuera de rango: tiene que estar " + textoRango(campo) + ".";
    return "";
  }

  // Origen de lo que muestra el escenario en un resultado. Si ningún campo que lo alimenta cambió, es
  // el del caso: la fórmula, las celdas de partida y la celda del Excel donde está esa misma cifra. Si
  // cambió alguno, es un supuesto del usuario: dice qué cambiaste y NO nombra la celda del Excel (la
  // cifra ya no es esa); sólo conserva las celdas de los campos que quedaron como en el caso.
  function origenDeResultado(resultado, porClave, celdasDeTabla, celdaExcel) {
    var app = base();
    var cambiados = [];
    var celdas = [];
    USA[resultado.clave].forEach(function (k) {
      if (k === "tabla") {
        celdas = celdas.concat(celdasDeTabla);
      } else if (porClave[k].cambiado) {
        cambiados.push(porClave[k].etiqueta);
      } else {
        celdas.push(porClave[k].historico.origen);
      }
    });
    var titulo = resultado.nombre + ": " + FORMULAS[resultado.clave];
    if (!cambiados.length) return app.origenCalculado(titulo, celdas, [celdaExcel]);
    return "Supuesto del usuario (cambiaste: " + cambiados.join(", ") + ") — " +
      (celdas.length ? app.origenCalculado(titulo, celdas) : titulo);
  }

  // ---------------------------------------------------------------------------------------
  // Sensibilidad (D-06): el margen real para otros rindes y otros precios a cosecha
  // ---------------------------------------------------------------------------------------

  // «−30 %», «0 %», «+20 %» (con espacio duro antes del «%»).
  function etiquetaDesvio(d) {
    return (d > 0 ? "+" : "") + base().formato.numero(d * 100, 0) + NBSP + "%";
  }

  // Un porcentaje con un decimal y signo explícito, para decir dónde cae tu escenario («−19,2 %», «+38,7 %»).
  function porcentajeConSigno(d) {
    return (d > 0 ? "+" : "") + base().formato.numero(d * 100, 1) + NBSP + "%";
  }

  // De qué campos del escenario sale cada vista de la tabla (lo que NO se mueve en la sensibilidad).
  var USA_SENSIBILIDAD = {
    sin: ["rindeEsperado", "fs", "gc", "cd", "tabla"],
    con: ["rindeEsperado", "fs", "sc", "fc", "gc", "cd", "comision", "h", "tabla"],
    diferencia: ["rindeEsperado", "fs", "sc", "fc", "comision", "h"]
  };

  function etiquetaDeClave(clave) {
    var campo = CAMPOS.filter(function (c) { return c.clave === clave; })[0];
    return campo ? campo.etiqueta : clave;
  }

  // Las celdas del Excel de las que parte un grupo de campos que NO cambiaste (la tabla de cosecha, si está, va entera).
  function celdasDeCampos(claves, caso, datos, cambiados) {
    var celdas = [];
    claves.forEach(function (k) {
      if (k === "tabla") {
        CLAVES_TABLA.forEach(function (t) { celdas.push(raiz.TESIS_MOTOR.origen(caso, "tabla." + t, datos)); });
      } else if (cambiados.indexOf(k) < 0) {
        celdas.push(historicoDe({ clave: k }, caso, datos).origen);
      }
    });
    return celdas;
  }

  // Arma la tabla de sensibilidad. Pura: no toca datos ni caso. `valores` son los números exactos con que se
  // calculó el escenario (rindeEsperado, rindeReal, fs, sc, fc, gc, cd, v, h y comision). Cada celda mueve el
  // rinde real (rinde esperado × (1 + fila)) y Sc (Fs × (1 + columna)); Fc se mueve junto con Sc y conserva la
  // base Sc − Fc del escenario. `cambiados` (opcional) son las claves de los campos que el usuario cambió: sólo
  // sirven para el origen. Si algo falla devuelve null y, si se pasa `informe`, deja ahí el motivo.
  function armarSensibilidad(datos, caso, valores, cambiados, informe) {
    datos = datos || raiz.TESIS_DATOS;
    cambiados = cambiados || [];
    var app = base();
    var motor = raiz.TESIS_MOTOR;
    try {
      ["rindeEsperado", "rindeReal", "fs", "sc", "fc", "gc", "cd", "v", "h", "comision"].forEach(function (k) {
        if (!esFinito(valores[k])) throw new Error("el valor de «" + k + "» falta o no es un número");
      });
      var b = valores.sc - valores.fc;
      var fmt = app.formato;
      var notaCambios = cambiados.length
        ? ["campos que cambiaste en el escenario: " + cambiados.map(etiquetaDeClave).join(", ")]
        : [];
      var nota = ["Estas cifras no salen de ninguna celda de los Excels: las calcula el motor con supuestos de sensibilidad"].concat(notaCambios);
      var cuentas = DESVIOS_RINDE.map(function (dr) {
        return DESVIOS_PRECIO.map(function (dp) {
          var rinde = valores.rindeEsperado * (1 + dr);
          var sc = valores.fs * (1 + dp);
          var fc = sc - b;
          // Un precio de futuro negativo (o un disponible que no es positivo) no es un precio posible: la celda no es un
          // resultado. Pasa cuando la diferencia Sc − Fc del escenario es grande y Sc baja: se muestra «—» y se explica.
          if (!(sc > 0) || fc < 0) return { dr: dr, dp: dp, rinde: rinde, sc: sc, fc: fc, r: null, invalida: true };
          var r = motor.calcularCaso(caso, {
            h: valores.h, comision: valores.comision, datos: datos,
            ajustes: { rindeEsperado: valores.rindeEsperado, rindeReal: rinde, fs: valores.fs, sc: sc, fc: fc, gc: valores.gc, cd: valores.cd, v: valores.v }
          });
          if (!esFinito(r.mbRealSin) || !esFinito(r.mbRealCon) || !esFinito(r.futuro)) {
            throw new Error("con " + etiquetaDesvio(dr) + " de rinde y " + etiquetaDesvio(dp) + " de precio la cuenta no da un número");
          }
          return { dr: dr, dp: dp, rinde: rinde, sc: sc, fc: fc, r: r };
        });
      });
      var invalidas = 0;
      cuentas.forEach(function (fila) { fila.forEach(function (c) { if (c.invalida) invalidas++; }); });
      var celdasPorVista = {};
      VISTAS_SENSIBILIDAD.forEach(function (vistaClave) {
        celdasPorVista[vistaClave] = celdasDeCampos(USA_SENSIBILIDAD[vistaClave], caso, datos, cambiados);
      });
      var origenDe = function (c, vistaClave) {
        if (c.invalida) {
          return "Sin resultado: con x = " + etiquetaDesvio(c.dr) + " e y = " + etiquetaDesvio(c.dp) + " el supuesto de sensibilidad da Sc " +
            fmt.numero(c.sc, 2) + " USD/t y Fc " + fmt.numero(c.fc, 2) + " USD/t, y un precio negativo (o un Sc que no es positivo) no es un resultado";
        }
        var titulo = "Supuesto de sensibilidad: rinde real = rinde esperado × (1 + x %), Sc = Fs × (1 + y %), " +
          "Fc = Sc − base del escenario (la diferencia Sc − Fc de tu escenario, " + fmt.numero(b, 2) + " USD/t). " +
          "En esta celda x = " + etiquetaDesvio(c.dr) + " e y = " + etiquetaDesvio(c.dp) + ": rinde real " + fmt.numero(c.rinde, 1) +
          " qq/ha, Sc " + fmt.numero(c.sc, 2) + " USD/t, Fc " + fmt.numero(c.fc, 2) + " USD/t. " +
          NOMBRE_DE_VISTA[vistaClave] + ": " + FORMULAS[CLAVE_DE_VISTA[vistaClave]];
        var celdas = celdasPorVista[vistaClave];
        return celdas.length ? app.origenCalculado(titulo, celdas, null, nota) : [titulo].concat(nota).join(" — ");
      };
      var filas = cuentas.map(function (fila, i) {
        return {
          desvioRinde: DESVIOS_RINDE[i],
          etiqueta: etiquetaDesvio(DESVIOS_RINDE[i]),
          celdas: fila.map(function (c) {
            return {
              desvioPrecio: c.dp,
              sinResultado: !!c.invalida,
              // Una celda sin resultado trae v = null (se muestra «—»): nunca un número que no es un resultado.
              sin: celda(c.invalida ? null : c.r.mbRealSin, "usd", origenDe(c, "sin")),
              con: celda(c.invalida ? null : c.r.mbRealCon, "usd", origenDe(c, "con")),
              // El número del motor (con − sin): la interfaz no resta.
              diferencia: celda(c.invalida ? null : c.r.futuro, "usd", origenDe(c, "diferencia"))
            };
          })
        };
      });
      // La celda más cercana al escenario (cada eje por separado): el rinde real y Sc del escenario casi nunca caen justo en la grilla.
      var dr0 = valores.rindeReal / valores.rindeEsperado - 1;
      var dp0 = valores.sc / valores.fs - 1;
      var masCerca = function (lista, d0) {
        var mejor = 0;
        lista.forEach(function (d, i) { if (Math.abs(d - d0) < Math.abs(lista[mejor] - d0)) mejor = i; });
        return mejor;
      };
      var cercana = null;
      if (esFinito(dr0) && esFinito(dp0)) {
        var iFila = masCerca(DESVIOS_RINDE, dr0);
        var iColumna = masCerca(DESVIOS_PRECIO, dp0);
        cercana = {
          fila: iFila, columna: iColumna,
          desvioRinde: DESVIOS_RINDE[iFila], desvioPrecio: DESVIOS_PRECIO[iColumna],
          exacta: Math.abs(DESVIOS_RINDE[iFila] - dr0) < 1e-9 && Math.abs(DESVIOS_PRECIO[iColumna] - dp0) < 1e-9,
          rindeEscenario: dr0, precioEscenario: dp0
        };
      }
      var celdasBase = celdasDeCampos(["sc", "fc"], caso, datos, cambiados);
      var tituloBase = "Diferencia Sc − Fc de tu escenario: Sc menos Fc";
      var cambiosBase = cambiados.filter(function (k) { return k === "sc" || k === "fc"; });
      var origenBase = cambiosBase.length
        ? "Supuesto del usuario (cambiaste: " + cambiosBase.map(etiquetaDeClave).join(", ") + ") — " + (celdasBase.length ? app.origenCalculado(tituloBase, celdasBase) : tituloBase)
        : app.origenCalculado(tituloBase, celdasBase);
      return {
        base: celda(b, "usd2", origenBase),
        columnas: DESVIOS_PRECIO.map(function (dp) { return { desvioPrecio: dp, etiqueta: etiquetaDesvio(dp) }; }),
        filas: filas,
        sinResultado: invalidas,
        cercana: cercana
      };
    } catch (error) {
      if (informe && typeof informe === "object") informe.motivo = error.message;
      return null;
    }
  }

  // Todo lo que la pantalla necesita, sin tocar el DOM. datos no se modifica.
  // estadoEscenario: { cultivo, zona, campana, textos: { clave: "texto escrito" } }; lo que falta se
  // completa con el caso histórico.
  function armarVista(datos, estadoEscenario) {
    datos = datos || raiz.TESIS_DATOS;
    var app = base();
    var motor = raiz.TESIS_MOTOR;
    var e = normalizarEscenario(estadoEscenario, datos);
    var caso = motor.casosDe(datos, e.cultivo, e.zona).filter(function (c) { return c.campana === e.campana; })[0];

    var porClave = {};
    var campos = CAMPOS.map(function (c) {
      var hist = historicoDe(c, caso, datos);
      var textoHistorico = app.formato.numero(hist.v * c.escala, c.decimales);
      var hayTexto = Object.prototype.hasOwnProperty.call(e.textos, c.clave);
      var texto = hayTexto ? e.textos[c.clave] : textoHistorico;
      var valor = leerDecimal(texto);
      if (valor === 0) valor = 0; // sin «−0»
      var error = mensajeDeCampo(c, texto, valor, textoHistorico);
      // Cambiado = lo escrito difiere de lo que muestra el caso (con la misma cantidad de decimales).
      var cambiado = false;
      if (!error) {
        var referencia = leerDecimal(textoHistorico);
        cambiado = Math.abs(valor - referencia) > TOLERANCIA_CAMBIO * Math.max(1, Math.abs(valor));
      }
      var campo = {
        clave: c.clave, id: c.id, etiqueta: c.etiqueta, unidad: c.unidad, aclaracion: c.aclaracion || "",
        texto: texto, textoHistorico: textoHistorico,
        historico: celda(hist.v, c.formato, hist.origen),
        escala: c.escala,
        valor: error ? null : valor, cambiado: cambiado, error: error
      };
      porClave[c.clave] = campo;
      return campo;
    });

    var conError = campos.filter(function (c) { return c.error; });
    var hayErrores = conError.length > 0;
    var hayCambios = campos.some(function (c) { return c.cambiado; });
    var marca = hayCambios || hayErrores
      ? { supuesto: true, texto: TEXTO_SUPUESTO }
      : { supuesto: false, texto: TEXTO_HISTORICO };

    // Costo de cosecha del caso: se muestra, no se edita.
    var rotulos = { rindeBajo: "Rinde bajo", costoBajo: "Costo al rinde bajo", rindeAlto: "Rinde alto", costoAlto: "Costo al rinde alto", piso: "Piso" };
    var formatosTabla = { rindeBajo: "rinde", rindeAlto: "rinde", costoBajo: "usd2", costoAlto: "usd2", piso: "usd2" };
    var cosecha = CLAVES_TABLA.map(function (k) {
      return { clave: "tabla." + k, nombre: rotulos[k], v: caso.tabla[k], formato: formatosTabla[k], origen: motor.origen(caso, "tabla." + k, datos) };
    });
    var celdasDeTabla = ["rindeBajo", "costoBajo", "rindeAlto", "costoAlto", "piso"].map(function (k) { return motor.origen(caso, "tabla." + k, datos); });

    var vista = {
      cultivo: e.cultivo, zona: e.zona, campana: e.campana,
      cultivos: unicos(datos.casos.map(function (c) { return c.cultivo; })),
      zonas: motor.zonasDe(datos, e.cultivo),
      campanas: unicos(motor.casosDe(datos, e.cultivo, e.zona).map(function (c) { return c.campana; })),
      casoId: caso.id,
      campos: campos, hayCambios: hayCambios, hayErrores: hayErrores,
      marca: marca, mensaje: "", resultados: null, cosecha: cosecha,
      valores: null, sensibilidad: null, mensajeSensibilidad: "", vistaSensibilidad: e.vistaSensibilidad
    };
    // Sin resultados tampoco hay sensibilidad. El motivo se dice una sola vez (arriba, en el mensaje de estado de los
    // resultados): acá sólo se dice que la tabla espera campos válidos.
    var sinSensibilidad = function () {
      vista.mensajeSensibilidad = TEXTO_SENSIBILIDAD_PENDIENTE;
      return vista;
    };

    if (hayErrores) {
      vista.mensaje = "Para ver el resultado corregí: " + conError.map(function (c) { return c.etiqueta; }).join(", ") + ".";
      return sinSensibilidad();
    }

    // Cálculo con copias: los campos sin cambio usan el valor EXACTO del caso (nada se redondea).
    var ajustes = {};
    CLAVES_AJUSTES.forEach(function (k) { if (porClave[k].cambiado) ajustes[k] = porClave[k].valor; });
    var h = porClave.h.cambiado ? porClave.h.valor / 100 : datos.parametros.h.v;
    var comision = porClave.comision.cambiado ? porClave.comision.valor / 100 : datos.parametros.comision.v;
    var r;
    try {
      r = raiz.TESIS_MOTOR.calcularCaso(caso, { h: h, comision: comision, datos: datos, ajustes: ajustes });
    } catch (error) {
      vista.mensaje = "No se pudo calcular: " + error.message;
      return sinSensibilidad();
    }
    if (!RESULTADOS.every(function (res) { return esFinito(r[res.clave]); })) {
      vista.mensaje = TEXTO_NO_FINITO;
      return sinSensibilidad();
    }
    vista.resultados = RESULTADOS.map(function (res) {
      var usa = USA[res.clave];
      var supuesto = usa.some(function (k) { return k !== "tabla" && porClave[k].cambiado; });
      var celdaExcel = motor.origen(caso, "excel." + res.clave, datos);
      return {
        clave: res.clave, nombre: res.nombre, serie: res.serie, supuesto: supuesto,
        escenario: celda(r[res.clave], res.formato, origenDeResultado(res, porClave, celdasDeTabla, celdaExcel)),
        historico: celda(caso.excel[res.clave], res.formato, celdaExcel)
      };
    });

    // Los números exactos con que se calculó el escenario: la sensibilidad parte de ellos.
    var valores = {};
    CLAVES_AJUSTES.forEach(function (k) { valores[k] = porClave[k].cambiado ? porClave[k].valor : caso[k]; });
    valores.h = h;
    valores.comision = comision;
    vista.valores = valores;
    var informe = {};
    var cambiadas = CAMPOS.filter(function (c) { return porClave[c.clave].cambiado; }).map(function (c) { return c.clave; });
    vista.sensibilidad = armarSensibilidad(datos, caso, valores, cambiadas, informe);
    if (!vista.sensibilidad) vista.mensajeSensibilidad = "No se pudo armar la tabla de sensibilidad: " + informe.motivo;
    return vista;
  }

  // ---------------------------------------------------------------------------------------
  // Pintado
  // ---------------------------------------------------------------------------------------

  var nodos = null;   // se arma en montar()
  var estado = null;  // el estado del escenario: propio de la sección, no se guarda en ningún lado

  function nuevoEstado(parcial) {
    return normalizarEscenario(Object.assign({}, estado, parcial), raiz.TESIS_DATOS);
  }

  // Cambia los renglones de un select sin tocar lo demás.
  function rehacerOpciones(select, valores) {
    var a = base();
    a.vaciar(select);
    valores.forEach(function (valor) { select.appendChild(a.el("option", { value: valor }, valor)); });
  }

  function selector(id, etiqueta) {
    var a = base();
    var select = a.el("select", { id: id });
    return { etiqueta: a.el("label", { "for": id }, etiqueta), select: select };
  }

  // La etiqueta es corta («Proporción cubierta con futuros (%)»): la explicación de un campo va en su línea de ayuda, no acá.
  function etiquetaDeCampo(c) {
    return c.etiqueta + " (" + c.unidad + ")";
  }

  function idEstado(id) {
    return "esc-estado-" + id.slice(4); // «esc-fs» → «esc-estado-fs»
  }

  // Un campo: etiqueta, entrada de texto y la línea de estado («Dato del Excel», «Supuesto propio · histórico: …»
  // o el error). Se crea una sola vez: al escribir sólo cambia el estado, no la entrada (no se pierde el foco).
  function crearCampo(c) {
    var a = base();
    var estadoId = idEstado(c.id);
    var describe = estadoId + (c.clave === "h" ? " esc-ayuda-h" : "");
    var entrada = a.el("input", { type: "text", id: c.id, inputmode: "decimal", autocomplete: "off", "aria-describedby": describe });
    // aria-live polite: el estado (por ejemplo un error) se anuncia al cambiar, sin interrumpir. Sólo se rehace cuando cambia
    // (ver pintarEstadoDeCampo): reescribir una región viva con el mismo contenido hace que se vuelva a leer.
    var linea = a.el("p", { "class": "esc-estado", id: estadoId, "aria-live": "polite" });
    entrada.addEventListener("input", function () {
      nodos.descartado = false; // el aviso de «cambiaste de caso» dura hasta la próxima edición
      var textos = Object.assign({}, estado.textos);
      textos[c.clave] = entrada.value;
      estado = nuevoEstado({ textos: textos });
      pintar();
    });
    var hijos = [a.el("label", { "for": c.id }, etiquetaDeCampo(c)), entrada, linea];
    if (c.clave === "h") {
      hijos.push(a.el("p", { "class": "ayuda", id: "esc-ayuda-h" },
        c.aclaracion + ". Más de 100" + NBSP + "% es cubrir más de lo que se espera cosechar. Se acepta de 0 a 200" + NBSP + "%."));
    }
    var contenedor = a.el("div", { "class": "esc-campo" }, hijos);
    nodos.campos[c.clave] = { contenedor: contenedor, entrada: entrada, linea: linea };
    return contenedor;
  }

  // La sección de sensibilidad se crea una sola vez (el selector de vista no se recrea al escribir en un campo):
  // al pintar sólo se rehacen la regla, la tabla y los textos de ayuda.
  function crearSensibilidad() {
    var a = base();
    var el = a.el;
    var s = {};
    s.regla = el("p", { "class": "ayuda", id: "esc-sens-regla" });
    s.select = el("select", { id: "esc-sens-vista" }, [
      el("option", { value: "sin" }, "Sin cobertura"),
      el("option", { value: "con" }, "Con cobertura"),
      el("option", { value: "diferencia" }, "Diferencia: con − sin")
    ]);
    s.select.value = "sin";
    s.tabla = el("div", { id: "esc-sens-tabla" });
    s.lectura = el("p", { "class": "ayuda", id: "esc-sens-lectura" });
    s.fijos = el("p", { "class": "ayuda", id: "esc-sens-fijos" });
    s.sinResultado = el("p", { "class": "ayuda", id: "esc-sens-sin-resultado" });
    s.sinResultado.hidden = true;
    // Texto plano, no una región viva: el aviso que se anuncia es uno solo, el de los resultados (#esc-resultados-estado).
    s.mensaje = el("p", { "class": "mc-mensaje", id: "esc-sens-mensaje" });
    s.mensaje.hidden = true;
    s.controles = el("div", { id: "esc-sens-controles" }, [
      el("label", { "for": "esc-sens-vista" }, "Ver en la tabla"), s.select, s.tabla, s.lectura, s.sinResultado, s.fijos
    ]);
    s.seccion = el("section", { id: "esc-sensibilidad", "class": "esc-sensibilidad", "aria-labelledby": "esc-sens-titulo" }, [
      el("h3", { id: "esc-sens-titulo" }, "Sensibilidad: qué pasa si cambian el rinde y el precio"),
      s.regla, s.mensaje, s.controles
    ]);
    // Elegir la vista no cambia el escenario: sólo repinta esta sección.
    s.select.addEventListener("change", function () {
      estado = nuevoEstado({ vistaSensibilidad: s.select.value });
      if (nodos.vista) pintarSensibilidad(nodos.vista);
    });
    return s;
  }

  function montar(contenedor) {
    var a = base();
    var el = a.el;
    estado = normalizarEscenario({}, raiz.TESIS_DATOS);
    nodos = { campos: {}, claves: { cultivos: null, zonas: null, campanas: null, cosecha: null }, descartado: false };

    contenedor.appendChild(el("p", { "class": "mc-intro" },
      "Elegí un caso de la tesis como punto de partida y cambiá los números que quieras. " +
      "Lo que cambies deja de ser un dato de los Excels: es un supuesto tuyo. El escenario no se guarda. " +
      "Si elegís otro cultivo, otra zona u otra campaña, los campos vuelven a los valores de ese caso y se descartan tus cambios."));

    var cultivo = selector("esc-cultivo", "Cultivo");
    var zona = selector("esc-zona", "Zona");
    var campana = selector("esc-campana", "Campaña");
    nodos.cultivo = cultivo.select;
    nodos.zona = zona.select;
    nodos.campana = campana.select;
    // Elegir otro caso vuelve los campos al histórico de ese caso (D-01) y se dice: si había cambios, se avisa que se descartaron.
    var cambiarDeCaso = function (parcial) {
      nodos.descartado = !!(nodos.vista && (nodos.vista.hayCambios || nodos.vista.hayErrores));
      estado = nuevoEstado(Object.assign({}, parcial, { textos: {} }));
      pintar();
    };
    nodos.cultivo.addEventListener("change", function () { cambiarDeCaso({ cultivo: nodos.cultivo.value }); });
    nodos.zona.addEventListener("change", function () { cambiarDeCaso({ zona: nodos.zona.value }); });
    nodos.campana.addEventListener("change", function () { cambiarDeCaso({ campana: nodos.campana.value }); });
    // Aviso fijo (una región viva): sólo dice algo cuando se descartaron cambios, hasta la próxima edición.
    nodos.avisoCaso = el("p", { "class": "ayuda", id: "esc-aviso-caso", role: "status" });
    nodos.avisoCaso.hidden = true;

    nodos.volver = el("button", { type: "button", id: "esc-volver" }, "Volver al caso histórico");
    nodos.volver.addEventListener("click", function () {
      if (nodos.volver.getAttribute("aria-disabled") === "true") return; // sin cambios no hay nada que deshacer
      nodos.descartado = false;
      estado = nuevoEstado({ textos: {} });
      pintar();
    });

    nodos.cosecha = el("div", { "class": "esc-cosecha" });

    var entradas = el("div", { "class": "esc-entradas tarjeta" },
      [cultivo.etiqueta, cultivo.select, zona.etiqueta, zona.select, campana.etiqueta, campana.select, nodos.avisoCaso, nodos.volver,
        el("p", { "class": "ayuda" }, "Usá coma para los decimales (por ejemplo 166,96). El punto sólo separa miles (1.500 o 6.915,49): " +
          "166.96 no se acepta. Los porcentajes van sin el signo %. Cada campo tiene un tope razonable (por ejemplo, rindes hasta 300 qq/ha): " +
          "si te pasás, el campo lo dice y no calcula.")]
        .concat(CAMPOS.map(crearCampo), [nodos.cosecha]));

    // El cartel de supuesto va siempre arriba de los resultados y no se rehace: sólo cambia su texto.
    nodos.marca = el("p", { id: "esc-marca", role: "status", "class": "esc-marca esc-marca-historico" }, TEXTO_HISTORICO);
    // El aviso de «corregí estos campos» o «no se pudo calcular»: UNA región viva fija (no se crea de nuevo en cada repintado).
    nodos.estadoResultados = el("p", { id: "esc-resultados-estado", "class": "mc-mensaje", role: "status" });
    nodos.estadoResultados.hidden = true;
    nodos.cuerpo = el("div", { id: "esc-cuerpo" });
    nodos.sens = crearSensibilidad();
    nodos.resultados = el("div", { id: "esc-resultados", "class": "mc-resultados" }, [nodos.marca, nodos.estadoResultados, nodos.cuerpo, nodos.sens.seccion]);

    contenedor.appendChild(el("div", { "class": "mc-disposicion" }, [entradas, nodos.resultados]));
  }

  // Línea de estado de un campo: de dónde sale lo que tiene (o qué está mal) y el histórico al lado.
  function pintarEstadoDeCampo(c, linea, n) {
    var a = base();
    // Si no cambió nada de lo que dice la línea (error, supuesto o dato del Excel y los valores que muestra), no se toca.
    var firma = [c.error, c.cambiado, c.textoHistorico, c.historico.v, c.historico.origen].join("|");
    if (n && n.firma === firma) return;
    if (n) n.firma = firma;
    a.vaciar(linea);
    var texto = function (t) { linea.appendChild(raiz.document.createTextNode(t)); };
    var historico = function () {
      texto(" · histórico: ");
      linea.appendChild(a.numero(c.historico.v, c.historico.formato, c.historico.origen));
    };
    if (c.error) {
      linea.appendChild(a.el("span", { "class": "esc-error" }, c.error));
      historico();
    } else if (c.cambiado) {
      var origen = "Supuesto del usuario: el valor que escribiste reemplaza al del Excel";
      linea.appendChild(a.el("span", { "class": "esc-supuesto", "data-origen": origen, title: origen, tabindex: "0", role: "button", "aria-haspopup": "dialog" }, "Supuesto propio"));
      historico();
    } else {
      // El campo muestra el valor redondeado, pero el cálculo usa el exacto del Excel: se ve en la línea (si difiere) y la
      // ventanita de origen lo muestra siempre («Valor exacto»), porque el span lleva data-valor.
      var mostrado = leerDecimal(c.textoHistorico);
      var exacto = c.historico.v * c.escala;
      var difiere = mostrado !== null && Math.abs(exacto - mostrado) > TOLERANCIA_CAMBIO * Math.max(1, Math.abs(exacto));
      var corto = Number(exacto.toPrecision(9)); // hasta 9 cifras; la «…» sólo si de verdad se cortó
      var texto = "Dato del Excel" + (difiere ? ": " + a.formato.exacto(corto) + (corto !== exacto ? "…" : "") : "");
      linea.appendChild(a.el("span", {
        "class": "esc-fuente", "data-origen": c.historico.origen, "data-valor": String(c.historico.v), title: c.historico.origen,
        tabindex: "0", role: "button", "aria-haspopup": "dialog"
      }, texto));
    }
  }

  // Tabla de cosecha del caso (no se edita). Se rehace sólo si cambia el caso.
  function pintarCosecha(vista) {
    var a = base();
    if (nodos.claves.cosecha === vista.casoId) return;
    nodos.claves.cosecha = vista.casoId;
    a.vaciar(nodos.cosecha);
    nodos.cosecha.appendChild(a.el("h3", null, "Costo de cosecha del caso (no se edita)"));
    nodos.cosecha.appendChild(a.el("ul", { "class": "esc-lista" }, vista.cosecha.map(function (c) {
      var unidad = c.formato === "rinde" ? " qq/ha" : " USD/ha";
      return a.el("li", null, [c.nombre + ": ", a.numero(c.v, c.formato, c.origen), unidad]);
    })));
    nodos.cosecha.appendChild(a.el("p", { "class": "ayuda" },
      "Debajo del rinde bajo se paga el costo bajo proporcional (nunca menos que el piso); entre los dos rindes se interpola; arriba del alto es proporcional."));
  }

  function tablaDeResultados(vista) {
    var a = base();
    var el = a.el;
    var filas = vista.resultados.map(function (f) {
      var nombre = f.serie
        ? [el("span", { "class": "muestra-serie " + f.serie, "aria-hidden": "true" }), f.nombre]
        : f.nombre;
      var propio = [a.numero(f.escenario.v, f.escenario.formato, f.escenario.origen)];
      if (f.supuesto) propio.push(el("span", { "class": "esc-nota-supuesto" }, "supuesto propio"));
      return el("tr", null, [
        el("th", { scope: "row" }, nombre),
        el("td", { "class": f.supuesto ? "esc-celda-supuesto" : null }, propio),
        el("td", null, a.numero(f.historico.v, f.historico.formato, f.historico.origen))
      ]);
    });
    return el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla esc-tabla" }, [
      el("caption", null, "Tu escenario comparado con el caso histórico: " + vista.cultivo + " · " + vista.zona + " · " + vista.campana),
      el("thead", null, el("tr", null, [
        el("th", { scope: "col" }, "Resultado"), el("th", { scope: "col" }, "Tu escenario"), el("th", { scope: "col" }, "Caso histórico")
      ])),
      el("tbody", null, filas)
    ]));
  }

  function captionDeVista(vistaClave) {
    if (vistaClave === "con") return "Margen real con cobertura (USD/ha) según el rinde y el precio";
    if (vistaClave === "diferencia") return "Diferencia: con cobertura − sin cobertura (USD/ha) según el rinde y el precio";
    return "Margen real sin cobertura (USD/ha) según el rinde y el precio";
  }

  // La tabla de 7 × 7 de la vista elegida. Los números de las celdas no son paradas de tabulador (son 49): se
  // pueden tocar o cliquear igual, y cada fila trae un botón «Ver orígenes» con la lista de sus 7 celdas.
  function tablaDeSensibilidad(sens, vistaClave) {
    var a = base();
    var el = a.el;
    var cercana = sens.cercana;
    var filas = sens.filas.map(function (fila, i) {
      var boton = el("button", {
        type: "button", "class": "df-ver-origenes",
        "aria-label": "Ver orígenes de los números de la fila: rinde real " + fila.etiqueta + " respecto del esperado"
      }, "Ver orígenes");
      a.vincularOrigenes(boton, function () {
        var actual = estado.vistaSensibilidad;
        return {
          titulo: "Rinde real " + fila.etiqueta + " respecto del esperado · " + NOMBRE_DE_VISTA[actual] + " (USD/ha)",
          items: fila.celdas.map(function (c, j) {
            return { etiqueta: "Precio a cosecha " + sens.columnas[j].etiqueta + " respecto de Fs", v: c[actual].v, formato: c[actual].formato, origen: c[actual].origen };
          })
        };
      });
      var celdas = fila.celdas.map(function (c, j) {
        var numero = a.numero(c[vistaClave].v, c[vistaClave].formato, c[vistaClave].origen, { enfocable: false });
        var clases = [];
        // Negativa: signo «−» (lo pone numero) y, además, color y negrita: nunca el color solo.
        if (numero.getAttribute("class").split(" ").indexOf("negativo") >= 0) clases.push("esc-negativa");
        if (cercana && cercana.fila === i && cercana.columna === j) clases.push("esc-celda-base");
        return el("td", { "class": clases.length ? clases.join(" ") : null }, numero);
      });
      return el("tr", null, [el("th", { scope: "row" }, fila.etiqueta)].concat(celdas, [el("td", { "class": "col-origenes" }, boton)]));
    });
    var esquina = el("th", { scope: "col" }, ["Rinde real respecto del esperado ↓", el("br"), "Precio a cosecha respecto de Fs →"]);
    return el("div", { "class": "tabla-contenedor" }, el("table", { "class": "mc-tabla esc-tabla-sens" }, [
      el("caption", null, captionDeVista(vistaClave)),
      el("thead", null, el("tr", null, [esquina].concat(
        sens.columnas.map(function (c) { return el("th", { scope: "col" }, c.etiqueta); }),
        [el("th", { scope: "col", "class": "col-origenes" }, "Orígenes")]))),
      el("tbody", null, filas)
    ]));
  }

  // Qué celda está marcada y por qué, en palabras (el contorno solo no alcanza).
  function textoDeCercana(sens) {
    var c = sens.cercana;
    // Sin celda más cercana (Fs = 0: no se puede comparar el precio con Fs) se dice por qué no hay marca.
    if (!c) return "No se marca ninguna celda porque no se puede ubicar tu escenario en la tabla (Fs es 0).";
    var donde = "rinde real " + porcentajeConSigno(c.rindeEscenario) + " respecto del esperado y Sc " + porcentajeConSigno(c.precioEscenario) + " respecto de Fs";
    return c.exacta
      ? "La celda con el borde grueso es tu escenario (" + donde + ")."
      : "La celda con el borde grueso es la más cercana a tu escenario (" + donde + "): tu escenario no cae justo en la grilla.";
  }

  function pintarSensibilidad(vista) {
    var a = base();
    var s = nodos.sens;
    // La tabla se rehace: si había una ventanita abierta sobre uno de sus números, ya no corresponde.
    if (a.origenAbierto) a.cerrarOrigen(false);
    // Se recuerda el desplazamiento horizontal de la tabla y se devuelve al rehacerla (en un celular se desplaza adentro de su caja).
    var anterior = s.tabla.firstChild;
    var desplazamiento = anterior ? anterior.scrollLeft : 0;
    a.vaciar(s.regla);
    a.vaciar(s.tabla);
    var sens = vista.sensibilidad;
    if (!sens) {
      s.controles.hidden = true;
      s.regla.hidden = true;
      s.mensaje.hidden = false;
      s.mensaje.textContent = vista.mensajeSensibilidad;
      return;
    }
    s.mensaje.hidden = true;
    s.mensaje.textContent = "";
    s.controles.hidden = false;
    s.regla.hidden = false;
    // La vista elegida es la del estado (al cambiar el selector la vista armada todavía trae la anterior).
    var vistaClave = estado.vistaSensibilidad;
    s.select.value = vistaClave;
    s.regla.appendChild(raiz.document.createTextNode(
      "Filas: rinde real respecto del esperado. Columnas: precio a cosecha (Sc) respecto de Fs. Fc se mueve junto con Sc y mantiene la diferencia Sc − Fc de tu escenario ("));
    s.regla.appendChild(a.numero(sens.base.v, sens.base.formato, sens.base.origen));
    s.regla.appendChild(raiz.document.createTextNode(" USD/t). La celda 0" + NBSP + "% / 0" + NBSP + "% es cosechar lo esperado y vender a Fs."));
    var contenedorNuevo = tablaDeSensibilidad(sens, vistaClave);
    s.tabla.appendChild(contenedorNuevo);
    if (desplazamiento) contenedorNuevo.scrollLeft = desplazamiento;
    s.lectura.textContent = (vistaClave === "diferencia"
      ? "Positivo: cubrirse dejó más margen; en rojo y con −: dejó menos."
      : "En rojo y con signo −: el margen da pérdida.") + " " + textoDeCercana(sens);
    // Celdas sin resultado: se dice por qué (un precio de futuro negativo no existe), sin cifras que no sean un resultado.
    s.sinResultado.hidden = !(sens.sinResultado > 0);
    s.sinResultado.textContent = sens.sinResultado > 0
      ? "Las celdas con «—» no tienen resultado: con tus supuestos el futuro a cosecha (Fc) daría negativo, o el precio a cosecha (Sc) no sería positivo, y eso no es un precio posible."
      : "";
    s.fijos.textContent = "Cada celda es un supuesto de sensibilidad, no un dato del Excel. En todas quedan fijos: el rinde esperado, Fs, los costos (GC y costos directos), " +
      "la comisión, la proporción cubierta y la diferencia Sc − Fc de tu escenario. Las cifras están en USD por hectárea.";
  }

  function pintarResultados(vista) {
    var a = base();
    // El cartel y el mensaje de estado son regiones vivas: se tocan sólo si cambia lo que dicen (si no, un lector de
    // pantalla los vuelve a leer en cada tecla).
    var clase = "esc-marca " + (vista.marca.supuesto ? "esc-marca-supuesto" : "esc-marca-historico");
    if (nodos.marca.getAttribute("class") !== clase) nodos.marca.setAttribute("class", clase);
    if (nodos.marca.textContent !== vista.marca.texto) nodos.marca.textContent = vista.marca.texto;
    var estadoResultados = nodos.estadoResultados;
    if (estadoResultados.textContent !== vista.mensaje) estadoResultados.textContent = vista.mensaje;
    estadoResultados.hidden = !vista.mensaje;
    a.vaciar(nodos.cuerpo);
    if (vista.mensaje) return;
    nodos.cuerpo.appendChild(tablaDeResultados(vista));
  }

  // Sin cifras viejas de la sensibilidad: se vacía la tabla y se esconde todo menos el título.
  function limpiarSensibilidad() {
    var a = base();
    var s = nodos.sens;
    nodos.vista = null;
    a.vaciar(s.regla);
    a.vaciar(s.tabla);
    s.controles.hidden = true;
    s.mensaje.hidden = true;
    s.mensaje.textContent = "";
  }

  // Si falla algo que no es del motor (un error mío), se borran las cifras viejas y se avisa.
  function mostrarError(error) {
    var a = base();
    limpiarSensibilidad();
    a.vaciar(nodos.cuerpo);
    nodos.estadoResultados.textContent = "";
    nodos.estadoResultados.hidden = true;
    nodos.cuerpo.appendChild(a.el("p", { "class": "mc-mensaje", role: "alert" }, "No se pudo calcular: " + error.message));
  }

  // Repinta desde el estado propio. Las entradas NO se recrean: sólo se actualizan sus textos de estado,
  // las clases y los resultados (así el foco y el cursor sobreviven a cada tecla).
  function pintar() {
    var a = base();
    if (!nodos) return;
    try {
      // Si había una ventanita abierta sobre algo de esta sección, los números de abajo están por cambiar.
      if (a.origenAbierto) a.cerrarOrigen(false);
      var vista = armarVista(raiz.TESIS_DATOS, estado);
      var cambiarOpciones = function (clave, select, valores) {
        var firma = valores.join("|");
        if (nodos.claves[clave] !== firma) {
          nodos.claves[clave] = firma;
          rehacerOpciones(select, valores);
        }
      };
      cambiarOpciones("cultivos", nodos.cultivo, vista.cultivos);
      cambiarOpciones("zonas", nodos.zona, vista.zonas);
      cambiarOpciones("campanas", nodos.campana, vista.campanas);
      nodos.cultivo.value = vista.cultivo;
      nodos.zona.value = vista.zona;
      nodos.campana.value = vista.campana;

      vista.campos.forEach(function (c) {
        var n = nodos.campos[c.clave];
        if (n.entrada.value !== c.texto) n.entrada.value = c.texto;
        n.contenedor.setAttribute("class", "esc-campo" + (c.error ? " esc-invalido" : (c.cambiado ? " esc-cambiado" : "")));
        if (c.error) n.entrada.setAttribute("aria-invalid", "true");
        else n.entrada.removeAttribute("aria-invalid");
        pintarEstadoDeCampo(c, n.linea, n);
      });
      // Sin cambios el botón queda «desactivado» con aria-disabled y no hace nada: con `disabled` perdería el foco
      // justo después de usarlo (quien navega con el teclado se quedaría sin lugar) y desaparecería del orden de lectura.
      if (vista.hayCambios || vista.hayErrores) nodos.volver.removeAttribute("aria-disabled");
      else nodos.volver.setAttribute("aria-disabled", "true");

      var aviso = nodos.descartado ? TEXTO_CAMBIO_DE_CASO : "";
      if (nodos.avisoCaso.textContent !== aviso) nodos.avisoCaso.textContent = aviso;
      nodos.avisoCaso.hidden = !aviso;
      pintarCosecha(vista);
      pintarResultados(vista);
      nodos.vista = vista;
      pintarSensibilidad(vista);
    } catch (e) {
      mostrarError(e);
    }
  }

  // La base llama a actualizar cada vez que cambia el estado compartido («Mi campo», por ejemplo al mover el deslizador de h).
  // Esta sección no depende de él: sólo pinta la primera vez (todavía no hay vista) o si lo último que se pintó fue un fallo.
  // Repintar de nuevo era trabajo perdido (49 cuentas del motor y todo el DOM) y cerraba la ventanita de origen; lo que escribiste
  // no se pierde porque nunca se toca.
  function actualizar() {
    var v = nodos && nodos.vista;
    // También se repinta si lo último que se pintó fue un fallo (sin resultados o sin sensibilidad): así se recupera solo.
    if (!nodos || !v || !v.resultados || !v.sensibilidad) pintar();
  }

  // Deja los resultados vacíos (la base lo pide si el cálculo falla: no pueden quedar cifras viejas).
  function limpiar() {
    if (!nodos) return;
    limpiarSensibilidad();
    base().vaciar(nodos.cuerpo);
    nodos.estadoResultados.textContent = "";
    nodos.estadoResultados.hidden = true;
  }

  var seccion = { id: "escenario", titulo: "Escenario propio", grupo: "historico", montar: montar, actualizar: actualizar, limpiar: limpiar };

  var api = {
    armarVista: armarVista,
    leerDecimal: leerDecimal,
    normalizarEscenario: normalizarEscenario,
    armarSensibilidad: armarSensibilidad,
    etiquetaDesvio: etiquetaDesvio,
    DESVIOS_RINDE: DESVIOS_RINDE,
    DESVIOS_PRECIO: DESVIOS_PRECIO,
    VISTAS_SENSIBILIDAD: VISTAS_SENSIBILIDAD,
    CAMPOS: CAMPOS,
    RESULTADOS: RESULTADOS,
    FORMULAS: FORMULAS,
    USA: USA,
    MAXIMO: MAXIMO,
    textoRango: textoRango,
    seccion: seccion
  };
  raiz.TESIS_ESCENARIO = api;
  // Sin la base común la sección desaparecería sin decir nada: mejor un error claro en la consola.
  if (!raiz.TESIS_APP) throw new Error("escenario.js tiene que cargarse después de app.js");
  raiz.TESIS_APP.registrarSeccion(seccion);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
