// Cálculo de «Simulá tu campaña» (sección 1 de la página). Funciones puras, sin DOM.
// Usa los datos de TESIS_DATOS y las funciones de TESIS_MOTOR. Las fórmulas son las del PLAN-v2:
// La cobertura es por cultivo: cada cultivo tiene su proporción h (un h único vale para todos).
//   MB = Ȳ·(P − GC) − CD − CC − COM         (por hectárea; total = hectáreas × MB)
//   P(h) = h·(F27 + base) + (1 − h)·spot proyectado
//   COM = comisión × Ȳ × F27 × h
//   spot proyectado = último Sc × (1 + crecimiento anual compuesto de Sc entre 2020/21 y 2025/26)
//   base esperada = promedio de (Sc − Fc) del cultivo
//   R = MB total ÷ valor de la tierra total
//   escenarios históricos: sin cubrir P = F27 × Sc_t/Fs_t; cubierto P = F27 × (1 + (Sc_t − Fc_t)/Fs_t)
//   Sharpe adaptado = R media ÷ desvío muestral de R (sin tasa libre de riesgo).
// Script clásico: anda con <script src> y con require en Node (pruebas).
(function (raiz) {
  "use strict";

  var PROPORCIONES = [0, 0.25, 0.5, 0.75, 1];
  var CULTIVOS = ["Trigo", "Soja", "Maíz"];

  // Calendario de la tesis: mes de siembra y mes de cosecha de cada cultivo (1 = enero). El contrato que le corresponde al productor es el
  // que vence en el mes de cosecha de 2026/27 (trigo ENE, soja MAY, maíz ABR).
  var CALENDARIO = { Trigo: { siembra: 6, cosecha: 1 }, Soja: { siembra: 11, cosecha: 5 }, "Maíz": { siembra: 9, cosecha: 4 } };
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  // ÚNICO LUGAR para cargar las cotizaciones de los futuros 2026/27 (A3 Mercados, ex MATBA-ROFEX): una fila por contrato.
  // Para cargar una cotización real, completar valor (USD/t), fecha ("AAAA-MM-DD") y fuente de la fila del contrato; se pueden agregar
  // filas de otros meses de vencimiento (mes: 1 a 12). Mientras valor sea null, el simulador usa el futuro de siembra 2025/26 de la tesis
  // (Fs) como referencia y lo rotula así: nunca se inventa una cotización. El productor no carga precios: elige los meses de su calendario
  // y el simulador toma el precio del contrato que vence en el mes de cosecha 2026/27.
  var COTIZACIONES_2627 = [
    { cultivo: "Trigo", mes: 1, contrato: "TRI.ROS/ENE27", valor: null, fecha: null, fuente: null },
    { cultivo: "Soja", mes: 5, contrato: "SOJ.ROS/MAY27", valor: null, fecha: null, fuente: null },
    { cultivo: "Maíz", mes: 4, contrato: "MAI.ROS/ABR27", valor: null, fecha: null, fuente: null }
  ];
  var CONTRATOS_2627 = {};
  COTIZACIONES_2627.forEach(function (f) { CONTRATOS_2627[f.cultivo] = f.contrato; });
  var ROTULO_REFERENCIA = "referencia: futuro de siembra 2025/26 — actualizalo con la cotización del día";

  // Límites de plausibilidad de cada entrada (para que un texto mal leído no pase en silencio).
  var LIMITES = {
    hectareas: { min: 0, max: 100000, texto: "hectáreas" },
    rinde: { min: 0, max: 30, minExclusivo: true, texto: "rinde esperado (t/ha)" },
    cd: { min: 0, max: 20000, texto: "costos directos (USD/ha)" },
    cc: { min: 0, max: 5000, texto: "costo de cosecha (USD/ha)" },
    gc: { min: 0, max: 1000, texto: "gastos de comercialización (USD/t)" },
    f27: { min: 0, max: 5000, minExclusivo: true, texto: "precio futuro 2026/27 (USD/t)" },
    comision: { min: 0, max: 1, texto: "comisión (proporción del valor del contrato)" },
    v: { min: 0, max: 200000, minExclusivo: true, texto: "valor de la tierra (USD/ha)" }
  };

  function esFinito(x) { return typeof x === "number" && isFinite(x); }

  function datosDe(d) { return d || raiz.TESIS_DATOS; }
  function motor() { return raiz.TESIS_MOTOR; }

  // Lee un número con coma decimal es-AR: «166,96», «6.915,49», «1.500». El punto sólo separa miles bien puestos.
  // Todo lo demás (punto decimal, %, exponente, +, vacío, letras) es null.
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

  // Cuenta de un campo contra sus límites: devuelve null si está bien o el mensaje.
  function revisarLimite(clave, valor) {
    var l = LIMITES[clave];
    if (!esFinito(valor)) return "«" + l.texto + "» tiene que ser un número.";
    if (valor < l.min || (l.minExclusivo && valor <= l.min)) {
      return "«" + l.texto + "» tiene que ser " + (l.minExclusivo ? "mayor que " : "al menos ") + l.min + ".";
    }
    if (valor > l.max) return "«" + l.texto + "» no puede pasar de " + l.max + ".";
    return null;
  }

  function mensajeDeLimite(clave) {
    var l = LIMITES[clave];
    return (l.minExclusivo ? "más de " : "de ") + l.min + " a " + l.max;
  }

  // ---------------------------------------------------------------------------------------
  // Datos de partida
  // ---------------------------------------------------------------------------------------

  // Casos de un cultivo en una zona, en orden de campaña.
  function casosOrdenados(datos, cultivo, zona) {
    return motor().casosDe(datos, cultivo, zona).slice().sort(function (a, b) { return a.campana < b.campana ? -1 : a.campana > b.campana ? 1 : 0; });
  }

  // Precios del cultivo (Fs, Sc y Fc son los mismos en todas las zonas), base esperada y spot proyectado.
  function preciosDe(datos, cultivo, zona) {
    var casos = casosOrdenados(datos, cultivo, zona);
    if (casos.length < 2) throw new Error("No hay campañas de " + cultivo + " en la zona «" + zona + "».");
    var m = motor();
    var primero = casos[0], ultimo = casos[casos.length - 1];
    var n = casos.length - 1;
    var crecimiento = Math.pow(ultimo.sc / primero.sc, 1 / n) - 1;
    var base = m.promedio(casos.map(function (c) { return c.sc - c.fc; }));
    return {
      cultivo: cultivo,
      campanas: casos.map(function (c) { return c.campana; }),
      primera: primero.campana,
      ultima: ultimo.campana,
      scPrimero: primero.sc,
      scUltimo: ultimo.sc,
      crecimientoAnual: crecimiento,
      spotProyectado: ultimo.sc * (1 + crecimiento),
      base: base,
      fsUltimo: ultimo.fs,
      origenSc: [m.origen(primero, "sc", datos), m.origen(ultimo, "sc", datos)],
      origenBase: casos.map(function (c) { return m.origen(c, "sc", datos); }).concat(casos.map(function (c) { return m.origen(c, "fc", datos); }))
    };
  }

  function distanciaMeses(a, b) {
    var d = Math.abs(a - b) % 12;
    return Math.min(d, 12 - d);
  }

  // F27 de un cultivo para un mes de cosecha 2026/27 (por defecto, el del calendario de la tesis). Se toma el precio del contrato que vence
  // en ese mes; si no hay uno cargado, el contrato cargado más cercano (y lo dice en `aviso`). Sin cotización cargada (valor null), el
  // Fs de la última campaña, bien rotulado como referencia.
  function futuro2627(datos, cultivo, zona, mesCosecha) {
    var pedido = mesCosecha || CALENDARIO[cultivo].cosecha;
    var fila = null;
    COTIZACIONES_2627.forEach(function (f) {
      if (f.cultivo === cultivo && (!fila || distanciaMeses(f.mes, pedido) < distanciaMeses(fila.mes, pedido))) fila = f;
    });
    if (!fila) throw new Error("No hay contratos 2026/27 cargados de " + cultivo + ".");
    var aproximado = fila.mes !== pedido;
    var aviso = aproximado ? "No hay un precio cargado para un contrato de " + MESES[pedido - 1] + "; usamos el contrato cargado más cercano (" + fila.contrato + ", " + MESES[fila.mes - 1] + ")." : "";
    var salida;
    if (esFinito(fila.valor) && fila.fecha && fila.fuente) {
      salida = { valor: fila.valor, fecha: fila.fecha, fuente: fila.fuente, esReferencia: false,
        origen: "Cotización " + fila.contrato + " al " + fila.fecha + " — fuente: " + fila.fuente };
    } else {
      var ultimo = casosOrdenados(datos, cultivo, zona).slice(-1)[0];
      salida = { valor: ultimo.fs, fecha: null, fuente: null, esReferencia: true,
        origen: ROTULO_REFERENCIA + " — " + motor().origen(ultimo, "fs", datos) };
    }
    salida.contrato = fila.contrato;
    salida.mesUsado = fila.mes;
    salida.mesPedido = pedido;
    salida.aproximado = aproximado;
    salida.aviso = aviso;
    return salida;
  }

  // Valores por defecto de un cultivo en una zona (los del último año disponible).
  function porDefecto(datos, cultivo, zona) {
    datos = datosDe(datos);
    var m = motor();
    var ultimo = casosOrdenados(datos, cultivo, zona).slice(-1)[0];
    if (!ultimo) throw new Error("La tesis no tiene " + cultivo + " en la zona «" + zona + "».");
    return {
      cultivo: cultivo,
      campana: ultimo.campana,
      rinde: ultimo.rindeEsperado / 10,
      cd: ultimo.cd,
      cc: m.cosecha(ultimo.rindeEsperado, ultimo.tabla),
      gc: ultimo.gc,
      f27: futuro2627(datos, cultivo, zona, null),
      origen: {
        // rinde: celda en qq/ha (la página lo muestra en t/ha: ÷ 10); cc: la tabla de costo de cosecha de ese caso.
        rinde: m.origen(ultimo, "rindeEsperado", datos),
        cd: m.origen(ultimo, "cd", datos),
        cc: m.origen(ultimo, "tabla.piso", datos),
        gc: m.origen(ultimo, "gc", datos)
      }
    };
  }

  // Valor de la tierra por defecto de la zona (último disponible).
  function valorTierraDe(datos, zona) {
    datos = datosDe(datos);
    var m = motor();
    var caso = null;
    datos.casos.forEach(function (c) {
      if (c.zona === zona && (!caso || c.campana >= caso.campana)) caso = c;
    });
    if (!caso) throw new Error("No hay datos de la zona «" + zona + "».");
    return { v: caso.v, campana: caso.campana, origen: m.origen(caso, "v", datos) };
  }

  // Rango del rinde REAL (qq/ha) que hubo en la zona para un cultivo en las últimas campañas (hasta 6) de TESIS_DATOS, o null si los datos
  // no traen rinde real de esa zona y cultivo (no se inventa nada). Sale de la columna «rindeReal» de cada caso.
  function rindeHistorico(datos, cultivo, zona) {
    datos = datosDe(datos);
    var m = motor();
    if (m.cultivosDe(datos, zona).indexOf(cultivo) < 0) return null;
    var casos = casosOrdenados(datos, cultivo, zona).filter(function (c) { return esFinito(c.rindeReal) && c.rindeReal > 0; }).slice(-6);
    if (!casos.length) return null;
    var menor = casos[0], mayor = casos[0];
    casos.forEach(function (c) {
      if (c.rindeReal < menor.rindeReal) menor = c;
      if (c.rindeReal > mayor.rindeReal) mayor = c;
    });
    return { cultivo: cultivo, zona: zona, campanas: casos.length, desde: casos[0].campana, hasta: casos[casos.length - 1].campana,
      min: menor.rindeReal, max: mayor.rindeReal,
      origenMin: m.origen(menor, "rindeReal", datos), origenMax: m.origen(mayor, "rindeReal", datos) };
  }

  function comisionPorDefecto(datos) {
    datos = datosDe(datos);
    return { valor: datos.parametros.comision.v, origen: datos.parametros.comision.o };
  }

  // Detalle de cada zona, sólo con lo que figura en las fuentes del repositorio. Los partidos salen de la hoja «Rindes_trigo_partidos» de
  // TIF_01_Rindes_y_costos_2.xlsx (filas «Provincia» y «Zona Márgenes (orientativa)»: una correspondencia orientativa de la revista Márgenes
  // Agropecuarios). «C. Suárez» y «M. Juárez» se escriben «Cnel. Suárez» y «Marcos Juárez» como en el libro del valor de la tierra
  // (Buenos_Aires.csv y Córdoba.csv). La tabla de equivalencias completa zona ↔ partidos MAGyP está pendiente (P-03 de consolidado/pendientes.md):
  // lo que no está en las fuentes no se completa. Provincias y regiones: texto de la tesis (consolidado/archivos/texto/40_corregido_3.md).
  var DETALLE_ZONAS = {
    "Norte BA / Sur SF": { provincia: "Buenos Aires y Santa Fe", region: "norte de Buenos Aires y sur de Santa Fe", partidos: ["Pergamino", "Arrecifes", "Caseros (Santa Fe)", "Gral. López (Santa Fe)"] },
    "Sur Entre Ríos": { provincia: "Entre Ríos", region: "sur de Entre Ríos", partidos: ["Victoria"] },
    "Sudeste BA": { provincia: "Buenos Aires", region: "sudeste de Buenos Aires", partidos: ["Necochea", "Tres Arroyos", "Tandil", "Balcarce", "Azul", "Madariaga"] },
    "Sudoeste BA": { provincia: "Buenos Aires", region: "sudoeste de Buenos Aires", partidos: ["Cnel. Suárez"] },
    "Centro Oeste BA": { provincia: "Buenos Aires", region: "centro oeste de Buenos Aires", partidos: ["9 de Julio", "Bragado"] },
    "Oeste BA": { provincia: "Buenos Aires", region: "oeste de Buenos Aires", partidos: ["T. Lauquen"] },
    "Sur de Córdoba": { provincia: "Córdoba", region: "sur de Córdoba", partidos: ["Río Cuarto"] },
    "Sudeste de Córdoba": { provincia: "Córdoba", region: "sudeste de Córdoba", partidos: ["Marcos Juárez"] }
  };

  // Una línea para la tarjeta: «Provincia · Región. Partidos de referencia: …». Sin detalle: sólo el nombre.
  function detalleDeZona(zona) {
    var d = DETALLE_ZONAS[zona];
    if (!d) return { provincia: null, region: null, partidos: [], linea: zona };
    var linea = d.provincia + " · " + d.region.charAt(0).toUpperCase() + d.region.slice(1);
    if (d.partidos.length) linea += ". Partidos de referencia: " + d.partidos.join(", ");
    return { provincia: d.provincia, region: d.region, partidos: d.partidos.slice(), linea: linea };
  }

  function zonas(datos) {
    datos = datosDe(datos);
    var lista = [];
    datos.casos.forEach(function (c) { if (lista.indexOf(c.zona) < 0) lista.push(c.zona); });
    return lista;
  }

  function cultivosDeZona(datos, zona) {
    datos = datosDe(datos);
    return CULTIVOS.filter(function (c) { return motor().cultivosDe(datos, zona).indexOf(c) >= 0; });
  }

  // ---------------------------------------------------------------------------------------
  // Validación y cálculo
  // ---------------------------------------------------------------------------------------

  // La proporción cubierta es un número (vale para todos los cultivos) o un objeto { cultivo: h } con la de cada uno.
  // Un cultivo que falta en el objeto se toma como no cubierto (0).
  function hPorCultivo(h, nombres) {
    var salida = {};
    nombres.forEach(function (c) { salida[c] = typeof h === "number" ? h : (h && h[c] !== undefined ? h[c] : 0); });
    return salida;
  }

  function revisarH(h, nombres) {
    var texto = "La proporción cubierta tiene que ser 0, 25, 50, 75 o 100 %.";
    if (typeof h === "number") {
      if (PROPORCIONES.indexOf(h) < 0) throw new Error(texto);
      return;
    }
    if (h === null || typeof h !== "object") throw new Error(texto);
    var porCultivo = hPorCultivo(h, nombres);
    nombres.forEach(function (c) { if (PROPORCIONES.indexOf(porCultivo[c]) < 0) throw new Error(c + ": " + texto); });
  }

  // Entrada ya numérica: { zona, h (número, o { cultivo: h }), comision, v, cultivos: { Soja: { ha, rinde, cd, cc (null = de la tabla), gc, f27 } } }.
  // Lanza un Error en español que nombra el campo; nunca devuelve NaN.
  function validar(datos, entrada) {
    datos = datosDe(datos);
    if (entrada === null || typeof entrada !== "object") throw new Error("Falta la entrada de la campaña.");
    if (zonas(datos).indexOf(entrada.zona) < 0) throw new Error("La zona «" + entrada.zona + "» no está en la tesis.");
    var msg = revisarLimite("comision", entrada.comision) || revisarLimite("v", entrada.v);
    if (msg) throw new Error(msg);
    var claves = Object.keys(entrada.cultivos || {});
    if (!claves.length) throw new Error("Elegí al menos un cultivo.");
    revisarH(entrada.h, claves);
    var haTotal = 0;
    claves.forEach(function (cultivo) {
      if (cultivosDeZona(datos, entrada.zona).indexOf(cultivo) < 0) throw new Error("La tesis no tiene " + cultivo + " en la zona «" + entrada.zona + "».");
      var c = entrada.cultivos[cultivo];
      ["hectareas:ha", "rinde:rinde", "cd:cd", "gc:gc", "f27:f27"].forEach(function (par) {
        var partes = par.split(":");
        var m = revisarLimite(partes[0], c[partes[1]]);
        if (m) throw new Error(cultivo + ": " + m);
      });
      if (c.cc !== null && c.cc !== undefined) {
        var mcc = revisarLimite("cc", c.cc);
        if (mcc) throw new Error(cultivo + ": " + mcc);
      }
      haTotal += c.ha;
    });
    if (!(haTotal > 0)) throw new Error("Cargá hectáreas en al menos un cultivo.");
  }

  function estadisticas(lista) {
    var m = motor();
    var media = m.promedio(lista);
    var desvio = lista.length >= 2 ? m.desvioMuestral(lista) : 0;
    return {
      media: media,
      desvio: desvio,
      sharpe: desvio > 0 ? media / desvio : null,
      peor: Math.min.apply(null, lista),
      mejor: Math.max.apply(null, lista)
    };
  }

  // Margen bruto por hectárea de un cultivo con la proporción cubierta h y un precio ya calculado.
  function margenPorHa(c, precio, h, comision) {
    var com = comision * c.rinde * c.f27 * h;
    return { mb: c.rinde * (precio - c.gc) - c.cd - c.cc - com, ingreso: c.rinde * precio, comision: com };
  }

  // Resultado de una cobertura con la proporción h de cada cultivo (h: número para todos, u objeto { cultivo: h }), sobre un resultado de
  // calcular() (usa sólo lo que éste guarda: cultivos, comisión, campañas, hectáreas y valor de la tierra). Devuelve
  //   hPorCultivo: { cultivo: h }; h: la proporción de toda la campaña (ponderada por toneladas esperadas; igual a h si es la misma para todos);
  //   resultado: { mbTotal, mbHa, ingresoTotal, ingresoHa, comisionTotal, r, porCultivo: { h, precio, mbHa, ingresoHa, comisionHa } }
  //   escenario: { r: [6], mbHa: [6], estadisticasR, estadisticasMbHa }
  function evaluar(vista, h) {
    var nombres = vista.nombres;
    revisarH(h, nombres);
    var hp = hPorCultivo(h, nombres);
    var haTotal = vista.hectareasTotales, valorTotal = vista.valorTotal;
    var mbTotal = 0, ingTotal = 0, comTotal = 0, producido = 0, cubierto = 0;
    var porCultivo = {};
    nombres.forEach(function (cultivo) {
      var i = vista.cultivos[cultivo];
      var precio = hp[cultivo] * (i.f27 + i.precios.base) + (1 - hp[cultivo]) * i.precios.spotProyectado;
      var cuenta = margenPorHa(i, precio, hp[cultivo], vista.comision);
      porCultivo[cultivo] = { h: hp[cultivo], precio: precio, mbHa: cuenta.mb, ingresoHa: cuenta.ingreso, comisionHa: cuenta.comision };
      mbTotal += i.ha * cuenta.mb;
      ingTotal += i.ha * cuenta.ingreso;
      comTotal += i.ha * cuenta.comision;
      producido += i.ha * i.rinde;
      cubierto += i.ha * i.rinde * hp[cultivo];
    });
    var hTotal = typeof h === "number" ? h : cubierto / producido;
    var resultado = { h: hTotal, mbTotal: mbTotal, mbHa: mbTotal / haTotal, ingresoTotal: ingTotal, ingresoHa: ingTotal / haTotal,
      comisionTotal: comTotal, r: mbTotal / valorTotal, porCultivo: porCultivo };

    // Seis escenarios históricos: las sorpresas de precio de cada campaña de la tesis aplicadas al F27.
    var r = [], mbHa = [];
    vista.campanas.forEach(function (campana, t) {
      var mb = 0;
      nombres.forEach(function (cultivo) {
        var i = vista.cultivos[cultivo];
        var caso = i.casos[t];
        var sin = i.f27 * caso.sc / caso.fs;
        var cub = i.f27 * (1 + (caso.sc - caso.fc) / caso.fs);
        var precio = hp[cultivo] * cub + (1 - hp[cultivo]) * sin;
        mb += i.ha * margenPorHa(i, precio, hp[cultivo], vista.comision).mb;
      });
      r.push(mb / valorTotal);
      mbHa.push(mb / haTotal);
    });
    return { hPorCultivo: hp, h: hTotal, resultado: resultado,
      escenario: { h: hTotal, r: r, mbHa: mbHa, estadisticasR: estadisticas(r), estadisticasMbHa: estadisticas(mbHa) } };
  }

  // Resultado completo. Devuelve:
  //   cultivos[cultivo]: { ha, proporcion, rinde, cd, cc, gc, f27, precios, casos }
  //   resultados[h] (h = 0, 0.25, …, la misma para todos los cultivos): { mbTotal, mbHa, ingresoTotal, ingresoHa, comisionTotal, r, porCultivo }
  //   usuario: el resultado con la cobertura elegida (entrada.h: un número, o una proporción por cultivo); futuro: h = 1; spot: h = 0
  //   hPorCultivo: la proporción de cada cultivo; h: la de toda la campaña (si no es la misma para todos, la ponderada por toneladas)
  //   escenarios[h]: { r: [6], mbHa: [6], estadísticas de R y de MB/ha } (misma h para todos); escenarioUsuario: el de la cobertura elegida
  //   campanas: las 6; lectura: diferencia de cubrirse al 100 % contra no cubrirse
  function calcular(datos, entrada) {
    datos = datosDe(datos);
    validar(datos, entrada);
    var m = motor();
    var nombres = cultivosDeZona(datos, entrada.zona).filter(function (c) { return entrada.cultivos[c]; });
    var haTotal = 0;
    nombres.forEach(function (c) { haTotal += entrada.cultivos[c].ha; });
    var valorTotal = haTotal * entrada.v;

    var info = {};
    nombres.forEach(function (cultivo) {
      var e = entrada.cultivos[cultivo];
      var p = preciosDe(datos, cultivo, entrada.zona);
      var ultimo = casosOrdenados(datos, cultivo, entrada.zona).slice(-1)[0];
      var cc = e.cc === null || e.cc === undefined ? m.cosecha(e.rinde * 10, ultimo.tabla) : e.cc;
      info[cultivo] = { ha: e.ha, proporcion: e.ha / haTotal, rinde: e.rinde, cd: e.cd, cc: cc, gc: e.gc, f27: e.f27,
        precios: p, casos: casosOrdenados(datos, cultivo, entrada.zona) };
    });

    var vista = { zona: entrada.zona, hectareasTotales: haTotal, valorTotal: valorTotal, v: entrada.v, comision: entrada.comision,
      cultivos: info, nombres: nombres, campanas: info[nombres[0]].precios.campanas };

    var resultados = {}, escenarios = {};
    PROPORCIONES.forEach(function (h) {
      var ev = evaluar(vista, h);
      resultados[h] = ev.resultado;
      escenarios[h] = ev.escenario;
    });
    var elegida = evaluar(vista, entrada.h);

    var e0 = escenarios[0], e1 = escenarios[1];
    var lectura = {
      mediaMbHa0: e0.estadisticasMbHa.media,
      mediaMbHa100: e1.estadisticasMbHa.media,
      resignaMbHa: e0.estadisticasMbHa.media - e1.estadisticasMbHa.media,
      peorMbHa0: e0.estadisticasMbHa.peor,
      peorMbHa100: e1.estadisticasMbHa.peor,
      mejoraPeorMbHa: e1.estadisticasMbHa.peor - e0.estadisticasMbHa.peor,
      desvioR0: e0.estadisticasR.desvio,
      desvioR100: e1.estadisticasR.desvio,
      peorR0: e0.estadisticasR.peor,
      peorR100: e1.estadisticasR.peor
    };

    return Object.assign(vista, {
      h: elegida.h, hPorCultivo: elegida.hPorCultivo, resultados: resultados,
      usuario: elegida.resultado, escenarioUsuario: elegida.escenario, futuro: resultados[1], spot: resultados[0],
      escenarios: escenarios, lectura: lectura
    });
  }

  // Qué implica cubrir la proporción h (un número para todos los cultivos, u objeto { cultivo: h }) con un resultado de calcular():
  // toneladas cubiertas (ha × rinde × h) por cultivo y en total, comisión estimada en USD (comisión × toneladas cubiertas × F27) y las
  // cifras de esperado y de riesgo de la campaña entera. `porCultivo` trae, de cada cultivo, su h, toneladas, comisión y margen esperado.
  // No calcula cantidad de contratos: el tamaño del contrato no está en las fuentes del repositorio.
  function cobertura(vista, h) {
    var ev = evaluar(vista, h);
    var toneladas = {}, producidas = {}, cubierto = 0, producido = 0, comision = 0, porCultivo = {};
    vista.nombres.forEach(function (c) {
      var i = vista.cultivos[c];
      var hc = ev.hPorCultivo[c];
      producidas[c] = i.ha * i.rinde;
      toneladas[c] = producidas[c] * hc;
      producido += producidas[c];
      cubierto += toneladas[c];
      var com = toneladas[c] * i.f27 * vista.comision;
      comision += com;
      porCultivo[c] = { h: hc, toneladas: toneladas[c], producidas: producidas[c], comisionUsd: com,
        mbTotal: i.ha * ev.resultado.porCultivo[c].mbHa, precio: ev.resultado.porCultivo[c].precio };
    });
    var e = ev.escenario;
    return { h: ev.h, hPorCultivo: ev.hPorCultivo, toneladas: toneladas, producidas: producidas, toneladasCubiertas: cubierto, toneladasProducidas: producido,
      comisionUsd: comision, mbTotal: ev.resultado.mbTotal, r: ev.resultado.r, porCultivo: porCultivo,
      desvio: e.estadisticasR.desvio, peor: e.estadisticasR.peor, sharpe: e.estadisticasR.sharpe,
      peorMbTotal: e.estadisticasMbHa.peor * vista.hectareasTotales, mediaMbTotal: e.estadisticasMbHa.media * vista.hectareasTotales };
  }

  // ---------------------------------------------------------------------------------------
  // Entradas como texto (lo que escribe el productor)
  // ---------------------------------------------------------------------------------------

  var ETIQUETAS = { ha: "Hectáreas", rinde: "Rinde esperado", cd: "Costos directos", cc: "Costo de cosecha", gc: "Gastos de comercialización",
    f27: "Precio futuro 2026/27", comision: "Comisión", v: "Valor de la tierra" };

  // textos: { zona, h, comision, v, cultivos: { Soja: { ha, rinde, cd, cc, gc, f27 } } } con cadenas.
  // Una cadena vacía en cc (y sólo en cc) significa «de la tabla». La comisión se escribe en % (0,5).
  // Devuelve { entrada (numérica, lista para calcular, o null si hay errores), errores: { clave: mensaje } }.
  function leerEntradas(datos, textos) {
    datos = datosDe(datos);
    var errores = {};
    var entrada = { zona: textos.zona, h: textos.h, comision: null, v: null, cultivos: {} };

    function numero(clave, texto, limite, escala, obligatorio) {
      if (typeof texto === "string" && texto.trim() === "" && !obligatorio) return null;
      var n = leerDecimal(texto);
      if (n === null) {
        errores[clave] = "Escribí un número con coma decimal (por ejemplo 0,5): el punto sólo separa miles.";
        return undefined;
      }
      if (revisarLimite(limite, n * (escala || 1))) {
        errores[clave] = escala ? "Tiene que ir de 0 a 100 (en %)." : "Tiene que ir " + mensajeDeLimite(limite) + ".";
        return undefined;
      }
      return n * (escala || 1);
    }

    var com = numero("comision", textos.comision, "comision", 0.01, true);
    var v = numero("v", textos.v, "v", 1, true);
    entrada.comision = com === undefined ? null : com;
    entrada.v = v === undefined ? null : v;
    var claves = Object.keys(textos.cultivos || {});
    var algunCultivo = false;
    claves.forEach(function (cultivo) {
      var t = textos.cultivos[cultivo];
      var ha = numero(cultivo + ".ha", t.ha, "hectareas", 1, true);
      if (ha !== undefined && ha > 0 && !/^\d+$/.test(String(t.ha).trim()) && !/^\d{1,3}(\.\d{3})+$/.test(String(t.ha).trim())) {
        errores[cultivo + ".ha"] = "Las hectáreas son un número entero (por ejemplo 1500 o 1.500).";
        ha = undefined;
      }
      var fila = { ha: ha, rinde: numero(cultivo + ".rinde", t.rinde, "rinde", 1, true), cd: numero(cultivo + ".cd", t.cd, "cd", 1, true),
        cc: numero(cultivo + ".cc", t.cc, "cc", 1, false), gc: numero(cultivo + ".gc", t.gc, "gc", 1, true),
        f27: numero(cultivo + ".f27", t.f27, "f27", 1, true) };
      if (fila.ha > 0) algunCultivo = true;
      entrada.cultivos[cultivo] = fila;
    });
    if (!claves.length) errores.cultivos = "Elegí al menos un cultivo.";
    else if (!algunCultivo && !Object.keys(errores).length) errores.cultivos = "Cargá hectáreas en al menos un cultivo.";
    if (Object.keys(errores).length) return { entrada: null, errores: errores };
    // Los cultivos sin hectáreas no entran al cálculo.
    claves.forEach(function (cultivo) { if (!(entrada.cultivos[cultivo].ha > 0)) delete entrada.cultivos[cultivo]; });
    return { entrada: entrada, errores: errores };
  }

  var api = {
    PROPORCIONES: PROPORCIONES,
    CULTIVOS: CULTIVOS,
    CONTRATOS_2627: CONTRATOS_2627,
    COTIZACIONES_2627: COTIZACIONES_2627,
    CALENDARIO: CALENDARIO,
    MESES: MESES,
    DETALLE_ZONAS: DETALLE_ZONAS,
    detalleDeZona: detalleDeZona,
    cobertura: cobertura,
    evaluar: evaluar,
    hPorCultivo: hPorCultivo,
    ROTULO_REFERENCIA: ROTULO_REFERENCIA,
    LIMITES: LIMITES,
    leerDecimal: leerDecimal,
    zonas: zonas,
    cultivosDeZona: cultivosDeZona,
    preciosDe: preciosDe,
    futuro2627: futuro2627,
    porDefecto: porDefecto,
    valorTierraDe: valorTierraDe,
    rindeHistorico: rindeHistorico,
    comisionPorDefecto: comisionPorDefecto,
    validar: validar,
    calcular: calcular,
    leerEntradas: leerEntradas
  };
  raiz.TESIS_CAMPANA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
