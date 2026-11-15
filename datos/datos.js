// Generado por pagina/simulador/herramientas/extraer_datos.py — no editar a mano: volver a correr el script.
(function (raiz) {
// --- inicio de datos (JSON) ---
var datos = {
 "meta": {
  "generadoPor": "pagina/simulador/herramientas/extraer_datos.py",
  "extraidoEl": "2026-11-14T21:00:52-03:00",
  "carpeta": "EXCLES Para WEB",
  "aviso": "Datos de los Excels definitivos del grupo (carpeta EXCLES Para WEB), pendientes de integrar a consolidado/",
  "archivos": {
   "COB": {
    "nombre": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx",
    "modificado": "2026-11-14T12:26:30-03:00",
    "sha256": "95ce8391b7908cf31e8fecb0a730c5de5e9eb04b4965e870b13e2d2d12273e32",
    "uso": "leído"
   },
   "RENT": {
    "nombre": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx",
    "modificado": "2026-11-12T13:07:38-03:00",
    "sha256": "f4f69ed37c91507eb89a1373cefe0512d2c437bf17274ac78d725f28b95cf38c",
    "uso": "leído"
   },
   "CAPM": {
    "nombre": "CAPM_K_Anual_TIF (3).xlsx",
    "modificado": "2026-11-12T12:21:18-03:00",
    "sha256": "b869a1aa81c9707c01b600a231262a3b59d505db87724690354782127955ca4c",
    "uso": "leído"
   },
   "TIF01": {
    "nombre": "TIF_01_Rindes_y_costos (2).xlsx",
    "modificado": "2026-11-14T12:26:27-03:00",
    "sha256": "c10d0e39be0f8321d22761a6e25d92e3120b96a30842bd0110c2dab8d517d3f4",
    "uso": "citado en los textos de origen"
   }
  }
 },
 "parametros": {
  "comision": {
   "v": 0.005,
   "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Parametros › B5"
  },
  "h": {
   "v": 1,
   "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Parametros › B7"
  },
  "umbralCaidaRinde": {
   "v": -0.2,
   "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Parametros › B8"
  },
  "reduccionHipotesis": {
   "v": 0.5,
   "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Parametros › B9"
  }
 },
 "campos": {
  "cultivo": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "A",
   "fila": "fila"
  },
  "zona": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "B",
   "fila": "fila"
  },
  "campana": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "C",
   "fila": "fila"
  },
  "rindeEsperado": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "E",
   "fila": "fila"
  },
  "rindeReal": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "F",
   "fila": "fila"
  },
  "fs": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "H",
   "fila": "fila"
  },
  "sc": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "I",
   "fila": "fila"
  },
  "fc": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "J",
   "fila": "fila"
  },
  "gc": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "K",
   "fila": "fila"
  },
  "cd": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "L",
   "fila": "fila"
  },
  "tabla.rindeBajo": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "M",
   "fila": "fila"
  },
  "tabla.rindeAlto": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "N",
   "fila": "fila"
  },
  "tabla.costoBajo": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "O",
   "fila": "fila"
  },
  "tabla.costoAlto": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "P",
   "fila": "fila"
  },
  "tabla.piso": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "Q",
   "fila": "fila"
  },
  "v": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "Z",
   "fila": "fila"
  },
  "excel.desvioRinde": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "G",
   "fila": "fila"
  },
  "excel.cosechaEsperado": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "R",
   "fila": "fila"
  },
  "excel.cosechaReal": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "S",
   "fila": "fila"
  },
  "excel.mbProyectado": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "T",
   "fila": "fila"
  },
  "excel.mbRealSin": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "U",
   "fila": "fila"
  },
  "excel.futuro": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "V",
   "fila": "fila"
  },
  "excel.mbRealCon": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "W",
   "fila": "fila"
  },
  "excel.sorpresaSin": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "X",
   "fila": "fila"
  },
  "excel.sorpresaCon": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "Y",
   "fila": "fila"
  },
  "excel.rProyectada": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AA",
   "fila": "fila"
  },
  "excel.rRealSin": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AB",
   "fila": "fila"
  },
  "excel.rRealCon": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AC",
   "fila": "fila"
  },
  "excel.sorpresaRSin": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AD",
   "fila": "fila"
  },
  "excel.sorpresaRCon": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AE",
   "fila": "fila"
  },
  "origenTexto.rindes": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AF",
   "fila": "fila"
  },
  "origenTexto.cosecha": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AG",
   "fila": "fila"
  },
  "origenTexto.tierra": {
   "archivo": "COB",
   "hoja": "RR_Margenes",
   "columna": "AH",
   "fila": "fila"
  },
  "anioCosecha": {
   "archivo": "COB",
   "hoja": "Datos_Completos",
   "columna": "C",
   "fila": "filaDC"
  },
  "rindePlanteo": {
   "archivo": "COB",
   "hoja": "Datos_Completos",
   "columna": "E",
   "fila": "filaDC"
  },
  "cosechaPlanteo": {
   "archivo": "COB",
   "hoja": "Datos_Completos",
   "columna": "V",
   "fila": "filaDC"
  },
  "excel.comisionPlanteo": {
   "archivo": "COB",
   "hoja": "Datos_Completos",
   "columna": "Q",
   "fila": "filaDC"
  },
  "excel.mbCoberturaPlanteo": {
   "archivo": "COB",
   "hoja": "Datos_Completos",
   "columna": "R",
   "fila": "filaDC"
  },
  "excel.mbSpotPlanteo": {
   "archivo": "COB",
   "hoja": "Datos_Completos",
   "columna": "S",
   "fila": "filaDC"
  }
 },
 "casos": [
  {
   "id": "Trigo|Norte BA / Sur SF|2020/21",
   "fila": 5,
   "filaDC": 5,
   "cultivo": "Trigo",
   "zona": "Norte BA / Sur SF",
   "campana": "2020/21",
   "rindeEsperado": 41.1249751192516,
   "rindeReal": 33.16990759895187,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 30.7,
   "cd": 249,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 50,
    "costoAlto": 60,
    "piso": 50
   },
   "v": 6915.4947915,
   "excel": {
    "desvioRinde": -0.1934364093165315,
    "cosechaEsperado": 56.1249751192516,
    "cosechaReal": 50,
    "mbProyectado": 255.24101919076935,
    "mbRealSin": 367.4663684319405,
    "futuro": -279.07616074131596,
    "mbRealCon": 88.39020769062455,
    "sorpresaSin": 112.22534924117116,
    "sorpresaCon": -166.8508115001448,
    "rProyectada": 0.03690856936288813,
    "rRealSin": 0.0531366705508335,
    "rRealCon": 0.012781472671957915,
    "sorpresaRSin": 0.01622810118794537,
    "sorpresaRCon": -0.024127096690930216,
    "comisionPlanteo": 3.33918581560284,
    "mbCoberturaPlanteo": 228.25797730496515,
    "mbSpotPlanteo": 499.70000000000005
   },
   "origenTexto": {
    "rindes": "esperado C30 · real M6",
    "cosecha": "fila 5 (F, G, I, J, O)",
    "tierra": "fila 5 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 40,
   "cosechaPlanteo": 55
  },
  {
   "id": "Trigo|Norte BA / Sur SF|2021/22",
   "fila": 6,
   "filaDC": 12,
   "cultivo": "Trigo",
   "zona": "Norte BA / Sur SF",
   "campana": "2021/22",
   "rindeEsperado": 39.81478716276902,
   "rindeReal": 47.04799846711482,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 38.3,
   "cd": 326,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 73,
    "costoAlto": 91,
    "piso": 55
   },
   "v": 7161.1458335,
   "excel": {
    "desvioRinde": 0.18167147986438592,
    "cosechaEsperado": 81.66661689298424,
    "cosechaReal": 95.14150801127666,
    "mbProyectado": 268.22669536404766,
    "mbRealSin": 534.2241103854757,
    "futuro": -134.78559876511224,
    "mbRealCon": 399.43851162036344,
    "sorpresaSin": 265.997415021428,
    "sorpresaCon": 131.21181625631579,
    "rProyectada": 0.03745583480639051,
    "rRealSin": 0.0746003674281235,
    "rRealCon": 0.05577857523188275,
    "sorpresaRSin": 0.03714453262173299,
    "sorpresaRCon": 0.018322740425492243,
    "comisionPlanteo": 4.16118736842106,
    "mbCoberturaPlanteo": 268.8350164745229,
    "mbSpotPlanteo": 404.24761904762
   },
   "origenTexto": {
    "rindes": "esperado D30 · real N6",
    "cosecha": "fila 24 (F, G, I, J, O)",
    "tierra": "fila 12 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 40,
   "cosechaPlanteo": 82
  },
  {
   "id": "Trigo|Norte BA / Sur SF|2022/23",
   "fila": 7,
   "filaDC": 19,
   "cultivo": "Trigo",
   "zona": "Norte BA / Sur SF",
   "campana": "2022/23",
   "rindeEsperado": 40.51872889215618,
   "rindeReal": 18.49538162372387,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 47.9,
   "cd": 531,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 83,
    "costoAlto": 102,
    "piso": 59
   },
   "v": 7575.2083335,
   "excel": {
    "desvioRinde": -0.5435349990136463,
    "cosechaEsperado": 93.48558489509675,
    "cosechaReal": 59,
    "mbProyectado": 486.1402139185027,
    "mbRealSin": -104.47941839395395,
    "futuro": 43.997236014119395,
    "mbRealCon": -60.482182379834555,
    "sorpresaSin": -590.6196323124566,
    "sorpresaCon": -546.6223962983372,
    "rProyectada": 0.0641751609349983,
    "rRealSin": -0.013792283168228187,
    "rRealCon": -0.007984226930414964,
    "sorpresaRSin": -0.07796744410322647,
    "sorpresaRCon": -0.07215938786541325,
    "comisionPlanteo": 6.440036723163841,
    "mbCoberturaPlanteo": 469.97033821263625,
    "mbSpotPlanteo": 426.53636363636406
   },
   "origenTexto": {
    "rindes": "esperado E30 · real O6",
    "cosecha": "fila 43 (F, G, I, J, O)",
    "tierra": "fila 19 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 40,
   "cosechaPlanteo": 92.5
  },
  {
   "id": "Trigo|Norte BA / Sur SF|2023/24",
   "fila": 8,
   "filaDC": 26,
   "cultivo": "Trigo",
   "zona": "Norte BA / Sur SF",
   "campana": "2023/24",
   "rindeEsperado": 35.36414808634185,
   "rindeReal": 36.19215714071939,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 42.7,
   "cd": 396,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 71,
    "costoAlto": 86,
    "piso": 65
   },
   "v": 7836.0677085,
   "excel": {
    "desvioRinde": 0.023413798979575295,
    "cosechaEsperado": 71.54622212951277,
    "cosechaReal": 72.78823571107908,
    "mbProyectado": 194.42209102002175,
    "mbRealSin": 183.42733792572164,
    "futuro": 22.134651425463673,
    "mbRealCon": 205.56198935118533,
    "sorpresaSin": -10.994753094300108,
    "sorpresaCon": 11.139898331163579,
    "rProyectada": 0.02481118058859123,
    "rRealSin": 0.0234080848646513,
    "rRealCon": 0.026232799025997,
    "sorpresaRSin": -0.001403095723939929,
    "sorpresaRCon": 0.0014216184374057695,
    "comisionPlanteo": 4.59772549019608,
    "mbCoberturaPlanteo": 271.37262507427187,
    "mbSpotPlanteo": 246.336363636364
   },
   "origenTexto": {
    "rindes": "esperado F30 · real P6",
    "cosecha": "fila 62 (F, G, I, J, O)",
    "tierra": "fila 26 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 40,
   "cosechaPlanteo": 78.5
  },
  {
   "id": "Trigo|Norte BA / Sur SF|2024/25",
   "fila": 9,
   "filaDC": 33,
   "cultivo": "Trigo",
   "zona": "Norte BA / Sur SF",
   "campana": "2024/25",
   "rindeEsperado": 34.86313613282796,
   "rindeReal": 36.81843067207141,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 46.6,
   "cd": 356,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 78,
    "costoAlto": 96,
    "piso": 65
   },
   "v": 8410.4166665,
   "excel": {
    "desvioRinde": 0.05608487233603454,
    "cosechaEsperado": 77.6949890960166,
    "cosechaReal": 81.27317520972854,
    "mbProyectado": 206.14094522247646,
    "mbRealSin": 111.95739651574293,
    "futuro": 110.30853892016789,
    "mbRealCon": 222.26593543591082,
    "sorpresaSin": -94.18354870673353,
    "sorpresaCon": 16.12499021343436,
    "rProyectada": 0.02451019413147127,
    "rRealSin": 0.013311753858960008,
    "rRealCon": 0.026427458263896805,
    "sorpresaRSin": -0.011198440272511264,
    "sorpresaRCon": 0.0019172641324255322,
    "comisionPlanteo": 4.60255867768596,
    "mbCoberturaPlanteo": 280.252717529362,
    "mbSpotPlanteo": 153.690909090908
   },
   "origenTexto": {
    "rindes": "esperado G30 · real Q6",
    "cosecha": "fila 81 (F, G, I, J, O)",
    "tierra": "fila 33 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 40,
   "cosechaPlanteo": 87
  },
  {
   "id": "Trigo|Norte BA / Sur SF|2025/26",
   "fila": 10,
   "filaDC": 40,
   "cultivo": "Trigo",
   "zona": "Norte BA / Sur SF",
   "campana": "2025/26",
   "rindeEsperado": 34.34477510051627,
   "rindeReal": 53.72769535789978,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 47.7,
   "cd": 440,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 77,
    "costoAlto": 96,
    "piso": 75
   },
   "v": 9427.8645835,
   "excel": {
    "desvioRinde": 0.564362998466458,
    "cosechaEsperado": 75.5585052211358,
    "cosechaReal": 114.6190834301862,
    "mbProyectado": 21.13445288738201,
    "mbRealSin": 161.1873264380592,
    "futuro": 75.45532957747763,
    "mbRealCon": 236.64265601553683,
    "sorpresaSin": 140.0528735506772,
    "sorpresaCon": 215.50820312815483,
    "rProyectada": 0.002241700938765081,
    "rRealSin": 0.01709690725937644,
    "rRealCon": 0.025100345249940533,
    "sorpresaRSin": 0.01485520632061136,
    "sorpresaRCon": 0.022858644311175454,
    "comisionPlanteo": 4.07932521489972,
    "mbCoberturaPlanteo": 94.29412112638822,
    "mbSpotPlanteo": 6.414285714284006
   },
   "origenTexto": {
    "rindes": "esperado H30 · real R6",
    "cosecha": "fila 100 (F, G, I, J, O)",
    "tierra": "fila 40 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 40,
   "cosechaPlanteo": 86.5
  },
  {
   "id": "Trigo|Sur Entre Ríos|2020/21",
   "fila": 11,
   "filaDC": 6,
   "cultivo": "Trigo",
   "zona": "Sur Entre Ríos",
   "campana": "2020/21",
   "rindeEsperado": 31.6503045591396,
   "rindeReal": 25.82788148655592,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 24.9,
   "cd": 263,
   "tabla": {
    "rindeBajo": 30,
    "rindeAlto": 38,
    "costoBajo": 50,
    "costoAlto": 54,
    "piso": 50
   },
   "v": 5500,
   "excel": {
    "desvioRinde": -0.18396104409372416,
    "cosechaEsperado": 50.8251522795698,
    "cosechaReal": 50,
    "mbProyectado": 135.79682958511677,
    "mbRealSin": 220.9268800308273,
    "futuro": -214.78056721116843,
    "mbRealCon": 6.146312819658874,
    "sorpresaSin": 85.13005044571054,
    "sorpresaCon": -129.6505167654579,
    "rProyectada": 0.02469033265183941,
    "rRealSin": 0.0401685236419686,
    "rRealCon": 0.001117511421756159,
    "sorpresaRSin": 0.015478190990129188,
    "sorpresaRCon": -0.023572821230083252,
    "comisionPlanteo": 2.8383079432624143,
    "mbCoberturaPlanteo": 157.13928070922032,
    "mbSpotPlanteo": 387.865
   },
   "origenTexto": {
    "rindes": "esperado C31 · real M7",
    "cosecha": "fila 6 (F, G, I, J, O)",
    "tierra": "fila 6 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 34,
   "cosechaPlanteo": 52
  },
  {
   "id": "Trigo|Sur Entre Ríos|2021/22",
   "fila": 12,
   "filaDC": 13,
   "cultivo": "Trigo",
   "zona": "Sur Entre Ríos",
   "campana": "2021/22",
   "rindeEsperado": 30.41016146413621,
   "rindeReal": 35.44758735440931,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 30.8,
   "cd": 340,
   "tabla": {
    "rindeBajo": 30,
    "rindeAlto": 38,
    "costoBajo": 64,
    "costoAlto": 79,
    "piso": 55
   },
   "v": 5325,
   "excel": {
    "desvioRinde": 0.16564942926113413,
    "cosechaEsperado": 64.7690527452554,
    "cosechaReal": 74.21422628951746,
    "mbProyectado": 134.2795487262474,
    "mbRealSin": 332.1769249663266,
    "futuro": -102.94797771316972,
    "mbRealCon": 229.2289472531569,
    "sorpresaSin": 197.8973762400792,
    "sorpresaCon": 94.94939852690948,
    "rProyectada": 0.025216816662206088,
    "rRealSin": 0.062380643186164625,
    "rRealCon": 0.04304768962500599,
    "sorpresaRSin": 0.03716382652395854,
    "sorpresaRCon": 0.017830872962799903,
    "comisionPlanteo": 3.537009263157901,
    "mbCoberturaPlanteo": 189.30976400334438,
    "mbSpotPlanteo": 304.41047619047697
   },
   "origenTexto": {
    "rindes": "esperado D31 · real N7",
    "cosecha": "fila 25 (F, G, I, J, O)",
    "tierra": "fila 13 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 34,
   "cosechaPlanteo": 71.5
  },
  {
   "id": "Trigo|Sur Entre Ríos|2022/23",
   "fila": 13,
   "filaDC": 20,
   "cultivo": "Trigo",
   "zona": "Sur Entre Ríos",
   "campana": "2022/23",
   "rindeEsperado": 30.91079212142076,
   "rindeReal": 33.06566970091027,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 38.7,
   "cd": 547,
   "tabla": {
    "rindeBajo": 30,
    "rindeAlto": 38,
    "costoBajo": 72,
    "costoAlto": 90,
    "piso": 59
   },
   "v": 5575,
   "excel": {
    "desvioRinde": 0.06971279063392921,
    "cosechaEsperado": 74.04928227319671,
    "cosechaReal": 78.89775682704811,
    "mbProyectado": 254.65913423707104,
    "mbRealSin": 272.52654864641244,
    "futuro": 33.56446397835558,
    "mbRealCon": 306.09101262476804,
    "sorpresaSin": 17.867414409341393,
    "sorpresaCon": 51.431878387697,
    "rProyectada": 0.045678768473017224,
    "rRealSin": 0.048883685855858734,
    "rRealCon": 0.054904217511169154,
    "sorpresaRSin": 0.0032049173828415053,
    "sorpresaRCon": 0.009225449038151928,
    "comisionPlanteo": 5.474031214689265,
    "mbCoberturaPlanteo": 332.7297874807407,
    "mbSpotPlanteo": 295.8109090909094
   },
   "origenTexto": {
    "rindes": "esperado E31 · real O7",
    "cosecha": "fila 44 (F, G, I, J, O)",
    "tierra": "fila 20 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 34,
   "cosechaPlanteo": 81
  },
  {
   "id": "Trigo|Sur Entre Ríos|2023/24",
   "fila": 14,
   "filaDC": 27,
   "cultivo": "Trigo",
   "zona": "Sur Entre Ríos",
   "campana": "2023/24",
   "rindeEsperado": 32.03667574949296,
   "rindeReal": 33.56667693255312,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 34.1,
   "cd": 419,
   "tabla": {
    "rindeBajo": 30,
    "rindeAlto": 38,
    "costoBajo": 68,
    "costoAlto": 77,
    "piso": 65
   },
   "v": 5575,
   "excel": {
    "desvioRinde": 0.04775780093489823,
    "cosechaEsperado": 70.29126021817957,
    "cosechaReal": 72.01251154912227,
    "mbProyectado": 137.94287904900136,
    "mbRealSin": 142.75686409832866,
    "futuro": 20.051964741644788,
    "mbRealCon": 162.80882883997344,
    "sorpresaSin": 4.8139850493273,
    "sorpresaCon": 24.86594979097208,
    "rProyectada": 0.024743117318206522,
    "rRealSin": 0.025606612394319044,
    "rRealCon": 0.029203377370398825,
    "sorpresaRSin": 0.0008634950761125202,
    "sorpresaRCon": 0.0044602600521923014,
    "comisionPlanteo": 3.9080666666666684,
    "mbCoberturaPlanteo": 171.73173131313112,
    "mbSpotPlanteo": 150.45090909090936
   },
   "origenTexto": {
    "rindes": "esperado F31 · real P7",
    "cosecha": "fila 63 (F, G, I, J, O)",
    "tierra": "fila 27 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 34,
   "cosechaPlanteo": 72.5
  },
  {
   "id": "Trigo|Sur Entre Ríos|2024/25",
   "fila": 15,
   "filaDC": 34,
   "cultivo": "Trigo",
   "zona": "Sur Entre Ríos",
   "campana": "2024/25",
   "rindeEsperado": 31.36960678141571,
   "rindeReal": 32.50235725510738,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 35.2,
   "cd": 375,
   "tabla": {
    "rindeBajo": 30,
    "rindeAlto": 38,
    "costoBajo": 74,
    "costoAlto": 85,
    "piso": 65
   },
   "v": 5875,
   "excel": {
    "desvioRinde": 0.03610980786545093,
    "cosechaEsperado": 75.8832093244466,
    "cosechaReal": 77.44074122577264,
    "mbProyectado": 160.5980543419761,
    "mbRealSin": 69.4584734987369,
    "futuro": 99.25485410647904,
    "mbRealCon": 168.71332760521594,
    "sorpresaSin": -91.13958084323922,
    "sorpresaCon": 8.115273263239828,
    "rProyectada": 0.027335839036932104,
    "rRealSin": 0.011822718893402024,
    "rRealCon": 0.02871716214556867,
    "sorpresaRSin": -0.015513120143530078,
    "sorpresaRCon": 0.0013813231086365666,
    "comisionPlanteo": 3.912174876033066,
    "mbCoberturaPlanteo": 199.02480989995763,
    "mbSpotPlanteo": 91.44727272727175
   },
   "origenTexto": {
    "rindes": "esperado G31 · real Q7",
    "cosecha": "fila 82 (F, G, I, J, O)",
    "tierra": "fila 34 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 34,
   "cosechaPlanteo": 79.5
  },
  {
   "id": "Trigo|Sur Entre Ríos|2025/26",
   "fila": 16,
   "filaDC": 41,
   "cultivo": "Trigo",
   "zona": "Sur Entre Ríos",
   "campana": "2025/26",
   "rindeEsperado": 32.08203454590721,
   "rindeReal": 38.26148969889065,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 36.1,
   "cd": 431,
   "tabla": {
    "rindeBajo": 30,
    "rindeAlto": 38,
    "costoBajo": 75,
    "costoAlto": 84,
    "piso": 75
   },
   "v": 6875,
   "excel": {
    "desvioRinde": 0.19261419172593475,
    "cosechaEsperado": 77.34228886414562,
    "cosechaReal": 84.57802986070566,
    "mbProyectado": 30.206828767145254,
    "mbRealSin": 38.55765952122614,
    "futuro": 70.48409788949418,
    "mbRealCon": 109.04175741072032,
    "sorpresaSin": 8.350830754080889,
    "sorpresaCon": 78.83492864357507,
    "rProyectada": 0.0043937205479484005,
    "rRealSin": 0.005608386839451075,
    "rRealCon": 0.015860619259741138,
    "sorpresaRSin": 0.0012146662915026747,
    "sorpresaRCon": 0.011466898711792737,
    "comisionPlanteo": 3.467426432664762,
    "mbCoberturaPlanteo": 56.61500295742996,
    "mbSpotPlanteo": -18.082857142858643
   },
   "origenTexto": {
    "rindes": "esperado H31 · real R7",
    "cosecha": "fila 101 (F, G, I, J, O)",
    "tierra": "fila 41 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 34,
   "cosechaPlanteo": 79.5
  },
  {
   "id": "Trigo|Sudeste BA|2020/21",
   "fila": 17,
   "filaDC": 7,
   "cultivo": "Trigo",
   "zona": "Sudeste BA",
   "campana": "2020/21",
   "rindeEsperado": 39.48423412527204,
   "rindeReal": 45.89791343599822,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 26,
   "cd": 263,
   "tabla": {
    "rindeBajo": 41,
    "rindeAlto": 46,
    "costoBajo": 56.5,
    "costoAlto": 62,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": 0.16243646237071308,
    "cosechaEsperado": 54.411200684826106,
    "cosechaReal": 61.88770477959804,
    "mbProyectado": 239.15576324471658,
    "mbRealSin": 618.8881402481154,
    "futuro": -267.9420093882041,
    "mbRealCon": 350.9461308599113,
    "sorpresaSin": 379.7323770033988,
    "sorpresaCon": 111.79036761519473,
    "rProyectada": 0.038320167028664726,
    "rRealSin": 0.09916506541429287,
    "rRealCon": 0.05623244938845323,
    "sorpresaRSin": 0.060844898385628156,
    "sorpresaRCon": 0.017912282359788506,
    "comisionPlanteo": 3.6313645744680882,
    "mbCoberturaPlanteo": 277.0255503191495,
    "mbSpotPlanteo": 572.2187499999999
   },
   "origenTexto": {
    "rindes": "esperado C32 · real M8",
    "cosecha": "fila 7 (F, G, I, J, O)",
    "tierra": "fila 7 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 43.5,
   "cosechaPlanteo": 59.25
  },
  {
   "id": "Trigo|Sudeste BA|2021/22",
   "fila": 18,
   "filaDC": 14,
   "cultivo": "Trigo",
   "zona": "Sudeste BA",
   "campana": "2021/22",
   "rindeEsperado": 40.5131103359037,
   "rindeReal": 42.0546221117873,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 32.05,
   "cd": 342.5,
   "tabla": {
    "rindeBajo": 41,
    "rindeAlto": 46,
    "costoBajo": 82.5,
    "costoAlto": 93,
    "piso": 55
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": 0.03804970201257252,
    "cosechaEsperado": 81.52028299297695,
    "cosechaReal": 84.71470643475334,
    "mbProyectado": 289.04841330650754,
    "mbRealSin": 453.0385993912795,
    "futuro": -137.149642722894,
    "mbRealCon": 315.8889566683855,
    "sorpresaSin": 163.99018608477195,
    "sorpresaCon": 26.840543361877963,
    "rProyectada": 0.045718930497185416,
    "rRealSin": 0.07165733934041223,
    "rRealCon": 0.04996431251617318,
    "sorpresaRSin": 0.025938408843226804,
    "sorpresaRCon": 0.004245382018987762,
    "comisionPlanteo": 4.525291263157903,
    "mbCoberturaPlanteo": 332.9955804160436,
    "mbSpotPlanteo": 480.2567857142867
   },
   "origenTexto": {
    "rindes": "esperado D32 · real N8",
    "cosecha": "fila 26 (F, G, I, J, O)",
    "tierra": "fila 14 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 43.5,
   "cosechaPlanteo": 87.75
  },
  {
   "id": "Trigo|Sudeste BA|2022/23",
   "fila": 19,
   "filaDC": 21,
   "cultivo": "Trigo",
   "zona": "Sudeste BA",
   "campana": "2022/23",
   "rindeEsperado": 42.19182333863522,
   "rindeReal": 26.7517448597041,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 40.3,
   "cd": 551.5,
   "tabla": {
    "rindeBajo": 41,
    "rindeAlto": 46,
    "costoBajo": 90.5,
    "costoAlto": 101.5,
    "piso": 59
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.3659495432327661,
    "cosechaEsperado": 93.12201134499747,
    "cosechaReal": 59.049583165932226,
    "mbProyectado": 543.9293991905627,
    "mbRealSin": 112.03936526272997,
    "futuro": 45.813964555421215,
    "mbRealCon": 157.8533298181512,
    "sorpresaSin": -431.8900339278327,
    "sorpresaCon": -386.07606937241144,
    "rProyectada": 0.08432469207350239,
    "rRealSin": 0.017369322176645982,
    "rRealCon": 0.02447180360080004,
    "sorpresaRSin": -0.06695536989685641,
    "sorpresaRCon": -0.05985288847270235,
    "comisionPlanteo": 7.003539936440676,
    "mbCoberturaPlanteo": 574.7089928062416,
    "mbSpotPlanteo": 527.4745454545457
   },
   "origenTexto": {
    "rindes": "esperado E32 · real O8",
    "cosecha": "fila 45 (F, G, I, J, O)",
    "tierra": "fila 21 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 43.5,
   "cosechaPlanteo": 96
  },
  {
   "id": "Trigo|Sudeste BA|2023/24",
   "fila": 20,
   "filaDC": 28,
   "cultivo": "Trigo",
   "zona": "Sudeste BA",
   "campana": "2023/24",
   "rindeEsperado": 38.69726836446305,
   "rindeReal": 46.93000379802969,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 35.7,
   "cd": 415.5,
   "tabla": {
    "rindeBajo": 41,
    "rindeAlto": 46,
    "costoBajo": 80,
    "costoAlto": 90,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": 0.2127471984851268,
    "cosechaEsperado": 75.50686510139131,
    "cosechaReal": 91.81957264831897,
    "mbProyectado": 260.4409726387262,
    "mbRealSin": 371.2527620906137,
    "futuro": 24.220873192639544,
    "mbRealCon": 395.47363528325326,
    "sorpresaSin": 110.81178945188753,
    "sorpresaCon": 135.03266264452708,
    "rProyectada": 0.03817587261456821,
    "rRealSin": 0.05441884972929345,
    "rRealCon": 0.057969185762243455,
    "sorpresaRSin": 0.01624297711472524,
    "sorpresaRCon": 0.01979331314767525,
    "comisionPlanteo": 5.000026470588237,
    "mbCoberturaPlanteo": 341.0864797682705,
    "mbSpotPlanteo": 313.8595454545458
   },
   "origenTexto": {
    "rindes": "esperado F32 · real P8",
    "cosecha": "fila 64 (F, G, I, J, O)",
    "tierra": "fila 28 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 43.5,
   "cosechaPlanteo": 85
  },
  {
   "id": "Trigo|Sudeste BA|2024/25",
   "fila": 21,
   "filaDC": 35,
   "cultivo": "Trigo",
   "zona": "Sudeste BA",
   "campana": "2024/25",
   "rindeEsperado": 39.56791410982633,
   "rindeReal": 41.62801516869307,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 38.8,
   "cd": 378,
   "tabla": {
    "rindeBajo": 41,
    "rindeAlto": 46,
    "costoBajo": 85.5,
    "costoAlto": 96.5,
    "piso": 65
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.052064939616190964,
    "cosechaEsperado": 82.51357698512565,
    "cosechaReal": 86.88163337112475,
    "mbProyectado": 296.5311484893177,
    "mbRealSin": 188.56467382689527,
    "futuro": 125.19466914692602,
    "mbRealCon": 313.7593429738213,
    "sorpresaSin": -107.9664746624224,
    "sorpresaCon": 17.228194484503604,
    "rProyectada": 0.038910593570557185,
    "rRealSin": 0.02474331422659067,
    "rRealCon": 0.041171264252056215,
    "sorpresaRSin": -0.014167279343966516,
    "sorpresaRCon": 0.0022606706814990263,
    "comisionPlanteo": 5.005282561983481,
    "mbCoberturaPlanteo": 351.467330313181,
    "mbSpotPlanteo": 213.83136363636243
   },
   "origenTexto": {
    "rindes": "esperado G32 · real Q8",
    "cosecha": "fila 83 (F, G, I, J, O)",
    "tierra": "fila 35 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 43.5,
   "cosechaPlanteo": 91
  },
  {
   "id": "Trigo|Sudeste BA|2025/26",
   "fila": 22,
   "filaDC": 42,
   "cultivo": "Trigo",
   "zona": "Sudeste BA",
   "campana": "2025/26",
   "rindeEsperado": 40.65245987484248,
   "rindeReal": 50.53665901530681,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 39.15,
   "cd": 434,
   "tabla": {
    "rindeBajo": 41,
    "rindeAlto": 46,
    "costoBajo": 86,
    "costoAlto": 95,
    "piso": 75
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.24313901719342468,
    "cosechaEsperado": 85.27101339601104,
    "cosechaReal": 104.36918709682928,
    "mbProyectado": 150.74762926970078,
    "mbRealSin": 178.13234489947192,
    "futuro": 89.3132870724582,
    "mbRealCon": 267.4456319719301,
    "sorpresaSin": 27.384715629771136,
    "sorpresaCon": 116.6980027022293,
    "rProyectada": 0.018483648265278495,
    "rRealSin": 0.021841375706814457,
    "rRealCon": 0.03279236307332005,
    "sorpresaRSin": 0.0033577274415359623,
    "sorpresaRCon": 0.014308714808041552,
    "comisionPlanteo": 4.436266171203445,
    "mbCoberturaPlanteo": 187.80610672494709,
    "mbSpotPlanteo": 92.23678571428377
   },
   "origenTexto": {
    "rindes": "esperado H32 · real R8",
    "cosecha": "fila 102 (F, G, I, J, O)",
    "tierra": "fila 42 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 43.5,
   "cosechaPlanteo": 90.5
  },
  {
   "id": "Trigo|Sudoeste BA|2020/21",
   "fila": 23,
   "filaDC": 8,
   "cultivo": "Trigo",
   "zona": "Sudoeste BA",
   "campana": "2020/21",
   "rindeEsperado": 30.81408022532903,
   "rindeReal": 35.21070234113712,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 32.5,
   "cd": 179,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 35,
    "costoBajo": 50,
    "costoAlto": 50,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": 0.1426822440799025,
    "cosechaEsperado": 50,
    "cosechaReal": 50.3010033444816,
    "mbProyectado": 185.3239373140139,
    "mbRealSin": 471.83210702341137,
    "futuro": -209.1059065962597,
    "mbRealCon": 262.72620042715164,
    "sorpresaSin": 286.50816970939746,
    "sorpresaCon": 77.40226311313774,
    "rProyectada": 0.02969463974412372,
    "rRealSin": 0.07560213019881457,
    "rRealCon": 0.04209688174176714,
    "sorpresaRSin": 0.04590749045469084,
    "sorpresaRCon": 0.012402241997643428,
    "comisionPlanteo": 2.50438936170213,
    "mbCoberturaPlanteo": 164.79348297872383,
    "mbSpotPlanteo": 368.375
   },
   "origenTexto": {
    "rindes": "esperado C33 · real M9",
    "cosecha": "fila 8 (F, G, I, J, O)",
    "tierra": "fila 8 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 30,
   "cosechaPlanteo": 50
  },
  {
   "id": "Trigo|Sudoeste BA|2021/22",
   "fila": 24,
   "filaDC": 15,
   "cultivo": "Trigo",
   "zona": "Sudoeste BA",
   "campana": "2021/22",
   "rindeEsperado": 31.00812761016925,
   "rindeReal": 26.96839668948659,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 40.3,
   "cd": 225,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 35,
    "costoBajo": 55,
    "costoAlto": 72,
    "piso": 55
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": -0.13027974379716545,
    "cosechaEsperado": 65.21381693728773,
    "cosechaReal": 58.3462743721272,
    "mbProyectado": 229.97657344285318,
    "mbRealSin": 258.88544630415544,
    "futuro": -104.97228151529319,
    "mbRealCon": 153.91316478886225,
    "sorpresaSin": 28.908872861302257,
    "sorpresaCon": -76.06340865399093,
    "rProyectada": 0.036375508368784205,
    "rRealSin": 0.04094803908769991,
    "rRealCon": 0.024344521400717946,
    "sorpresaRSin": 0.004572530718915701,
    "sorpresaRCon": -0.012030986968066263,
    "comisionPlanteo": 3.1208905263157947,
    "mbCoberturaPlanteo": 213.12626235589215,
    "mbSpotPlanteo": 314.685714285715
   },
   "origenTexto": {
    "rindes": "esperado D33 · real N9",
    "cosecha": "fila 27 (F, G, I, J, O)",
    "tierra": "fila 15 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 30,
   "cosechaPlanteo": 63.5
  },
  {
   "id": "Trigo|Sudoeste BA|2022/23",
   "fila": 25,
   "filaDC": 22,
   "cultivo": "Trigo",
   "zona": "Sudoeste BA",
   "campana": "2022/23",
   "rindeEsperado": 31.2315170929941,
   "rindeReal": 26.61206080867974,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 50.3,
   "cd": 355,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 35,
    "costoBajo": 59,
    "costoAlto": 81,
    "piso": 59
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.1479100829639366,
    "cosechaEsperado": 72.70933760458702,
    "cosechaReal": 62.54653377909543,
    "mbProyectado": 420.8567164126586,
    "mbRealSin": 274.6573606372182,
    "futuro": 33.91272298488788,
    "mbRealCon": 308.57008362210604,
    "sorpresaSin": -146.19935577544044,
    "sorpresaCon": -112.28663279055257,
    "rProyectada": 0.06524488853033943,
    "rRealSin": 0.042579785898537545,
    "rRealCon": 0.04783723277919932,
    "sorpresaRSin": -0.02266510263180188,
    "sorpresaRCon": -0.01740765575114011,
    "comisionPlanteo": 4.83002754237288,
    "mbCoberturaPlanteo": 387.9027536594771,
    "mbSpotPlanteo": 355.3272727272729
   },
   "origenTexto": {
    "rindes": "esperado E33 · real O9",
    "cosecha": "fila 46 (F, G, I, J, O)",
    "tierra": "fila 22 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 30,
   "cosechaPlanteo": 70
  },
  {
   "id": "Trigo|Sudoeste BA|2023/24",
   "fila": 26,
   "filaDC": 29,
   "cultivo": "Trigo",
   "zona": "Sudoeste BA",
   "campana": "2023/24",
   "rindeEsperado": 30.08223803196213,
   "rindeReal": 25.92243911669184,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 44.7,
   "cd": 280,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 35,
    "costoBajo": 65,
    "costoAlto": 68,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": -0.1382808988762917,
    "cosechaEsperado": 66.52467140958863,
    "cosechaReal": 65.27673173500756,
    "mbProyectado": 210.55708759603186,
    "mbRealSin": 116.68469917818373,
    "futuro": 18.828669400139542,
    "mbRealCon": 135.51336857832328,
    "sorpresaSin": -93.87238841784813,
    "sorpresaCon": -75.04371901770858,
    "rProyectada": 0.030863809456397932,
    "rRealSin": 0.017103838028107516,
    "rRealCon": 0.0198637758260616,
    "sorpresaRSin": -0.013759971428290416,
    "sorpresaRCon": -0.011000033630336333,
    "comisionPlanteo": 3.44829411764706,
    "mbCoberturaPlanteo": 206.90446880570389,
    "mbSpotPlanteo": 188.12727272727307
   },
   "origenTexto": {
    "rindes": "esperado F33 · real P9",
    "cosecha": "fila 65 (F, G, I, J, O)",
    "tierra": "fila 29 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 30,
   "cosechaPlanteo": 66.5
  },
  {
   "id": "Trigo|Sudoeste BA|2024/25",
   "fila": 27,
   "filaDC": 36,
   "cultivo": "Trigo",
   "zona": "Sudoeste BA",
   "campana": "2024/25",
   "rindeEsperado": 28.08967201525178,
   "rindeReal": 26.78268450988804,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 49,
   "cd": 254,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 35,
    "costoBajo": 65,
    "costoAlto": 76,
    "piso": 65
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": -0.04652911236037527,
    "cosechaEsperado": 68.39863921677696,
    "cosechaReal": 66.96095296087684,
    "mbProyectado": 186.383786344237,
    "mbRealSin": 72.13581195925185,
    "futuro": 88.87699221733243,
    "mbRealCon": 161.01280417658427,
    "sorpresaSin": -114.24797438498514,
    "sorpresaCon": -25.370982167652727,
    "rProyectada": 0.02445713981660659,
    "rRealSin": 0.009465606818467849,
    "rRealCon": 0.02112797867909812,
    "sorpresaRSin": -0.014991532998138742,
    "sorpresaRCon": -0.003329161137508468,
    "comisionPlanteo": 3.4519190082644697,
    "mbCoberturaPlanteo": 210.73953814702142,
    "mbSpotPlanteo": 115.81818181818096
   },
   "origenTexto": {
    "rindes": "esperado G33 · real Q9",
    "cosecha": "fila 84 (F, G, I, J, O)",
    "tierra": "fila 36 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 30,
   "cosechaPlanteo": 70.5
  },
  {
   "id": "Trigo|Sudoeste BA|2025/26",
   "fila": 28,
   "filaDC": 43,
   "cultivo": "Trigo",
   "zona": "Sudoeste BA",
   "campana": "2025/26",
   "rindeEsperado": 28.29925669317667,
   "rindeReal": 43.21664318287511,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 50.1,
   "cd": 278,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 35,
    "costoBajo": 75,
    "costoAlto": 75,
    "piso": 75
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.5271299755832535,
    "cosechaEsperado": 75,
    "cosechaReal": 92.60709253473237,
    "mbProyectado": 82.43008092416113,
    "mbRealSin": 194.79007642065187,
    "futuro": 62.173350512031355,
    "mbRealCon": 256.9634269326832,
    "sorpresaSin": 112.35999549649074,
    "sorpresaCon": 174.53334600852207,
    "rProyectada": 0.010107015477867097,
    "rRealSin": 0.023883833368182256,
    "rRealCon": 0.031507106436591555,
    "sorpresaRSin": 0.013776817890315157,
    "sorpresaRCon": 0.021400090958724458,
    "comisionPlanteo": 3.0594939111747896,
    "mbCoberturaPlanteo": 105.39559084479113,
    "mbSpotPlanteo": 39.485714285713016
   },
   "origenTexto": {
    "rindes": "esperado H33 · real R9",
    "cosecha": "fila 103 (F, G, I, J, O)",
    "tierra": "fila 43 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 30,
   "cosechaPlanteo": 75
  },
  {
   "id": "Trigo|Sudeste de Córdoba|2020/21",
   "fila": 29,
   "filaDC": 9,
   "cultivo": "Trigo",
   "zona": "Sudeste de Córdoba",
   "campana": "2020/21",
   "rindeEsperado": 38.28556244870935,
   "rindeReal": 17.90754516471839,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 28.2,
   "cd": 252,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 50,
    "costoAlto": 60,
    "piso": 50
   },
   "v": 6412.5,
   "excel": {
    "desvioRinde": -0.5322637563779066,
    "cosechaEsperado": 53.28556244870935,
    "cosechaReal": 50,
    "mbProyectado": 225.96218680146524,
    "mbRealSin": 62.28423751328381,
    "futuro": -259.80776277736845,
    "mbRealCon": -197.52352526408464,
    "sorpresaSin": -163.67794928818142,
    "sorpresaCon": -423.4857120655499,
    "rProyectada": 0.03523776792225579,
    "rRealSin": 0.009712941522539386,
    "rRealCon": -0.03080288893007168,
    "sorpresaRSin": -0.025524826399716403,
    "sorpresaRCon": -0.06604065685232746,
    "comisionPlanteo": 3.33918581560284,
    "mbCoberturaPlanteo": 235.25797730496515,
    "mbSpotPlanteo": 506.70000000000005
   },
   "origenTexto": {
    "rindes": "esperado C34 · real M10",
    "cosecha": "fila 9 (F, G, I, J, O)",
    "tierra": "fila 9 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 40,
   "cosechaPlanteo": 55
  },
  {
   "id": "Trigo|Sudeste de Córdoba|2021/22",
   "fila": 30,
   "filaDC": 16,
   "cultivo": "Trigo",
   "zona": "Sudeste de Córdoba",
   "campana": "2021/22",
   "rindeEsperado": 34.87121304791809,
   "rindeReal": 43.79379328753459,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 34.9,
   "cd": 320,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 73,
    "costoAlto": 91,
    "piso": 55
   },
   "v": 6875,
   "excel": {
    "desvioRinde": 0.25587237895497306,
    "cosechaEsperado": 72.73138721422916,
    "cosechaReal": 88.82882791756226,
    "mbProyectado": 211.09633553111868,
    "mbRealSin": 495.34616997178995,
    "futuro": -118.05004284248825,
    "mbRealCon": 377.2961271293017,
    "sorpresaSin": 284.2498344406713,
    "sorpresaCon": 166.199791598183,
    "rProyectada": 0.03070492153179908,
    "rRealSin": 0.07205035199589672,
    "rRealCon": 0.054879436673352974,
    "sorpresaRSin": 0.041345430464097645,
    "sorpresaRCon": 0.02417451514155389,
    "comisionPlanteo": 4.16118736842106,
    "mbCoberturaPlanteo": 288.4350164745229,
    "mbSpotPlanteo": 423.84761904762
   },
   "origenTexto": {
    "rindes": "esperado D34 · real N10",
    "cosecha": "fila 28 (F, G, I, J, O)",
    "tierra": "fila 16 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 40,
   "cosechaPlanteo": 82
  },
  {
   "id": "Trigo|Sudeste de Córdoba|2022/23",
   "fila": 31,
   "filaDC": 23,
   "cultivo": "Trigo",
   "zona": "Sudeste de Córdoba",
   "campana": "2022/23",
   "rindeEsperado": 34.66144337823761,
   "rindeReal": 15.98999464658212,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 43.5,
   "cd": 506,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 83,
    "costoAlto": 102,
    "piso": 59
   },
   "v": 7000,
   "excel": {
    "desvioRinde": -0.5386806466166515,
    "cosechaEsperado": 82.19713715410633,
    "cosechaReal": 59,
    "mbProyectado": 377.1304253191317,
    "mbRealSin": -138.2125065239535,
    "futuro": 37.63710626168174,
    "mbRealCon": -100.57540026227176,
    "sorpresaSin": -515.3429318430851,
    "sorpresaCon": -477.7058255814035,
    "rProyectada": 0.05387577504559024,
    "rRealSin": -0.019744643789136214,
    "rRealCon": -0.01436791432318168,
    "sorpresaRSin": -0.07362041883472645,
    "sorpresaRCon": -0.06824368936877193,
    "comisionPlanteo": 6.440036723163841,
    "mbCoberturaPlanteo": 512.5703382126361,
    "mbSpotPlanteo": 469.13636363636397
   },
   "origenTexto": {
    "rindes": "esperado E34 · real O10",
    "cosecha": "fila 47 (F, G, I, J, O)",
    "tierra": "fila 23 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 40,
   "cosechaPlanteo": 92.5
  },
  {
   "id": "Trigo|Sudeste de Córdoba|2023/24",
   "fila": 32,
   "filaDC": 30,
   "cultivo": "Trigo",
   "zona": "Sudeste de Córdoba",
   "campana": "2023/24",
   "rindeEsperado": 28.58590059817463,
   "rindeReal": 28.42300966405891,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 38.9,
   "cd": 393,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 71,
    "costoAlto": 86,
    "piso": 65
   },
   "v": 7437.5,
   "excel": {
    "desvioRinde": -0.005698296387629642,
    "cosechaEsperado": 65,
    "cosechaReal": 65,
    "mbProyectado": 87.95146587529496,
    "mbRealSin": 65.0092169183788,
    "futuro": 17.892102020348737,
    "mbRealCon": 82.90131893872754,
    "sorpresaSin": -22.94224895691616,
    "sorpresaCon": -5.050146936567415,
    "rProyectada": 0.011825407176510247,
    "rRealSin": 0.00874073504784925,
    "rRealCon": 0.01114639582369446,
    "sorpresaRSin": -0.0030846721286609965,
    "sorpresaRCon": -0.000679011352815787,
    "comisionPlanteo": 4.59772549019608,
    "mbCoberturaPlanteo": 289.5726250742719,
    "mbSpotPlanteo": 264.53636363636394
   },
   "origenTexto": {
    "rindes": "esperado F34 · real P10",
    "cosecha": "fila 66 (F, G, I, J, O)",
    "tierra": "fila 30 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 40,
   "cosechaPlanteo": 78.5
  },
  {
   "id": "Trigo|Sudeste de Córdoba|2024/25",
   "fila": 33,
   "filaDC": 37,
   "cultivo": "Trigo",
   "zona": "Sudeste de Córdoba",
   "campana": "2024/25",
   "rindeEsperado": 28.58078666180002,
   "rindeReal": 36.30079630105317,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 40.2,
   "cd": 352,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 78,
    "costoAlto": 96,
    "piso": 65
   },
   "v": 8675,
   "excel": {
    "desvioRinde": 0.2701118667797697,
    "cosechaEsperado": 65,
    "cosechaReal": 80.34143334189571,
    "mbProyectado": 125.82897594635801,
    "mbRealSin": 132.39995493076037,
    "futuro": 90.43090116277637,
    "mbRealCon": 222.83085609353674,
    "sorpresaSin": 6.570978984402359,
    "sorpresaCon": 97.00188014717872,
    "rProyectada": 0.01450478108891735,
    "rRealSin": 0.015262242643315316,
    "rRealCon": 0.025686554016546022,
    "sorpresaRSin": 0.0007574615543979664,
    "sorpresaRCon": 0.011181772927628671,
    "comisionPlanteo": 4.60255867768596,
    "mbCoberturaPlanteo": 309.852717529362,
    "mbSpotPlanteo": 183.29090909090792
   },
   "origenTexto": {
    "rindes": "esperado G34 · real Q10",
    "cosecha": "fila 85 (F, G, I, J, O)",
    "tierra": "fila 37 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 40,
   "cosechaPlanteo": 87
  },
  {
   "id": "Trigo|Sudeste de Córdoba|2025/26",
   "fila": 34,
   "filaDC": 44,
   "cultivo": "Trigo",
   "zona": "Sudeste de Córdoba",
   "campana": "2025/26",
   "rindeEsperado": 28.48302781278944,
   "rindeReal": 62.6365965173968,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 41.7,
   "cd": 402,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 77,
    "costoAlto": 96,
    "piso": 75
   },
   "v": 9200,
   "excel": {
    "desvioRinde": 1.199084905196481,
    "cosechaEsperado": 75,
    "cosechaReal": 133.62473923711315,
    "mbProyectado": -14.816558212322093,
    "mbRealSin": 336.45564598938296,
    "futuro": 62.57709490565807,
    "mbRealCon": 399.032740895041,
    "sorpresaSin": 351.27220420170505,
    "sorpresaCon": 413.8492991073631,
    "rProyectada": -0.0016104954578610971,
    "rRealSin": 0.03657126586841119,
    "rRealCon": 0.04337312401033054,
    "sorpresaRSin": 0.03818176132627229,
    "sorpresaRCon": 0.04498361946819164,
    "comisionPlanteo": 4.07932521489972,
    "mbCoberturaPlanteo": 156.29412112638823,
    "mbSpotPlanteo": 68.414285714284
   },
   "origenTexto": {
    "rindes": "esperado H34 · real R10",
    "cosecha": "fila 104 (F, G, I, J, O)",
    "tierra": "fila 44 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 40,
   "cosechaPlanteo": 86.5
  },
  {
   "id": "Trigo|Centro Oeste BA|2020/21",
   "fila": 35,
   "filaDC": 10,
   "cultivo": "Trigo",
   "zona": "Centro Oeste BA",
   "campana": "2020/21",
   "rindeEsperado": 40.0157884550729,
   "rindeReal": 39.79145280674266,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 42.1,
   "cd": 252,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 50,
    "costoAlto": 60,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": -0.005606178385866634,
    "cosechaEsperado": 55.0157884550729,
    "cosechaReal": 54.79145280674266,
    "mbProyectado": 192.6185081957868,
    "mbRealSin": 447.35605651304763,
    "futuro": -271.54916394954034,
    "mbRealCon": 175.8068925635073,
    "sorpresaSin": 254.73754831726083,
    "sorpresaCon": -16.811615632279512,
    "rProyectada": 0.030863456128891093,
    "rRealSin": 0.07168030815683668,
    "rRealCon": 0.028169714149562507,
    "sorpresaRSin": 0.04081685202794559,
    "sorpresaRCon": -0.002693741979328587,
    "comisionPlanteo": 3.33918581560284,
    "mbCoberturaPlanteo": 179.65797730496513,
    "mbSpotPlanteo": 451.1
   },
   "origenTexto": {
    "rindes": "esperado C35 · real M11",
    "cosecha": "fila 10 (F, G, I, J, O)",
    "tierra": "fila 10 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 40,
   "cosechaPlanteo": 55
  },
  {
   "id": "Trigo|Centro Oeste BA|2021/22",
   "fila": 36,
   "filaDC": 17,
   "cultivo": "Trigo",
   "zona": "Centro Oeste BA",
   "campana": "2021/22",
   "rindeEsperado": 40.33042517026759,
   "rindeReal": 39.93607315601749,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 52.2,
   "cd": 328,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 72,
    "costoAlto": 91,
    "piso": 55
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": -0.009778027694605562,
    "cosechaEsperado": 82.12780782350842,
    "cosechaReal": 81.37853899643324,
    "mbProyectado": 218.45965169553608,
    "mbRealSin": 346.05982769387197,
    "futuro": -136.53119587963693,
    "mbRealCon": 209.52863181423504,
    "sorpresaSin": 127.60017599833589,
    "sorpresaCon": -8.93101988130104,
    "rProyectada": 0.03455387115969575,
    "rRealSin": 0.054736454108907207,
    "rRealCon": 0.0331412473277524,
    "sorpresaRSin": 0.020182582949211457,
    "sorpresaRCon": -0.0014126238319433484,
    "comisionPlanteo": 4.16118736842106,
    "mbCoberturaPlanteo": 211.73501647452298,
    "mbSpotPlanteo": 347.1476190476201
   },
   "origenTexto": {
    "rindes": "esperado D35 · real N11",
    "cosecha": "fila 29 (F, G, I, J, O)",
    "tierra": "fila 17 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 40,
   "cosechaPlanteo": 81.5
  },
  {
   "id": "Trigo|Centro Oeste BA|2022/23",
   "fila": 37,
   "filaDC": 24,
   "cultivo": "Trigo",
   "zona": "Centro Oeste BA",
   "campana": "2022/23",
   "rindeEsperado": 39.94800754362051,
   "rindeReal": 25.8492343864458,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 64.4,
   "cd": 526,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 81,
    "costoAlto": 100,
    "piso": 59
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.3529280688600003,
    "cosechaEsperado": 90.40121433287898,
    "cosechaReal": 59.82251386577457,
    "mbProyectado": 412.666795076916,
    "mbRealSin": 50.09215134478006,
    "futuro": 43.377518600558545,
    "mbRealCon": 93.46966994533861,
    "sorpresaSin": -362.57464373213594,
    "sorpresaCon": -319.1971251315774,
    "rProyectada": 0.06397521530478768,
    "rRealSin": 0.007765723352577971,
    "rRealCon": 0.014490485618320538,
    "sorpresaRSin": -0.056209491952209714,
    "sorpresaRCon": -0.04948472968646715,
    "comisionPlanteo": 6.440036723163841,
    "mbCoberturaPlanteo": 410.97033821263625,
    "mbSpotPlanteo": 367.53636363636394
   },
   "origenTexto": {
    "rindes": "esperado E35 · real O11",
    "cosecha": "fila 48 (F, G, I, J, O)",
    "tierra": "fila 24 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 40,
   "cosechaPlanteo": 90.5
  },
  {
   "id": "Trigo|Centro Oeste BA|2023/24",
   "fila": 38,
   "filaDC": 31,
   "cultivo": "Trigo",
   "zona": "Centro Oeste BA",
   "campana": "2023/24",
   "rindeEsperado": 36.56796155345722,
   "rindeReal": 26.73744613094145,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 58.3,
   "cd": 396,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 68,
    "costoAlto": 82,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": -0.26882864138174456,
    "cosechaEsperado": 70.19514617484012,
    "cosechaReal": 65,
    "mbProyectado": 161.26088276270698,
    "mbRealSin": -20.87732991549359,
    "futuro": 22.888126142593045,
    "mbRealCon": 2.010796227099455,
    "sorpresaSin": -182.13821267820057,
    "sorpresaCon": -159.25008653560752,
    "rProyectada": 0.023637889444537097,
    "rRealSin": -0.0030602338768400306,
    "rRealCon": 0.00029474586829349284,
    "sorpresaRSin": -0.026698123321377127,
    "sorpresaRCon": -0.0233431435762436,
    "comisionPlanteo": 4.59772549019608,
    "mbCoberturaPlanteo": 212.472625074272,
    "mbSpotPlanteo": 187.43636363636392
   },
   "origenTexto": {
    "rindes": "esperado F35 · real P11",
    "cosecha": "fila 67 (F, G, I, J, O)",
    "tierra": "fila 31 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 40,
   "cosechaPlanteo": 75
  },
  {
   "id": "Trigo|Centro Oeste BA|2024/25",
   "fila": 39,
   "filaDC": 38,
   "cultivo": "Trigo",
   "zona": "Centro Oeste BA",
   "campana": "2024/25",
   "rindeEsperado": 33.92649744370026,
   "rindeReal": 36.32957568376305,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 63.6,
   "cd": 360,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 76,
    "costoAlto": 94,
    "piso": 65
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.07083189899135944,
    "cosechaEsperado": 73.66896587774914,
    "cosechaReal": 78.3932362307735,
    "mbProyectado": 131.30198644528315,
    "mbRealSin": 41.784673647617396,
    "futuro": 107.34497176143229,
    "mbRealCon": 149.1296454090497,
    "sorpresaSin": -89.51731279766575,
    "sorpresaCon": 17.827658963766538,
    "rProyectada": 0.017229347593355007,
    "rRealSin": 0.0054829533492984205,
    "rRealCon": 0.019568679551524013,
    "sorpresaRSin": -0.011746394244056584,
    "sorpresaRCon": 0.002339331958169008,
    "comisionPlanteo": 4.60255867768596,
    "mbCoberturaPlanteo": 210.252717529362,
    "mbSpotPlanteo": 83.69090909090801
   },
   "origenTexto": {
    "rindes": "esperado G35 · real Q11",
    "cosecha": "fila 86 (F, G, I, J, O)",
    "tierra": "fila 38 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 40,
   "cosechaPlanteo": 85
  },
  {
   "id": "Trigo|Centro Oeste BA|2025/26",
   "fila": 40,
   "filaDC": 45,
   "cultivo": "Trigo",
   "zona": "Centro Oeste BA",
   "campana": "2025/26",
   "rindeEsperado": 33.72875643278209,
   "rindeReal": 41.36884357981273,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 66,
   "cd": 387,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 45,
    "costoBajo": 75,
    "costoAlto": 91,
    "piso": 75
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.22651553021993398,
    "cosechaEsperado": 75,
    "cosechaReal": 85.19014972770037,
    "mbProyectado": 3.3430404609337074,
    "mbRealSin": 3.2560597002884606,
    "futuro": 74.10193909919603,
    "mbRealCon": 77.35799879948449,
    "sorpresaSin": -0.08698076064524685,
    "sorpresaCon": 74.01495833855078,
    "rProyectada": 0.0004099008675349883,
    "rRealSin": 0.00039923587868307894,
    "rRealCon": 0.009485111289925267,
    "sorpresaRSin": -1.0664988851909339e-05,
    "sorpresaRCon": 0.009075210422390277,
    "comisionPlanteo": 4.07932521489972,
    "mbCoberturaPlanteo": 77.59412112638817,
    "mbSpotPlanteo": -10.28571428571604
   },
   "origenTexto": {
    "rindes": "esperado H35 · real R11",
    "cosecha": "fila 105 (F, G, I, J, O)",
    "tierra": "fila 45 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 40,
   "cosechaPlanteo": 83
  },
  {
   "id": "Trigo|Oeste BA|2020/21",
   "fila": 41,
   "filaDC": 11,
   "cultivo": "Trigo",
   "zona": "Oeste BA",
   "campana": "2020/21",
   "rindeEsperado": 37.41416891414245,
   "rindeReal": 37.23342732331137,
   "fs": 166.959290780142,
   "sc": 231.625,
   "fc": 233.985,
   "gc": 42.1,
   "cd": 215,
   "tabla": {
    "rindeBajo": 28,
    "rindeAlto": 38,
    "costoBajo": 50,
    "costoAlto": 51,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": -0.0048308327052739575,
    "cosechaEsperado": 50.94141689141424,
    "cosechaReal": 50.923342732331136,
    "mbProyectado": 201.20924268341196,
    "mbRealSin": 439.7431886127276,
    "futuro": -253.8944421877131,
    "mbRealCon": 185.84874642501447,
    "sorpresaSin": 238.53394592931562,
    "sorpresaCon": -15.36049625839749,
    "rProyectada": 0.03223995810399864,
    "rRealSin": 0.07046049072258603,
    "rRealCon": 0.029778730432630893,
    "sorpresaRSin": 0.03822053261858739,
    "sorpresaRCon": -0.0024612276713677525,
    "comisionPlanteo": 2.754828297872343,
    "mbCoberturaPlanteo": 135.99283127659623,
    "mbSpotPlanteo": 359.9325
   },
   "origenTexto": {
    "rindes": "esperado C36 · real M12",
    "cosecha": "fila 11 (F, G, I, J, O)",
    "tierra": "fila 11 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 33,
   "cosechaPlanteo": 50.5
  },
  {
   "id": "Trigo|Oeste BA|2021/22",
   "fila": 42,
   "filaDC": 18,
   "cultivo": "Trigo",
   "zona": "Oeste BA",
   "campana": "2021/22",
   "rindeEsperado": 38.44829461961213,
   "rindeReal": 39.87186541205435,
   "fs": 208.059368421053,
   "sc": 241.361904761905,
   "fc": 240.872222222222,
   "gc": 52.2,
   "cd": 271,
   "tabla": {
    "rindeBajo": 28,
    "rindeAlto": 38,
    "costoBajo": 59,
    "costoAlto": 77,
    "piso": 55
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": 0.03702558999108563,
    "cosechaEsperado": 77.90838646605616,
    "cosechaReal": 80.79299044021539,
    "mbProyectado": 250.34430516187538,
    "mbRealSin": 402.4308103352365,
    "futuro": -130.15959097347212,
    "mbRealCon": 272.2712193617644,
    "sorpresaSin": 152.08650517336113,
    "sorpresaCon": 21.926914199889012,
    "rProyectada": 0.039597082568743086,
    "rRealSin": 0.06365268031460411,
    "rRealCon": 0.043065273432878526,
    "sorpresaRSin": 0.02405559774586102,
    "sorpresaRCon": 0.0034681908641354385,
    "comisionPlanteo": 3.4329795789473745,
    "mbCoberturaPlanteo": 173.51888859148147,
    "mbSpotPlanteo": 285.23428571428656
   },
   "origenTexto": {
    "rindes": "esperado D36 · real N12",
    "cosecha": "fila 30 (F, G, I, J, O)",
    "tierra": "fila 18 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 33,
   "cosechaPlanteo": 68
  },
  {
   "id": "Trigo|Oeste BA|2022/23",
   "fila": 43,
   "filaDC": 25,
   "cultivo": "Trigo",
   "zona": "Oeste BA",
   "campana": "2022/23",
   "rindeEsperado": 37.87850710157991,
   "rindeReal": 25.47446720128421,
   "fs": 322.001836158192,
   "sc": 310.409090909091,
   "fc": 309.533333333333,
   "gc": 64.4,
   "cd": 427,
   "tabla": {
    "rindeBajo": 28,
    "rindeAlto": 38,
    "costoBajo": 66,
    "costoAlto": 85,
    "piso": 59
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.327469080738357,
    "cosechaEsperado": 84.76916349300183,
    "cosechaReal": 60.04695840302707,
    "mbProyectado": 463.9881345368082,
    "mbRealSin": 139.64809335511126,
    "futuro": 41.130352860929165,
    "mbRealCon": 180.77844621604044,
    "sorpresaSin": -324.34004118169696,
    "sorpresaCon": -283.2096883207678,
    "rProyectada": 0.07193149814810378,
    "rRealSin": 0.02164946864123425,
    "rRealCon": 0.02802585562276832,
    "sorpresaRSin": -0.05028202950686952,
    "sorpresaRCon": -0.04390564252533545,
    "comisionPlanteo": 5.313030296610169,
    "mbCoberturaPlanteo": 345.1630290254248,
    "mbSpotPlanteo": 309.33000000000015
   },
   "origenTexto": {
    "rindes": "esperado E36 · real O12",
    "cosecha": "fila 49 (F, G, I, J, O)",
    "tierra": "fila 25 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 33,
   "cosechaPlanteo": 75.5
  },
  {
   "id": "Trigo|Oeste BA|2023/24",
   "fila": 44,
   "filaDC": 32,
   "cultivo": "Trigo",
   "zona": "Oeste BA",
   "campana": "2023/24",
   "rindeEsperado": 35.2691651182944,
   "rindeReal": 21.81727863559217,
   "fs": 229.886274509804,
   "sc": 222.909090909091,
   "fc": 222.477777777778,
   "gc": 58.3,
   "cd": 338,
   "tabla": {
    "rindeBajo": 28,
    "rindeAlto": 38,
    "costoBajo": 65,
    "costoAlto": 69,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": -0.3814064335683588,
    "cosechaEsperado": 67.90766604731776,
    "cosechaReal": 65,
    "mbProyectado": 199.26279872460896,
    "mbRealSin": -43.86775976848401,
    "futuro": 22.075200964959063,
    "mbRealCon": -21.792558803524944,
    "sorpresaSin": -243.13055849309296,
    "sorpresaCon": -221.0553575281339,
    "rProyectada": 0.02920827373611909,
    "rRealSin": -0.006430209470654957,
    "rRealCon": -0.003194389655359276,
    "sorpresaRSin": -0.03563848320677405,
    "sorpresaRCon": -0.03240266339147836,
    "comisionPlanteo": 3.793123529411766,
    "mbCoberturaPlanteo": 158.86491568627437,
    "mbSpotPlanteo": 138.21000000000015
   },
   "origenTexto": {
    "rindes": "esperado F36 · real P12",
    "cosecha": "fila 68 (F, G, I, J, O)",
    "tierra": "fila 32 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 33,
   "cosechaPlanteo": 67
  },
  {
   "id": "Trigo|Oeste BA|2024/25",
   "fila": 45,
   "filaDC": 39,
   "cultivo": "Trigo",
   "zona": "Oeste BA",
   "campana": "2024/25",
   "rindeEsperado": 30.49025400494025,
   "rindeReal": 29.5151140639226,
   "fs": 230.127933884298,
   "sc": 195.772727272727,
   "fc": 197.336842105263,
   "gc": 63.6,
   "cd": 304,
   "tabla": {
    "rindeBajo": 28,
    "rindeAlto": 38,
    "costoBajo": 67,
    "costoAlto": 79,
    "piso": 65
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": -0.03198202090607882,
    "cosechaEsperado": 69.9883048059283,
    "cosechaReal": 68.81813687670711,
    "mbProyectado": 133.7595954990859,
    "mbRealSin": 17.291175282719962,
    "futuro": 96.4725421653263,
    "mbRealCon": 113.76371744804626,
    "sorpresaSin": -116.46842021636593,
    "sorpresaCon": -19.995878051039625,
    "rProyectada": 0.017551833199116875,
    "rRealSin": 0.0022689349743216544,
    "rRealCon": 0.014927989168247864,
    "sorpresaRSin": -0.015282898224795219,
    "sorpresaRCon": -0.0026238440308690093,
    "comisionPlanteo": 3.797110909090917,
    "mbCoberturaPlanteo": 163.5834919617236,
    "mbSpotPlanteo": 59.169999999999106
   },
   "origenTexto": {
    "rindes": "esperado G36 · real Q12",
    "cosecha": "fila 87 (F, G, I, J, O)",
    "tierra": "fila 39 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 33,
   "cosechaPlanteo": 73
  },
  {
   "id": "Trigo|Oeste BA|2025/26",
   "fila": 46,
   "filaDC": 46,
   "cultivo": "Trigo",
   "zona": "Oeste BA",
   "campana": "2025/26",
   "rindeEsperado": 30.78243052723294,
   "rindeReal": 45.60364261168385,
   "fs": 203.966260744986,
   "sc": 180.928571428571,
   "fc": 180.976470588235,
   "gc": 66,
   "cd": 406,
   "tabla": {
    "rindeBajo": 32,
    "rindeAlto": 47,
    "costoBajo": 76,
    "costoAlto": 95,
    "piso": 75
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.48148284039295475,
    "cosechaEsperado": 75,
    "cosechaReal": 93.23128064146621,
    "mbProyectado": -56.306316351536395,
    "mbRealSin": 24.884869088526926,
    "futuro": 67.62887320794407,
    "mbRealCon": 92.513742296471,
    "sorpresaSin": 81.19118544006332,
    "sorpresaCon": 148.82005864800738,
    "rProyectada": -0.0069038972725289855,
    "rRealSin": 0.0030512132733903135,
    "rRealCon": 0.011343405402769303,
    "sorpresaRSin": 0.009955110545919299,
    "sorpresaRCon": 0.018247302675298286,
    "comisionPlanteo": 4.028333649713473,
    "mbCoberturaPlanteo": 49.249194612308386,
    "mbSpotPlanteo": -37.53214285714455
   },
   "origenTexto": {
    "rindes": "esperado H36 · real R12",
    "cosecha": "fila 106 (F, G, I, J, O)",
    "tierra": "fila 46 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 39.5,
   "cosechaPlanteo": 85.5
  },
  {
   "id": "Soja|Norte BA / Sur SF|2020/21",
   "fila": 47,
   "filaDC": 47,
   "cultivo": "Soja",
   "zona": "Norte BA / Sur SF",
   "campana": "2020/21",
   "rindeEsperado": 38.96055914278035,
   "rindeReal": 35.18449843123469,
   "fs": 297.282098934135,
   "sc": 347.157894736842,
   "fc": 352.676470588235,
   "gc": 45,
   "cd": 212,
   "tabla": {
    "rindeBajo": 34,
    "rindeAlto": 38,
    "costoBajo": 64,
    "costoAlto": 72,
    "piso": 50
   },
   "v": 6915.4947915,
   "excel": {
    "desvioRinde": -0.09692008519968565,
    "cosechaEsperado": 73.82000679684698,
    "cosechaReal": 66.36899686246937,
    "mbProyectado": 697.0851568219658,
    "mbRealSin": 784.7584004728899,
    "futuro": -221.61070769947858,
    "mbRealCon": 563.1476927734113,
    "sorpresaSin": 87.67324365092406,
    "sorpresaCon": -133.9374640485545,
    "rProyectada": 0.10080047456311728,
    "rRealSin": 0.11347827221812894,
    "rRealCon": 0.08143274049827781,
    "sorpresaRSin": 0.012677797655011662,
    "sorpresaRCon": -0.01936773406483947,
    "comisionPlanteo": 5.35107778081443,
    "mbCoberturaPlanteo": 602.9976053170567,
    "mbSpotPlanteo": 807.7684210526313
   },
   "origenTexto": {
    "rindes": "esperado C37 · real M13",
    "cosecha": "fila 18 (F, G, I, J, O)",
    "tierra": "fila 47 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 36,
   "cosechaPlanteo": 68
  },
  {
   "id": "Soja|Norte BA / Sur SF|2021/22",
   "fila": 48,
   "filaDC": 53,
   "cultivo": "Soja",
   "zona": "Norte BA / Sur SF",
   "campana": "2021/22",
   "rindeEsperado": 38.74400951931856,
   "rindeReal": 34.35623641279069,
   "fs": 317.432933333333,
   "sc": 428.32,
   "fc": 427.36875,
   "gc": 51.7,
   "cd": 267,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 40,
    "costoBajo": 72,
    "costoAlto": 83,
    "piso": 53
   },
   "v": 7161.1458335,
   "excel": {
    "desvioRinde": -0.11325036208087946,
    "cosechaEsperado": 80.23682094250083,
    "cosechaReal": 70.67568633488371,
    "mbProyectado": 682.3191089238089,
    "mbRealSin": 956.2488894436394,
    "futuro": -432.0847450401466,
    "mbRealCon": 524.1641444034929,
    "sorpresaSin": 273.9297805198305,
    "sorpresaCon": -158.15496452031607,
    "rProyectada": 0.09528071691151783,
    "rRealSin": 0.13353294454223874,
    "rRealCon": 0.07319556905983415,
    "sorpresaRSin": 0.03825222763072089,
    "sorpresaRCon": -0.02208514785168368,
    "comisionPlanteo": 5.951867499999993,
    "mbCoberturaPlanteo": 649.6138199999988,
    "mbSpotPlanteo": 1067.825
   },
   "origenTexto": {
    "rindes": "esperado D37 · real N13",
    "cosecha": "fila 37 (F, G, I, J, O)",
    "tierra": "fila 53 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 37.5,
   "cosechaPlanteo": 77.5
  },
  {
   "id": "Soja|Norte BA / Sur SF|2022/23",
   "fila": 49,
   "filaDC": 59,
   "cultivo": "Soja",
   "zona": "Norte BA / Sur SF",
   "campana": "2022/23",
   "rindeEsperado": 37.39996933953888,
   "rindeReal": 17.36526495777918,
   "fs": 375.668410078193,
   "sc": 351.85,
   "fc": 362.481818181818,
   "gc": 56.6,
   "cd": 293,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 40,
    "costoBajo": 84,
    "costoAlto": 96,
    "piso": 53
   },
   "v": 7575.2083335,
   "excel": {
    "desvioRinde": -0.5356877220907026,
    "cosechaEsperado": 89.7599264148933,
    "cosechaReal": 53,
    "mbProyectado": 810.5549489990901,
    "mbRealSin": 166.7094478784303,
    "futuro": 42.29281975236473,
    "mbRealCon": 209.00226763079502,
    "sorpresaSin": -643.8455011206598,
    "sorpresaCon": -601.5526813682951,
    "rProyectada": 0.1070010108388117,
    "rRealSin": 0.02200724264456037,
    "rRealCon": 0.02759029962338065,
    "sorpresaRSin": -0.08499376819425132,
    "sorpresaRCon": -0.07941071121543104,
    "comisionPlanteo": 7.043782688966119,
    "mbCoberturaPlanteo": 766.5934369224401,
    "mbSpotPlanteo": 724.1875
   },
   "origenTexto": {
    "rindes": "esperado E37 · real O13",
    "cosecha": "fila 56 (F, G, I, J, O)",
    "tierra": "fila 59 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 37.5,
   "cosechaPlanteo": 90
  },
  {
   "id": "Soja|Norte BA / Sur SF|2023/24",
   "fila": 50,
   "filaDC": 65,
   "cultivo": "Soja",
   "zona": "Norte BA / Sur SF",
   "campana": "2023/24",
   "rindeEsperado": 34.20664397515782,
   "rindeReal": 38.64223042765533,
   "fs": 336.569919724771,
   "sc": 312.136363636364,
   "fc": 314.531578947368,
   "gc": 65.8,
   "cd": 290,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 40,
    "costoBajo": 89,
    "costoAlto": 102,
    "piso": 70
   },
   "v": 7836.0677085,
   "excel": {
    "desvioRinde": 0.12967031947708185,
    "cosechaEsperado": 86.98260896540131,
    "cosechaReal": 98.46979911190385,
    "mbProyectado": 549.2304153553291,
    "mbRealSin": 563.4288535228035,
    "futuro": 69.62930396919636,
    "mbRealCon": 633.0581574919999,
    "sorpresaSin": 14.198438167474364,
    "sorpresaCon": 83.82774213667074,
    "rProyectada": 0.07009005483191061,
    "rRealSin": 0.07190198891615454,
    "rRealCon": 0.08078773449153638,
    "sorpresaRSin": 0.0018119340842439283,
    "sorpresaRCon": 0.010697679659625767,
    "comisionPlanteo": 6.3106859948394565,
    "mbCoberturaPlanteo": 614.5944555567868,
    "mbSpotPlanteo": 538.2613636363651
   },
   "origenTexto": {
    "rindes": "esperado F37 · real P13",
    "cosecha": "fila 75 (F, G, I, J, O)",
    "tierra": "fila 65 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 37.5,
   "cosechaPlanteo": 95.5
  },
  {
   "id": "Soja|Norte BA / Sur SF|2024/25",
   "fila": 51,
   "filaDC": 71,
   "cultivo": "Soja",
   "zona": "Norte BA / Sur SF",
   "campana": "2024/25",
   "rindeEsperado": 33.06718998918026,
   "rindeReal": 38.00726970009413,
   "fs": 280.48699255751,
   "sc": 274.425,
   "fc": 276.95,
   "gc": 61.7,
   "cd": 262,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 40,
    "costoBajo": 89,
    "costoAlto": 102,
    "piso": 70
   },
   "v": 8410.4166665,
   "excel": {
    "desvioRinde": 0.14939520753140156,
    "cosechaEsperado": 84.08514025820122,
    "cosechaReal": 96.81890122024473,
    "mbProyectado": 377.3819647478538,
    "mbRealSin": 449.6907434750077,
    "futuro": 7.058382152753548,
    "mbRealCon": 456.74912562776126,
    "sorpresaSin": 72.30877872715394,
    "sorpresaCon": 79.36716087990749,
    "rProyectada": 0.044870781045964696,
    "rRealSin": 0.053468307374852905,
    "rRealCon": 0.05430755023672777,
    "sorpresaRSin": 0.008597526328888208,
    "sorpresaRCon": 0.009436769190763077,
    "comisionPlanteo": 5.259131110453312,
    "mbCoberturaPlanteo": 448.22334098020934,
    "mbSpotPlanteo": 440.2187500000001
   },
   "origenTexto": {
    "rindes": "esperado G37 · real Q13",
    "cosecha": "fila 94 (F, G, I, J, O)",
    "tierra": "fila 71 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 37.5,
   "cosechaPlanteo": 95.5
  },
  {
   "id": "Soja|Norte BA / Sur SF|2025/26",
   "fila": 52,
   "filaDC": 77,
   "cultivo": "Soja",
   "zona": "Norte BA / Sur SF",
   "campana": "2025/26",
   "rindeEsperado": 32.7110999859108,
   "rindeReal": 39.56246891533615,
   "fs": 322.43335799314,
   "sc": 328.657894736842,
   "fc": 331.3625,
   "gc": 59.9,
   "cd": 314,
   "tabla": {
    "rindeBajo": 40,
    "rindeAlto": 45,
    "costoBajo": 95,
    "costoAlto": 107,
    "piso": 68
   },
   "v": 9427.8645835,
   "excel": {
    "desvioRinde": 0.20945088769183373,
    "cosechaEsperado": 77.68886246653815,
    "cosechaReal": 93.96086367392334,
    "mbProyectado": 467.08662982851376,
    "mbRealSin": 655.3117219538265,
    "futuro": -34.48178060353263,
    "mbRealCon": 620.8299413502939,
    "sorpresaSin": 188.2250921253127,
    "sorpresaCon": 153.74331152178013,
    "rProyectada": 0.049543205218069916,
    "rRealSin": 0.06950796929144569,
    "rRealCon": 0.06585053655064453,
    "sorpresaRSin": 0.019964764073375777,
    "sorpresaRCon": 0.01630733133257462,
    "comisionPlanteo": 6.851708857354226,
    "mbCoberturaPlanteo": 682.4204902450695,
    "mbSpotPlanteo": 727.2210526315787
   },
   "origenTexto": {
    "rindes": "esperado H37 · real R13",
    "cosecha": "fila 113 (F, G, I, J, O)",
    "tierra": "fila 77 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 42.5,
   "cosechaPlanteo": 101
  },
  {
   "id": "Soja|Sur Entre Ríos|2020/21",
   "fila": 53,
   "filaDC": 48,
   "cultivo": "Soja",
   "zona": "Sur Entre Ríos",
   "campana": "2020/21",
   "rindeEsperado": 24.1620725739287,
   "rindeReal": 17.6126679462572,
   "fs": 297.282098934135,
   "sc": 347.157894736842,
   "fc": 352.676470588235,
   "gc": 37.2,
   "cd": 212,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 30,
    "costoBajo": 52,
    "costoAlto": 61,
    "piso": 50
   },
   "v": 5500,
   "excel": {
    "desvioRinde": -0.2710613755352437,
    "cosechaEsperado": 52.24310886089305,
    "cosechaReal": 50,
    "mbProyectado": 364.1691461017344,
    "mbRealSin": 283.9185477320941,
    "futuro": -137.4357586340426,
    "mbRealCon": 146.4827890980515,
    "sorpresaSin": -80.25059836964027,
    "sorpresaCon": -217.68635700368287,
    "rProyectada": 0.06621257201849716,
    "rRealSin": 0.05162155413310802,
    "rRealCon": 0.02663323438146391,
    "sorpresaRSin": -0.01459101788538914,
    "sorpresaRCon": -0.03957933763703325,
    "comisionPlanteo": 4.013308335610823,
    "mbCoberturaPlanteo": 414.80820398779264,
    "mbSpotPlanteo": 568.3863157894735
   },
   "origenTexto": {
    "rindes": "esperado C38 · real M14",
    "cosecha": "fila 19 (F, G, I, J, O)",
    "tierra": "fila 48 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 27,
   "cosechaPlanteo": 56.5
  },
  {
   "id": "Soja|Sur Entre Ríos|2021/22",
   "fila": 54,
   "filaDC": 54,
   "cultivo": "Soja",
   "zona": "Sur Entre Ríos",
   "campana": "2021/22",
   "rindeEsperado": 23.74887258982281,
   "rindeReal": 27.54023692810458,
   "fs": 317.432933333333,
   "sc": 428.32,
   "fc": 427.36875,
   "gc": 41.6,
   "cd": 270,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 30,
    "costoBajo": 53,
    "costoAlto": 65,
    "piso": 53
   },
   "v": 5325,
   "excel": {
    "desvioRinde": 0.1596439714745237,
    "cosechaEsperado": 53,
    "cosechaReal": 60.08047385620916,
    "mbProyectado": 332.0721189810414,
    "mbRealSin": 734.9555686274509,
    "futuro": -264.8545074522529,
    "mbRealCon": 470.101061175198,
    "sorpresaSin": 402.88344964640953,
    "sorpresaCon": 138.02894219415663,
    "rProyectada": 0.06236096131099369,
    "rRealSin": 0.13801982509435698,
    "rRealCon": 0.0882818894225724,
    "sorpresaRSin": 0.0756588637833633,
    "sorpresaRCon": 0.02592092811157871,
    "comisionPlanteo": 4.285344599999996,
    "mbCoberturaPlanteo": 414.03195039999906,
    "mbSpotPlanteo": 715.144
   },
   "origenTexto": {
    "rindes": "esperado D38 · real N14",
    "cosecha": "fila 38 (F, G, I, J, O)",
    "tierra": "fila 54 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 27,
   "cosechaPlanteo": 59
  },
  {
   "id": "Soja|Sur Entre Ríos|2022/23",
   "fila": 55,
   "filaDC": 60,
   "cultivo": "Soja",
   "zona": "Sur Entre Ríos",
   "campana": "2022/23",
   "rindeEsperado": 22.81885390674978,
   "rindeReal": 9.622153846153847,
   "fs": 375.668410078193,
   "sc": 351.85,
   "fc": 362.481818181818,
   "gc": 45.2,
   "cd": 302,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 30,
    "costoBajo": 68,
    "costoAlto": 75,
    "piso": 53
   },
   "v": 5575,
   "excel": {
    "desvioRinde": -0.5783244029049317,
    "cosechaEsperado": 64.65341940245771,
    "cosechaReal": 53,
    "mbProyectado": 387.43761763455865,
    "mbRealSin": -59.93665230769227,
    "futuro": 25.804130117653486,
    "mbRealCon": -34.132522190038785,
    "sorpresaSin": -447.3742699422509,
    "sorpresaCon": -421.57013982459745,
    "rProyectada": 0.06949553679543653,
    "rRealSin": -0.010750969023801304,
    "rRealCon": -0.006122425504939692,
    "sorpresaRSin": -0.08024650581923783,
    "sorpresaRCon": -0.07561796230037622,
    "comisionPlanteo": 5.071523536055606,
    "mbCoberturaPlanteo": 484.987274584157,
    "mbSpotPlanteo": 454.45500000000015
   },
   "origenTexto": {
    "rindes": "esperado E38 · real O14",
    "cosecha": "fila 57 (F, G, I, J, O)",
    "tierra": "fila 60 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 27,
   "cosechaPlanteo": 71.5
  },
  {
   "id": "Soja|Sur Entre Ríos|2023/24",
   "fila": 56,
   "filaDC": 66,
   "cultivo": "Soja",
   "zona": "Sur Entre Ríos",
   "campana": "2023/24",
   "rindeEsperado": 21.86795374938609,
   "rindeReal": 29.16457142857143,
   "fs": 336.569919724771,
   "sc": 312.136363636364,
   "fc": 314.531578947368,
   "gc": 48.3,
   "cd": 291,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 30,
    "costoBajo": 70,
    "costoAlto": 82,
    "piso": 70
   },
   "v": 5575,
   "excel": {
    "desvioRinde": 0.33366714429740285,
    "cosechaEsperado": 70,
    "cosechaReal": 80.32914285714287,
    "mbProyectado": 269.3873271880533,
    "mbRealSin": 398.1383044155856,
    "futuro": 44.51329396435788,
    "mbRealCon": 442.6515983799435,
    "sorpresaSin": 128.7509772275323,
    "sorpresaCon": 173.2642711918902,
    "rProyectada": 0.04832059680503198,
    "rRealSin": 0.07141494249606917,
    "rRealCon": 0.07939938984393605,
    "sorpresaRSin": 0.023094345691037185,
    "sorpresaRCon": 0.03107879303890407,
    "comisionPlanteo": 4.543693916284409,
    "mbCoberturaPlanteo": 400.3180080008866,
    "mbSpotPlanteo": 345.35818181818286
   },
   "origenTexto": {
    "rindes": "esperado F38 · real P14",
    "cosecha": "fila 76 (F, G, I, J, O)",
    "tierra": "fila 66 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 27,
   "cosechaPlanteo": 76
  },
  {
   "id": "Soja|Sur Entre Ríos|2024/25",
   "fila": 57,
   "filaDC": 72,
   "cultivo": "Soja",
   "zona": "Sur Entre Ríos",
   "campana": "2024/25",
   "rindeEsperado": 21.38255732620143,
   "rindeReal": 28.9095,
   "fs": 280.48699255751,
   "sc": 274.425,
   "fc": 276.95,
   "gc": 45.5,
   "cd": 261,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 30,
    "costoBajo": 70,
    "costoAlto": 82,
    "piso": 70
   },
   "v": 5875,
   "excel": {
    "desvioRinde": 0.35201321146817754,
    "cosechaEsperado": 70,
    "cosechaReal": 79.819,
    "mbProyectado": 171.4622839272626,
    "mbRealSin": 320.99172875000005,
    "futuro": 4.564230013523181,
    "mbRealCon": 325.5559587635232,
    "sorpresaSin": 149.52944482273745,
    "sorpresaCon": 154.09367483626062,
    "rProyectada": 0.029185069604640443,
    "rRealSin": 0.05463689000000001,
    "rRealCon": 0.055413780215067786,
    "sorpresaRSin": 0.025451820395359565,
    "sorpresaRCon": 0.02622871061042734,
    "comisionPlanteo": 3.7865743995263856,
    "mbCoberturaPlanteo": 286.86080550575076,
    "mbSpotPlanteo": 281.0975000000001
   },
   "origenTexto": {
    "rindes": "esperado G38 · real Q14",
    "cosecha": "fila 95 (F, G, I, J, O)",
    "tierra": "fila 72 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 27,
   "cosechaPlanteo": 76
  },
  {
   "id": "Soja|Sur Entre Ríos|2025/26",
   "fila": 58,
   "filaDC": 78,
   "cultivo": "Soja",
   "zona": "Sur Entre Ríos",
   "campana": "2025/26",
   "rindeEsperado": 22.56982602981741,
   "rindeReal": 24.16402116402116,
   "fs": 322.43335799314,
   "sc": 328.657894736842,
   "fc": 331.3625,
   "gc": 44.5,
   "cd": 257,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 30,
    "costoBajo": 68,
    "costoAlto": 73,
    "piso": 68
   },
   "v": 6875,
   "excel": {
    "desvioRinde": 0.07063391326533175,
    "cosechaEsperado": 68,
    "cosechaReal": 68.13668430335096,
    "mbProyectado": 302.29075377881315,
    "mbRealSin": 361.50305393112376,
    "futuro": -23.79155056709397,
    "mbRealCon": 337.7115033640298,
    "sorpresaSin": 59.212300152310604,
    "sorpresaCon": 35.42074958521664,
    "rProyectada": 0.04396956418600918,
    "rRealSin": 0.052582262389981635,
    "rRealCon": 0.04912167321658615,
    "sorpresaRSin": 0.008612698203972452,
    "sorpresaRCon": 0.005152109030576966,
    "comisionPlanteo": 4.352850332907391,
    "mbCoberturaPlanteo": 411.2647820380442,
    "mbSpotPlanteo": 439.72631578947346
   },
   "origenTexto": {
    "rindes": "esperado H38 · real R14",
    "cosecha": "fila 114 (F, G, I, J, O)",
    "tierra": "fila 78 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 27,
   "cosechaPlanteo": 70.5
  },
  {
   "id": "Soja|Sudeste BA|2020/21",
   "fila": 59,
   "filaDC": 49,
   "cultivo": "Soja",
   "zona": "Sudeste BA",
   "campana": "2020/21",
   "rindeEsperado": 23.26899944332362,
   "rindeReal": 23.25563897442626,
   "fs": 297.282098934135,
   "sc": 347.157894736842,
   "fc": 352.676470588235,
   "gc": 43.1,
   "cd": 201,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 32,
    "costoBajo": 50,
    "costoAlto": 63,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": -0.0005741746193212993,
    "cosechaEsperado": 50,
    "cosechaReal": 50,
    "mbProyectado": 340.45631186012156,
    "mbRealSin": 456.1060627324101,
    "futuro": -132.35588881555577,
    "mbRealCon": 323.75017391685435,
    "sorpresaSin": 115.64975087228856,
    "sorpresaCon": -16.70613794326721,
    "rProyectada": 0.05455165520344718,
    "rRealSin": 0.07308233040074442,
    "rRealCon": 0.05187481401967505,
    "sorpresaRSin": 0.018530675197297244,
    "sorpresaRCon": -0.002676841183772123,
    "comisionPlanteo": 4.1619493850778895,
    "mbCoberturaPlanteo": 434.59591524659965,
    "mbSpotPlanteo": 593.8621052631576
   },
   "origenTexto": {
    "rindes": "esperado C39 · real M15",
    "cosecha": "fila 20 (F, G, I, J, O)",
    "tierra": "fila 49 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 28,
   "cosechaPlanteo": 56.5
  },
  {
   "id": "Soja|Sudeste BA|2021/22",
   "fila": 60,
   "filaDC": 55,
   "cultivo": "Soja",
   "zona": "Sudeste BA",
   "campana": "2021/22",
   "rindeEsperado": 22.35972372799809,
   "rindeReal": 24.9454787148646,
   "fs": 317.432933333333,
   "sc": 428.32,
   "fc": 427.36875,
   "gc": 49.3,
   "cd": 266,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 32,
    "costoBajo": 53,
    "costoAlto": 67,
    "piso": 53
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": 0.11564342289384877,
    "cosechaEsperado": 53,
    "cosechaReal": 54.65458775101305,
    "mbProyectado": 280.5378311711055,
    "mbRealSin": 624.8289464997848,
    "futuro": -249.36230519360288,
    "mbRealCon": 375.46664130618194,
    "sorpresaSin": 344.2911153286793,
    "sorpresaCon": 94.92881013507645,
    "rProyectada": 0.044372807511461096,
    "rRealSin": 0.0988295035107536,
    "rRealCon": 0.05938774436269328,
    "sorpresaRSin": 0.054456695999292516,
    "sorpresaRCon": 0.015014936851232182,
    "comisionPlanteo": 4.444061066666661,
    "mbCoberturaPlanteo": 422.9916522666656,
    "mbSpotPlanteo": 735.2559999999999
   },
   "origenTexto": {
    "rindes": "esperado D39 · real N15",
    "cosecha": "fila 39 (F, G, I, J, O)",
    "tierra": "fila 55 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 28,
   "cosechaPlanteo": 60
  },
  {
   "id": "Soja|Sudeste BA|2022/23",
   "fila": 61,
   "filaDC": 61,
   "cultivo": "Soja",
   "zona": "Sudeste BA",
   "campana": "2022/23",
   "rindeEsperado": 22.73556716755363,
   "rindeReal": 26.18527146249333,
   "fs": 375.668410078193,
   "sc": 351.85,
   "fc": 362.481818181818,
   "gc": 54.1,
   "cd": 299,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 32,
    "costoBajo": 68,
    "costoAlto": 80,
    "piso": 53
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": 0.15173161370976662,
    "cosechaEsperado": 64.41744030806862,
    "cosechaReal": 71.27790719373999,
    "mbProyectado": 367.68657832154986,
    "mbRealSin": 409.3885506019989,
    "futuro": 25.709947392084747,
    "mbRealCon": 435.09849799408363,
    "sorpresaSin": 41.70197228044901,
    "sorpresaCon": 67.41191967253377,
    "rProyectada": 0.057001988755643565,
    "rRealSin": 0.06346699317834918,
    "rRealCon": 0.06745277405412044,
    "sorpresaRSin": 0.006465004422705614,
    "sorpresaRCon": 0.010450785298476869,
    "comisionPlanteo": 5.259357741094702,
    "mbCoberturaPlanteo": 492.3630995687552,
    "mbSpotPlanteo": 460.69999999999993
   },
   "origenTexto": {
    "rindes": "esperado E39 · real O15",
    "cosecha": "fila 58 (F, G, I, J, O)",
    "tierra": "fila 61 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 28,
   "cosechaPlanteo": 74
  },
  {
   "id": "Soja|Sudeste BA|2023/24",
   "fila": 62,
   "filaDC": 67,
   "cultivo": "Soja",
   "zona": "Sudeste BA",
   "campana": "2023/24",
   "rindeEsperado": 24.29282460562549,
   "rindeReal": 27.56198180665704,
   "fs": 336.569919724771,
   "sc": 312.136363636364,
   "fc": 314.531578947368,
   "gc": 62.1,
   "cd": 280,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 32,
    "costoBajo": 70,
    "costoAlto": 83,
    "piso": 70
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": 0.13457295535219527,
    "cosechaEsperado": 70.47583998414142,
    "cosechaReal": 75.78822043581769,
    "mbProyectado": 316.2891219552556,
    "mbRealSin": 333.36155011899723,
    "futuro": 49.44923769674385,
    "mbRealCon": 382.8107878157411,
    "sorpresaSin": 17.07242816374162,
    "sorpresaCon": 66.52166586048548,
    "rProyectada": 0.0463621875882291,
    "rRealSin": 0.04886469261344438,
    "rRealCon": 0.056113044437936445,
    "sorpresaRSin": 0.002502505025215277,
    "sorpresaRCon": 0.009750856849707338,
    "comisionPlanteo": 4.711978876146794,
    "mbCoberturaPlanteo": 400.59719348240077,
    "mbSpotPlanteo": 343.6018181818192
   },
   "origenTexto": {
    "rindes": "esperado F39 · real P15",
    "cosecha": "fila 77 (F, G, I, J, O)",
    "tierra": "fila 67 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 28,
   "cosechaPlanteo": 76.5
  },
  {
   "id": "Soja|Sudeste BA|2024/25",
   "fila": 63,
   "filaDC": 73,
   "cultivo": "Soja",
   "zona": "Sudeste BA",
   "campana": "2024/25",
   "rindeEsperado": 24.83146677410583,
   "rindeReal": 28.49429331849252,
   "fs": 280.48699255751,
   "sc": 274.425,
   "fc": 276.95,
   "gc": 58.5,
   "cd": 250,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 32,
    "costoBajo": 70,
    "costoAlto": 85,
    "piso": 70
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.14750745808565258,
    "cosechaEsperado": 71.55900020144843,
    "cosechaReal": 78.42679997217347,
    "mbProyectado": 229.66726279610037,
    "mbRealSin": 286.83622850737623,
    "futuro": 5.300419599076624,
    "mbRealCon": 292.13664810645287,
    "sorpresaSin": 57.16896571127586,
    "sorpresaCon": 62.46938531035249,
    "rProyectada": 0.030136764939024077,
    "rRealSin": 0.03763843348539168,
    "rRealCon": 0.038333950545989835,
    "sorpresaRSin": 0.0075016685463676,
    "sorpresaRCon": 0.00819718560696576,
    "comisionPlanteo": 3.9268178958051396,
    "mbCoberturaPlanteo": 283.0667612652229,
    "mbSpotPlanteo": 277.09000000000003
   },
   "origenTexto": {
    "rindes": "esperado G39 · real Q15",
    "cosecha": "fila 96 (F, G, I, J, O)",
    "tierra": "fila 73 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 28,
   "cosechaPlanteo": 77.5
  },
  {
   "id": "Soja|Sudeste BA|2025/26",
   "fila": 64,
   "filaDC": 79,
   "cultivo": "Soja",
   "zona": "Sudeste BA",
   "campana": "2025/26",
   "rindeEsperado": 26.08853285538675,
   "rindeReal": 20.54633838031769,
   "fs": 322.43335799314,
   "sc": 328.657894736842,
   "fc": 331.3625,
   "gc": 57.1,
   "cd": 242,
   "tabla": {
    "rindeBajo": 24,
    "rindeAlto": 32,
    "costoBajo": 68,
    "costoAlto": 77,
    "piso": 68
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": -0.21243795140916522,
    "cosechaEsperado": 70.3495994623101,
    "cosechaReal": 68,
    "mbProyectado": 379.86620330110264,
    "mbRealSin": 247.95203951098472,
    "futuro": -27.50072808847644,
    "mbRealCon": 220.45131142250827,
    "sorpresaSin": -131.91416379011793,
    "sorpresaCon": -159.41489187859437,
    "rProyectada": 0.04657660835994048,
    "rRealSin": 0.0304021914452796,
    "rRealCon": 0.02703023934567447,
    "sorpresaRSin": -0.016174416914660882,
    "sorpresaRCon": -0.019546369014266013,
    "comisionPlanteo": 4.514067011903959,
    "mbCoberturaPlanteo": 416.3464406320457,
    "mbSpotPlanteo": 445.86210526315756
   },
   "origenTexto": {
    "rindes": "esperado H39 · real R15",
    "cosecha": "fila 115 (F, G, I, J, O)",
    "tierra": "fila 79 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 28,
   "cosechaPlanteo": 72.5
  },
  {
   "id": "Soja|Sudoeste BA|2020/21",
   "fila": 65,
   "filaDC": 50,
   "cultivo": "Soja",
   "zona": "Sudoeste BA",
   "campana": "2020/21",
   "rindeEsperado": 20.51053529201233,
   "rindeReal": 22.27177700348432,
   "fs": 297.282098934135,
   "sc": 347.157894736842,
   "fc": 352.676470588235,
   "gc": 44.7,
   "cd": 177,
   "tabla": {
    "rindeBajo": 18,
    "rindeAlto": 24,
    "costoBajo": 50,
    "costoAlto": 50,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": 0.08587009975102355,
    "cosechaEsperado": 50,
    "cosechaReal": 50,
    "mbProyectado": 291.05940543191264,
    "mbRealSin": 446.62747845222793,
    "futuro": -116.66552896996266,
    "mbRealCon": 329.96194948226525,
    "sorpresaSin": 155.5680730203153,
    "sorpresaCon": 38.90254405035262,
    "rProyectada": 0.0466367395043788,
    "rRealSin": 0.07156356736579221,
    "rRealCon": 0.05287013302843151,
    "sorpresaRSin": 0.02492682786141342,
    "sorpresaRCon": 0.0062333935240527095,
    "comisionPlanteo": 3.1214620388084175,
    "mbCoberturaPlanteo": 288.71193643494973,
    "mbSpotPlanteo": 408.1615789473683
   },
   "origenTexto": {
    "rindes": "esperado C40 · real M16",
    "cosecha": "fila 21 (F, G, I, J, O)",
    "tierra": "fila 50 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 21,
   "cosechaPlanteo": 50
  },
  {
   "id": "Soja|Sudoeste BA|2021/22",
   "fila": 66,
   "filaDC": 56,
   "cultivo": "Soja",
   "zona": "Sudoeste BA",
   "campana": "2021/22",
   "rindeEsperado": 19.65925470624779,
   "rindeReal": 20.89518261859329,
   "fs": 317.432933333333,
   "sc": 428.32,
   "fc": 427.36875,
   "gc": 51.5,
   "cd": 222,
   "tabla": {
    "rindeBajo": 18,
    "rindeAlto": 24,
    "costoBajo": 53,
    "costoAlto": 53,
    "piso": 53
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": 0.06286748560985456,
    "cosechaEsperado": 53,
    "cosechaReal": 53,
    "mbProyectado": 247.8043271179606,
    "mbRealSin": 512.3722714338323,
    "futuro": -219.24586956321244,
    "mbRealCon": 293.12640187061993,
    "sorpresaSin": 264.5679443158717,
    "sorpresaCon": 45.32207475265932,
    "rProyectada": 0.03919533298525384,
    "rRealSin": 0.08104217559405304,
    "rRealCon": 0.04636394796536044,
    "sorpresaRSin": 0.0418468426087992,
    "sorpresaRCon": 0.007168614980106598,
    "comisionPlanteo": 3.3330457999999967,
    "mbCoberturaPlanteo": 282.1237391999993,
    "mbSpotPlanteo": 516.322
   },
   "origenTexto": {
    "rindes": "esperado D40 · real N16",
    "cosecha": "fila 40 (F, G, I, J, O)",
    "tierra": "fila 56 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 21,
   "cosechaPlanteo": 53
  },
  {
   "id": "Soja|Sudoeste BA|2022/23",
   "fila": 67,
   "filaDC": 62,
   "cultivo": "Soja",
   "zona": "Sudoeste BA",
   "campana": "2022/23",
   "rindeEsperado": 19.3883953125951,
   "rindeReal": 23.80371913062361,
   "fs": 375.668410078193,
   "sc": 351.85,
   "fc": 362.481818181818,
   "gc": 56.6,
   "cd": 252,
   "tabla": {
    "rindeBajo": 18,
    "rindeAlto": 24,
    "costoBajo": 53,
    "costoAlto": 68,
    "piso": 53
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": 0.22773023485652888,
    "cosechaEsperado": 56.47098828148775,
    "cosechaReal": 67.50929782655902,
    "mbProyectado": 310.1514583542331,
    "mbRealSin": 383.2955095051031,
    "futuro": 21.92488183075307,
    "mbRealCon": 405.22039133585616,
    "sorpresaSin": 73.14405115086998,
    "sorpresaCon": 95.06893298162305,
    "rProyectada": 0.04808239131914563,
    "rRealSin": 0.059421821766340026,
    "rRealCon": 0.06282080867875448,
    "sorpresaRSin": 0.011339430447194394,
    "sorpresaRCon": 0.014738417359608848,
    "comisionPlanteo": 3.9445183058210267,
    "mbCoberturaPlanteo": 331.2723246765664,
    "mbSpotPlanteo": 307.525
   },
   "origenTexto": {
    "rindes": "esperado E40 · real O16",
    "cosecha": "fila 59 (F, G, I, J, O)",
    "tierra": "fila 62 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 21,
   "cosechaPlanteo": 60.5
  },
  {
   "id": "Soja|Sudoeste BA|2023/24",
   "fila": 68,
   "filaDC": 68,
   "cultivo": "Soja",
   "zona": "Sudoeste BA",
   "campana": "2023/24",
   "rindeEsperado": 21.65563213260181,
   "rindeReal": 22.60708798352103,
   "fs": 336.569919724771,
   "sc": 312.136363636364,
   "fc": 314.531578947368,
   "gc": 65.1,
   "cd": 250,
   "tabla": {
    "rindeBajo": 18,
    "rindeAlto": 24,
    "costoBajo": 70,
    "costoAlto": 70,
    "piso": 70
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": 0.04393572282227853,
    "cosechaEsperado": 70,
    "cosechaReal": 70,
    "mbProyectado": 267.8852716626584,
    "mbRealSin": 238.47728078563762,
    "futuro": 44.08110288460622,
    "mbRealCon": 282.5583836702438,
    "sorpresaSin": -29.40799087702078,
    "sorpresaCon": 14.673112007585416,
    "rProyectada": 0.03926707039486759,
    "rRealSin": 0.034956397991071655,
    "rRealCon": 0.04141787965189607,
    "sorpresaRSin": -0.004310672403795936,
    "sorpresaRCon": 0.002150809257028475,
    "comisionPlanteo": 3.533984157110096,
    "mbCoberturaPlanteo": 241.52289511180064,
    "mbSpotPlanteo": 198.77636363636452
   },
   "origenTexto": {
    "rindes": "esperado F40 · real P16",
    "cosecha": "fila 78 (F, G, I, J, O)",
    "tierra": "fila 68 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 21,
   "cosechaPlanteo": 70
  },
  {
   "id": "Soja|Sudoeste BA|2024/25",
   "fila": 69,
   "filaDC": 74,
   "cultivo": "Soja",
   "zona": "Sudoeste BA",
   "campana": "2024/25",
   "rindeEsperado": 22.11825308041035,
   "rindeReal": 22.96196773222429,
   "fs": 280.48699255751,
   "sc": 274.425,
   "fc": 276.95,
   "gc": 61.5,
   "cd": 220,
   "tabla": {
    "rindeBajo": 18,
    "rindeAlto": 24,
    "costoBajo": 70,
    "costoAlto": 70,
    "piso": 70
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.03814562790047815,
    "cosechaEsperado": 70,
    "cosechaReal": 70,
    "mbProyectado": 194.36097227049441,
    "mbRealSin": 198.9176979383858,
    "futuro": 4.721268509478354,
    "mbRealCon": 203.63896644786416,
    "sorpresaSin": 4.556725667891385,
    "sorpresaCon": 9.277994177369749,
    "rProyectada": 0.025503900135024044,
    "rRealSin": 0.026101830239092804,
    "rRealCon": 0.02672135153068623,
    "sorpresaRSin": 0.0005979301040687626,
    "sorpresaRCon": 0.0012174513956621847,
    "comisionPlanteo": 2.945113421853855,
    "mbCoberturaPlanteo": 161.62507094891723,
    "mbSpotPlanteo": 157.14250000000004
   },
   "origenTexto": {
    "rindes": "esperado G40 · real Q16",
    "cosecha": "fila 97 (F, G, I, J, O)",
    "tierra": "fila 74 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 21,
   "cosechaPlanteo": 70
  },
  {
   "id": "Soja|Sudoeste BA|2025/26",
   "fila": 70,
   "filaDC": 80,
   "cultivo": "Soja",
   "zona": "Sudoeste BA",
   "campana": "2025/26",
   "rindeEsperado": 22.5079468936893,
   "rindeReal": 21.5093682095855,
   "fs": 322.43335799314,
   "sc": 328.657894736842,
   "fc": 331.3625,
   "gc": 59.7,
   "cd": 212,
   "tabla": {
    "rindeBajo": 18,
    "rindeAlto": 24,
    "costoBajo": 68,
    "costoAlto": 68,
    "piso": 68
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": -0.04436560512695098,
    "cosechaEsperado": 68,
    "cosechaReal": 68,
    "mbProyectado": 311.35884689102545,
    "mbRealSin": 298.51143907696724,
    "futuro": -23.72632185889325,
    "mbRealCon": 274.785117218074,
    "sorpresaSin": -12.847407814058215,
    "sorpresaCon": -36.57372967295146,
    "rProyectada": 0.03817670259954887,
    "rRealSin": 0.03660144089688691,
    "rRealCon": 0.033692280799357495,
    "sorpresaRSin": -0.0015752617026619582,
    "sorpresaRCon": -0.004484421800191376,
    "comisionPlanteo": 3.3855502589279705,
    "mbCoberturaPlanteo": 262.67483047403437,
    "mbSpotPlanteo": 284.8115789473683
   },
   "origenTexto": {
    "rindes": "esperado H40 · real R16",
    "cosecha": "fila 116 (F, G, I, J, O)",
    "tierra": "fila 80 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 21,
   "cosechaPlanteo": 68
  },
  {
   "id": "Soja|Sur de Córdoba|2020/21",
   "fila": 71,
   "filaDC": 51,
   "cultivo": "Soja",
   "zona": "Sur de Córdoba",
   "campana": "2020/21",
   "rindeEsperado": 25.08505110999167,
   "rindeReal": 27.87251414241558,
   "fs": 297.282098934135,
   "sc": 347.157894736842,
   "fc": 352.676470588235,
   "gc": 53.7,
   "cd": 201,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 30,
    "costoBajo": 54,
    "costoAlto": 61,
    "piso": 50
   },
   "v": 6412.5,
   "excel": {
    "desvioRinde": 0.11112048447505973,
    "cosechaEsperado": 54.11907155398834,
    "cosechaReal": 58.02151979938181,
    "mbProyectado": 355.907868570194,
    "mbRealSin": 558.9194123262313,
    "futuro": -142.68573273782152,
    "mbRealCon": 416.23367958840976,
    "sorpresaSin": 203.01154375603727,
    "sorpresaCon": 60.325811018215745,
    "rProyectada": 0.05550220172634605,
    "rRealSin": 0.08716092200019201,
    "rRealCon": 0.06490973560832901,
    "sorpresaRSin": 0.03165872027384597,
    "sorpresaRCon": 0.009407533881982962,
    "comisionPlanteo": 4.087628860344356,
    "mbCoberturaPlanteo": 392.08705961719613,
    "mbSpotPlanteo": 548.5092105263157
   },
   "origenTexto": {
    "rindes": "esperado C41 · real M17",
    "cosecha": "fila 22 (F, G, I, J, O)",
    "tierra": "fila 51 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 27.5,
   "cosechaPlanteo": 57.5
  },
  {
   "id": "Soja|Sur de Córdoba|2021/22",
   "fila": 72,
   "filaDC": 57,
   "cultivo": "Soja",
   "zona": "Sur de Córdoba",
   "campana": "2021/22",
   "rindeEsperado": 24.51261382904676,
   "rindeReal": 24.55704893233258,
   "fs": 317.432933333333,
   "sc": 428.32,
   "fc": 427.36875,
   "gc": 63.2,
   "cd": 294,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 30,
    "costoBajo": 56,
    "costoAlto": 65,
    "piso": 53
   },
   "v": 6875,
   "excel": {
    "desvioRinde": 0.0018127443933850795,
    "cosechaEsperado": 54.90825497706474,
    "cosechaReal": 55.007789608424986,
    "mbProyectado": 274.28311676551345,
    "mbRealSin": 547.6191810089022,
    "futuro": -273.37197744879984,
    "mbRealCon": 274.2472035601023,
    "sorpresaSin": 273.3360642433887,
    "sorpresaCon": -0.035913205411134186,
    "rProyectada": 0.039895726074983776,
    "rRealSin": 0.07965369905584031,
    "rRealCon": 0.039890502336014884,
    "sorpresaRSin": 0.03975797298085654,
    "sorpresaRCon": -5.223738968892245e-06,
    "comisionPlanteo": 4.364702833333329,
    "mbCoberturaPlanteo": 342.8918013333324,
    "mbSpotPlanteo": 649.58
   },
   "origenTexto": {
    "rindes": "esperado D41 · real N17",
    "cosecha": "fila 41 (F, G, I, J, O)",
    "tierra": "fila 57 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 27.5,
   "cosechaPlanteo": 60.5
  },
  {
   "id": "Soja|Sur de Córdoba|2022/23",
   "fila": 73,
   "filaDC": 63,
   "cultivo": "Soja",
   "zona": "Sur de Córdoba",
   "campana": "2022/23",
   "rindeEsperado": 23.65872010177274,
   "rindeReal": 12,
   "fs": 375.668410078193,
   "sc": 351.85,
   "fc": 362.481818181818,
   "gc": 69.4,
   "cd": 330,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 30,
    "costoBajo": 71,
    "costoAlto": 75,
    "piso": 53
   },
   "v": 7000,
   "excel": {
    "desvioRinde": -0.49278743954112536,
    "cosechaEsperado": 67.19076508903458,
    "cosechaReal": 53,
    "mbProyectado": 327.4010939164576,
    "mbRealSin": -44.059999999999945,
    "futuro": 26.753871794705045,
    "mbRealCon": -17.3061282052949,
    "sorpresaSin": -371.46109391645757,
    "sorpresaCon": -344.7072221217525,
    "rProyectada": 0.046771584845208235,
    "rRealSin": -0.006294285714285706,
    "rRealCon": -0.002472304029327843,
    "sorpresaRSin": -0.05306587055949394,
    "sorpresaRCon": -0.049243888874536075,
    "comisionPlanteo": 5.165440638575154,
    "mbCoberturaPlanteo": 404.83518707645607,
    "mbSpotPlanteo": 373.7375000000002
   },
   "origenTexto": {
    "rindes": "esperado E41 · real O17",
    "cosecha": "fila 60 (F, G, I, J, O)",
    "tierra": "fila 63 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 27.5,
   "cosechaPlanteo": 73
  },
  {
   "id": "Soja|Sur de Córdoba|2023/24",
   "fila": 74,
   "filaDC": 69,
   "cultivo": "Soja",
   "zona": "Sur de Córdoba",
   "campana": "2023/24",
   "rindeEsperado": 23.1639842391102,
   "rindeReal": 28.91418937593279,
   "fs": 336.569919724771,
   "sc": 312.136363636364,
   "fc": 314.531578947368,
   "gc": 79.9,
   "cd": 313,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 30,
    "costoBajo": 72,
    "costoAlto": 82,
    "piso": 70
   },
   "v": 7437.5,
   "excel": {
    "desvioRinde": 0.24823903683693205,
    "cosechaEsperado": 70,
    "cosechaReal": 79.82837875186559,
    "mbProyectado": 211.54979751582766,
    "mbRealSin": 278.6642410641165,
    "futuro": 47.15142768445867,
    "mbRealCon": 325.81566874857515,
    "sorpresaSin": 67.11444354828882,
    "sorpresaCon": 114.26587123274749,
    "rProyectada": 0.02844367025422893,
    "rRealSin": 0.03746746098341062,
    "rRealCon": 0.04380714873930422,
    "sorpresaRSin": 0.00902379072918169,
    "sorpresaRCon": 0.015363478485075292,
    "comisionPlanteo": 4.627836396215601,
    "mbCoberturaPlanteo": 304.6276007416437,
    "mbSpotPlanteo": 248.650000000001
   },
   "origenTexto": {
    "rindes": "esperado F41 · real P17",
    "cosecha": "fila 79 (F, G, I, J, O)",
    "tierra": "fila 69 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 27.5,
   "cosechaPlanteo": 77
  },
  {
   "id": "Soja|Sur de Córdoba|2024/25",
   "fila": 75,
   "filaDC": 75,
   "cultivo": "Soja",
   "zona": "Sur de Córdoba",
   "campana": "2024/25",
   "rindeEsperado": 23.37473672841826,
   "rindeReal": 25.6694468832309,
   "fs": 280.48699255751,
   "sc": 274.425,
   "fc": 276.95,
   "gc": 75.8,
   "cd": 277,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 30,
    "costoBajo": 72,
    "costoAlto": 82,
    "piso": 70
   },
   "v": 8675,
   "excel": {
    "desvioRinde": 0.0981705240779378,
    "cosechaEsperado": 70,
    "cosechaReal": 73.33889376646181,
    "mbProyectado": 131.4504562763504,
    "mbRealSin": 159.52049495171195,
    "futuro": 4.989472180828342,
    "mbRealCon": 164.50996713254028,
    "sorpresaSin": 28.07003867536156,
    "sorpresaCon": 33.05951085618989,
    "rProyectada": 0.015152790348858835,
    "rRealSin": 0.018388529677430772,
    "rRealCon": 0.018963684972050754,
    "sorpresaRSin": 0.0032357393285719375,
    "sorpresaRCon": 0.0038108946231919178,
    "comisionPlanteo": 3.8566961476657626,
    "mbCoberturaPlanteo": 198.08878338548683,
    "mbSpotPlanteo": 192.21875
   },
   "origenTexto": {
    "rindes": "esperado G41 · real Q17",
    "cosecha": "fila 98 (F, G, I, J, O)",
    "tierra": "fila 75 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 27.5,
   "cosechaPlanteo": 77
  },
  {
   "id": "Soja|Sur de Córdoba|2025/26",
   "fila": 76,
   "filaDC": 81,
   "cultivo": "Soja",
   "zona": "Sur de Córdoba",
   "campana": "2025/26",
   "rindeEsperado": 23.80263986678237,
   "rindeReal": 25,
   "fs": 322.43335799314,
   "sc": 328.657894736842,
   "fc": 331.3625,
   "gc": 71.9,
   "cd": 273,
   "tabla": {
    "rindeBajo": 25,
    "rindeAlto": 30,
    "costoBajo": 68,
    "costoAlto": 73,
    "piso": 68
   },
   "v": 9200,
   "excel": {
    "desvioRinde": 0.05030366967357258,
    "cosechaEsperado": 68,
    "cosechaReal": 68,
    "mbProyectado": 255.33552949263742,
    "mbRealSin": 300.894736842105,
    "futuro": -25.09109770153869,
    "mbRealCon": 275.8036391405663,
    "sorpresaSin": 45.559207349467556,
    "sorpresaCon": 20.468109647928884,
    "rProyectada": 0.027753861901373633,
    "rRealSin": 0.03270594965675054,
    "rRealCon": 0.029978656428322425,
    "sorpresaRSin": 0.004952087755376909,
    "sorpresaRCon": 0.002224794526948792,
    "comisionPlanteo": 4.433458672405675,
    "mbCoberturaPlanteo": 333.59561133504496,
    "mbSpotPlanteo": 362.5842105263155
   },
   "origenTexto": {
    "rindes": "esperado H41 · real R17",
    "cosecha": "fila 117 (F, G, I, J, O)",
    "tierra": "fila 81 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 27.5,
   "cosechaPlanteo": 70.5
  },
  {
   "id": "Soja|Oeste BA|2020/21",
   "fila": 77,
   "filaDC": 52,
   "cultivo": "Soja",
   "zona": "Oeste BA",
   "campana": "2020/21",
   "rindeEsperado": 34.82884697627861,
   "rindeReal": 28.86416926825627,
   "fs": 297.282098934135,
   "sc": 347.157894736842,
   "fc": 352.676470588235,
   "gc": 54.8,
   "cd": 225,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 38,
    "costoBajo": 63,
    "costoAlto": 69,
    "piso": 50
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": -0.17125682374971507,
    "cosechaEsperado": 62.6919245573015,
    "cosechaReal": 51.95550468286128,
    "mbProyectado": 556.8452672690822,
    "mbRealSin": 566.9112713766644,
    "futuro": -198.10920573505751,
    "mbRealCon": 368.80206564160693,
    "sorpresaSin": 10.066004107582216,
    "sorpresaCon": -188.0432016274753,
    "rProyectada": 0.08922387385261596,
    "rRealSin": 0.09083675975375594,
    "rRealCon": 0.05909352366909838,
    "sorpresaRSin": 0.0016128859011399854,
    "sorpresaRCon": -0.030130350183517573,
    "comisionPlanteo": 5.425398305547963,
    "mbCoberturaPlanteo": 568.4914609464602,
    "mbSpotPlanteo": 776.1063157894732
   },
   "origenTexto": {
    "rindes": "esperado C42 · real M18",
    "cosecha": "fila 23 (F, G, I, J, O)",
    "tierra": "fila 52 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 36.5,
   "cosechaPlanteo": 66
  },
  {
   "id": "Soja|Oeste BA|2021/22",
   "fila": 78,
   "filaDC": 58,
   "cultivo": "Soja",
   "zona": "Oeste BA",
   "campana": "2021/22",
   "rindeEsperado": 33.30461094817973,
   "rindeReal": 35.51108784325527,
   "fs": 317.432933333333,
   "sc": 428.32,
   "fc": 427.36875,
   "gc": 64.7,
   "cd": 305,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 38,
    "costoBajo": 71,
    "costoAlto": 77,
    "piso": 53
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": 0.06625139379375145,
    "cosechaEsperado": 67.5607822091646,
    "cosechaReal": 72.02217568651054,
    "mbProyectado": 469.15641963672533,
    "mbRealSin": 914.2320004699375,
    "futuro": -371.42295050877874,
    "mbRealCon": 542.8090499611587,
    "sorpresaSin": 445.07558083321214,
    "sorpresaCon": 73.6526303244334,
    "rProyectada": 0.0742067029405724,
    "rRealSin": 0.14460452769711446,
    "rRealCon": 0.085856375907872,
    "sorpresaRSin": 0.07039782475654205,
    "sorpresaRCon": 0.011649672967299596,
    "comisionPlanteo": 5.793151033333326,
    "mbCoberturaPlanteo": 541.1541181333322,
    "mbSpotPlanteo": 948.213
   },
   "origenTexto": {
    "rindes": "esperado D42 · real N18",
    "cosecha": "fila 42 (F, G, I, J, O)",
    "tierra": "fila 58 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 36.5,
   "cosechaPlanteo": 74
  },
  {
   "id": "Soja|Oeste BA|2022/23",
   "fila": 79,
   "filaDC": 64,
   "cultivo": "Soja",
   "zona": "Oeste BA",
   "campana": "2022/23",
   "rindeEsperado": 33.20882417139939,
   "rindeReal": 22.72845822245353,
   "fs": 375.668410078193,
   "sc": 351.85,
   "fc": 362.481818181818,
   "gc": 71.4,
   "cd": 321,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 38,
    "costoBajo": 84,
    "costoAlto": 91,
    "piso": 53
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.31558979308794444,
    "cosechaEsperado": 79.70117801135855,
    "cosechaReal": 54.54829973388847,
    "mbProyectado": 609.7384351084373,
    "mbRealSin": 261.87131111482086,
    "futuro": 37.55336808215373,
    "mbRealCon": 299.4246791969746,
    "sorpresaSin": -347.8671239936165,
    "sorpresaCon": -310.31375591146275,
    "rProyectada": 0.09452698431526567,
    "rRealSin": 0.04059758068878573,
    "rRealCon": 0.04641943220952157,
    "sorpresaRSin": -0.05392940362647994,
    "sorpresaRCon": -0.048107552105744106,
    "comisionPlanteo": 6.855948483927022,
    "mbCoberturaPlanteo": 656.4176119378417,
    "mbSpotPlanteo": 615.1425000000002
   },
   "origenTexto": {
    "rindes": "esperado E42 · real O18",
    "cosecha": "fila 61 (F, G, I, J, O)",
    "tierra": "fila 64 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 36.5,
   "cosechaPlanteo": 87.5
  },
  {
   "id": "Soja|Oeste BA|2023/24",
   "fila": 80,
   "filaDC": 70,
   "cultivo": "Soja",
   "zona": "Oeste BA",
   "campana": "2023/24",
   "rindeEsperado": 32.49181387020911,
   "rindeReal": 32.08906371548928,
   "fs": 336.569919724771,
   "sc": 312.136363636364,
   "fc": 314.531578947368,
   "gc": 84.5,
   "cd": 302,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 38,
    "costoBajo": 85,
    "costoAlto": 93,
    "piso": 70
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": -0.012395434626353619,
    "cosechaEsperado": 78.90869082765069,
    "cosechaReal": 77.9305833090454,
    "mbProyectado": 438.1122005699304,
    "mbRealSin": 350.5331943599119,
    "futuro": 66.13868306175752,
    "mbRealCon": 416.67187742166936,
    "sorpresaSin": -87.57900621001852,
    "sorpresaCon": -21.44032314826103,
    "rProyectada": 0.064219217853431,
    "rRealSin": 0.05138174089690777,
    "rRealCon": 0.06107645948853046,
    "sorpresaRSin": -0.012837476956523233,
    "sorpresaRCon": -0.0031427583649005467,
    "comisionPlanteo": 6.142401034977071,
    "mbCoberturaPlanteo": 514.1702700752725,
    "mbSpotPlanteo": 439.87272727272864
   },
   "origenTexto": {
    "rindes": "esperado F42 · real P18",
    "cosecha": "fila 80 (F, G, I, J, O)",
    "tierra": "fila 70 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 36.5,
   "cosechaPlanteo": 89
  },
  {
   "id": "Soja|Oeste BA|2024/25",
   "fila": 81,
   "filaDC": 76,
   "cultivo": "Soja",
   "zona": "Oeste BA",
   "campana": "2024/25",
   "rindeEsperado": 31.11583017204845,
   "rindeReal": 32.94010058658365,
   "fs": 280.48699255751,
   "sc": 274.425,
   "fc": 276.95,
   "gc": 80,
   "cd": 283,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 38,
    "costoBajo": 88,
    "costoAlto": 96,
    "piso": 70
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.05862837033266599,
    "cosechaEsperado": 78.23408728972183,
    "cosechaReal": 82.82082433198174,
    "mbProyectado": 262.5978339227005,
    "mbRealSin": 274.61708132267086,
    "futuro": 6.641853160984055,
    "mbRealCon": 281.2589344836549,
    "sorpresaSin": 12.019247399970368,
    "sorpresaCon": 18.661100560954424,
    "rProyectada": 0.03445788963597854,
    "rRealSin": 0.03603504621122133,
    "rRealCon": 0.036906585171694754,
    "sorpresaRSin": 0.0015771565752427889,
    "sorpresaRCon": 0.002448695535716215,
    "comisionPlanteo": 5.118887614174557,
    "mbCoberturaPlanteo": 342.44238522073704,
    "mbSpotPlanteo": 334.65125
   },
   "origenTexto": {
    "rindes": "esperado G42 · real Q18",
    "cosecha": "fila 99 (F, G, I, J, O)",
    "tierra": "fila 76 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 36.5,
   "cosechaPlanteo": 92
  },
  {
   "id": "Soja|Oeste BA|2025/26",
   "fila": 82,
   "filaDC": 82,
   "cultivo": "Soja",
   "zona": "Oeste BA",
   "campana": "2025/26",
   "rindeEsperado": 30.4265759272076,
   "rindeReal": 38.84714853998577,
   "fs": 322.43335799314,
   "sc": 328.657894736842,
   "fc": 331.3625,
   "gc": 76.6,
   "cd": 305,
   "tabla": {
    "rindeBajo": 35,
    "rindeAlto": 40,
    "costoBajo": 82,
    "costoAlto": 94,
    "piso": 68
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.27675058254742524,
    "cosechaEsperado": 71.28512074374352,
    "cosechaReal": 91.23315649596584,
    "mbProyectado": 371.70161249812475,
    "mbRealSin": 582.9398912558539,
    "futuro": -32.07359324787583,
    "mbRealCon": 550.8662980079781,
    "sorpresaSin": 211.23827875772918,
    "sorpresaCon": 179.16468550985337,
    "rProyectada": 0.045575521806451955,
    "rRealSin": 0.07147612179356885,
    "rRealCon": 0.06754347609247653,
    "sorpresaRSin": 0.025900599987116905,
    "sorpresaRCon": 0.021967954286024584,
    "comisionPlanteo": 6.045625462371375,
    "mbCoberturaPlanteo": 512.6871972750613,
    "mbSpotPlanteo": 552.2171052631576
   },
   "origenTexto": {
    "rindes": "esperado H42 · real R18",
    "cosecha": "fila 118 (F, G, I, J, O)",
    "tierra": "fila 82 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 37.5,
   "cosechaPlanteo": 88
  },
  {
   "id": "Maíz|Norte BA / Sur SF|2020/21",
   "fila": 83,
   "filaDC": 83,
   "cultivo": "Maíz",
   "zona": "Norte BA / Sur SF",
   "campana": "2020/21",
   "rindeEsperado": 93.93552231770907,
   "rindeReal": 89.27247775239523,
   "fs": 153.443003763257,
   "sc": 212.24,
   "fc": 212.375,
   "gc": 38.8,
   "cd": 374,
   "tabla": {
    "rindeBajo": 78.33333333,
    "rindeAlto": 95,
    "costoBajo": 77.33333333,
    "costoAlto": 93,
    "piso": 60
   },
   "v": 6915.4947915,
   "excel": {
    "desvioRinde": -0.049640907403936896,
    "cosechaEsperado": 91.99939097863376,
    "cosechaReal": 87.61612908718278,
    "mbProyectado": 610.9056528786296,
    "mbRealSin": 1086.72572505036,
    "futuro": -560.7876591246219,
    "mbRealCon": 525.9380659257382,
    "sorpresaSin": 475.82007217173054,
    "sorpresaCon": -84.96758695289134,
    "rProyectada": 0.08833867587168286,
    "rRealSin": 0.15714359678010034,
    "rRealCon": 0.07605212378616513,
    "sorpresaRSin": 0.06880492090841749,
    "sorpresaRCon": -0.012286552085517731,
    "comisionPlanteo": 6.617229537290458,
    "mbCoberturaPlanteo": 522.2443029208013,
    "mbSpotPlanteo": 1037.15
   },
   "origenTexto": {
    "rindes": "esperado C43 · real M19",
    "cosecha": "fila 12 (F, G, I, J, O)",
    "tierra": "fila 83 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 86.25,
   "cosechaPlanteo": 84.77
  },
  {
   "id": "Maíz|Norte BA / Sur SF|2021/22",
   "fila": 84,
   "filaDC": 89,
   "cultivo": "Maíz",
   "zona": "Norte BA / Sur SF",
   "campana": "2021/22",
   "rindeEsperado": 93.10354188609539,
   "rindeReal": 74.27880681495964,
   "fs": 190.998497618175,
   "sc": 265.921052631579,
   "fc": 264.613333333333,
   "gc": 45.5,
   "cd": 450.666666666667,
   "tabla": {
    "rindeBajo": 78.33333333,
    "rindeAlto": 95,
    "costoBajo": 75.33333333,
    "costoAlto": 89,
    "piso": 60
   },
   "v": 7161.1458335,
   "excel": {
    "desvioRinde": -0.20219139562022548,
    "cosechaEsperado": 87.44490434652994,
    "cosechaReal": 71.43408655384013,
    "mbProyectado": 816.5309757225739,
    "mbRealSin": 1115.1605254166036,
    "futuro": -694.2715123560118,
    "mbRealCon": 420.88901306059176,
    "sorpresaSin": 298.6295496940297,
    "sorpresaCon": -395.6419626619821,
    "rProyectada": 0.11402239176624833,
    "rRealSin": 0.15572375585480439,
    "rRealCon": 0.058773975959498494,
    "sorpresaRSin": 0.041701364088556056,
    "sorpresaRCon": -0.055248415806749836,
    "comisionPlanteo": 8.236810209783798,
    "mbCoberturaPlanteo": 725.4801440276807,
    "mbSpotPlanteo": 1368.644912280702
   },
   "origenTexto": {
    "rindes": "esperado D43 · real N19",
    "cosecha": "fila 31 (F, G, I, J, O)",
    "tierra": "fila 89 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 86.25,
   "cosechaPlanteo": 81.82
  },
  {
   "id": "Maíz|Norte BA / Sur SF|2022/23",
   "fila": 85,
   "filaDC": 95,
   "cultivo": "Maíz",
   "zona": "Norte BA / Sur SF",
   "campana": "2022/23",
   "rindeEsperado": 88.39853389490989,
   "rindeReal": 44.37793651272056,
   "fs": 246.021527975007,
   "sc": 237.611111111111,
   "fc": 240.921428571429,
   "gc": 53.1,
   "cd": 617.666666666667,
   "tabla": {
    "rindeBajo": 78.33333333,
    "rindeAlto": 95,
    "costoBajo": 100,
    "costoAlto": 117,
    "piso": 80
   },
   "v": 7575.2083335,
   "excel": {
    "desvioRinde": -0.49797881755054874,
    "cosechaEsperado": 110.26650457415478,
    "cosechaReal": 80,
    "mbProyectado": 977.4648517348245,
    "mbRealSin": 121.15557081137433,
    "futuro": 34.21015980967174,
    "mbRealCon": 155.36573062104605,
    "sorpresaSin": -856.3092809234502,
    "sorpresaCon": -822.0991211137784,
    "rProyectada": 0.1290347154430277,
    "rRealSin": 0.01599369488962905,
    "rRealCon": 0.02050976339937332,
    "sorpresaRSin": -0.11304102055339864,
    "sorpresaRCon": -0.10852495204365438,
    "comisionPlanteo": 10.609678393922177,
    "mbCoberturaPlanteo": 899.0403456286034,
    "mbSpotPlanteo": 865.6616666666654
   },
   "origenTexto": {
    "rindes": "esperado E43 · real O19",
    "cosecha": "fila 50 (F, G, I, J, O)",
    "tierra": "fila 95 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 86.25,
   "cosechaPlanteo": 108.08
  },
  {
   "id": "Maíz|Norte BA / Sur SF|2023/24",
   "fila": 86,
   "filaDC": 101,
   "cultivo": "Maíz",
   "zona": "Norte BA / Sur SF",
   "campana": "2023/24",
   "rindeEsperado": 80.84932640476516,
   "rindeReal": 93.35513001195588,
   "fs": 187.253918752565,
   "sc": 178.42,
   "fc": 177.4,
   "gc": 47.5,
   "cd": 558.666666666667,
   "tabla": {
    "rindeBajo": 78.33333333,
    "rindeAlto": 95,
    "costoBajo": 83,
    "costoAlto": 99,
    "piso": 65
   },
   "v": 7836.0677085,
   "excel": {
    "desvioRinde": 0.1546803685732827,
    "cosechaEsperado": 85.41535335129149,
    "cosechaReal": 97.42092481179345,
    "mbProyectado": 485.8189993391575,
    "mbRealSin": 566.1177706380657,
    "futuro": 72.0985927603176,
    "mbRealCon": 638.2163633983834,
    "sorpresaSin": 80.29877129890826,
    "sorpresaCon": 152.39736405922588,
    "rProyectada": 0.06199780520173098,
    "rRealSin": 0.07224513514909807,
    "rRealCon": 0.08144599908268944,
    "sorpresaRSin": 0.01024732994736709,
    "sorpresaRCon": 0.01944819388095846,
    "comisionPlanteo": 8.075325246204367,
    "mbCoberturaPlanteo": 556.8330573280017,
    "mbSpotPlanteo": 479.91833333333295
   },
   "origenTexto": {
    "rindes": "esperado F43 · real P19",
    "cosecha": "fila 69 (F, G, I, J, O)",
    "tierra": "fila 101 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 86.25,
   "cosechaPlanteo": 90.6
  },
  {
   "id": "Maíz|Norte BA / Sur SF|2024/25",
   "fila": 87,
   "filaDC": 107,
   "cultivo": "Maíz",
   "zona": "Norte BA / Sur SF",
   "campana": "2024/25",
   "rindeEsperado": 78.93141916779297,
   "rindeReal": 85.69336994754131,
   "fs": 178.943553927181,
   "sc": 202.552631578947,
   "fc": 201.8875,
   "gc": 56.2,
   "cd": 485.666666666667,
   "tabla": {
    "rindeBajo": 78.33333333,
    "rindeAlto": 95,
    "costoBajo": 95,
    "costoAlto": 112,
    "piso": 72
   },
   "v": 8410.4166665,
   "excel": {
    "desvioRinde": 0.08566868366288638,
    "cosechaEsperado": 95.61004755442681,
    "cosechaReal": 102.50723734839069,
    "mbProyectado": 387.55557629599855,
    "mbRealSin": 665.9711160540347,
    "futuro": -188.16195681489174,
    "mbRealCon": 477.809159239143,
    "sorpresaSin": 278.4155397580362,
    "sorpresaCon": 90.25358294314447,
    "rProyectada": 0.04608042522312751,
    "rRealSin": 0.07918408117717896,
    "rRealCon": 0.056811591884898094,
    "sorpresaRSin": 0.03310365595405144,
    "sorpresaRCon": 0.010731166661770581,
    "comisionPlanteo": 7.716940763109681,
    "mbCoberturaPlanteo": 467.9363050605775,
    "mbSpotPlanteo": 673.5447807017509
   },
   "origenTexto": {
    "rindes": "esperado G43 · real Q19",
    "cosecha": "fila 88 (F, G, I, J, O)",
    "tierra": "fila 107 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 86.25,
   "cosechaPlanteo": 103.08
  },
  {
   "id": "Maíz|Norte BA / Sur SF|2025/26",
   "fila": 88,
   "filaDC": 113,
   "cultivo": "Maíz",
   "zona": "Norte BA / Sur SF",
   "campana": "2025/26",
   "rindeEsperado": 77.39554420791453,
   "rindeReal": 93.44583901803007,
   "fs": 176.638736681887,
   "sc": 187.925,
   "fc": 187.894117647059,
   "gc": 54.3,
   "cd": 546.666666666667,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 95,
    "costoBajo": 83,
    "costoAlto": 101,
    "piso": 77
   },
   "v": 9427.8645835,
   "excel": {
    "desvioRinde": 0.20738008853582346,
    "cosechaEsperado": 80.29787711571132,
    "cosechaReal": 99.13500682163608,
    "mbProyectado": 319.88276653796163,
    "mbRealSin": 602.8683503901239,
    "futuro": -93.94715908353555,
    "mbRealCon": 508.9211913065883,
    "sorpresaSin": 282.9855838521622,
    "sorpresaCon": 189.03842476862667,
    "rProyectada": 0.03392950372853238,
    "rRealSin": 0.06394537650076376,
    "rRealCon": 0.053980536822438786,
    "sorpresaRSin": 0.030015872772231382,
    "sorpresaRCon": 0.02005103309390641,
    "comisionPlanteo": 7.727944729832557,
    "mbCoberturaPlanteo": 424.3395551582456,
    "mbSpotPlanteo": 530.552083333333
   },
   "origenTexto": {
    "rindes": "esperado H43 · real R19",
    "cosecha": "fila 107 (F, G, I, J, O)",
    "tierra": "fila 113 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 87.5,
   "cosechaPlanteo": 92
  },
  {
   "id": "Maíz|Sur Entre Ríos|2020/21",
   "fila": 89,
   "filaDC": 84,
   "cultivo": "Maíz",
   "zona": "Sur Entre Ríos",
   "campana": "2020/21",
   "rindeEsperado": 66.49680728014155,
   "rindeReal": 46.68793706293706,
   "fs": 153.443003763257,
   "sc": 212.24,
   "fc": 212.375,
   "gc": 28.1,
   "cd": 344,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 67,
    "costoAlto": 83,
    "piso": 60
   },
   "v": 5500,
   "excel": {
    "desvioRinde": -0.2978920496701827,
    "cosechaEsperado": 68.19744582411325,
    "cosechaReal": 60,
    "mbProyectado": 421.29351069182263,
    "mbRealSin": 455.71167307692315,
    "futuro": -396.9806945637384,
    "mbRealCon": 58.730978513184766,
    "sorpresaSin": 34.418162385100516,
    "sorpresaCon": -362.56253217863787,
    "rProyectada": 0.07659882012578594,
    "rRealSin": 0.08285666783216784,
    "rRealCon": 0.010678359729669958,
    "sorpresaRSin": 0.006257847706381912,
    "sorpresaRCon": -0.06592046039611597,
    "comisionPlanteo": 5.754112641122137,
    "mbCoberturaPlanteo": 514.3059155833055,
    "mbSpotPlanteo": 962.0500000000002
   },
   "origenTexto": {
    "rindes": "esperado C44 · real M20",
    "cosecha": "fila 13 (F, G, I, J, O)",
    "tierra": "fila 84 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 75,
   "cosechaPlanteo": 75
  },
  {
   "id": "Maíz|Sur Entre Ríos|2021/22",
   "fila": 90,
   "filaDC": 90,
   "cultivo": "Maíz",
   "zona": "Sur Entre Ríos",
   "campana": "2021/22",
   "rindeEsperado": 62.29993746884367,
   "rindeReal": 39.93718298868514,
   "fs": 190.998497618175,
   "sc": 265.921052631579,
   "fc": 264.613333333333,
   "gc": 32.6,
   "cd": 424,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 65,
    "costoAlto": 80,
    "piso": 60
   },
   "v": 5325,
   "excel": {
    "desvioRinde": -0.3589530806727085,
    "cosechaEsperado": 62.29993746884367,
    "cosechaReal": 60,
    "mbProyectado": 500.521712208265,
    "mbRealSin": 447.81855740600076,
    "futuro": -464.569563412482,
    "mbRealCon": -16.751006006481248,
    "sorpresaSin": -52.70315480226424,
    "sorpresaCon": -517.2727182147462,
    "rProyectada": 0.09399468773864131,
    "rRealSin": 0.08409738167248841,
    "rRealCon": -0.0031457288275082156,
    "sorpresaRSin": -0.009897306066152908,
    "sorpresaRCon": -0.09714041656614952,
    "comisionPlanteo": 7.1624436606815625,
    "mbCoberturaPlanteo": 694.1341832124762,
    "mbSpotPlanteo": 1253.4078947368428
   },
   "origenTexto": {
    "rindes": "esperado D44 · real N20",
    "cosecha": "fila 32 (F, G, I, J, O)",
    "tierra": "fila 90 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 75,
   "cosechaPlanteo": 72.5
  },
  {
   "id": "Maíz|Sur Entre Ríos|2022/23",
   "fila": 91,
   "filaDC": 96,
   "cultivo": "Maíz",
   "zona": "Sur Entre Ríos",
   "campana": "2022/23",
   "rindeEsperado": 56.61868966335883,
   "rindeReal": 23.44444444444445,
   "fs": 246.021527975007,
   "sc": 237.611111111111,
   "fc": 240.921428571429,
   "gc": 37.9,
   "cd": 618,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 87,
    "costoAlto": 105,
    "piso": 80
   },
   "v": 5575,
   "excel": {
    "desvioRinde": -0.5859239310581099,
    "cosechaEsperado": 80,
    "cosechaReal": 80,
    "mbProyectado": 480.35682046809734,
    "mbRealSin": -229.78839506172858,
    "futuro": 21.911386266885202,
    "mbRealCon": -207.8770087948434,
    "sorpresaSin": -710.1452155298259,
    "sorpresaCon": -688.2338292629407,
    "rProyectada": 0.08616265837992777,
    "rRealSin": -0.04121764933842665,
    "rRealCon": -0.03728735583764007,
    "sorpresaRSin": -0.12738030771835443,
    "sorpresaRCon": -0.12345001421756785,
    "comisionPlanteo": 9.225807299062762,
    "mbCoberturaPlanteo": 812.8582715611046,
    "mbSpotPlanteo": 783.8333333333326
   },
   "origenTexto": {
    "rindes": "esperado E44 · real O20",
    "cosecha": "fila 51 (F, G, I, J, O)",
    "tierra": "fila 96 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 75,
   "cosechaPlanteo": 96
  },
  {
   "id": "Maíz|Sur Entre Ríos|2023/24",
   "fila": 92,
   "filaDC": 102,
   "cultivo": "Maíz",
   "zona": "Sur Entre Ríos",
   "campana": "2023/24",
   "rindeEsperado": 51.44194558891682,
   "rindeReal": 56.66666666666667,
   "fs": 187.253918752565,
   "sc": 178.42,
   "fc": 177.4,
   "gc": 32.5,
   "cd": 566,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 72,
    "costoAlto": 88,
    "piso": 65
   },
   "v": 5575,
   "excel": {
    "desvioRinde": 0.10156538633864409,
    "cosechaEsperado": 65,
    "cosechaReal": 65,
    "mbProyectado": 165.08426681411026,
    "mbRealSin": 195.88,
    "futuro": 45.8741222808151,
    "mbRealCon": 241.7541222808151,
    "sorpresaSin": 30.79573318588973,
    "sorpresaCon": 76.66985546670483,
    "rProyectada": 0.029611527679661034,
    "rRealSin": 0.03513542600896861,
    "rRealCon": 0.0433639681221193,
    "sorpresaRSin": 0.005523898329307575,
    "sorpresaRCon": 0.013752440442458266,
    "comisionPlanteo": 7.022021953221187,
    "mbCoberturaPlanteo": 515.2823686910162,
    "mbSpotPlanteo": 448.39999999999986
   },
   "origenTexto": {
    "rindes": "esperado F44 · real P20",
    "cosecha": "fila 70 (F, G, I, J, O)",
    "tierra": "fila 102 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 75,
   "cosechaPlanteo": 80
  },
  {
   "id": "Maíz|Sur Entre Ríos|2024/25",
   "fila": 93,
   "filaDC": 108,
   "cultivo": "Maíz",
   "zona": "Sur Entre Ríos",
   "campana": "2024/25",
   "rindeEsperado": 47.53247700177743,
   "rindeReal": 66.70043415340086,
   "fs": 178.943553927181,
   "sc": 202.552631578947,
   "fc": 201.8875,
   "gc": 38,
   "cd": 481,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 81,
    "costoAlto": 101,
    "piso": 72
   },
   "v": 5875,
   "excel": {
    "desvioRinde": 0.403260220394293,
    "cosechaEsperado": 72,
    "cosechaReal": 82.70043415340086,
    "mbProyectado": 116.93962355925089,
    "mbRealSin": 533.8727625866377,
    "futuro": -113.31107408445904,
    "mbRealCon": 420.56168850217864,
    "sorpresaSin": 416.9331390273868,
    "sorpresaCon": 303.62206494292775,
    "rProyectada": 0.019904616776042706,
    "rRealSin": 0.09087195958921493,
    "rRealCon": 0.07158496825568998,
    "sorpresaRSin": 0.07096734281317223,
    "sorpresaRCon": 0.05168035147964728,
    "comisionPlanteo": 6.710383272269287,
    "mbCoberturaPlanteo": 483.3547580236908,
    "mbSpotPlanteo": 662.1447368421025
   },
   "origenTexto": {
    "rindes": "esperado G44 · real Q20",
    "cosecha": "fila 89 (F, G, I, J, O)",
    "tierra": "fila 108 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 75,
   "cosechaPlanteo": 91
  },
  {
   "id": "Maíz|Sur Entre Ríos|2025/26",
   "fila": 94,
   "filaDC": 114,
   "cultivo": "Maíz",
   "zona": "Sur Entre Ríos",
   "campana": "2025/26",
   "rindeEsperado": 46.68733306322683,
   "rindeReal": 62.2031746031746,
   "fs": 176.638736681887,
   "sc": 187.925,
   "fc": 187.894117647059,
   "gc": 36.8,
   "cd": 555,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 77,
    "costoAlto": 91,
    "piso": 77
   },
   "v": 6875,
   "excel": {
    "desvioRinde": 0.33233514364453565,
    "cosechaEsperado": 77,
    "cosechaReal": 77,
    "mbProyectado": 20.869767460813364,
    "mbRealSin": 308.04547619047617,
    "futuro": -56.67176775311634,
    "mbRealCon": 251.37370843735982,
    "sorpresaSin": 287.1757087296628,
    "sorpresaCon": 230.50394097654646,
    "rProyectada": 0.003035602539754671,
    "rRealSin": 0.04480661471861472,
    "rRealCon": 0.03656344849997961,
    "sorpresaRSin": 0.04177101217886004,
    "sorpresaRCon": 0.03352784596022494,
    "comisionPlanteo": 6.623952625570762,
    "mbCoberturaPlanteo": 403.39819013563925,
    "mbSpotPlanteo": 494.4375
   },
   "origenTexto": {
    "rindes": "esperado H44 · real R20",
    "cosecha": "fila 108 (F, G, I, J, O)",
    "tierra": "fila 114 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 75,
   "cosechaPlanteo": 84
  },
  {
   "id": "Maíz|Sudeste BA|2020/21",
   "fila": 95,
   "filaDC": 85,
   "cultivo": "Maíz",
   "zona": "Sudeste BA",
   "campana": "2020/21",
   "rindeEsperado": 68.05438550557834,
   "rindeReal": 71.80397065818792,
   "fs": 153.443003763257,
   "sc": 212.24,
   "fc": 212.375,
   "gc": 37,
   "cd": 348,
   "tabla": {
    "rindeBajo": 70,
    "rindeAlto": 90,
    "costoBajo": 71,
    "costoAlto": 86,
    "piso": 60
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": 0.05509689235680826,
    "cosechaEsperado": 69.02659101280089,
    "cosechaReal": 72.35297799364093,
    "mbProyectado": 375.41911574041916,
    "mbRealSin": 837.9398038204442,
    "futuro": -406.27931371647935,
    "mbRealCon": 431.6604901039649,
    "sorpresaSin": 462.5206880800251,
    "sorpresaCon": 56.24137436354573,
    "rProyectada": 0.06015378022149459,
    "rRealSin": 0.1342639324543869,
    "rRealCon": 0.06916539186025508,
    "sorpresaRSin": 0.07411015223289232,
    "sorpresaRCon": 0.009011611638760483,
    "comisionPlanteo": 6.13772015053028,
    "mbCoberturaPlanteo": 497.82630995552574,
    "mbSpotPlanteo": 975.4200000000001
   },
   "origenTexto": {
    "rindes": "esperado C45 · real M21",
    "cosecha": "fila 14 (F, G, I, J, O)",
    "tierra": "fila 85 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 80,
   "cosechaPlanteo": 78.5
  },
  {
   "id": "Maíz|Sudeste BA|2021/22",
   "fila": 96,
   "filaDC": 91,
   "cultivo": "Maíz",
   "zona": "Sudeste BA",
   "campana": "2021/22",
   "rindeEsperado": 68.44387157426293,
   "rindeReal": 57.31884576029597,
   "fs": 190.998497618175,
   "sc": 265.921052631579,
   "fc": 264.613333333333,
   "gc": 43.2,
   "cd": 450,
   "tabla": {
    "rindeBajo": 70,
    "rindeAlto": 90,
    "costoBajo": 68,
    "costoAlto": 82,
    "piso": 60
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": -0.1625423220236174,
    "cosechaEsperado": 66.48833238642685,
    "cosechaReal": 60,
    "mbProyectado": 495.1018065983107,
    "mbRealSin": 766.611366336024,
    "futuro": -510.38477448580153,
    "mbRealCon": 256.2265918502225,
    "sorpresaSin": 271.50955973771335,
    "sorpresaCon": -238.87521474808818,
    "rProyectada": 0.07831049762897797,
    "rRealSin": 0.12125529898240046,
    "rRealCon": 0.040527486763641346,
    "sorpresaRSin": 0.04294480135342249,
    "sorpresaRCon": -0.03778301086533662,
    "comisionPlanteo": 7.639939904727001,
    "mbCoberturaPlanteo": 660.2097954266412,
    "mbSpotPlanteo": 1256.7684210526322
   },
   "origenTexto": {
    "rindes": "esperado D45 · real N21",
    "cosecha": "fila 33 (F, G, I, J, O)",
    "tierra": "fila 91 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 80,
   "cosechaPlanteo": 75
  },
  {
   "id": "Maíz|Sudeste BA|2022/23",
   "fila": 97,
   "filaDC": 97,
   "cultivo": "Maíz",
   "zona": "Sudeste BA",
   "campana": "2022/23",
   "rindeEsperado": 66.9094808165459,
   "rindeReal": 55.73043497687719,
   "fs": 246.021527975007,
   "sc": 237.611111111111,
   "fc": 240.921428571429,
   "gc": 50.4,
   "cd": 645,
   "tabla": {
    "rindeBajo": 70,
    "rindeAlto": 90,
    "costoBajo": 93,
    "costoAlto": 110,
    "piso": 80
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.16707715712695026,
    "cosechaEsperado": 88.89402451341097,
    "cosechaReal": 80,
    "mbProyectado": 574.9994628213016,
    "mbRealSin": 318.33566547267014,
    "futuro": 25.893913967367318,
    "mbRealCon": 344.22957944003747,
    "sorpresaSin": -256.6637973486314,
    "sorpresaCon": -230.7698833812641,
    "rProyectada": 0.08914144504229769,
    "rRealSin": 0.04935117867676037,
    "rRealCon": 0.05336547965980218,
    "sorpresaRSin": -0.03979026636553731,
    "sorpresaRCon": -0.035775965382495514,
    "comisionPlanteo": 9.84086111900028,
    "mbCoberturaPlanteo": 782.1488229985116,
    "mbSpotPlanteo": 751.188888888888
   },
   "origenTexto": {
    "rindes": "esperado E45 · real O21",
    "cosecha": "fila 52 (F, G, I, J, O)",
    "tierra": "fila 97 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 80,
   "cosechaPlanteo": 101.5
  },
  {
   "id": "Maíz|Sudeste BA|2023/24",
   "fila": 98,
   "filaDC": 103,
   "cultivo": "Maíz",
   "zona": "Sudeste BA",
   "campana": "2023/24",
   "rindeEsperado": 66.25208774379408,
   "rindeReal": 65.46936573938035,
   "fs": 187.253918752565,
   "sc": 178.42,
   "fc": 177.4,
   "gc": 44.9,
   "cd": 558,
   "tabla": {
    "rindeBajo": 70,
    "rindeAlto": 90,
    "costoBajo": 74,
    "costoAlto": 88,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": -0.011814299459371291,
    "cosechaEsperado": 70.03792132915373,
    "cosechaReal": 69.21047235305923,
    "mbProyectado": 315.0865102576331,
    "mbRealSin": 246.93649899914715,
    "futuro": 59.08128745373327,
    "mbRealCon": 306.0177864528804,
    "sorpresaSin": -68.15001125848596,
    "sorpresaCon": -9.068723804752722,
    "rProyectada": 0.04618590675765138,
    "rRealSin": 0.03619636432073877,
    "rRealCon": 0.04485659808075902,
    "sorpresaRSin": -0.009989542436912602,
    "sorpresaRCon": -0.0013293086768923516,
    "comisionPlanteo": 7.4901567501026,
    "mbCoberturaPlanteo": 500.5011932704172,
    "mbSpotPlanteo": 429.15999999999985
   },
   "origenTexto": {
    "rindes": "esperado F45 · real P21",
    "cosecha": "fila 71 (F, G, I, J, O)",
    "tierra": "fila 103 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 80,
   "cosechaPlanteo": 81
  },
  {
   "id": "Maíz|Sudeste BA|2024/25",
   "fila": 99,
   "filaDC": 109,
   "cultivo": "Maíz",
   "zona": "Sudeste BA",
   "campana": "2024/25",
   "rindeEsperado": 64.29933955980712,
   "rindeReal": 61.75111893397221,
   "fs": 178.943553927181,
   "sc": 202.552631578947,
   "fc": 201.8875,
   "gc": 52.9,
   "cd": 490,
   "tabla": {
    "rindeBajo": 70,
    "rindeAlto": 90,
    "costoBajo": 84,
    "costoAlto": 102,
    "piso": 72
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": -0.03963058786108875,
    "cosechaEsperado": 77.15920747176855,
    "cosechaReal": 74.10134272076665,
    "mbProyectado": 243.2925198570986,
    "mbRealSin": 360.0204024205814,
    "futuro": -153.28103410581036,
    "mbRealCon": 206.739368314771,
    "sorpresaSin": 116.72788256348278,
    "sorpresaCon": -36.55315154232758,
    "rProyectada": 0.031924660890244747,
    "rRealSin": 0.04724160556846302,
    "rRealCon": 0.027128183924393274,
    "sorpresaRSin": 0.015316944678218274,
    "sorpresaRCon": -0.00479647696585147,
    "comisionPlanteo": 7.15774215708724,
    "mbCoberturaPlanteo": 423.5117418919368,
    "mbSpotPlanteo": 614.221052631576
   },
   "origenTexto": {
    "rindes": "esperado G45 · real Q21",
    "cosecha": "fila 90 (F, G, I, J, O)",
    "tierra": "fila 109 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 80,
   "cosechaPlanteo": 93
  },
  {
   "id": "Maíz|Sudeste BA|2025/26",
   "fila": 100,
   "filaDC": 115,
   "cultivo": "Maíz",
   "zona": "Sudeste BA",
   "campana": "2025/26",
   "rindeEsperado": 62.41474721374273,
   "rindeReal": 60.57409789867059,
   "fs": 176.638736681887,
   "sc": 187.925,
   "fc": 187.894117647059,
   "gc": 51.2,
   "cd": 502,
   "tabla": {
    "rindeBajo": 70,
    "rindeAlto": 90,
    "costoBajo": 77,
    "costoAlto": 93,
    "piso": 77
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": -0.029490615555466948,
    "cosechaEsperado": 77,
    "cosechaReal": 77,
    "mbProyectado": 203.9227040811213,
    "mbRealSin": 249.19935351957372,
    "futuro": -75.76260682263568,
    "mbRealCon": 173.43674669693803,
    "sorpresaSin": 45.27664943845241,
    "sorpresaCon": -30.48595738418328,
    "rProyectada": 0.025003614012373113,
    "rRealSin": 0.03055512859940138,
    "rRealCon": 0.0212656334149378,
    "sorpresaRSin": 0.0055515145870282685,
    "sorpresaRCon": -0.0037379805974353144,
    "comisionPlanteo": 7.06554946727548,
    "mbCoberturaPlanteo": 409.6914028113485,
    "mbSpotPlanteo": 506.8000000000002
   },
   "origenTexto": {
    "rindes": "esperado H45 · real R21",
    "cosecha": "fila 109 (F, G, I, J, O)",
    "tierra": "fila 115 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 80,
   "cosechaPlanteo": 85
  },
  {
   "id": "Maíz|Sudoeste BA|2020/21",
   "fila": 101,
   "filaDC": 86,
   "cultivo": "Maíz",
   "zona": "Sudoeste BA",
   "campana": "2020/21",
   "rindeEsperado": 59.67854900438378,
   "rindeReal": 47.41318004029868,
   "fs": 153.443003763257,
   "sc": 212.24,
   "fc": 212.375,
   "gc": 39.8,
   "cd": 323,
   "tabla": {
    "rindeBajo": 60,
    "rindeAlto": 70,
    "costoBajo": 60,
    "costoAlto": 71,
    "piso": 60
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": -0.20552391384690227,
    "cosechaEsperado": 60,
    "cosechaReal": 60,
    "mbProyectado": 295.20495690909036,
    "mbRealSin": 434.5928766149103,
    "futuro": -356.2762304437955,
    "mbRealCon": 78.31664617111483,
    "sorpresaSin": 139.38791970581997,
    "sorpresaCon": -216.88831073797553,
    "rProyectada": 0.04730098536187388,
    "rRealSin": 0.06963525108241,
    "rRealCon": 0.012548754509131638,
    "sorpresaRSin": 0.02233426572053613,
    "sorpresaRCon": -0.03475223085274224,
    "comisionPlanteo": 4.986897622305853,
    "mbCoberturaPlanteo": 344.31512683886467,
    "mbSpotPlanteo": 732.3599999999999
   },
   "origenTexto": {
    "rindes": "esperado C46 · real M22",
    "cosecha": "fila 15 (F, G, I, J, O)",
    "tierra": "fila 86 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 65,
   "cosechaPlanteo": 65.5
  },
  {
   "id": "Maíz|Sudoeste BA|2021/22",
   "fila": 102,
   "filaDC": 92,
   "cultivo": "Maíz",
   "zona": "Sudoeste BA",
   "campana": "2021/22",
   "rindeEsperado": 56.7624859174209,
   "rindeReal": 46.39409686524478,
   "fs": 190.998497618175,
   "sc": 265.921052631579,
   "fc": 264.613333333333,
   "gc": 46.7,
   "cd": 399,
   "tabla": {
    "rindeBajo": 60,
    "rindeAlto": 70,
    "costoBajo": 60,
    "costoAlto": 68,
    "piso": 60
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": -0.18266270203986923,
    "cosechaEsperado": 60,
    "cosechaReal": 60,
    "mbProyectado": 360.0741438956653,
    "mbRealSin": 558.0562750690401,
    "futuro": -423.276882325141,
    "mbRealCon": 134.7793927438991,
    "sorpresaSin": 197.9821311733748,
    "sorpresaCon": -225.2947511517662,
    "rProyectada": 0.05695310543408141,
    "rRealSin": 0.0882680370445238,
    "rRealCon": 0.021318123212726355,
    "sorpresaRSin": 0.03131493161044239,
    "sorpresaRCon": -0.035634982221355055,
    "comisionPlanteo": 6.207451172590688,
    "mbCoberturaPlanteo": 477.23295878414604,
    "mbSpotPlanteo": 961.9368421052636
   },
   "origenTexto": {
    "rindes": "esperado D46 · real N22",
    "cosecha": "fila 34 (F, G, I, J, O)",
    "tierra": "fila 92 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 65,
   "cosechaPlanteo": 64
  },
  {
   "id": "Maíz|Sudoeste BA|2022/23",
   "fila": 103,
   "filaDC": 98,
   "cultivo": "Maíz",
   "zona": "Sudoeste BA",
   "campana": "2022/23",
   "rindeEsperado": 54.21200862204046,
   "rindeReal": 48.74634862875361,
   "fs": 246.021527975007,
   "sc": 237.611111111111,
   "fc": 240.921428571429,
   "gc": 54.7,
   "cd": 539,
   "tabla": {
    "rindeBajo": 60,
    "rindeAlto": 70,
    "costoBajo": 80,
    "costoAlto": 93,
    "piso": 80
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.10082009746941434,
    "cosechaEsperado": 80,
    "cosechaReal": 80,
    "mbProyectado": 418.1924324163033,
    "mbRealSin": 272.62487902949033,
    "futuro": 20.98000268610899,
    "mbRealCon": 293.60488171559933,
    "sorpresaSin": -145.56755338681296,
    "sorpresaCon": -124.58755070070396,
    "rProyectada": 0.0648318479263137,
    "rRealSin": 0.042264692825848785,
    "rRealCon": 0.045517196310382056,
    "sorpresaRSin": -0.022567155100464916,
    "sorpresaRCon": -0.01931465161593164,
    "comisionPlanteo": 7.995699659187728,
    "mbCoberturaPlanteo": 588.5771686862906,
    "mbSpotPlanteo": 563.4222222222213
   },
   "origenTexto": {
    "rindes": "esperado E46 · real O22",
    "cosecha": "fila 53 (F, G, I, J, O)",
    "tierra": "fila 98 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 65,
   "cosechaPlanteo": 86.5
  },
  {
   "id": "Maíz|Sudoeste BA|2023/24",
   "fila": 104,
   "filaDC": 104,
   "cultivo": "Maíz",
   "zona": "Sudoeste BA",
   "campana": "2023/24",
   "rindeEsperado": 53.6067412633922,
   "rindeReal": 36.54713125382517,
   "fs": 187.253918752565,
   "sc": 178.42,
   "fc": 177.4,
   "gc": 48.5,
   "cd": 463,
   "tabla": {
    "rindeBajo": 60,
    "rindeAlto": 70,
    "costoBajo": 65,
    "costoAlto": 74,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": -0.31823628162260553,
    "cosechaEsperado": 65,
    "cosechaReal": 65,
    "mbProyectado": 215.8145421850495,
    "mbRealSin": -53.179670750303444,
    "futuro": 47.804611113361496,
    "mbRealCon": -5.375059636941948,
    "sorpresaSin": -268.99421293535295,
    "sorpresaCon": -221.18960182199146,
    "rProyectada": 0.031634455928163455,
    "rRealSin": -0.007795164929999137,
    "rRealCon": -0.0007878852160494937,
    "sorpresaRSin": -0.03942962085816259,
    "sorpresaRCon": -0.03242234114421295,
    "comisionPlanteo": 6.085752359458363,
    "mbCoberturaPlanteo": 369.94471953221404,
    "mbSpotPlanteo": 311.9799999999999
   },
   "origenTexto": {
    "rindes": "esperado F46 · real P22",
    "cosecha": "fila 72 (F, G, I, J, O)",
    "tierra": "fila 104 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 65,
   "cosechaPlanteo": 69.5
  },
  {
   "id": "Maíz|Sudoeste BA|2024/25",
   "fila": 105,
   "filaDC": 110,
   "cultivo": "Maíz",
   "zona": "Sudoeste BA",
   "campana": "2024/25",
   "rindeEsperado": 49.11868755997624,
   "rindeReal": 56.76656953887424,
   "fs": 178.943553927181,
   "sc": 202.552631578947,
   "fc": 201.8875,
   "gc": 57.8,
   "cd": 413,
   "tabla": {
    "rindeBajo": 60,
    "rindeAlto": 70,
    "costoBajo": 72,
    "costoAlto": 84,
    "piso": 72
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.15570208323582713,
    "cosechaEsperado": 72,
    "cosechaReal": 72,
    "mbProyectado": 110.04123752543364,
    "mbRealSin": 336.71103264613384,
    "futuro": -117.09238811248444,
    "mbRealCon": 219.6186445336494,
    "sorpresaSin": 226.6697951207002,
    "sorpresaCon": 109.57740700821574,
    "rProyectada": 0.01443952816143206,
    "rRealSin": 0.04418296765369424,
    "rRealCon": 0.028818192832357196,
    "sorpresaRSin": 0.02974343949226218,
    "sorpresaRCon": 0.014378664670925136,
    "comisionPlanteo": 5.815665502633383,
    "mbCoberturaPlanteo": 294.9407902871987,
    "mbSpotPlanteo": 449.8921052631554
   },
   "origenTexto": {
    "rindes": "esperado G46 · real Q22",
    "cosecha": "fila 91 (F, G, I, J, O)",
    "tierra": "fila 110 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 65,
   "cosechaPlanteo": 78
  },
  {
   "id": "Maíz|Sudoeste BA|2025/26",
   "fila": 106,
   "filaDC": 116,
   "cultivo": "Maíz",
   "zona": "Sudoeste BA",
   "campana": "2025/26",
   "rindeEsperado": 47.17346526539929,
   "rindeReal": 51.53711380126833,
   "fs": 176.638736681887,
   "sc": 187.925,
   "fc": 187.894117647059,
   "gc": 56,
   "cd": 411,
   "tabla": {
    "rindeBajo": 60,
    "rindeAlto": 70,
    "costoBajo": 77,
    "costoAlto": 77,
    "piso": 77
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.09250218340584127,
    "cosechaEsperado": 77,
    "cosechaReal": 77,
    "mbProyectado": 81.09472545246479,
    "mbRealSin": 191.90337382323253,
    "futuro": -57.26186295563131,
    "mbRealCon": 134.64151086760123,
    "sorpresaSin": 110.80864837076774,
    "sorpresaCon": 53.54678541513644,
    "rProyectada": 0.009943283278776976,
    "rRealSin": 0.023529885543492387,
    "rRealCon": 0.016508825650119976,
    "sorpresaRSin": 0.01358660226471541,
    "sorpresaRCon": 0.006565542371342999,
    "comisionPlanteo": 5.740758942161327,
    "mbCoberturaPlanteo": 290.6117647842207,
    "mbSpotPlanteo": 369.51250000000005
   },
   "origenTexto": {
    "rindes": "esperado H46 · real R22",
    "cosecha": "fila 110 (F, G, I, J, O)",
    "tierra": "fila 116 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 65,
   "cosechaPlanteo": 77
  },
  {
   "id": "Maíz|Oeste BA|2020/21",
   "fila": 107,
   "filaDC": 87,
   "cultivo": "Maíz",
   "zona": "Oeste BA",
   "campana": "2020/21",
   "rindeEsperado": 84.0482872147467,
   "rindeReal": 72.67837280816539,
   "fs": 153.443003763257,
   "sc": 212.24,
   "fc": 212.375,
   "gc": 49.9,
   "cd": 332,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 90,
    "costoBajo": 79,
    "costoAlto": 88,
    "piso": 60
   },
   "v": 6240.989583,
   "excel": {
    "desvioRinde": -0.13527835942130173,
    "cosechaEsperado": 82.64345849327202,
    "cosechaReal": 71.76989314806333,
    "mbProyectado": 455.6177534439101,
    "mbRealSin": 776.0908110196935,
    "futuro": -501.76164541010854,
    "mbRealCon": 274.329165609585,
    "sorpresaSin": 320.47305757578346,
    "sorpresaCon": -181.28858783432509,
    "rProyectada": 0.07300408811528537,
    "rRealSin": 0.12435380650749815,
    "rRealCon": 0.04395603645243018,
    "sorpresaRSin": 0.05134971839221278,
    "sorpresaRCon": -0.029048051662855196,
    "comisionPlanteo": 6.5213276599384224,
    "mbCoberturaPlanteo": 456.9467043277461,
    "mbSpotPlanteo": 964.3900000000001
   },
   "origenTexto": {
    "rindes": "esperado C47 · real M23",
    "cosecha": "fila 16 (F, G, I, J, O)",
    "tierra": "fila 87 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 85,
   "cosechaPlanteo": 83.5
  },
  {
   "id": "Maíz|Oeste BA|2021/22",
   "fila": 108,
   "filaDC": 93,
   "cultivo": "Maíz",
   "zona": "Oeste BA",
   "campana": "2021/22",
   "rindeEsperado": 80.86270261294726,
   "rindeReal": 81.12526593503141,
   "fs": 190.998497618175,
   "sc": 265.921052631579,
   "fc": 264.613333333333,
   "gc": 59,
   "cd": 428,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 90,
    "costoBajo": 77,
    "costoAlto": 84,
    "piso": 60
   },
   "v": 6322.291667,
   "excel": {
    "desvioRinde": 0.0032470263001338484,
    "cosechaEsperado": 77.60389182906309,
    "cosechaReal": 77.78768615452199,
    "mbProyectado": 561.7716339963681,
    "mbRealSin": 1172.8648560748259,
    "futuro": -602.9917841897881,
    "mbRealCon": 569.8730718850378,
    "sorpresaSin": 611.0932220784578,
    "sorpresaCon": 8.101437888669693,
    "rProyectada": 0.08885569720369056,
    "rRealSin": 0.18551261438897892,
    "rRealCon": 0.09013710564154487,
    "sorpresaRSin": 0.09665691718528836,
    "sorpresaRCon": 0.0012814084378542944,
    "comisionPlanteo": 8.117436148772438,
    "mbCoberturaPlanteo": 616.4854076408062,
    "mbSpotPlanteo": 1250.3289473684217
   },
   "origenTexto": {
    "rindes": "esperado D47 · real N23",
    "cosecha": "fila 35 (F, G, I, J, O)",
    "tierra": "fila 93 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 85,
   "cosechaPlanteo": 80.5
  },
  {
   "id": "Maíz|Oeste BA|2022/23",
   "fila": 109,
   "filaDC": 99,
   "cultivo": "Maíz",
   "zona": "Oeste BA",
   "campana": "2022/23",
   "rindeEsperado": 80.1076126127116,
   "rindeReal": 66.40484019466,
   "fs": 246.021527975007,
   "sc": 237.611111111111,
   "fc": 240.921428571429,
   "gc": 69.8,
   "cd": 612,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 90,
    "costoBajo": 102,
    "costoAlto": 111,
    "piso": 80
   },
   "v": 6450.416667,
   "excel": {
    "desvioRinde": -0.17105455987434126,
    "cosechaEsperado": 102.09685135144045,
    "cosechaReal": 84.66617124819149,
    "mbProyectado": 697.5717383527577,
    "mbRealSin": 417.68083037397435,
    "futuro": 31.001580102110047,
    "mbRealCon": 448.6824104760844,
    "sorpresaSin": -279.8909079787834,
    "sorpresaCon": -248.88932787667335,
    "rProyectada": 0.10814367107810241,
    "rRealSin": 0.06475253490380055,
    "rRealCon": 0.06955867095710584,
    "sorpresaRSin": -0.04339113617430187,
    "sorpresaRCon": -0.038585000120996575,
    "comisionPlanteo": 10.455914938937799,
    "mbCoberturaPlanteo": 740.7893744359188,
    "mbSpotPlanteo": 707.8944444444437
   },
   "origenTexto": {
    "rindes": "esperado E47 · real O23",
    "cosecha": "fila 54 (F, G, I, J, O)",
    "tierra": "fila 99 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 85,
   "cosechaPlanteo": 106.5
  },
  {
   "id": "Maíz|Oeste BA|2023/24",
   "fila": 110,
   "filaDC": 105,
   "cultivo": "Maíz",
   "zona": "Oeste BA",
   "campana": "2023/24",
   "rindeEsperado": 79.53993484280952,
   "rindeReal": 80.33214387233005,
   "fs": 187.253918752565,
   "sc": 178.42,
   "fc": 177.4,
   "gc": 61.8,
   "cd": 538,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 90,
    "costoBajo": 85,
    "costoAlto": 93,
    "piso": 65
   },
   "v": 6822.135417,
   "excel": {
    "desvioRinde": 0.009959890350502931,
    "cosechaEsperado": 84.51118077048511,
    "cosechaReal": 85.26571509786405,
    "mbProyectado": 375.3484715649288,
    "mbRealSin": 313.56774674124904,
    "futuro": 70.93092330421597,
    "mbRealCon": 384.498670045465,
    "sorpresaSin": -61.78072482367975,
    "sorpresaCon": 9.150198480536233,
    "rProyectada": 0.055019205662438515,
    "rRealSin": 0.045963283865616794,
    "rRealCon": 0.05636045703334138,
    "sorpresaRSin": -0.009055921796821721,
    "sorpresaRCon": 0.001341251370902864,
    "comisionPlanteo": 7.958291546984013,
    "mbCoberturaPlanteo": 440.0700178498183,
    "mbSpotPlanteo": 364.26999999999987
   },
   "origenTexto": {
    "rindes": "esperado F47 · real P23",
    "cosecha": "fila 73 (F, G, I, J, O)",
    "tierra": "fila 105 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 85,
   "cosechaPlanteo": 89
  },
  {
   "id": "Maíz|Oeste BA|2024/25",
   "fila": 111,
   "filaDC": 111,
   "cultivo": "Maíz",
   "zona": "Oeste BA",
   "campana": "2024/25",
   "rindeEsperado": 77.01929626623162,
   "rindeReal": 80.36262373867922,
   "fs": 178.943553927181,
   "sc": 202.552631578947,
   "fc": 201.8875,
   "gc": 75.2,
   "cd": 473,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 90,
    "costoBajo": 97,
    "costoAlto": 106,
    "piso": 72
   },
   "v": 7620.833333,
   "excel": {
    "desvioRinde": 0.04340895898205499,
    "cosechaEsperado": 93.38589672280584,
    "cosechaReal": 97.32636136481129,
    "mbProyectado": 232.6396548401272,
    "mbRealSin": 453.1128000061442,
    "futuro": -183.6037113073137,
    "mbRealCon": 269.5090886988305,
    "sorpresaSin": 220.473145166017,
    "sorpresaCon": 36.8694338587033,
    "rProyectada": 0.030526799980356848,
    "rRealSin": 0.05945711974096839,
    "rRealCon": 0.035364779273126576,
    "sorpresaRSin": 0.02893031976061154,
    "sorpresaRCon": 0.004837979292769728,
    "comisionPlanteo": 7.605101041905193,
    "mbCoberturaPlanteo": 305.3687257601829,
    "mbSpotPlanteo": 507.9973684210495
   },
   "origenTexto": {
    "rindes": "esperado G47 · real Q23",
    "cosecha": "fila 92 (F, G, I, J, O)",
    "tierra": "fila 111 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 85,
   "cosechaPlanteo": 101.5
  },
  {
   "id": "Maíz|Oeste BA|2025/26",
   "fila": 112,
   "filaDC": 117,
   "cultivo": "Maíz",
   "zona": "Oeste BA",
   "campana": "2025/26",
   "rindeEsperado": 76.1806493097732,
   "rindeReal": 88.41476101551444,
   "fs": 176.638736681887,
   "sc": 187.925,
   "fc": 187.894117647059,
   "gc": 72.3,
   "cd": 608,
   "tabla": {
    "rindeBajo": 80,
    "rindeAlto": 98,
    "costoBajo": 83,
    "costoAlto": 105,
    "piso": 77
   },
   "v": 8155.729167,
   "excel": {
    "desvioRinde": 0.16059342912651875,
    "cosechaEsperado": 79.03742365888971,
    "cosechaReal": 93.28470790785099,
    "mbProyectado": 107.82184719987058,
    "mbRealSin": 321.0109663340349,
    "futuro": -92.47244984240864,
    "mbRealCon": 228.53851649162624,
    "sorpresaSin": 213.18911913416432,
    "sorpresaCon": 120.71666929175566,
    "rProyectada": 0.013220381034248064,
    "rRealSin": 0.03936017979029034,
    "rRealCon": 0.028021837387188733,
    "sorpresaRSin": 0.026139798756042276,
    "sorpresaRCon": 0.014801456352940669,
    "comisionPlanteo": 7.860423782343972,
    "mbCoberturaPlanteo": 219.02918562762528,
    "mbSpotPlanteo": 327.0625000000002
   },
   "origenTexto": {
    "rindes": "esperado H47 · real R23",
    "cosecha": "fila 111 (F, G, I, J, O)",
    "tierra": "fila 117 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 89,
   "cosechaPlanteo": 94
  },
  {
   "id": "Maíz|Sur de Córdoba|2020/21",
   "fila": 113,
   "filaDC": 88,
   "cultivo": "Maíz",
   "zona": "Sur de Córdoba",
   "campana": "2020/21",
   "rindeEsperado": 61.86191598460731,
   "rindeReal": 70.42071646764788,
   "fs": 153.443003763257,
   "sc": 212.24,
   "fc": 212.375,
   "gc": 49.2,
   "cd": 308,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 67,
    "costoAlto": 83,
    "piso": 60
   },
   "v": 6412.5,
   "excel": {
    "desvioRinde": 0.1383533042392382,
    "cosechaEsperado": 63.765359553364455,
    "cosechaReal": 71.3365731741183,
    "mbProyectado": 273.10183452520624,
    "mbRealSin": 768.8027881144128,
    "futuro": -369.3107591038732,
    "mbRealCon": 399.4920290105396,
    "sorpresaSin": 495.70095358920656,
    "sorpresaCon": 126.39019448533338,
    "rProyectada": 0.042588980042917154,
    "rRealSin": 0.1198912730002983,
    "rRealCon": 0.062298951892481816,
    "sorpresaRSin": 0.07730229295738114,
    "sorpresaRCon": 0.01970997184956466,
    "comisionPlanteo": 5.754112641122137,
    "mbCoberturaPlanteo": 392.0559155833053,
    "mbSpotPlanteo": 839.8000000000002
   },
   "origenTexto": {
    "rindes": "esperado C48 · real M24",
    "cosecha": "fila 17 (F, G, I, J, O)",
    "tierra": "fila 88 (G)"
   },
   "anioCosecha": 2021,
   "rindePlanteo": 75,
   "cosechaPlanteo": 75
  },
  {
   "id": "Maíz|Sur de Córdoba|2021/22",
   "fila": 114,
   "filaDC": 94,
   "cultivo": "Maíz",
   "zona": "Sur de Córdoba",
   "campana": "2021/22",
   "rindeEsperado": 62.21542136259332,
   "rindeReal": 57.75062137531069,
   "fs": 190.998497618175,
   "sc": 265.921052631579,
   "fc": 264.613333333333,
   "gc": 58,
   "cd": 390,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 65,
    "costoAlto": 80,
    "piso": 60
   },
   "v": 6875,
   "excel": {
    "desvioRinde": -0.0717635578044491,
    "cosechaEsperado": 62.21542136259332,
    "cosechaReal": 60,
    "mbProyectado": 375.240335628069,
    "mbRealSin": 750.7569986482367,
    "futuro": -463.9393282601324,
    "mbRealCon": 286.8176703881043,
    "sorpresaSin": 375.51666302016775,
    "sorpresaCon": -88.42266523996466,
    "rProyectada": 0.05458041245499185,
    "rRealSin": 0.10920101798519807,
    "rRealCon": 0.04171893387463336,
    "sorpresaRSin": 0.05462060553020622,
    "sorpresaRCon": -0.012861478580358496,
    "comisionPlanteo": 7.1624436606815625,
    "mbCoberturaPlanteo": 537.6341832124762,
    "mbSpotPlanteo": 1096.9078947368425
   },
   "origenTexto": {
    "rindes": "esperado D48 · real N24",
    "cosecha": "fila 36 (F, G, I, J, O)",
    "tierra": "fila 94 (G)"
   },
   "anioCosecha": 2022,
   "rindePlanteo": 75,
   "cosechaPlanteo": 72.5
  },
  {
   "id": "Maíz|Sur de Córdoba|2022/23",
   "fila": 115,
   "filaDC": 100,
   "cultivo": "Maíz",
   "zona": "Sur de Córdoba",
   "campana": "2022/23",
   "rindeEsperado": 61.11683117636909,
   "rindeReal": 40.65428470075508,
   "fs": 246.021527975007,
   "sc": 237.611111111111,
   "fc": 240.921428571429,
   "gc": 68.5,
   "cd": 559,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 87,
    "costoAlto": 105,
    "piso": 80
   },
   "v": 7000,
   "excel": {
    "desvioRinde": -0.3348103309964454,
    "cosechaEsperado": 81.80252788221709,
    "cosechaReal": 80,
    "mbProyectado": 444.1527976597414,
    "mbRealSin": 48.50912571721324,
    "futuro": 23.65216332761721,
    "mbRealCon": 72.16128904483045,
    "sorpresaSin": -395.64367194252816,
    "sorpresaCon": -371.9915086149109,
    "rProyectada": 0.06345039966567734,
    "rRealSin": 0.006929875102459034,
    "rRealCon": 0.010308755577832921,
    "sorpresaRSin": -0.05652052456321831,
    "sorpresaRCon": -0.053141644087844414,
    "comisionPlanteo": 9.225807299062762,
    "mbCoberturaPlanteo": 642.3582715611046,
    "mbSpotPlanteo": 613.3333333333326
   },
   "origenTexto": {
    "rindes": "esperado E48 · real O24",
    "cosecha": "fila 55 (F, G, I, J, O)",
    "tierra": "fila 100 (G)"
   },
   "anioCosecha": 2023,
   "rindePlanteo": 75,
   "cosechaPlanteo": 96
  },
  {
   "id": "Maíz|Sur de Córdoba|2023/24",
   "fila": 116,
   "filaDC": 106,
   "cultivo": "Maíz",
   "zona": "Sur de Córdoba",
   "campana": "2023/24",
   "rindeEsperado": 59.93346252663967,
   "rindeReal": 65.05763648928819,
   "fs": 187.253918752565,
   "sc": 178.42,
   "fc": 177.4,
   "gc": 59,
   "cd": 493,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 72,
    "costoAlto": 88,
    "piso": 65
   },
   "v": 7437.5,
   "excel": {
    "desvioRinde": 0.08549771274053919,
    "cosechaEsperado": 66.38783541412394,
    "cosechaReal": 72.04610919143055,
    "mbProyectado": 209.28230793103037,
    "mbRealSin": 211.87218576364887,
    "futuro": 53.446559168478956,
    "mbRealCon": 265.31874493212786,
    "sorpresaSin": 2.589877832618498,
    "sorpresaCon": 56.03643700109748,
    "rProyectada": 0.028138797705012486,
    "rRealSin": 0.028487016573263715,
    "rRealCon": 0.03567310856230291,
    "sorpresaRSin": 0.00034821886825122663,
    "sorpresaRCon": 0.007534310857290418,
    "comisionPlanteo": 7.022021953221187,
    "mbCoberturaPlanteo": 389.5323686910162,
    "mbSpotPlanteo": 322.64999999999986
   },
   "origenTexto": {
    "rindes": "esperado F48 · real P24",
    "cosecha": "fila 74 (F, G, I, J, O)",
    "tierra": "fila 106 (G)"
   },
   "anioCosecha": 2024,
   "rindePlanteo": 75,
   "cosechaPlanteo": 80
  },
  {
   "id": "Maíz|Sur de Córdoba|2024/25",
   "fila": 117,
   "filaDC": 112,
   "cultivo": "Maíz",
   "zona": "Sur de Córdoba",
   "campana": "2024/25",
   "rindeEsperado": 59.19044491004864,
   "rindeReal": 65.85035971223022,
   "fs": 178.943553927181,
   "sc": 202.552631578947,
   "fc": 201.8875,
   "gc": 72.6,
   "cd": 433,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 81,
    "costoAlto": 101,
    "piso": 72
   },
   "v": 8675,
   "excel": {
    "desvioRinde": 0.11251672144554092,
    "cosechaEsperado": 73.76040058021447,
    "cosechaReal": 81.85035971223022,
    "mbProyectado": 122.69182644634493,
    "mbRealSin": 340.89239379022854,
    "futuro": -141.10211188959946,
    "mbRealCon": 199.79028190062908,
    "sorpresaSin": 218.20056734388362,
    "sorpresaCon": 77.09845545428415,
    "rProyectada": 0.014143150022633421,
    "rRealSin": 0.039295953174666116,
    "rRealCon": 0.023030580046182025,
    "sorpresaRSin": 0.025152803152032693,
    "sorpresaRCon": 0.008887430023548606,
    "comisionPlanteo": 6.710383272269287,
    "mbCoberturaPlanteo": 271.8547580236908,
    "mbSpotPlanteo": 450.6447368421026
   },
   "origenTexto": {
    "rindes": "esperado G48 · real Q24",
    "cosecha": "fila 93 (F, G, I, J, O)",
    "tierra": "fila 112 (G)"
   },
   "anioCosecha": 2025,
   "rindePlanteo": 75,
   "cosechaPlanteo": 91
  },
  {
   "id": "Maíz|Sur de Córdoba|2025/26",
   "fila": 118,
   "filaDC": 118,
   "cultivo": "Maíz",
   "zona": "Sur de Córdoba",
   "campana": "2025/26",
   "rindeEsperado": 59.94672374904641,
   "rindeReal": 59.59975293390982,
   "fs": 176.638736681887,
   "sc": 187.925,
   "fc": 187.894117647059,
   "gc": 69.6,
   "cd": 476,
   "tabla": {
    "rindeBajo": 65,
    "rindeAlto": 85,
    "costoBajo": 77,
    "costoAlto": 91,
    "piso": 77
   },
   "v": 9200,
   "excel": {
    "desvioRinde": -0.005787986289110814,
    "cosechaEsperado": 77,
    "cosechaReal": 77,
    "mbProyectado": 88.6621578316001,
    "mbRealSin": 152.21407659048805,
    "futuro": -72.76677811656899,
    "mbRealCon": 79.44729847391906,
    "sorpresaSin": 63.55191875888795,
    "sorpresaCon": -9.214859357681036,
    "rProyectada": 0.009637191068652184,
    "rRealSin": 0.01654500832505305,
    "rRealCon": 0.00863557592107816,
    "sorpresaRSin": 0.006907817256400864,
    "sorpresaRCon": -0.0010016151475740257,
    "comisionPlanteo": 6.623952625570762,
    "mbCoberturaPlanteo": 236.39819013563928,
    "mbSpotPlanteo": 327.4375000000001
   },
   "origenTexto": {
    "rindes": "esperado H48 · real R24",
    "cosecha": "fila 112 (F, G, I, J, O)",
    "tierra": "fila 118 (G)"
   },
   "anioCosecha": 2026,
   "rindePlanteo": 75,
   "cosechaPlanteo": 84
  }
 ],
 "controles": {
  "zonas": [
   {
    "cultivo": "Trigo",
    "zona": "Norte BA / Sur SF",
    "fila": 6,
    "desvioRindePromedio": {
     "v": 0.01476029021937932,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D6"
    },
    "peorDesvio": {
     "v": -0.5435349990136463,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E6"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F6"
    },
    "sdSinUsd": {
     "v": 301.8392207014863,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G6"
    },
    "sdConUsd": {
     "v": 272.5696090152049,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H6"
    },
    "reduccionUsd": {
     "v": 0.09697086951873801,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I6"
    },
    "sdPrecioSin": {
     "v": 147.64466987659316,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J6"
    },
    "sdPrecioCon": {
     "v": 4.546342253545826,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K6"
    },
    "reduccionPrecio": {
     "v": 0.9692075422882125,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L6"
    },
    "sdRSin": {
     "v": 0.039967119118002735,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M6"
    },
    "sdRCon": {
     "v": 0.035231826088443066,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N6"
    },
    "reduccionR": {
     "v": 0.11847971868021656,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O6"
    },
    "riesgoRinde": {
     "v": 285.18898823013075,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P6"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q6"
    }
   },
   {
    "cultivo": "Trigo",
    "zona": "Sur Entre Ríos",
    "fila": 7,
    "desvioRindePromedio": {
     "v": 0.054647162721270515,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D7"
    },
    "peorDesvio": {
     "v": -0.18396104409372416,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E7"
    },
    "campanaPeorDesvio": {
     "v": "2020/21",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F7"
    },
    "sdSinUsd": {
     "v": 96.7955048685714,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G7"
    },
    "sdConUsd": {
     "v": 80.76503025667748,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H7"
    },
    "reduccionUsd": {
     "v": 0.1656117671338152,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I7"
    },
    "sdPrecioSin": {
     "v": 118.55713500651075,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J7"
    },
    "sdPrecioCon": {
     "v": 3.6411203339461253,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K7"
    },
    "reduccionPrecio": {
     "v": 0.9692880539518253,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L7"
    },
    "sdRSin": {
     "v": 0.017743043003458234,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M7"
    },
    "sdRCon": {
     "v": 0.014421979685688976,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N7"
    },
    "reduccionR": {
     "v": 0.18717552097021695,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O7"
    },
    "riesgoRinde": {
     "v": 63.46969258979631,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P7"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q7"
    }
   },
   {
    "cultivo": "Trigo",
    "zona": "Sudeste BA",
    "fila": 8,
    "desvioRindePromedio": {
     "v": 0.05708129607421033,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D8"
    },
    "peorDesvio": {
     "v": -0.3659495432327661,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E8"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F8"
    },
    "sdSinUsd": {
     "v": 275.2964827938254,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G8"
    },
    "sdConUsd": {
     "v": 197.1517927946532,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H8"
    },
    "reduccionUsd": {
     "v": 0.2838564779547009,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I8"
    },
    "sdPrecioSin": {
     "v": 150.04630901359175,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J8"
    },
    "sdPrecioCon": {
     "v": 4.516334760514623,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K8"
    },
    "reduccionPrecio": {
     "v": 0.9699003941502785,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L8"
    },
    "sdRSin": {
     "v": 0.04295902382759508,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M8"
    },
    "sdRCon": {
     "v": 0.030075141382047983,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N8"
    },
    "reduccionR": {
     "v": 0.2999109685837654,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O8"
    },
    "riesgoRinde": {
     "v": 205.20059683125797,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P8"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q8"
    }
   },
   {
    "cultivo": "Trigo",
    "zona": "Sudoeste BA",
    "fila": 9,
    "desvioRindePromedio": {
     "v": 0.034468730277564495,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D9"
    },
    "peorDesvio": {
     "v": -0.1479100829639366,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E9"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F9"
    },
    "sdSinUsd": {
     "v": 166.06442712677864,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G9"
    },
    "sdConUsd": {
     "v": 110.35951392106537,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H9"
    },
    "reduccionUsd": {
     "v": 0.33544157631776517,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I9"
    },
    "sdPrecioSin": {
     "v": 113.59360695062851,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J9"
    },
    "sdPrecioCon": {
     "v": 3.424674427414686,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K9"
    },
    "reduccionPrecio": {
     "v": 0.9698515214073344,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L9"
    },
    "sdRSin": {
     "v": 0.025371312886267053,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M9"
    },
    "sdRCon": {
     "v": 0.015330249831245115,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N9"
    },
    "reduccionR": {
     "v": 0.39576442496426545,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O9"
    },
    "riesgoRinde": {
     "v": 119.68303353356649,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P9"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q9"
    }
   },
   {
    "cultivo": "Trigo",
    "zona": "Sudeste de Córdoba",
    "fila": 10,
    "desvioRindePromedio": {
     "v": 0.10807107525817267,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D10"
    },
    "peorDesvio": {
     "v": -0.5386806466166515,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E10"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F10"
    },
    "sdSinUsd": {
     "v": 315.1288808722792,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G10"
    },
    "sdConUsd": {
     "v": 348.4585356709675,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H10"
    },
    "reduccionUsd": {
     "v": -0.10576515458193336,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I10"
    },
    "sdPrecioSin": {
     "v": 132.2751886935478,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J10"
    },
    "sdPrecioCon": {
     "v": 4.193038892879068,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K10"
    },
    "reduccionPrecio": {
     "v": 0.9683006394903476,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L10"
    },
    "sdRSin": {
     "v": 0.042821951220644174,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M10"
    },
    "sdRCon": {
     "v": 0.04744409113650117,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N10"
    },
    "reduccionR": {
     "v": -0.10793856384640166,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O10"
    },
    "riesgoRinde": {
     "v": 348.391801217685,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P10"
    },
    "bajoElRiesgo": {
     "v": "No",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q10"
    }
   },
   {
    "cultivo": "Trigo",
    "zona": "Centro Oeste BA",
    "fila": 11,
    "desvioRindePromedio": {
     "v": -0.056632247851820604,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D11"
    },
    "peorDesvio": {
     "v": -0.3529280688600003,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E11"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F11"
    },
    "sdSinUsd": {
     "v": 220.56237633075625,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G11"
    },
    "sdConUsd": {
     "v": 144.96030820473874,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H11"
    },
    "reduccionUsd": {
     "v": 0.3427695574545513,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I11"
    },
    "sdPrecioSin": {
     "v": 144.72687234828663,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J11"
    },
    "sdPrecioCon": {
     "v": 4.381999372903215,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K11"
    },
    "reduccionPrecio": {
     "v": 0.9697222823805803,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L11"
    },
    "sdRSin": {
     "v": 0.03433579862990278,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M11"
    },
    "sdRCon": {
     "v": 0.021795654238985763,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N11"
    },
    "reduccionR": {
     "v": 0.36522069942464963,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O11"
    },
    "riesgoRinde": {
     "v": 157.76285730433676,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P11"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q11"
    }
   },
   {
    "cultivo": "Trigo",
    "zona": "Oeste BA",
    "fila": 12,
    "desvioRindePromedio": {
     "v": -0.03786332292233804,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D12"
    },
    "peorDesvio": {
     "v": -0.3814064335683588,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E12"
    },
    "campanaPeorDesvio": {
     "v": "2023/24",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F12"
    },
    "sdSinUsd": {
     "v": 226.7134356744283,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G12"
    },
    "sdConUsd": {
     "v": 161.0336104115341,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H12"
    },
    "reduccionUsd": {
     "v": 0.289704159206575,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I12"
    },
    "sdPrecioSin": {
     "v": 134.7800519887104,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J12"
    },
    "sdPrecioCon": {
     "v": 4.029726634206115,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K12"
    },
    "reduccionPrecio": {
     "v": 0.9701014610489714,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L12"
    },
    "sdRSin": {
     "v": 0.03472934869706044,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M12"
    },
    "sdRCon": {
     "v": 0.023417931879921788,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N12"
    },
    "reduccionR": {
     "v": 0.3257019564578264,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O12"
    },
    "riesgoRinde": {
     "v": 176.35382306860686,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P12"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q12"
    }
   },
   {
    "cultivo": "Soja",
    "zona": "Norte BA / Sur SF",
    "fila": 13,
    "desvioRindePromedio": {
     "v": -0.04289029244515843,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D13"
    },
    "peorDesvio": {
     "v": -0.5356877220907026,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E13"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F13"
    },
    "sdSinUsd": {
     "v": 328.05810205424433,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G13"
    },
    "sdConUsd": {
     "v": 277.9745674535819,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H13"
    },
    "reduccionUsd": {
     "v": 0.15266665961623194,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I13"
    },
    "sdPrecioSin": {
     "v": 202.0303991144229,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J13"
    },
    "sdPrecioCon": {
     "v": 15.476958546105763,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K13"
    },
    "reduccionPrecio": {
     "v": 0.9233929219862593,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L13"
    },
    "sdRSin": {
     "v": 0.0431773637797896,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M13"
    },
    "sdRCon": {
     "v": 0.035917977491209986,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N13"
    },
    "reduccionR": {
     "v": 0.168129446846349,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O13"
    },
    "riesgoRinde": {
     "v": 282.49768176981246,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P13"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q13"
    }
   },
   {
    "cultivo": "Soja",
    "zona": "Sur Entre Ríos",
    "fila": 14,
    "desvioRindePromedio": {
     "v": 0.011095410344210077,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D14"
    },
    "peorDesvio": {
     "v": -0.5783244029049317,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E14"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F14"
    },
    "sdSinUsd": {
     "v": 284.1820130057321,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G14"
    },
    "sdConUsd": {
     "v": 243.30476296359558,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H14"
    },
    "reduccionUsd": {
     "v": 0.1438417921309889,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I14"
    },
    "sdPrecioSin": {
     "v": 124.29349766973435,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J14"
    },
    "sdPrecioCon": {
     "v": 9.327013796825211,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K14"
    },
    "reduccionPrecio": {
     "v": 0.9249597607944993,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L14"
    },
    "sdRSin": {
     "v": 0.051752429344883666,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M14"
    },
    "sdRCon": {
     "v": 0.043628016549922335,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N14"
    },
    "reduccionR": {
     "v": 0.1569861144260375,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O14"
    },
    "riesgoRinde": {
     "v": 239.4226846305228,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P14"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q14"
    }
   },
   {
    "cultivo": "Soja",
    "zona": "Sudeste BA",
    "fila": 15,
    "desvioRindePromedio": {
     "v": 0.05607388733549612,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D15"
    },
    "peorDesvio": {
     "v": -0.21243795140916522,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E15"
    },
    "campanaPeorDesvio": {
     "v": "2025/26",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F15"
    },
    "sdSinUsd": {
     "v": 156.05116226314175,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G15"
    },
    "sdConUsd": {
     "v": 95.25056637256371,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H15"
    },
    "reduccionUsd": {
     "v": 0.3896196286449495,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I15"
    },
    "sdPrecioSin": {
     "v": 119.44264738502,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J15"
    },
    "sdPrecioCon": {
     "v": 9.01566936988329,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K15"
    },
    "reduccionPrecio": {
     "v": 0.9245188417431712,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L15"
    },
    "sdRSin": {
     "v": 0.02357888087971061,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M15"
    },
    "sdRCon": {
     "v": 0.012738338909418664,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N15"
    },
    "reduccionR": {
     "v": 0.45975642464100674,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O15"
    },
    "riesgoRinde": {
     "v": 93.03651575113966,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P15"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q15"
    }
   },
   {
    "cultivo": "Soja",
    "zona": "Sudoeste BA",
    "fila": 16,
    "desvioRindePromedio": {
     "v": 0.06903059430220211,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D16"
    },
    "peorDesvio": {
     "v": -0.04436560512695098,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E16"
    },
    "campanaPeorDesvio": {
     "v": "2025/26",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F16"
    },
    "sdSinUsd": {
     "v": 114.89640809864315,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G16"
    },
    "sdConUsd": {
     "v": 43.85146090153661,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H16"
    },
    "reduccionUsd": {
     "v": 0.6183391489150089,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I16"
    },
    "sdPrecioSin": {
     "v": 104.97231270572112,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J16"
    },
    "sdPrecioCon": {
     "v": 7.662875101632819,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K16"
    },
    "reduccionPrecio": {
     "v": 0.9270009881261273,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L16"
    },
    "sdRSin": {
     "v": 0.018102998330251023,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M16"
    },
    "sdRCon": {
     "v": 0.006510989302584748,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N16"
    },
    "reduccionR": {
     "v": 0.6403364136810112,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O16"
    },
    "riesgoRinde": {
     "v": 51.29804831915999,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P16"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q16"
    }
   },
   {
    "cultivo": "Soja",
    "zona": "Sur de Córdoba",
    "fila": 17,
    "desvioRindePromedio": {
     "v": 0.002809836652626981,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D17"
    },
    "peorDesvio": {
     "v": -0.49278743954112536,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E17"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F17"
    },
    "sdSinUsd": {
     "v": 224.15256085749996,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G17"
    },
    "sdConUsd": {
     "v": 164.17307013812055,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H17"
    },
    "reduccionUsd": {
     "v": 0.2675833391772403,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I17"
    },
    "sdPrecioSin": {
     "v": 128.71139956752194,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J17"
    },
    "sdPrecioCon": {
     "v": 9.61145620102162,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K17"
    },
    "reduccionPrecio": {
     "v": 0.9253255249083089,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L17"
    },
    "sdRSin": {
     "v": 0.03257176196832588,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M17"
    },
    "sdRCon": {
     "v": 0.023290703400080003,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N17"
    },
    "reduccionR": {
     "v": 0.2849418639762614,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O17"
    },
    "riesgoRinde": {
     "v": 168.9426813516507,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P17"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q17"
    }
   },
   {
    "cultivo": "Soja",
    "zona": "Oeste BA",
    "fila": 18,
    "desvioRindePromedio": {
     "v": -0.016268617465028407,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D18"
    },
    "peorDesvio": {
     "v": -0.31558979308794444,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E18"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F18"
    },
    "sdSinUsd": {
     "v": 268.9994781692633,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G18"
    },
    "sdConUsd": {
     "v": 178.72350060585157,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H18"
    },
    "reduccionUsd": {
     "v": 0.3355990806294692,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I18"
    },
    "sdPrecioSin": {
     "v": 176.1714625730556,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J18"
    },
    "sdPrecioCon": {
     "v": 13.61517020742463,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K18"
    },
    "reduccionPrecio": {
     "v": 0.922716369560827,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L18"
    },
    "sdRSin": {
     "v": 0.041295313661595764,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M18"
    },
    "sdRCon": {
     "v": 0.02651083541304284,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N18"
    },
    "reduccionR": {
     "v": 0.35801830613778207,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O18"
    },
    "riesgoRinde": {
     "v": 166.32419561661723,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P18"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q18"
    }
   },
   {
    "cultivo": "Maíz",
    "zona": "Norte BA / Sur SF",
    "fila": 19,
    "desvioRindePromedio": {
     "v": -0.050346996633786424,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D19"
    },
    "peorDesvio": {
     "v": -0.49797881755054874,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E19"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F19"
    },
    "sdSinUsd": {
     "v": 481.80017257509013,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G19"
    },
    "sdConUsd": {
     "v": 395.03403407136983,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H19"
    },
    "reduccionUsd": {
     "v": 0.18008739606708524,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I19"
    },
    "sdPrecioSin": {
     "v": 325.0319973537667,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J19"
    },
    "sdPrecioCon": {
     "v": 15.947438783505005,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K19"
    },
    "reduccionPrecio": {
     "v": 0.9509357881275063,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L19"
    },
    "sdRSin": {
     "v": 0.06405779794079411,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M19"
    },
    "sdRCon": {
     "v": 0.05145405949107026,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N19"
    },
    "reduccionR": {
     "v": 0.19675572459379498,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O19"
    },
    "riesgoRinde": {
     "v": 379.3513705413104,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P19"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q19"
    }
   },
   {
    "cultivo": "Maíz",
    "zona": "Sur Entre Ríos",
    "fila": 20,
    "desvioRindePromedio": {
     "v": -0.06760138517058807,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D20"
    },
    "peorDesvio": {
     "v": -0.5859239310581099,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E20"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F20"
    },
    "sdSinUsd": {
     "v": 391.2832683882877,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G20"
    },
    "sdConUsd": {
     "v": 417.410225386167,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H20"
    },
    "reduccionUsd": {
     "v": -0.0667724871178299,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I20"
    },
    "sdPrecioSin": {
     "v": 221.99759525638964,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J20"
    },
    "sdPrecioCon": {
     "v": 10.24244545750669,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K20"
    },
    "reduccionPrecio": {
     "v": 0.9538623585283549,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L20"
    },
    "sdRSin": {
     "v": 0.06804032493785445,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M20"
    },
    "sdRCon": {
     "v": 0.0736793895057791,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N20"
    },
    "reduccionR": {
     "v": -0.08287827215809407,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O20"
    },
    "riesgoRinde": {
     "v": 371.88048683105825,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P20"
    },
    "bajoElRiesgo": {
     "v": "No",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q20"
    }
   },
   {
    "cultivo": "Maíz",
    "zona": "Sudeste BA",
    "fila": 21,
    "desvioRindePromedio": {
     "v": -0.059243014944947735,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D21"
    },
    "peorDesvio": {
     "v": -0.16707715712695026,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E21"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F21"
    },
    "sdSinUsd": {
     "v": 252.76736236899544,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G21"
    },
    "sdConUsd": {
     "v": 123.1990587624522,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H21"
    },
    "reduccionUsd": {
     "v": 0.5125990254129271,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I21"
    },
    "sdPrecioSin": {
     "v": 238.38710628964597,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J21"
    },
    "sdPrecioCon": {
     "v": 12.04934364339021,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K21"
    },
    "reduccionPrecio": {
     "v": 0.9494547174512451,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L21"
    },
    "sdRSin": {
     "v": 0.039975423705483126,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M21"
    },
    "sdRCon": {
     "v": 0.019517143435994897,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N21"
    },
    "reduccionR": {
     "v": 0.5117714428798442,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O21"
    },
    "riesgoRinde": {
     "v": 96.68121953287549,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P21"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q21"
    }
   },
   {
    "cultivo": "Maíz",
    "zona": "Sudoeste BA",
    "fila": 22,
    "desvioRindePromedio": {
     "v": -0.0931731213895205,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D22"
    },
    "peorDesvio": {
     "v": -0.31823628162260553,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E22"
    },
    "campanaPeorDesvio": {
     "v": "2023/24",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F22"
    },
    "sdSinUsd": {
     "v": 202.25723129539014,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G22"
    },
    "sdConUsd": {
     "v": 149.69944506743857,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H22"
    },
    "reduccionUsd": {
     "v": 0.259856153925061,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I22"
    },
    "sdPrecioSin": {
     "v": 201.73552657886108,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J22"
    },
    "sdPrecioCon": {
     "v": 9.781013250073848,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K22"
    },
    "reduccionPrecio": {
     "v": 0.9515156630270062,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L22"
    },
    "sdRSin": {
     "v": 0.02969418020494717,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M22"
    },
    "sdRCon": {
     "v": 0.022115396437323735,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N22"
    },
    "reduccionR": {
     "v": 0.2552279172321039,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O22"
    },
    "riesgoRinde": {
     "v": 127.22573797924078,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P22"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q22"
    }
   },
   {
    "cultivo": "Maíz",
    "zona": "Oeste BA",
    "fila": 23,
    "desvioRindePromedio": {
     "v": -0.014853935756072079,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D23"
    },
    "peorDesvio": {
     "v": -0.17105455987434126,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E23"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F23"
    },
    "sdSinUsd": {
     "v": 309.1084712178676,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G23"
    },
    "sdConUsd": {
     "v": 141.43991245261435,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H23"
    },
    "reduccionUsd": {
     "v": 0.5424262819606653,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I23"
    },
    "sdPrecioSin": {
     "v": 285.9933601834947,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J23"
    },
    "sdPrecioCon": {
     "v": 14.415646272717005,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K23"
    },
    "reduccionPrecio": {
     "v": 0.9495944721812147,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L23"
    },
    "sdRSin": {
     "v": 0.048338091035776395,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M23"
    },
    "sdRCon": {
     "v": 0.021144428943189228,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N23"
    },
    "reduccionR": {
     "v": 0.5625721146592315,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O23"
    },
    "riesgoRinde": {
     "v": 118.70157266814604,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P23"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q23"
    }
   },
   {
    "cultivo": "Maíz",
    "zona": "Sur de Córdoba",
    "fila": 24,
    "desvioRindePromedio": {
     "v": -0.012665689444114503,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D24"
    },
    "peorDesvio": {
     "v": -0.3348103309964454,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E24"
    },
    "campanaPeorDesvio": {
     "v": "2022/23",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › F24"
    },
    "sdSinUsd": {
     "v": 315.8093381026786,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G24"
    },
    "sdConUsd": {
     "v": 181.09810665500575,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H24"
    },
    "reduccionUsd": {
     "v": 0.42655873400385147,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I24"
    },
    "sdPrecioSin": {
     "v": 216.3677651318128,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J24"
    },
    "sdPrecioCon": {
     "v": 10.997962505876417,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K24"
    },
    "reduccionPrecio": {
     "v": 0.9491700508198327,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L24"
    },
    "sdRSin": {
     "v": 0.04668386836708293,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M24"
    },
    "sdRCon": {
     "v": 0.025906883887147472,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N24"
    },
    "reduccionR": {
     "v": 0.4450570444711782,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O24"
    },
    "riesgoRinde": {
     "v": 167.46694507747665,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P24"
    },
    "bajoElRiesgo": {
     "v": "Sí",
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q24"
    }
   }
  ],
  "cultivos": [
   {
    "cultivo": "Trigo",
    "fila": 28,
    "desvioRindePromedio": {
     "v": 0.024933283396634094,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D28"
    },
    "peorDesvio": {
     "v": -0.5435349990136463,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E28"
    },
    "sdSinUsd": {
     "v": 228.91433262401793,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G28"
    },
    "sdConUsd": {
     "v": 187.89977146783446,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H28"
    },
    "reduccionUsd": {
     "v": 0.17916991341712163,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I28"
    },
    "sdPrecioSin": {
     "v": 134.51769055398128,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J28"
    },
    "sdPrecioCon": {
     "v": 4.104748096487094,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K28"
    },
    "reduccionPrecio": {
     "v": 0.9694854403195401,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L28"
    },
    "sdRSin": {
     "v": 0.033989656768990066,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M28"
    },
    "sdRCon": {
     "v": 0.02681669632040484,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N28"
    },
    "reduccionR": {
     "v": 0.21103362406205184,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O28"
    },
    "riesgoRinde": {
     "v": 193.72154182505432,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P28"
    },
    "zonas": {
     "v": 7,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › C28"
    },
    "zonasDondeSubio": {
     "v": 1,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q28"
    }
   },
   {
    "cultivo": "Soja",
    "fila": 29,
    "desvioRindePromedio": {
     "v": 0.01330846978739141,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D29"
    },
    "peorDesvio": {
     "v": -0.5783244029049317,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E29"
    },
    "sdSinUsd": {
     "v": 229.38995407475412,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G29"
    },
    "sdConUsd": {
     "v": 167.21298807254166,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H29"
    },
    "reduccionUsd": {
     "v": 0.27105357012256115,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I29"
    },
    "sdPrecioSin": {
     "v": 142.60361983591267,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J29"
    },
    "sdPrecioCon": {
     "v": 10.784857203815555,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K29"
    },
    "reduccionPrecio": {
     "v": 0.9243717851186023,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L29"
    },
    "sdRSin": {
     "v": 0.03507979132742609,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M29"
    },
    "sdRCon": {
     "v": 0.024766143511043098,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N29"
    },
    "reduccionR": {
     "v": 0.29400539245282153,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O29"
    },
    "riesgoRinde": {
     "v": 166.92030123981712,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P29"
    },
    "zonas": {
     "v": 6,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › C29"
    },
    "zonasDondeSubio": {
     "v": 0,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q29"
    }
   },
   {
    "cultivo": "Maíz",
    "fila": 30,
    "desvioRindePromedio": {
     "v": -0.04964735722317156,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › D30"
    },
    "peorDesvio": {
     "v": -0.5859239310581099,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › E30"
    },
    "sdSinUsd": {
     "v": 325.50430732471824,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › G30"
    },
    "sdConUsd": {
     "v": 234.6467970658413,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › H30"
    },
    "reduccionUsd": {
     "v": 0.2791284422796865,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › I30"
    },
    "sdPrecioSin": {
     "v": 248.2522251323285,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › J30"
    },
    "sdPrecioCon": {
     "v": 12.23897498551153,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › K30"
    },
    "reduccionPrecio": {
     "v": 0.9506994349034026,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › L30"
    },
    "sdRSin": {
     "v": 0.049464947698656364,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › M30"
    },
    "sdRCon": {
     "v": 0.035636216950084114,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › N30"
    },
    "reduccionR": {
     "v": 0.2795662664563554,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › O30"
    },
    "riesgoRinde": {
     "v": 210.21788877168458,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › P30"
    },
    "zonas": {
     "v": 6,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › C30"
    },
    "zonasDondeSubio": {
     "v": 1,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Riesgo_Zonas › Q30"
    }
   }
  ],
  "curva": {
   "hs": [
    {
     "v": 0,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C5"
    },
    {
     "v": 0.25,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D5"
    },
    {
     "v": 0.5,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E5"
    },
    {
     "v": 0.75,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F5"
    },
    {
     "v": 1,
     "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G5"
    }
   ],
   "cultivos": [
    {
     "cultivo": "Trigo",
     "fila": 7,
     "riesgo": [
      {
       "v": 228.91433262401793,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C7"
      },
      {
       "v": 210.95118007297523,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D7"
      },
      {
       "v": 197.2875284526302,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E7"
      },
      {
       "v": 189.34598090664556,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F7"
      },
      {
       "v": 187.89977146783446,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G7"
      }
     ],
     "riesgoRelativo": [
      {
       "v": 1,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C8"
      },
      {
       "v": 0.9215289302983645,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D8"
      },
      {
       "v": 0.8618400001046094,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E8"
      },
      {
       "v": 0.827147775048399,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F8"
      },
      {
       "v": 0.8208300865828784,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G8"
      }
     ],
     "margenRealMedio": [
      {
       "v": 201.0041046189623,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C9"
      },
      {
       "v": 195.20880730720518,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D9"
      },
      {
       "v": 189.41350999544807,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E9"
      },
      {
       "v": 183.61821268369096,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F9"
      },
      {
       "v": 177.82291537193385,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G9"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.8927217466625645,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H7"
     }
    },
    {
     "cultivo": "Soja",
     "fila": 10,
     "riesgo": [
      {
       "v": 229.38995407475412,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C10"
      },
      {
       "v": 207.2006584776183,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D10"
      },
      {
       "v": 188.49125118549784,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E10"
      },
      {
       "v": 174.56556798725236,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F10"
      },
      {
       "v": 167.21298807254166,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G10"
      }
     ],
     "riesgoRelativo": [
      {
       "v": 1,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C11"
      },
      {
       "v": 0.9032682329675836,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D11"
      },
      {
       "v": 0.8217066520884864,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E11"
      },
      {
       "v": 0.7609991845168796,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F11"
      },
      {
       "v": 0.7289464298774389,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G11"
      }
     ],
     "margenRealMedio": [
      {
       "v": 411.2515688653276,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C12"
      },
      {
       "v": 394.64328722630927,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D12"
      },
      {
       "v": 378.03500558729087,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E12"
      },
      {
       "v": 361.4267239482725,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F12"
      },
      {
       "v": 344.8184423092542,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G12"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.0940071493484418,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H10"
     }
    },
    {
     "cultivo": "Maíz",
     "fila": 13,
     "riesgo": [
      {
       "v": 325.50430732471824,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C13"
      },
      {
       "v": 287.23347717437866,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D13"
      },
      {
       "v": 256.6359384685106,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E13"
      },
      {
       "v": 237.5239061278497,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F13"
      },
      {
       "v": 234.6467970658413,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G13"
      }
     ],
     "riesgoRelativo": [
      {
       "v": 1,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C14"
      },
      {
       "v": 0.8824260407953337,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D14"
      },
      {
       "v": 0.7884256296875801,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E14"
      },
      {
       "v": 0.729710485492591,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F14"
      },
      {
       "v": 0.7208715577203135,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G14"
      }
     ],
     "margenRealMedio": [
      {
       "v": 447.6851824648325,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C15"
      },
      {
       "v": 401.92560089511204,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D15"
      },
      {
       "v": 356.16601932539163,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E15"
      },
      {
       "v": 310.40643775567116,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F15"
      },
      {
       "v": 264.6468561859507,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G15"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.8626783290840842,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H13"
     }
    }
   ],
   "zonas": [
    {
     "cultivo": "Trigo",
     "zona": "Norte BA / Sur SF",
     "fila": 20,
     "riesgo": [
      {
       "v": 301.8392207014863,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C20"
      },
      {
       "v": 287.58480735889754,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D20"
      },
      {
       "v": 277.6729544166704,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E20"
      },
      {
       "v": 272.5778049037829,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F20"
      },
      {
       "v": 272.5696090152049,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G20"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.8753990479573238,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H20"
     },
     "varianzaFuturo": {
      "v": 22393.135366835304,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I20"
     }
    },
    {
     "cultivo": "Trigo",
     "zona": "Sur Entre Ríos",
     "fila": 21,
     "riesgo": [
      {
       "v": 96.7955048685714,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C21"
      },
      {
       "v": 77.28548009009309,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D21"
      },
      {
       "v": 66.07980564706908,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E21"
      },
      {
       "v": 67.45261749966696,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F21"
      },
      {
       "v": 80.76503025667749,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G21"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.5993947809022918,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H21"
     },
     "varianzaFuturo": {
      "v": 14318.556892829622,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I21"
     }
    },
    {
     "cultivo": "Trigo",
     "zona": "Sudeste BA",
     "fila": 22,
     "riesgo": [
      {
       "v": 275.2964827938254,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C22"
      },
      {
       "v": 249.52741727736165,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D22"
      },
      {
       "v": 227.16213918369604,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E22"
      },
      {
       "v": 209.29469643270463,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F22"
      },
      {
       "v": 197.15179279465323,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G22"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.3059785582032197,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H22"
     },
     "varianzaFuturo": {
      "v": 22903.415767542214,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I22"
     }
    },
    {
     "cultivo": "Trigo",
     "zona": "Sudoeste BA",
     "fila": 23,
     "riesgo": [
      {
       "v": 166.06442712677864,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C23"
      },
      {
       "v": 145.7853106394237,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D23"
      },
      {
       "v": 128.75939760390594,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E23"
      },
      {
       "v": 116.42281123649093,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F23"
      },
      {
       "v": 110.35951392106539,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G23"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.0833832885132557,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H23"
     },
     "varianzaFuturo": {
      "v": 13197.30265439499,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I23"
     }
    },
    {
     "cultivo": "Trigo",
     "zona": "Sudeste de Córdoba",
     "fila": 24,
     "riesgo": [
      {
       "v": 315.1288808722792,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C24"
      },
      {
       "v": 318.49991817637147,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D24"
      },
      {
       "v": 325.33119007901064,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E24"
      },
      {
       "v": 335.4113409523077,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F24"
      },
      {
       "v": 348.4585356709674,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G24"
      }
     ],
     "hMinimaVarianza": {
      "v": -0.11105198741536915,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H24"
     },
     "varianzaFuturo": {
      "v": 18097.592330638636,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I24"
     }
    },
    {
     "cultivo": "Trigo",
     "zona": "Centro Oeste BA",
     "fila": 25,
     "riesgo": [
      {
       "v": 220.56237633075625,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C25"
      },
      {
       "v": 194.18408635768455,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D25"
      },
      {
       "v": 171.6245323146587,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E25"
      },
      {
       "v": 154.56495057301976,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F25"
      },
      {
       "v": 144.96030820473874,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G25"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.1425801963258064,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H25"
     },
     "varianzaFuturo": {
      "v": 21502.585246064722,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I25"
     }
    },
    {
     "cultivo": "Trigo",
     "zona": "Oeste BA",
     "fila": 26,
     "riesgo": [
      {
       "v": 226.7134356744283,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C26"
      },
      {
       "v": 203.7912406109949,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D26"
      },
      {
       "v": 184.38267992340081,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E26"
      },
      {
       "v": 169.697644748546,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F26"
      },
      {
       "v": 161.0336104115341,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G26"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.1818983430462795,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H26"
     },
     "varianzaFuturo": {
      "v": 18673.72057201273,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I26"
     }
    },
    {
     "cultivo": "Soja",
     "zona": "Norte BA / Sur SF",
     "fila": 27,
     "riesgo": [
      {
       "v": 328.05810205424433,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C27"
      },
      {
       "v": 304.8291314847173,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D27"
      },
      {
       "v": 288.0306408452995,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E27"
      },
      {
       "v": 278.82731271436364,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F27"
      },
      {
       "v": 277.9745674535819,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G27"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.9000312729186296,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H27"
     },
     "varianzaFuturo": {
      "v": 37937.35668586214,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I27"
     }
    },
    {
     "cultivo": "Soja",
     "zona": "Sur Entre Ríos",
     "fila": 28,
     "riesgo": [
      {
       "v": 284.1820130057321,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C28"
      },
      {
       "v": 269.59154193019083,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D28"
      },
      {
       "v": 257.66766514743495,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E28"
      },
      {
       "v": 248.79408164722994,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F28"
      },
      {
       "v": 243.30476296359558,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G28"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.251676464917471,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H28"
     },
     "varianzaFuturo": {
      "v": 14342.745743400417,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I28"
     }
    },
    {
     "cultivo": "Soja",
     "zona": "Sudeste BA",
     "fila": 29,
     "riesgo": [
      {
       "v": 156.05116226314175,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C29"
      },
      {
       "v": 134.43594693386822,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D29"
      },
      {
       "v": 115.90295170767412,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E29"
      },
      {
       "v": 102.14390047043541,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F29"
      },
      {
       "v": 95.25056637256371,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G29"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.0824991175462764,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H29"
     },
     "varianzaFuturo": {
      "v": 13115.294417737367,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I29"
     }
    },
    {
     "cultivo": "Soja",
     "zona": "Sudoeste BA",
     "fila": 30,
     "riesgo": [
      {
       "v": 114.89640809864315,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C30"
      },
      {
       "v": 92.07325261783015,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D30"
      },
      {
       "v": 70.87461654488071,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E30"
      },
      {
       "v": 53.276325532466004,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F30"
      },
      {
       "v": 43.851460901536605,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G30"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.0552812205772721,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H30"
     },
     "varianzaFuturo": {
      "v": 10155.425352802378,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I30"
     }
    },
    {
     "cultivo": "Soja",
     "zona": "Sur de Córdoba",
     "fila": 31,
     "riesgo": [
      {
       "v": 224.15256085749996,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C31"
      },
      {
       "v": 203.81601204679197,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D31"
      },
      {
       "v": 186.43471577423333,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E31"
      },
      {
       "v": 172.90222663823207,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F31"
      },
      {
       "v": 164.17307013812055,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G31"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.2580549059752906,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H31"
     },
     "varianzaFuturo": {
      "v": 15362.722011826268,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I31"
     }
    },
    {
     "cultivo": "Soja",
     "zona": "Oeste BA",
     "fila": 32,
     "riesgo": [
      {
       "v": 268.9994781692633,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C32"
      },
      {
       "v": 238.45806585231134,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D32"
      },
      {
       "v": 212.03691709346427,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E32"
      },
      {
       "v": 191.44956092078712,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F32"
      },
      {
       "v": 178.72350060585157,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G32"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.2025172623606102,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H32"
     },
     "varianzaFuturo": {
      "v": 28767.001006289007,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I32"
     }
    },
    {
     "cultivo": "Maíz",
     "zona": "Norte BA / Sur SF",
     "fila": 33,
     "riesgo": [
      {
       "v": 481.80017257509013,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C33"
      },
      {
       "v": 440.614852370724,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D33"
      },
      {
       "v": 410.85059211184864,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E33"
      },
      {
       "v": 395.09706278373125,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F33"
      },
      {
       "v": 395.03403407136983,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G33"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.8759844637440206,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H33"
     },
     "varianzaFuturo": {
      "v": 101173.75258154716,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I33"
     }
    },
    {
     "cultivo": "Maíz",
     "zona": "Sur Entre Ríos",
     "fila": 34,
     "riesgo": [
      {
       "v": 391.2832683882877,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C34"
      },
      {
       "v": 386.63651940087607,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D34"
      },
      {
       "v": 389.62073288658127,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E34"
      },
      {
       "v": 400.06517994269257,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F34"
      },
      {
       "v": 417.410225386167,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G34"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.2773607233308219,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H34"
     },
     "varianzaFuturo": {
      "v": 47450.52277479616,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I34"
     }
    },
    {
     "cultivo": "Maíz",
     "zona": "Sudeste BA",
     "fila": 35,
     "riesgo": [
      {
       "v": 252.76736236899544,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C35"
      },
      {
       "v": 203.8002195078351,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D35"
      },
      {
       "v": 161.13153292395995,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E35"
      },
      {
       "v": 131.06434973679652,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F35"
      },
      {
       "v": 123.1990587624522,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G35"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.948679576312394,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H35"
     },
     "varianzaFuturo": {
      "v": 54285.211508165674,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I35"
     }
    },
    {
     "cultivo": "Maíz",
     "zona": "Sudoeste BA",
     "fila": 36,
     "riesgo": [
      {
       "v": 202.25723129539014,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C36"
      },
      {
       "v": 170.1824642705191,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D36"
      },
      {
       "v": 147.97664803450138,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E36"
      },
      {
       "v": 140.4031312553162,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F36"
      },
      {
       "v": 149.69944506743857,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G36"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.7368663578751278,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H36"
     },
     "varianzaFuturo": {
      "v": 39047.46947544524,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I36"
     }
    },
    {
     "cultivo": "Maíz",
     "zona": "Oeste BA",
     "fila": 37,
     "riesgo": [
      {
       "v": 309.1084712178676,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C37"
      },
      {
       "v": 248.9960803330414,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D37"
      },
      {
       "v": 195.51363638222634,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E37"
      },
      {
       "v": 155.6523335809533,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F37"
      },
      {
       "v": 141.43991245261435,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G37"
      }
     ],
     "hMinimaVarianza": {
      "v": 0.982983885308899,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H37"
     },
     "varianzaFuturo": {
      "v": 78204.2635808952,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I37"
     }
    },
    {
     "cultivo": "Maíz",
     "zona": "Sur de Córdoba",
     "fila": 38,
     "riesgo": [
      {
       "v": 315.8093381026786,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › C38"
      },
      {
       "v": 273.1707271632761,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › D38"
      },
      {
       "v": 234.72248847194575,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › E38"
      },
      {
       "v": 202.86137946760832,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › F38"
      },
      {
       "v": 181.09810665500575,
       "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › G38"
      }
     ],
     "hMinimaVarianza": {
      "v": 1.2490008687516811,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › H38"
     },
     "varianzaFuturo": {
      "v": 44685.538155908784,
      "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Cobertura_Parcial › I38"
     }
    }
   ]
  }
 },
 "k": {
  "anios": [
   {
    "v": 2021,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C4"
   },
   {
    "v": 2022,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D4"
   },
   {
    "v": 2023,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E4"
   },
   {
    "v": 2024,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F4"
   },
   {
    "v": 2025,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G4"
   }
  ],
  "componentes": {
   "rf": [
    {
     "v": 0.0151,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C5"
    },
    {
     "v": 0.0388,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D5"
    },
    {
     "v": 0.0388,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E5"
    },
    {
     "v": 0.0458,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F5"
    },
    {
     "v": 0.0418,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G5"
    }
   ],
   "erp": [
    {
     "v": 0.0424,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C7"
    },
    {
     "v": 0.0594,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D7"
    },
    {
     "v": 0.046,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E7"
    },
    {
     "v": 0.0433,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F7"
    },
    {
     "v": 0.0423,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G7"
    }
   ],
   "embi": [
    {
     "v": 0.1697,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C10"
    },
    {
     "v": 0.2213,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D10"
    },
    {
     "v": 0.1906,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E10"
    },
    {
     "v": 0.0635,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F10"
    },
    {
     "v": 0.0571,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G10"
    }
   ]
  },
  "base": {
   "beta": [
    {
     "v": 0.217,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C6"
    },
    {
     "v": 0.217,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D6"
    },
    {
     "v": 0.217,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E6"
    },
    {
     "v": 0.217,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F6"
    },
    {
     "v": 0.217,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G6"
    }
   ],
   "k": [
    {
     "v": 0.1940008,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C11"
    },
    {
     "v": 0.2729898,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D11"
    },
    {
     "v": 0.239382,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E11"
    },
    {
     "v": 0.1186961,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F11"
    },
    {
     "v": 0.1080791,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G11"
    }
   ],
   "promedio": {
    "v": 0.18662956,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › H11"
   }
  },
  "betaSignificativo": {
   "beta": [
    {
     "v": 0.368,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C29"
    },
    {
     "v": 0.368,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D29"
    },
    {
     "v": 0.368,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E29"
    },
    {
     "v": 0.368,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F29"
    },
    {
     "v": 0.368,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G29"
    }
   ],
   "k": [
    {
     "v": 0.2004032,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › C34"
    },
    {
     "v": 0.2819592,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › D34"
    },
    {
     "v": 0.246328,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › E34"
    },
    {
     "v": 0.1252344,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › F34"
    },
    {
     "v": 0.1144664,
     "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › G34"
    }
   ],
   "promedio": {
    "v": 0.19367824,
    "o": "CAPM_K_Anual_TIF (3).xlsx › 3_CAPM_K › H34"
   }
  },
  "sinK": "La campaña 2025/26 (cosecha 2026) no tiene K: el Excel del CAPM llega hasta 2025."
 },
 "porCampana": [
  {
   "cultivo": "Trigo",
   "campana": "2020/21",
   "fila": 5,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C5"
   },
   "oni": {
    "v": -1,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D5"
   },
   "anomaliaLluvia": {
    "v": -0.08990239762468431,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E5"
   },
   "zonas": {
    "v": 7,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F5"
   },
   "desvioRindePromedio": {
    "v": -0.08785421634695532,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G5"
   },
   "zonasCaidaFuerte": {
    "v": 1,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H5"
   },
   "mbProyectado": {
    "v": 205.04392671646866,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I5"
   },
   "mbRealSin": {
    "v": 375.49956833905054,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J5"
   },
   "mbRealCon": {
    "v": 124.62013793168337,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K5"
   },
   "sorpresaSin": {
    "v": 170.45564162258185,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L5"
   },
   "sorpresaCon": {
    "v": -80.4237887847853,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M5"
   },
   "efectoPrecio": {
    "v": 239.06830836127804,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N5"
   },
   "efectoRinde": {
    "v": -46.67225332506138,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O5"
   },
   "interaccion": {
    "v": -21.940413413634783,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P5"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q5"
   },
   "origenClima": {
    "v": "D6 · C6 · J6",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R5"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2021/22",
   "fila": 6,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C6"
   },
   "oni": {
    "v": -0.77,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D6"
   },
   "anomaliaLluvia": {
    "v": -0.03669688707754637,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E6"
   },
   "zonas": {
    "v": 7,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F6"
   },
   "desvioRindePromedio": {
    "v": 0.07688725837034004,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G6"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H6"
   },
   "mbProyectado": {
    "v": 228.77593188974083,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I6"
   },
   "mbRealSin": {
    "v": 403.1659841497336,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J6"
   },
   "mbRealCon": {
    "v": 279.6522226622956,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K6"
   },
   "sorpresaSin": {
    "v": 174.3900522599928,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L6"
   },
   "sorpresaCon": {
    "v": 50.87629077255475,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M6"
   },
   "efectoPrecio": {
    "v": 121.50483639985642,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N6"
   },
   "efectoRinde": {
    "v": 43.501409350285705,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O6"
   },
   "interaccion": {
    "v": 9.383806509850725,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P6"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q6"
   },
   "origenClima": {
    "v": "D7 · C7 · J7",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R6"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2022/23",
   "fila": 7,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C7"
   },
   "oni": {
    "v": -0.89,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D7"
   },
   "anomaliaLluvia": {
    "v": -0.4240896179375579,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E7"
   },
   "zonas": {
    "v": 7,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F7"
   },
   "desvioRindePromedio": {
    "v": -0.31525137582734697,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G7"
   },
   "zonasCaidaFuerte": {
    "v": 5,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H7"
   },
   "mbProyectado": {
    "v": 422.767259813093,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I7"
   },
   "mbRealSin": {
    "v": 86.61022776119206,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J7"
   },
   "mbRealCon": {
    "v": 126.52927994061399,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K7"
   },
   "sorpresaSin": {
    "v": -336.1570320519009,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L7"
   },
   "sorpresaCon": {
    "v": -296.237979872479,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M7"
   },
   "efectoPrecio": {
    "v": -42.61837946135559,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N7"
   },
   "efectoRinde": {
    "v": -307.63249391421283,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O7"
   },
   "interaccion": {
    "v": 14.093841323667514,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P7"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q7"
   },
   "origenClima": {
    "v": "D8 · C8 · J8",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R7"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2023/24",
   "fila": 8,
   "faseEnso": {
    "v": "El Niño",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C8"
   },
   "oni": {
    "v": 1.74,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D8"
   },
   "anomaliaLluvia": {
    "v": -0.1051535924765317,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E8"
   },
   "zonas": {
    "v": 7,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F8"
   },
   "desvioRindePromedio": {
    "v": -0.07289935311634634,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G8"
   },
   "zonasCaidaFuerte": {
    "v": 2,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H8"
   },
   "mbProyectado": {
    "v": 178.83402538091315,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I8"
   },
   "mbRealSin": {
    "v": 116.34082721817843,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J8"
   },
   "mbRealCon": {
    "v": 137.49676834500534,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K8"
   },
   "sorpresaSin": {
    "v": -62.49319816273472,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L8"
   },
   "sorpresaCon": {
    "v": -41.33725703590782,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M8"
   },
   "efectoPrecio": {
    "v": -23.58321522625557,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N8"
   },
   "efectoRinde": {
    "v": -40.605871743212695,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O8"
   },
   "interaccion": {
    "v": 1.6958888067335312,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P8"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q8"
   },
   "origenClima": {
    "v": "D9 · C9 · J9",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R8"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2024/25",
   "fila": 9,
   "faseEnso": {
    "v": "Neutral",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C9"
   },
   "oni": {
    "v": -0.19,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D9"
   },
   "anomaliaLluvia": {
    "v": -0.003420172499743167,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E9"
   },
   "zonas": {
    "v": 7,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F9"
   },
   "desvioRindePromedio": {
    "v": 0.05809889318890736,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G9"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H9"
   },
   "mbProyectado": {
    "v": 177.22064175553348,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I9"
   },
   "mbRealSin": {
    "v": 90.51316566596067,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J9"
   },
   "mbRealCon": {
    "v": 193.06794702030928,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K9"
   },
   "sorpresaSin": {
    "v": -86.7074760895728,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L9"
   },
   "sorpresaCon": {
    "v": 15.847305264775814,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M9"
   },
   "efectoPrecio": {
    "v": -111.35399362269652,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N9"
   },
   "efectoRinde": {
    "v": 31.021423785551143,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O9"
   },
   "interaccion": {
    "v": -6.374906252427424,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P9"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q9"
   },
   "origenClima": {
    "v": "D10 · C10 · J10",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R9"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2025/26",
   "fila": 10,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C10"
   },
   "oni": {
    "v": -0.57,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D10"
   },
   "anomaliaLluvia": {
    "v": 0.1050207369734961,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E10"
   },
   "zonas": {
    "v": 7,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F10"
   },
   "desvioRindePromedio": {
    "v": 0.49061849411120584,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G10"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H10"
   },
   "mbProyectado": {
    "v": 30.96273682078063,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I10"
   },
   "mbRealSin": {
    "v": 133.89485457965822,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J10"
   },
   "mbRealCon": {
    "v": 205.57113633169527,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K10"
   },
   "sorpresaSin": {
    "v": 102.93211775887758,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L10"
   },
   "sorpresaCon": {
    "v": 174.6083995109146,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M10"
   },
   "efectoPrecio": {
    "v": -75.1597179314616,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N10"
   },
   "efectoRinde": {
    "v": 213.2996217674425,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O10"
   },
   "interaccion": {
    "v": -35.207786077103336,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P10"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q10"
   },
   "origenClima": {
    "v": "D11 · C11 · J11",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R10"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2020/21",
   "fila": 11,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C11"
   },
   "oni": {
    "v": -0.99,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D11"
   },
   "anomaliaLluvia": {
    "v": -0.1972170942332052,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E11"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F11"
   },
   "desvioRindePromedio": {
    "v": -0.057136979146313736,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G11"
   },
   "zonasCaidaFuerte": {
    "v": 1,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H11"
   },
   "mbProyectado": {
    "v": 434.25385934250176,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I11"
   },
   "mbRealSin": {
    "v": 516.2068621820863,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J11"
   },
   "mbRealCon": {
    "v": 358.0630584167665,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K11"
   },
   "sorpresaSin": {
    "v": 81.95300283958453,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L11"
   },
   "sorpresaCon": {
    "v": -76.19080092573525,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M11"
   },
   "efectoPrecio": {
    "v": 138.6680661920702,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N11"
   },
   "efectoRinde": {
    "v": -46.943730964715655,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O11"
   },
   "interaccion": {
    "v": -9.77133238777003,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P11"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q11"
   },
   "origenClima": {
    "v": "F6 · E6 · K6",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R11"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2021/22",
   "fila": 12,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C12"
   },
   "oni": {
    "v": -0.76,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D12"
   },
   "anomaliaLluvia": {
    "v": -0.09525606406561338,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E12"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F12"
   },
   "desvioRindePromedio": {
    "v": 0.048828109347414016,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G12"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H12"
   },
   "mbProyectado": {
    "v": 381.02882043269256,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I12"
   },
   "mbRealSin": {
    "v": 715.0428095805911,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J12"
   },
   "mbRealCon": {
    "v": 413.3190837127924,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K12"
   },
   "sorpresaSin": {
    "v": 334.0139891478986,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L12"
   },
   "sorpresaCon": {
    "v": 32.290263280099765,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M12"
   },
   "efectoPrecio": {
    "v": 300.0032684314329,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N12"
   },
   "efectoRinde": {
    "v": 23.890083776435986,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O12"
   },
   "interaccion": {
    "v": 10.120636940029838,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P12"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q12"
   },
   "origenClima": {
    "v": "F7 · E7 · K7",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R12"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2022/23",
   "fila": 13,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C13"
   },
   "oni": {
    "v": -0.55,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D13"
   },
   "anomaliaLluvia": {
    "v": -0.4112411251383483,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E13"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F13"
   },
   "desvioRindePromedio": {
    "v": -0.2571545848430681,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G13"
   },
   "zonasCaidaFuerte": {
    "v": 4,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H13"
   },
   "mbProyectado": {
    "v": 468.8283553890545,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I13"
   },
   "mbRealSin": {
    "v": 186.21136113211014,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J13"
   },
   "mbRealCon": {
    "v": 216.21786429372932,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K13"
   },
   "sorpresaSin": {
    "v": -282.61699425694434,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L13"
   },
   "sorpresaCon": {
    "v": -252.6104910953252,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M13"
   },
   "efectoPrecio": {
    "v": -63.2022821435855,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N13"
   },
   "efectoRinde": {
    "v": -238.27312184541776,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O13"
   },
   "interaccion": {
    "v": 18.858409732058913,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P13"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q13"
   },
   "origenClima": {
    "v": "F8 · E8 · K8",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R13"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2023/24",
   "fila": 14,
   "faseEnso": {
    "v": "El Niño",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C14"
   },
   "oni": {
    "v": 1.84,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D14"
   },
   "anomaliaLluvia": {
    "v": 0.1851550795970411,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E14"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F14"
   },
   "desvioRindePromedio": {
    "v": 0.14628162402658948,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G14"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H14"
   },
   "mbProyectado": {
    "v": 342.07568904117574,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I14"
   },
   "mbRealSin": {
    "v": 360.43390404450867,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J14"
   },
   "mbRealCon": {
    "v": 413.92774558802876,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K14"
   },
   "sorpresaSin": {
    "v": 18.35821500333297,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L14"
   },
   "sorpresaCon": {
    "v": 71.85205654685305,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M14"
   },
   "efectoPrecio": {
    "v": -64.21091813793049,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N14"
   },
   "efectoRinde": {
    "v": 91.24315638559438,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O14"
   },
   "interaccion": {
    "v": -8.674023244330904,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P14"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q14"
   },
   "origenClima": {
    "v": "F9 · E9 · K9",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R14"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2024/25",
   "fila": 15,
   "faseEnso": {
    "v": "Neutral",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C15"
   },
   "oni": {
    "v": -0.46,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D15"
   },
   "anomaliaLluvia": {
    "v": -0.0642097363278104,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E15"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F15"
   },
   "desvioRindePromedio": {
    "v": 0.1406433998993856,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G15"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H15"
   },
   "mbProyectado": {
    "v": 227.82012899012702,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I15"
   },
   "mbRealSin": {
    "v": 281.76232915752547,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J15"
   },
   "mbRealCon": {
    "v": 287.30826676029943,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K15"
   },
   "sorpresaSin": {
    "v": 53.942200167398425,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L15"
   },
   "sorpresaCon": {
    "v": 59.48813777017244,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M15"
   },
   "efectoPrecio": {
    "v": -15.750070438742162,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N15"
   },
   "efectoRinde": {
    "v": 71.82331803377112,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O15"
   },
   "interaccion": {
    "v": -2.1310474276305436,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P15"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q15"
   },
   "origenClima": {
    "v": "F10 · E10 · K10",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R15"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2025/26",
   "fila": 16,
   "faseEnso": {
    "v": "Neutral",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C16"
   },
   "oni": {
    "v": -0.39,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D16"
   },
   "anomaliaLluvia": {
    "v": -0.4154172726408749,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E16"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F16"
   },
   "desvioRindePromedio": {
    "v": 0.058389249440341184,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G16"
   },
   "zonasCaidaFuerte": {
    "v": 1,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H16"
   },
   "mbProyectado": {
    "v": 347.93992929836946,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I16"
   },
   "mbRealSin": {
    "v": 407.8521470951435,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J16"
   },
   "mbRealCon": {
    "v": 380.0746350839084,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K16"
   },
   "sorpresaSin": {
    "v": 59.91221779677398,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L16"
   },
   "sorpresaCon": {
    "v": 32.13470578553886,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M16"
   },
   "efectoPrecio": {
    "v": 16.402341255255035,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N16"
   },
   "efectoRinde": {
    "v": 42.314482929022965,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O16"
   },
   "interaccion": {
    "v": 1.195393612496046,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P16"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q16"
   },
   "origenClima": {
    "v": "F11 · E11 · K11",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R16"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2020/21",
   "fila": 17,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C17"
   },
   "oni": {
    "v": -0.99,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D17"
   },
   "anomaliaLluvia": {
    "v": -0.1972170942332052,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E17"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F17"
   },
   "desvioRindePromedio": {
    "v": -0.08248083895771285,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G17"
   },
   "zonasCaidaFuerte": {
    "v": 2,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H17"
   },
   "mbProyectado": {
    "v": 405.25713736484636,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I17"
   },
   "mbRealSin": {
    "v": 726.6439462827907,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J17"
   },
   "mbRealCon": {
    "v": 294.7445625556879,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K17"
   },
   "sorpresaSin": {
    "v": 321.3868089179444,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L17"
   },
   "sorpresaCon": {
    "v": -110.51257480915847,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M17"
   },
   "efectoPrecio": {
    "v": 425.37222696203247,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N17"
   },
   "efectoRinde": {
    "v": -68.90437396286556,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O17"
   },
   "interaccion": {
    "v": -35.081044081222494,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P17"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q17"
   },
   "origenClima": {
    "v": "F6 · E6 · L6",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R17"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2021/22",
   "fila": 18,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C18"
   },
   "oni": {
    "v": -0.76,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D18"
   },
   "anomaliaLluvia": {
    "v": -0.09525606406561338,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E18"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F18"
   },
   "desvioRindePromedio": {
    "v": -0.1624776719767893,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G18"
   },
   "zonasCaidaFuerte": {
    "v": 2,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H18"
   },
   "mbProyectado": {
    "v": 518.2067680082087,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I18"
   },
   "mbRealSin": {
    "v": 801.8780964917886,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J18"
   },
   "mbRealCon": {
    "v": 275.30578898689566,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K18"
   },
   "sorpresaSin": {
    "v": 283.6713284835799,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L18"
   },
   "sorpresaCon": {
    "v": -242.90097902131296,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M18"
   },
   "efectoPrecio": {
    "v": 529.0630758869252,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N18"
   },
   "efectoRinde": {
    "v": -161.87415044946115,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O18"
   },
   "interaccion": {
    "v": -83.51759695388411,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P18"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q18"
   },
   "origenClima": {
    "v": "F7 · E7 · L7",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R18"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2022/23",
   "fila": 19,
   "faseEnso": {
    "v": "La Niña",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C19"
   },
   "oni": {
    "v": -0.55,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D19"
   },
   "anomaliaLluvia": {
    "v": -0.4112411251383483,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E19"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F19"
   },
   "desvioRindePromedio": {
    "v": -0.30961081567930165,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G19"
   },
   "zonasCaidaFuerte": {
    "v": 3,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H19"
   },
   "mbProyectado": {
    "v": 598.7896839088377,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I19"
   },
   "mbRealSin": {
    "v": 158.08627939049896,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J19"
   },
   "mbRealCon": {
    "v": 184.3611470837924,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K19"
   },
   "sorpresaSin": {
    "v": -440.70340451833863,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L19"
   },
   "sorpresaCon": {
    "v": -414.4285368250452,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M19"
   },
   "efectoPrecio": {
    "v": -57.10156605937234,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N19"
   },
   "efectoRinde": {
    "v": -401.5447433728641,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O19"
   },
   "interaccion": {
    "v": 17.942904913897767,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P19"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q19"
   },
   "origenClima": {
    "v": "F8 · E8 · L8",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R19"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2023/24",
   "fila": 20,
   "faseEnso": {
    "v": "El Niño",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C20"
   },
   "oni": {
    "v": 1.84,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D20"
   },
   "anomaliaLluvia": {
    "v": 0.1851550795970411,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E20"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F20"
   },
   "desvioRindePromedio": {
    "v": 0.0036087961534986834,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G20"
   },
   "zonasCaidaFuerte": {
    "v": 1,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H20"
   },
   "mbProyectado": {
    "v": 294.40584968198493,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I20"
   },
   "mbRealSin": {
    "v": 246.86575523196788,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J20"
   },
   "mbRealCon": {
    "v": 305.07177124545495,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K20"
   },
   "sorpresaSin": {
    "v": -47.54009445001702,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L20"
   },
   "sorpresaCon": {
    "v": 10.665921563470041,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M20"
   },
   "efectoPrecio": {
    "v": -57.65950276997768,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N20"
   },
   "efectoRinde": {
    "v": 10.974027483313888,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O20"
   },
   "interaccion": {
    "v": -0.854619163353274,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P20"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q20"
   },
   "origenClima": {
    "v": "F9 · E9 · L9",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R20"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2024/25",
   "fila": 21,
   "faseEnso": {
    "v": "Neutral",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C21"
   },
   "oni": {
    "v": -0.46,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D21"
   },
   "anomaliaLluvia": {
    "v": -0.0642097363278104,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E21"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F21"
   },
   "desvioRindePromedio": {
    "v": 0.12682101330991893,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G21"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H21"
   },
   "mbProyectado": {
    "v": 202.19340642070895,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I21"
   },
   "mbRealSin": {
    "v": 448.43008458396,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J21"
   },
   "mbRealCon": {
    "v": 299.00470519820027,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K21"
   },
   "sorpresaSin": {
    "v": 246.2366781632511,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L21"
   },
   "sorpresaCon": {
    "v": 96.8112987774913,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M21"
   },
   "efectoPrecio": {
    "v": 147.98628850918462,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N21"
   },
   "efectoRinde": {
    "v": 82.10460908126275,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O21"
   },
   "interaccion": {
    "v": 16.14578057280374,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P21"
   },
   "quePesoMas": {
    "v": "Precio",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q21"
   },
   "origenClima": {
    "v": "F10 · E10 · L10",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R21"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2025/26",
   "fila": 22,
   "faseEnso": {
    "v": "Neutral",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › C22"
   },
   "oni": {
    "v": -0.39,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › D22"
   },
   "anomaliaLluvia": {
    "v": -0.4154172726408749,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › E22"
   },
   "zonas": {
    "v": 6,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › F22"
   },
   "desvioRindePromedio": {
    "v": 0.1262553738113569,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › G22"
   },
   "zonasCaidaFuerte": {
    "v": 0,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › H22"
   },
   "mbProyectado": {
    "v": 137.04232809397197,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › I22"
   },
   "mbRealSin": {
    "v": 304.2069328079882,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › J22"
   },
   "mbRealCon": {
    "v": 229.39316204567214,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › K22"
   },
   "sorpresaSin": {
    "v": 167.16460471401624,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › L22"
   },
   "sorpresaCon": {
    "v": 92.35083395170017,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › M22"
   },
   "efectoPrecio": {
    "v": 69.56071376494933,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › N22"
   },
   "efectoRinde": {
    "v": 88.95555157355938,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › O22"
   },
   "interaccion": {
    "v": 8.648339375507563,
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › P22"
   },
   "quePesoMas": {
    "v": "Rinde",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › Q22"
   },
   "origenClima": {
    "v": "F11 · E11 · L11",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › RR_Por_Campaña › R22"
   }
  }
 ],
 "precios": [
  {
   "cultivo": "Trigo",
   "campana": "2020/21",
   "fila": 5,
   "contrato": {
    "v": "TRI.ROS/ENE21",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C5"
   },
   "mesSiembra": {
    "v": "jun",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D5"
   },
   "mesCosecha": {
    "v": "ene",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E5"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2021/22",
   "fila": 6,
   "contrato": {
    "v": "TRI.ROS/ENE22",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C6"
   },
   "mesSiembra": {
    "v": "jun",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D6"
   },
   "mesCosecha": {
    "v": "ene",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E6"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2022/23",
   "fila": 7,
   "contrato": {
    "v": "TRI.ROS/ENE23",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C7"
   },
   "mesSiembra": {
    "v": "jun",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D7"
   },
   "mesCosecha": {
    "v": "ene",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E7"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2023/24",
   "fila": 8,
   "contrato": {
    "v": "TRI.ROS/ENE24",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C8"
   },
   "mesSiembra": {
    "v": "jun",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D8"
   },
   "mesCosecha": {
    "v": "ene",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E8"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2024/25",
   "fila": 9,
   "contrato": {
    "v": "TRI.ROS/ENE25",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C9"
   },
   "mesSiembra": {
    "v": "jun",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D9"
   },
   "mesCosecha": {
    "v": "ene",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E9"
   }
  },
  {
   "cultivo": "Trigo",
   "campana": "2025/26",
   "fila": 10,
   "contrato": {
    "v": "TRI.ROS/ENE26",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C10"
   },
   "mesSiembra": {
    "v": "jun",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D10"
   },
   "mesCosecha": {
    "v": "ene",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E10"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2020/21",
   "fila": 11,
   "contrato": {
    "v": "SOJ.ROS/MAY21",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C11"
   },
   "mesSiembra": {
    "v": "nov",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D11"
   },
   "mesCosecha": {
    "v": "may",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E11"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2021/22",
   "fila": 12,
   "contrato": {
    "v": "SOJ.ROS/MAY22",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C12"
   },
   "mesSiembra": {
    "v": "nov",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D12"
   },
   "mesCosecha": {
    "v": "may",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E12"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2022/23",
   "fila": 13,
   "contrato": {
    "v": "SOJ.ROS/MAY23",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C13"
   },
   "mesSiembra": {
    "v": "nov",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D13"
   },
   "mesCosecha": {
    "v": "may",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E13"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2023/24",
   "fila": 14,
   "contrato": {
    "v": "SOJ.ROS/MAY24",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C14"
   },
   "mesSiembra": {
    "v": "nov",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D14"
   },
   "mesCosecha": {
    "v": "may",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E14"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2024/25",
   "fila": 15,
   "contrato": {
    "v": "SOJ.ROS/MAY25",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C15"
   },
   "mesSiembra": {
    "v": "nov",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D15"
   },
   "mesCosecha": {
    "v": "may",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E15"
   }
  },
  {
   "cultivo": "Soja",
   "campana": "2025/26",
   "fila": 16,
   "contrato": {
    "v": "SOJ.ROS/MAY26",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C16"
   },
   "mesSiembra": {
    "v": "nov",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D16"
   },
   "mesCosecha": {
    "v": "may",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E16"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2020/21",
   "fila": 17,
   "contrato": {
    "v": "MAI.ROS/ABR21",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C17"
   },
   "mesSiembra": {
    "v": "sep",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D17"
   },
   "mesCosecha": {
    "v": "abr",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E17"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2021/22",
   "fila": 18,
   "contrato": {
    "v": "MAI.ROS/ABR22",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C18"
   },
   "mesSiembra": {
    "v": "sep",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D18"
   },
   "mesCosecha": {
    "v": "abr",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E18"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2022/23",
   "fila": 19,
   "contrato": {
    "v": "MAI.ROS/ABR23",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C19"
   },
   "mesSiembra": {
    "v": "sep",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D19"
   },
   "mesCosecha": {
    "v": "abr",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E19"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2023/24",
   "fila": 20,
   "contrato": {
    "v": "MAI.ROS/ABR24",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C20"
   },
   "mesSiembra": {
    "v": "sep",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D20"
   },
   "mesCosecha": {
    "v": "abr",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E20"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2024/25",
   "fila": 21,
   "contrato": {
    "v": "MAI.ROS/ABR25",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C21"
   },
   "mesSiembra": {
    "v": "sep",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D21"
   },
   "mesCosecha": {
    "v": "abr",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E21"
   }
  },
  {
   "cultivo": "Maíz",
   "campana": "2025/26",
   "fila": 22,
   "contrato": {
    "v": "MAI.ROS/ABR26",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › C22"
   },
   "mesSiembra": {
    "v": "sep",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › D22"
   },
   "mesCosecha": {
    "v": "abr",
    "o": "Cobertura_Futuros_vs_Spot_TIF_con_cosecha.xlsx › Precios_A3 › E22"
   }
  }
 ],
 "referenciaTesis": {
  "nota": "Referencia de la tesis: promedio de zonas con rinde de planteo. No es la cifra con rinde real del simulador.",
  "k": {
   "base": {
    "beta": {
     "v": 0.217,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B6"
    },
    "porAnio": [
     {
      "v": 0.1940008,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C6"
     },
     {
      "v": 0.2729898,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D6"
     },
     {
      "v": 0.239382,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E6"
     },
     {
      "v": 0.1186961,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F6"
     },
     {
      "v": 0.1080791,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G6"
     }
    ],
    "promedio": {
     "v": 0.18662956,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H6"
    }
   },
   "betaSignificativo": {
    "beta": {
     "v": 0.368,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B7"
    },
    "porAnio": [
     {
      "v": 0.2004032,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C7"
     },
     {
      "v": 0.2819592,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D7"
     },
     {
      "v": 0.246328,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E7"
     },
     {
      "v": 0.1252344,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F7"
     },
     {
      "v": 0.1144664,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G7"
     }
    ],
    "promedio": {
     "v": 0.19367824,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H7"
    }
   }
  },
  "r": {
   "filas": [
    {
     "campana": "2020/21",
     "anio": {
      "v": 2021,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B13"
     },
     "trigoCobertura": {
      "v": 0.0313764396841722,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C13"
     },
     "trigoSpot": {
      "v": 0.0717801862477972,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D13"
     },
     "sojaCobertura": {
      "v": 0.0717908832520482,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E13"
     },
     "sojaSpot": {
      "v": 0.0984329331069315,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F13"
     },
     "maizCobertura": {
      "v": 0.0730536128920936,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G13"
     },
     "maizSpot": {
      "v": 0.147336737121866,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H13"
     }
    },
    {
     "campana": "2021/22",
     "anio": {
      "v": 2022,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B14"
     },
     "trigoCobertura": {
      "v": 0.0374803226519184,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C14"
     },
     "trigoSpot": {
      "v": 0.0572896553214589,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D14"
     },
     "sojaCobertura": {
      "v": 0.0692440641333305,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E14"
     },
     "sojaSpot": {
      "v": 0.120973240605202,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F14"
     },
     "maizCobertura": {
      "v": 0.0978804479547113,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G14"
     },
     "maizSpot": {
      "v": 0.189125299809993,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H14"
     }
    },
    {
     "campana": "2022/23",
     "anio": {
      "v": 2023,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B15"
     },
     "trigoCobertura": {
      "v": 0.065914612499331,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C15"
     },
     "trigoSpot": {
      "v": 0.0597400023163774,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D15"
     },
     "sojaCobertura": {
      "v": 0.0792458777263604,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E15"
     },
     "sojaSpot": {
      "v": 0.0741615119331845,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F15"
     },
     "maizCobertura": {
      "v": 0.113932858125794,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G15"
     },
     "maizSpot": {
      "v": 0.109339846294182,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H15"
     }
    },
    {
     "campana": "2023/24",
     "anio": {
      "v": 2024,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B16"
     },
     "trigoCobertura": {
      "v": 0.0341608517895085,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C16"
     },
     "trigoSpot": {
      "v": 0.0307581000256631,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D16"
     },
     "sojaCobertura": {
      "v": 0.0601144522693703,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E16"
     },
     "sojaSpot": {
      "v": 0.0513416343272961,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F16"
     },
     "maizCobertura": {
      "v": 0.067993218352767,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G16"
     },
     "maizSpot": {
      "v": 0.0578482734783711,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H16"
     }
    },
    {
     "campana": "2024/25",
     "anio": {
      "v": 2025,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B17"
     },
     "trigoCobertura": {
      "v": 0.0322490598638715,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C17"
     },
     "trigoSpot": {
      "v": 0.0167100670512206,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D17"
     },
     "sojaCobertura": {
      "v": 0.0380404673529452,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E17"
     },
     "sojaSpot": {
      "v": 0.0372064325358704,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F17"
     },
     "maizCobertura": {
      "v": 0.0505989392282523,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G17"
     },
     "maizSpot": {
      "v": 0.0751714592557022,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H17"
     }
    }
   ],
   "promedio": {
    "trigoCobertura": {
     "v": 0.0402362572977603,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C18"
    },
    "trigoSpot": {
     "v": 0.0472556021925035,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D18"
    },
    "sojaCobertura": {
     "v": 0.0636871489468109,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E18"
    },
    "sojaSpot": {
     "v": 0.0764231505016968,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F18"
    },
    "maizCobertura": {
     "v": 0.0806918153107235,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G18"
    },
    "maizSpot": {
     "v": 0.115764323192023,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H18"
    }
   }
  },
  "brechaBase": {
   "filas": [
    {
     "campana": "2020/21",
     "anio": {
      "v": 2021,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B23"
     },
     "trigoCobertura": {
      "v": -0.162624360315828,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C23"
     },
     "trigoSpot": {
      "v": -0.122220613752203,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D23"
     },
     "sojaCobertura": {
      "v": -0.122209916747952,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E23"
     },
     "sojaSpot": {
      "v": -0.0955678668930685,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F23"
     },
     "maizCobertura": {
      "v": -0.120947187107906,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G23"
     },
     "maizSpot": {
      "v": -0.046664062878134,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H23"
     }
    },
    {
     "campana": "2021/22",
     "anio": {
      "v": 2022,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B24"
     },
     "trigoCobertura": {
      "v": -0.235509477348082,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C24"
     },
     "trigoSpot": {
      "v": -0.215700144678541,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D24"
     },
     "sojaCobertura": {
      "v": -0.20374573586667,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E24"
     },
     "sojaSpot": {
      "v": -0.152016559394798,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F24"
     },
     "maizCobertura": {
      "v": -0.175109352045289,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G24"
     },
     "maizSpot": {
      "v": -0.0838645001900074,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H24"
     }
    },
    {
     "campana": "2022/23",
     "anio": {
      "v": 2023,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B25"
     },
     "trigoCobertura": {
      "v": -0.173467387500669,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C25"
     },
     "trigoSpot": {
      "v": -0.179641997683623,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D25"
     },
     "sojaCobertura": {
      "v": -0.16013612227364,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E25"
     },
     "sojaSpot": {
      "v": -0.165220488066816,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F25"
     },
     "maizCobertura": {
      "v": -0.125449141874206,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G25"
     },
     "maizSpot": {
      "v": -0.130042153705818,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H25"
     }
    },
    {
     "campana": "2023/24",
     "anio": {
      "v": 2024,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B26"
     },
     "trigoCobertura": {
      "v": -0.0845352482104915,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C26"
     },
     "trigoSpot": {
      "v": -0.0879379999743369,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D26"
     },
     "sojaCobertura": {
      "v": -0.0585816477306297,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E26"
     },
     "sojaSpot": {
      "v": -0.0673544656727039,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F26"
     },
     "maizCobertura": {
      "v": -0.0507028816472331,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G26"
     },
     "maizSpot": {
      "v": -0.0608478265216289,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H26"
     }
    },
    {
     "campana": "2024/25",
     "anio": {
      "v": 2025,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B27"
     },
     "trigoCobertura": {
      "v": -0.0758300401361285,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C27"
     },
     "trigoSpot": {
      "v": -0.0913690329487794,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D27"
     },
     "sojaCobertura": {
      "v": -0.0700386326470548,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E27"
     },
     "sojaSpot": {
      "v": -0.0708726674641296,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F27"
     },
     "maizCobertura": {
      "v": -0.0574801607717477,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G27"
     },
     "maizSpot": {
      "v": -0.0329076407442978,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H27"
     }
    }
   ],
   "promedio": {
    "trigoCobertura": {
     "v": -0.14639330270224,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C28"
    },
    "trigoSpot": {
     "v": -0.139373957807497,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D28"
    },
    "sojaCobertura": {
     "v": -0.122942411053189,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E28"
    },
    "sojaSpot": {
     "v": -0.110206409498303,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F28"
    },
    "maizCobertura": {
     "v": -0.105937744689276,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G28"
    },
    "maizSpot": {
     "v": -0.0708652368079771,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H28"
    }
   }
  },
  "brechaBetaSignificativo": {
   "filas": [
    {
     "campana": "2020/21",
     "anio": {
      "v": 2021,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B34"
     },
     "trigoCobertura": {
      "v": -0.169026760315828,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C34"
     },
     "trigoSpot": {
      "v": -0.128623013752203,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D34"
     },
     "sojaCobertura": {
      "v": -0.128612316747952,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E34"
     },
     "sojaSpot": {
      "v": -0.101970266893068,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F34"
     },
     "maizCobertura": {
      "v": -0.127349587107906,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G34"
     },
     "maizSpot": {
      "v": -0.053066462878134,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H34"
     }
    },
    {
     "campana": "2021/22",
     "anio": {
      "v": 2022,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B35"
     },
     "trigoCobertura": {
      "v": -0.244478877348082,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C35"
     },
     "trigoSpot": {
      "v": -0.224669544678541,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D35"
     },
     "sojaCobertura": {
      "v": -0.21271513586667,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E35"
     },
     "sojaSpot": {
      "v": -0.160985959394798,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F35"
     },
     "maizCobertura": {
      "v": -0.184078752045289,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G35"
     },
     "maizSpot": {
      "v": -0.0928339001900074,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H35"
     }
    },
    {
     "campana": "2022/23",
     "anio": {
      "v": 2023,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B36"
     },
     "trigoCobertura": {
      "v": -0.180413387500669,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C36"
     },
     "trigoSpot": {
      "v": -0.186587997683623,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D36"
     },
     "sojaCobertura": {
      "v": -0.16708212227364,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E36"
     },
     "sojaSpot": {
      "v": -0.172166488066816,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F36"
     },
     "maizCobertura": {
      "v": -0.132395141874206,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G36"
     },
     "maizSpot": {
      "v": -0.136988153705818,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H36"
     }
    },
    {
     "campana": "2023/24",
     "anio": {
      "v": 2024,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B37"
     },
     "trigoCobertura": {
      "v": -0.0910735482104915,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C37"
     },
     "trigoSpot": {
      "v": -0.0944762999743369,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D37"
     },
     "sojaCobertura": {
      "v": -0.0651199477306297,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E37"
     },
     "sojaSpot": {
      "v": -0.0738927656727039,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F37"
     },
     "maizCobertura": {
      "v": -0.0572411816472331,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G37"
     },
     "maizSpot": {
      "v": -0.0673861265216289,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H37"
     }
    },
    {
     "campana": "2024/25",
     "anio": {
      "v": 2025,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › B38"
     },
     "trigoCobertura": {
      "v": -0.0822173401361285,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C38"
     },
     "trigoSpot": {
      "v": -0.0977563329487794,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D38"
     },
     "sojaCobertura": {
      "v": -0.0764259326470548,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E38"
     },
     "sojaSpot": {
      "v": -0.0772599674641296,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F38"
     },
     "maizCobertura": {
      "v": -0.0638674607717477,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G38"
     },
     "maizSpot": {
      "v": -0.0392949407442978,
      "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H38"
     }
    }
   ],
   "promedio": {
    "trigoCobertura": {
     "v": -0.15344198270224,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › C39"
    },
    "trigoSpot": {
     "v": -0.146422637807497,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › D39"
    },
    "sojaCobertura": {
     "v": -0.129991091053189,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › E39"
    },
    "sojaSpot": {
     "v": -0.117255089498303,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › F39"
    },
    "maizCobertura": {
     "v": -0.112986424689276,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › G39"
    },
    "maizSpot": {
     "v": -0.0779139168079771,
     "o": "Rentabilidad_Tierra_por_Zona_con_cosecha.xlsx › Brecha_R_vs_K › H39"
    }
   }
  }
 }
};
// --- fin de datos (JSON) ---
raiz.TESIS_DATOS = datos;
if (typeof module !== "undefined" && module.exports) module.exports = datos;
})(typeof window !== "undefined" ? window : globalThis);
