// Cifras oficiales de la tesis que la página muestra como «el resultado de la tesis». Se cargan a mano (no las genera
// herramientas/extraer_datos.py ni están en datos.js): salen del procesamiento estadístico de la tesis o de su Excel.
(function (raiz) {
  "use strict";
  var cifras = {
    // Rinde fijo, cobertura del 100 %, 114 casos: reducción del desvío de la rentabilidad realizada respecto de la proyectada
    // (3,06 p.p. sin cobertura, 0,16 p.p. con cobertura). Por cultivo: trigo 96,5 %, soja 92,5 %, maíz 95,4 %.
    reduccionRindeFijo: {
      v: 0.947,
      o: "Tesis › procesamiento estadístico › 114 casos, rinde fijo, cobertura del 100 % (desvío 3,06 p.p. sin cobertura y 0,16 p.p. con cobertura)"
    },
    // Mismo procesamiento (rinde fijo, rentabilidad, 114 casos), por cultivo. Con cobertura del 100 %: trigo 96,5 %, soja 92,5 %, maíz 95,4 %.
    reduccionRindeFijoPorCultivo: {
      trigo: { v: 0.965, o: "Tesis › procesamiento estadístico › trigo, rinde fijo, cobertura del 100 % (reducción del desvío de la rentabilidad)" },
      soja: { v: 0.925, o: "Tesis › procesamiento estadístico › soja, rinde fijo, cobertura del 100 % (reducción del desvío de la rentabilidad)" },
      maiz: { v: 0.954, o: "Tesis › procesamiento estadístico › maíz, rinde fijo, cobertura del 100 % (reducción del desvío de la rentabilidad)" }
    },
    // Con cobertura del 50 %: total 49,0 %; trigo 50,8 %, soja 48,0 %, maíz 48,9 %.
    reduccionRindeFijo50: {
      v: 0.490,
      o: "Tesis › procesamiento estadístico › 114 casos, rinde fijo, cobertura del 50 % (reducción del desvío de la rentabilidad)"
    },
    reduccionRindeFijo50PorCultivo: {
      trigo: { v: 0.508, o: "Tesis › procesamiento estadístico › trigo, rinde fijo, cobertura del 50 %" },
      soja: { v: 0.480, o: "Tesis › procesamiento estadístico › soja, rinde fijo, cobertura del 50 %" },
      maiz: { v: 0.489, o: "Tesis › procesamiento estadístico › maíz, rinde fijo, cobertura del 50 %" }
    },
    // CAGR 2020→2026 de las 8 zonas ponderadas (valor exacto 4,51 %).
    valorizacionTierra: {
      v: 0.04506203022,
      o: "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › g_Implicito › K50 (valorización anual 2020→2026, 8 zonas ponderadas)"
    }
  };
  raiz.TESIS_CIFRAS = cifras;
  if (typeof module !== "undefined" && module.exports) module.exports = cifras;
})(typeof window !== "undefined" ? window : globalThis);
