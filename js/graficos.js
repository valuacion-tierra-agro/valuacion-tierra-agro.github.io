// Gráficos SVG propios del simulador (D-01, D-10): barras agrupadas por campaña, barras con líneas y líneas.
// La geometría es una función pura (se prueba sin navegador) y el SVG se arma con la API del
// DOM (createElementNS, setAttribute, textContent): nunca HTML en texto.
// Script clásico: anda con <script src> (doble clic, file://) y con require en Node (pruebas).
// No usa TESIS_APP (carga antes que app.js) ni toca el DOM al cargarse.
(function (raiz) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var MENOS = "−"; // signo menos (U+2212), no el guion

  // El tamaño de letra está en unidades del viewBox (420 de ancho). En un celular de 375 px el
  // gráfico mide ~343 px: escala 343 ÷ 420 = 0,82. Con 14 la letra queda en ~11,4 px (WR-06); los
  // márgenes dejan lugar para las etiquetas a ese tamaño (ver la prueba de geometría).
  var LETRA = 14;
  var MARGEN_INICIAL = { arriba: 12, derecha: 6, abajo: 30, izquierda: 66 };
  // Pasos «lindos»: 1, 2, 2,5 y 5 por una potencia de diez.
  var PASOS = [1, 2, 2.5, 5];

  function esFinito(x) {
    return typeof x === "number" && isFinite(x);
  }

  // Limpia el ruido de punto flotante (0,1 × 3 = 0,30000000000000004).
  function limpio(x) {
    return Number(x.toPrecision(12));
  }

  // Coordenada para escribir en un atributo: hasta 2 decimales.
  function coord(x) {
    return String(Math.round(x * 100) / 100);
  }

  // Paso «lindo» más chico con el que el dominio [min, max] entra en 6 marcas o menos.
  function pasoLindo(min, max) {
    var rango = max - min;
    var potencia = Math.pow(10, Math.floor(Math.log10(rango)) - 1);
    for (var vuelta = 0; vuelta < 6; vuelta++) {
      for (var i = 0; i < PASOS.length; i++) {
        var paso = limpio(PASOS[i] * potencia);
        var desde = Math.floor(min / paso);
        var hasta = Math.ceil(max / paso);
        if (hasta - desde + 1 <= 6) return paso;
      }
      potencia *= 10;
    }
    return rango; // no debería pasar: el rango siempre entra con un paso del mismo tamaño
  }

  // Eje vertical con marcas «lindas» que cubre de `minimo` a `maximo` (el cero tiene que estar adentro):
  // devuelve la escala (valor → y dentro del área), las marcas y la y del cero. Lo usan los dos gráficos.
  function ejeVertical(minimo, maximo, area) {
    var paso = pasoLindo(minimo, maximo);
    var desde = Math.floor(minimo / paso);
    var hasta = Math.ceil(maximo / paso);
    var bajo = limpio(desde * paso);
    var alta = limpio(hasta * paso);
    var escala = function (valor) { return area.y + area.alto * (alta - valor) / (alta - bajo); };
    var marcas = [];
    for (var k = desde; k <= hasta; k++) {
      var valorMarca = limpio(k * paso);
      marcas.push({ valor: valorMarca, y: escala(valorMarca) });
    }
    return { escala: escala, marcas: marcas, ceroY: escala(0) };
  }

  // Dominio, escala y barras que comparten las barras solas y las barras con líneas.
  // `extras` son números que también tienen que entrar en el eje (por ejemplo, los valores de las líneas).
  // Devuelve { geometria, escala }; la escala (valor → y) no forma parte de la geometría.
  function construirBarras(nombre, config, extras) {
    if (config === null || typeof config !== "object") throw new Error(nombre + ": falta la configuración");
    var categorias = config.categorias;
    var series = config.series;
    if (!Array.isArray(categorias) || categorias.length === 0) throw new Error(nombre + ": hacen falta categorías");
    if (!Array.isArray(series) || series.length === 0) throw new Error(nombre + ": hace falta al menos una serie");
    var ancho = config.ancho === undefined ? 420 : config.ancho;
    var alto = config.alto === undefined ? 260 : config.alto;
    var margen = Object.assign({}, MARGEN_INICIAL, config.margen || {});

    var minimo = 0;
    var maximo = 0;
    series.forEach(function (serie) {
      if (!Array.isArray(serie.valores) || serie.valores.length !== categorias.length) {
        throw new Error(nombre + ": la serie «" + serie.nombre + "» tiene que traer un valor por categoría (" + categorias.length + ")");
      }
      serie.valores.forEach(function (v, i) {
        if (!esFinito(v)) {
          throw new Error(nombre + ": el valor de la serie «" + serie.nombre + "» en «" + categorias[i] + "» no es un número (" + v + ")");
        }
        if (v < minimo) minimo = v;
        if (v > maximo) maximo = v;
      });
    });
    extras.forEach(function (v) {
      if (v < minimo) minimo = v;
      if (v > maximo) maximo = v;
    });
    var datosReferencia = config.referencia;
    if (datosReferencia !== undefined && datosReferencia !== null) {
      if (typeof datosReferencia !== "object" || !esFinito(datosReferencia.valor)) {
        throw new Error(nombre + ": la referencia tiene que traer un valor numérico (llegó " +
          (datosReferencia && typeof datosReferencia === "object" ? datosReferencia.valor : datosReferencia) + ")");
      }
      if (datosReferencia.valor < minimo) minimo = datosReferencia.valor;
      if (datosReferencia.valor > maximo) maximo = datosReferencia.valor;
    } else {
      datosReferencia = null;
    }
    if (minimo === 0 && maximo === 0) maximo = 1; // todo en cero: dominio [0, 1]

    var area = {
      x: margen.izquierda,
      y: margen.arriba,
      ancho: ancho - margen.izquierda - margen.derecha,
      alto: alto - margen.arriba - margen.abajo
    };

    var eje = ejeVertical(minimo, maximo, area);
    var escala = eje.escala;
    var marcas = eje.marcas;
    var ceroY = eje.ceroY;
    var referencia = datosReferencia === null ? null : {
      valor: datosReferencia.valor,
      nombre: datosReferencia.nombre,
      etiqueta: datosReferencia.etiqueta,
      y: escala(datosReferencia.valor)
    };

    // Cada grupo (una categoría) deja un hueco a los lados; las barras van una al lado de la otra.
    var anchoCelda = area.ancho / categorias.length;
    var hueco = anchoCelda * 0.3;
    var anchoBarra = (anchoCelda - hueco) / series.length;
    var grupos = [];
    var barras = [];
    categorias.forEach(function (categoria, i) {
      var x0 = area.x + i * anchoCelda + hueco / 2;
      grupos.push({ categoria: categoria, x: x0, ancho: anchoBarra * series.length });
      series.forEach(function (serie, j) {
        var valor = serie.valores[i];
        var yValor = escala(valor);
        barras.push({
          serie: serie.nombre,
          clase: serie.clase,
          categoria: categoria,
          valor: valor,
          x: x0 + j * anchoBarra,
          y: valor >= 0 ? yValor : ceroY,
          ancho: anchoBarra,
          alto: Math.abs(ceroY - yValor)
        });
      });
    });

    var geometria = { ancho: ancho, alto: alto, letra: LETRA, anchoCelda: anchoCelda, area: area, ceroY: ceroY, marcas: marcas, grupos: grupos, barras: barras };
    // Sin referencia, `referencia` vale null pero no se enumera: lo que ya se hacía con la geometría
    // (recorrerla, compararla, pasarla a JSON) sigue dando exactamente lo mismo que antes.
    if (referencia === null) Object.defineProperty(geometria, "referencia", { value: null, enumerable: false });
    else geometria.referencia = referencia;
    return { geometria: geometria, escala: escala };
  }

  // config: { categorias, series: [{nombre, clase, valores}], ancho, alto, margen, referencia }.
  // referencia (opcional): { valor, nombre, etiqueta }, una línea horizontal marcada en `valor` (por
  // ejemplo, el 50 % que pide una hipótesis). Entra en el dominio del eje, así que siempre se ve.
  function geometriaBarras(config) {
    return construirBarras("geometriaBarras", config, []).geometria;
  }

  // Valida las líneas de geometriaBarrasYLineas y devuelve sus valores finitos (para ampliar el dominio).
  function valoresDeLineas(lineasConfig, categorias) {
    var valores = [];
    lineasConfig.forEach(function (linea) {
      var nombre = linea && typeof linea === "object" ? linea.nombre : linea;
      if (linea === null || typeof linea !== "object" || !Array.isArray(linea.valores) || linea.valores.length !== categorias.length) {
        throw new Error("geometriaBarrasYLineas: la línea «" + nombre + "» tiene que traer un valor (o null) por categoría (" + categorias.length + ")");
      }
      linea.valores.forEach(function (v, i) {
        if (v === null) return;
        if (!esFinito(v)) {
          throw new Error("geometriaBarrasYLineas: el valor de la línea «" + linea.nombre + "» en «" + categorias[i] + "» no es un número ni null (" + v + ")");
        }
        valores.push(v);
      });
    });
    return valores;
  }

  // Barras agrupadas con líneas por categoría: config de geometriaBarras + lineas: [{nombre, clase, valores, discontinua}].
  // Cada línea trae un valor por categoría o null (sin dato: la línea se corta). El dominio del eje incluye
  // los valores de las líneas. Devuelve lo de geometriaBarras más
  //   lineas: [{serie, clase, discontinua, puntos: [{categoria, valor, x, y}], tramos}]
  // con un punto por valor (x en el centro del grupo de barras, misma escala) y los tramos = corridas sin null.
  function geometriaBarrasYLineas(config) {
    if (config === null || typeof config !== "object") throw new Error("geometriaBarrasYLineas: falta la configuración");
    var lineasConfig = config.lineas === undefined || config.lineas === null ? [] : config.lineas;
    if (!Array.isArray(lineasConfig)) throw new Error("geometriaBarrasYLineas: lineas tiene que ser una lista");
    // Sin categorías válidas el error es el de las barras (lo lanza construirBarras).
    var extras = Array.isArray(config.categorias) ? valoresDeLineas(lineasConfig, config.categorias) : [];
    var construido = construirBarras("geometriaBarrasYLineas", config, extras);
    var g = construido.geometria;
    var lineas = lineasConfig.map(function (linea) {
      var puntos = [];
      var tramos = [];
      var actual = null;
      linea.valores.forEach(function (v, i) {
        if (v === null) { actual = null; return; }
        var grupo = g.grupos[i];
        var punto = { categoria: config.categorias[i], valor: v, x: grupo.x + grupo.ancho / 2, y: construido.escala(v) };
        puntos.push(punto);
        if (actual === null) { actual = []; tramos.push(actual); }
        actual.push(punto);
      });
      return { serie: linea.nombre, clase: linea.clase, discontinua: linea.discontinua === true, puntos: puntos, tramos: tramos };
    });
    var resultado = Object.assign({}, g, { lineas: lineas });
    if (g.referencia === null) Object.defineProperty(resultado, "referencia", { value: null, enumerable: false });
    return resultado;
  }

  // Etiqueta corta para el eje: 1500 → «1,5 mil», 1200000 → «1,2 M», -250 → «−250».
  // Repite a propósito el formato es-AR y el signo menos real de app.js: graficos.js carga ANTES que
  // app.js y no puede usarlo. Si cambia allá (coma decimal, signo menos), hay que cambiarlo acá.
  function etiquetaEje(valor) {
    var formato = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    var absoluto = Math.abs(valor);
    var texto;
    if (absoluto >= 1000000) {
      texto = formato.format(absoluto / 1e6) + " M";
    } else if (absoluto >= 1000) {
      // 999.999 redondea a «1000 mil»: en ese caso se pasa a millones.
      if (Math.round(absoluto / 100) / 10 >= 1000) texto = formato.format(absoluto / 1e6) + " M";
      else texto = formato.format(absoluto / 1e3) + " mil";
    } else {
      texto = formato.format(absoluto);
    }
    var negativo = valor < 0 && /[1-9]/.test(texto);
    return (negativo ? MENOS : "") + texto;
  }

  // Porcentaje corto para el eje: 0,1 → «10 %», −0,1 → «−10 %», 0,025 → «2,5 %» (con espacio duro antes del %).
  function etiquetaPorcentaje(valor) {
    return etiquetaEje(valor * 100) + "\u00a0%";
  }

  function nodoSvg(documento, etiqueta, atributos, texto) {
    var nodo = documento.createElementNS(SVG_NS, etiqueta);
    Object.keys(atributos || {}).forEach(function (clave) {
      nodo.setAttribute(clave, String(atributos[clave]));
    });
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  // Dibuja las barras con sus guías, el cero y la referencia. `antesDeCampanas(svg)` (opcional) dibuja
  // algo más antes de los nombres de las categorías (las líneas de barrasYLineas).
  function dibujarBarras(documento, g, config, antesDeCampanas) {
    var formatear = typeof config.formatear === "function" ? config.formatear : String;
    var etiquetar = typeof config.etiquetarEje === "function" ? config.etiquetarEje : etiquetaEje;
    var unidad = config.unidad ? " " + config.unidad : "";

    var svg = nodoSvg(documento, "svg", {
      "class": "grafico-barras",
      viewBox: "0 0 " + g.ancho + " " + g.alto,
      width: "100%",
      role: "img",
      "aria-label": config.titulo
    });

    g.marcas.forEach(function (marca) {
      svg.appendChild(nodoSvg(documento, "line", {
        "class": "grafico-guia",
        x1: coord(g.area.x), x2: coord(g.area.x + g.area.ancho),
        y1: coord(marca.y), y2: coord(marca.y),
        stroke: "currentColor", "stroke-opacity": 0.15
      }));
      svg.appendChild(nodoSvg(documento, "text", {
        "class": "grafico-eje",
        x: coord(g.area.x - 6), y: coord(marca.y + g.letra * 0.35),
        "text-anchor": "end", "font-size": g.letra, fill: "currentColor"
      }, etiquetar(marca.valor)));
    });

    g.barras.forEach(function (barra) {
      var rect = nodoSvg(documento, "rect", {
        "class": "barra " + barra.clase,
        x: coord(barra.x), y: coord(barra.y),
        width: coord(barra.ancho), height: coord(barra.alto)
      });
      rect.appendChild(nodoSvg(documento, "title", {}, barra.serie + " · " + barra.categoria + ": " + formatear(barra.valor) + unidad));
      svg.appendChild(rect);
    });

    // La línea del cero va arriba de las barras para que se vea siempre.
    svg.appendChild(nodoSvg(documento, "line", {
      "class": "grafico-cero",
      x1: coord(g.area.x), x2: coord(g.area.x + g.area.ancho),
      y1: coord(g.ceroY), y2: coord(g.ceroY),
      stroke: "currentColor", "stroke-width": 1.5
    }));

    // La línea de referencia va después de la del cero: punteada (por CSS), con su nombre como
    // title y su etiqueta en el margen derecho, con la misma letra que el resto del gráfico.
    if (g.referencia) {
      var linea = nodoSvg(documento, "line", {
        "class": "grafico-referencia",
        x1: coord(g.area.x), x2: coord(g.area.x + g.area.ancho),
        y1: coord(g.referencia.y), y2: coord(g.referencia.y),
        stroke: "currentColor", "stroke-width": 1.5
      });
      linea.appendChild(nodoSvg(documento, "title", {}, g.referencia.nombre));
      svg.appendChild(linea);
      svg.appendChild(nodoSvg(documento, "text", {
        "class": "grafico-referencia-texto",
        x: coord(g.area.x + g.area.ancho + 4), y: coord(g.referencia.y + g.letra * 0.35),
        "text-anchor": "start", "font-size": g.letra, fill: "currentColor"
      }, g.referencia.etiqueta));
    }

    if (antesDeCampanas) antesDeCampanas(svg);

    g.grupos.forEach(function (grupo) {
      svg.appendChild(nodoSvg(documento, "text", {
        "class": "grafico-eje",
        x: coord(grupo.x + grupo.ancho / 2), y: coord(g.alto - 10),
        "text-anchor": "middle", "font-size": g.letra, fill: "currentColor"
      }, typeof config.rotularCategoria === "function" ? config.rotularCategoria(grupo.categoria) : grupo.categoria));
    });

    return svg;
  }

  // config: lo de geometriaBarras + { titulo, unidad, formatear(valor), etiquetarEje(valor) }.
  // etiquetarEje (opcional) escribe las marcas del eje; sin él se usa etiquetaEje (1,5 mil, 1,2 M).
  // rotularCategoria (opcional) acorta solo el rótulo visible del eje x; el title de cada barra sigue con el nombre entero.
  function barrasAgrupadas(documento, config) {
    return dibujarBarras(documento, geometriaBarras(config), config, null);
  }

  // Barras con líneas: lo de barrasAgrupadas y, después de la línea del cero, una polilínea por cada tramo
  // de dos o más puntos (continua o, si `discontinua`, de rayas) y un círculo por punto con su title.
  // Las líneas no dependen sólo del color: cada una lleva su propio trazo y el nombre en el title.
  function barrasYLineas(documento, config) {
    var g = geometriaBarrasYLineas(config);
    var formatear = typeof config.formatear === "function" ? config.formatear : String;
    var unidad = config.unidad ? " " + config.unidad : "";
    // `etiquetar` es otro nombre de etiquetarEje (el que usa el resto de los gráficos).
    var opciones = typeof config.etiquetarEje === "function" || typeof config.etiquetar !== "function"
      ? config : Object.assign({}, config, { etiquetarEje: config.etiquetar });
    return dibujarBarras(documento, g, opciones, function (svg) {
      g.lineas.forEach(function (linea) {
        linea.tramos.forEach(function (tramo) {
          if (tramo.length < 2) return;
          var atributos = {
            "class": "linea " + linea.clase,
            points: tramo.map(function (punto) { return coord(punto.x) + "," + coord(punto.y); }).join(" "),
            fill: "none",
            "stroke-width": 2
          };
          if (linea.discontinua) atributos["stroke-dasharray"] = "6 4";
          var polilinea = nodoSvg(documento, "polyline", atributos);
          polilinea.appendChild(nodoSvg(documento, "title", {}, linea.serie));
          svg.appendChild(polilinea);
        });
      });
      g.lineas.forEach(function (linea) {
        linea.puntos.forEach(function (punto) {
          var circulo = nodoSvg(documento, "circle", {
            "class": "punto " + linea.clase,
            cx: coord(punto.x), cy: coord(punto.y), r: 3.5
          });
          circulo.appendChild(nodoSvg(documento, "title", {}, linea.serie + " · " + punto.categoria + ": " + formatear(punto.valor) + unidad));
          svg.appendChild(circulo);
        });
      });
    });
  }

  // ---------------------------------------------------------------------------------------
  // Gráfico de líneas: una línea por serie sobre un eje x numérico (por ejemplo, la parte cubierta de 0 a 1).
  // ---------------------------------------------------------------------------------------

  var MARGEN_LINEAS = { arriba: 12, derecha: 54, abajo: 30, izquierda: 52 };

  // Las etiquetas del final de cada línea no se pisan: ordenadas por y, quedan separadas al menos una letra.
  // Si al separarlas la de más abajo se sale del área, se suben desde el final.
  function separarEtiquetas(etiquetas, limiteInferior) {
    var orden = etiquetas.slice().sort(function (a, b) { return a.y - b.y; });
    var i;
    for (i = 1; i < orden.length; i++) {
      if (orden[i].y - orden[i - 1].y < LETRA) orden[i].y = orden[i - 1].y + LETRA;
    }
    var ultima = orden.length - 1;
    if (ultima >= 0 && orden[ultima].y > limiteInferior) {
      orden[ultima].y = limiteInferior;
      for (i = ultima - 1; i >= 0; i--) {
        if (orden[i + 1].y - orden[i].y < LETRA) orden[i].y = orden[i + 1].y - LETRA;
      }
    }
  }

  // config: { xs, series: [{nombre, clase, valores}], marcaX, marcasX, ancho, alto, margen }.
  // xs: los valores de x, crecientes (por lo menos dos). Cada serie trae un valor por cada x.
  // marcaX (opcional): uno de los xs, que se marca con una línea vertical y un punto por serie.
  // marcasX (opcional): los x que llevan su marca abajo (por defecto, el primero y el último).
  // El eje y siempre incluye el 0: así se ve cuánto baja de verdad una línea.
  function geometriaLineas(config) {
    if (config === null || typeof config !== "object") throw new Error("geometriaLineas: falta la configuración");
    var xs = config.xs;
    var series = config.series;
    if (!Array.isArray(xs) || xs.length < 2) throw new Error("geometriaLineas: xs tiene que tener al menos dos valores");
    xs.forEach(function (x, i) {
      if (!esFinito(x)) throw new Error("geometriaLineas: el valor " + (i + 1) + " de xs no es un número (" + x + ")");
      if (i > 0 && !(x > xs[i - 1])) throw new Error("geometriaLineas: xs tiene que ir creciendo (el valor " + (i + 1) + " es " + x + " y el anterior " + xs[i - 1] + ")");
    });
    if (!Array.isArray(series) || series.length === 0) throw new Error("geometriaLineas: hace falta al menos una serie");
    var ancho = config.ancho === undefined ? 420 : config.ancho;
    var alto = config.alto === undefined ? 260 : config.alto;
    var margen = Object.assign({}, MARGEN_LINEAS, config.margen || {});

    var minimo = 0;
    var maximo = 0;
    series.forEach(function (serie) {
      if (!Array.isArray(serie.valores) || serie.valores.length !== xs.length) {
        throw new Error("geometriaLineas: la serie «" + serie.nombre + "» tiene que traer un valor por cada x (" + xs.length + ")");
      }
      serie.valores.forEach(function (v, i) {
        if (!esFinito(v)) {
          throw new Error("geometriaLineas: el valor de la serie «" + serie.nombre + "» en x = " + xs[i] + " no es un número (" + v + ")");
        }
        if (v < minimo) minimo = v;
        if (v > maximo) maximo = v;
      });
    });
    if (minimo === 0 && maximo === 0) maximo = 1; // todo en cero: dominio [0, 1]

    var indiceMarca = -1;
    if (config.marcaX !== undefined && config.marcaX !== null) {
      for (var j = 0; j < xs.length; j++) if (Math.abs(xs[j] - config.marcaX) < 1e-9) indiceMarca = j;
      if (indiceMarca < 0) throw new Error("geometriaLineas: marcaX (" + config.marcaX + ") tiene que ser uno de los valores de xs");
    }
    var marcasPedidas = config.marcasX === undefined || config.marcasX === null ? [xs[0], xs[xs.length - 1]] : config.marcasX;
    marcasPedidas.forEach(function (x) {
      if (!esFinito(x) || x < xs[0] - 1e-9 || x > xs[xs.length - 1] + 1e-9) {
        throw new Error("geometriaLineas: las marcasX tienen que estar entre " + xs[0] + " y " + xs[xs.length - 1] + " (llegó " + x + ")");
      }
    });

    var area = {
      x: margen.izquierda,
      y: margen.arriba,
      ancho: ancho - margen.izquierda - margen.derecha,
      alto: alto - margen.arriba - margen.abajo
    };
    var eje = ejeVertical(minimo, maximo, area);
    var escalaX = function (x) { return area.x + area.ancho * (x - xs[0]) / (xs[xs.length - 1] - xs[0]); };

    var trazos = series.map(function (serie) {
      return {
        nombre: serie.nombre,
        clase: serie.clase,
        puntos: serie.valores.map(function (v, i) {
          return { valorX: xs[i], valor: v, x: escalaX(xs[i]), y: eje.escala(v) };
        })
      };
    });
    var marca = null;
    if (indiceMarca >= 0) {
      marca = {
        valorX: xs[indiceMarca],
        x: escalaX(xs[indiceMarca]),
        puntos: trazos.map(function (linea) {
          var punto = linea.puntos[indiceMarca];
          return { serie: linea.nombre, clase: linea.clase, valor: punto.valor, x: punto.x, y: punto.y };
        })
      };
    }
    // Una etiqueta por serie, a la derecha de su último punto (con el nombre de la serie al final de la línea).
    var etiquetas = trazos.map(function (linea) {
      var ultimo = linea.puntos[linea.puntos.length - 1];
      return { serie: linea.nombre, clase: linea.clase, x: ultimo.x + 6, y: ultimo.y + 4 };
    });
    separarEtiquetas(etiquetas, area.y + area.alto);

    return {
      ancho: ancho,
      alto: alto,
      letra: LETRA,
      area: area,
      ceroY: eje.ceroY,
      marcas: eje.marcas,
      marcasX: marcasPedidas.map(function (x) { return { valor: x, x: escalaX(x) }; }),
      series: trazos,
      marca: marca,
      etiquetas: etiquetas
    };
  }

  // config: lo de geometriaLineas + { titulo, unidad, formatear(valor), etiquetarEje(valor), etiquetarX(x) }.
  function lineas(documento, config) {
    var g = geometriaLineas(config);
    var formatear = typeof config.formatear === "function" ? config.formatear : String;
    var etiquetar = typeof config.etiquetarEje === "function" ? config.etiquetarEje : etiquetaEje;
    var etiquetarX = typeof config.etiquetarX === "function" ? config.etiquetarX : String;
    var unidad = config.unidad ? " " + config.unidad : "";

    var svg = nodoSvg(documento, "svg", {
      "class": "grafico-lineas",
      viewBox: "0 0 " + g.ancho + " " + g.alto,
      width: "100%",
      role: "img",
      "aria-label": config.titulo
    });

    g.marcas.forEach(function (marcaY) {
      svg.appendChild(nodoSvg(documento, "line", {
        "class": "grafico-guia",
        x1: coord(g.area.x), x2: coord(g.area.x + g.area.ancho),
        y1: coord(marcaY.y), y2: coord(marcaY.y),
        stroke: "currentColor", "stroke-opacity": 0.15
      }));
      svg.appendChild(nodoSvg(documento, "text", {
        "class": "grafico-eje",
        x: coord(g.area.x - 6), y: coord(marcaY.y + g.letra * 0.35),
        "text-anchor": "end", "font-size": g.letra, fill: "currentColor"
      }, etiquetar(marcaY.valor)));
    });

    g.marcasX.forEach(function (marcaX) {
      svg.appendChild(nodoSvg(documento, "text", {
        "class": "grafico-eje",
        x: coord(marcaX.x), y: coord(g.alto - 10),
        "text-anchor": "middle", "font-size": g.letra, fill: "currentColor"
      }, etiquetarX(marcaX.valor)));
    });

    svg.appendChild(nodoSvg(documento, "line", {
      "class": "grafico-cero",
      x1: coord(g.area.x), x2: coord(g.area.x + g.area.ancho),
      y1: coord(g.ceroY), y2: coord(g.ceroY),
      stroke: "currentColor", "stroke-width": 1.5
    }));

    g.series.forEach(function (serie) {
      var polilinea = nodoSvg(documento, "polyline", {
        "class": "linea " + serie.clase,
        points: serie.puntos.map(function (punto) { return coord(punto.x) + "," + coord(punto.y); }).join(" "),
        fill: "none"
      });
      polilinea.appendChild(nodoSvg(documento, "title", {}, serie.nombre));
      svg.appendChild(polilinea);
    });

    if (g.marca) {
      svg.appendChild(nodoSvg(documento, "line", {
        "class": "grafico-marca",
        x1: coord(g.marca.x), x2: coord(g.marca.x),
        y1: coord(g.area.y), y2: coord(g.area.y + g.area.alto),
        stroke: "currentColor"
      }));
      g.marca.puntos.forEach(function (punto) {
        var circulo = nodoSvg(documento, "circle", {
          "class": "punto " + punto.clase,
          cx: coord(punto.x), cy: coord(punto.y), r: 4
        });
        circulo.appendChild(nodoSvg(documento, "title", {}, punto.serie + " · " + etiquetarX(g.marca.valorX) + ": " + formatear(punto.valor) + unidad));
        svg.appendChild(circulo);
      });
    }

    g.etiquetas.forEach(function (etiqueta) {
      svg.appendChild(nodoSvg(documento, "text", {
        "class": "grafico-etiqueta-serie " + etiqueta.clase,
        x: coord(etiqueta.x), y: coord(etiqueta.y),
        "text-anchor": "start", "font-size": g.letra
      }, etiqueta.serie));
    });

    return svg;
  }

  var api = {
    SVG_NS: SVG_NS,
    geometriaBarras: geometriaBarras,
    etiquetaEje: etiquetaEje,
    barrasAgrupadas: barrasAgrupadas,
    etiquetaPorcentaje: etiquetaPorcentaje,
    geometriaBarrasYLineas: geometriaBarrasYLineas,
    barrasYLineas: barrasYLineas,
    geometriaLineas: geometriaLineas,
    lineas: lineas
  };
  raiz.TESIS_GRAFICOS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
