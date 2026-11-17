# Bibliotecas de terceros en `vendor/`

Todo funciona sin internet: los archivos están copiados acá. Cada carpeta trae su licencia.

| Carpeta | Biblioteca | Versión | Licencia |
|---|---|---|---|
| `echarts/` | Apache ECharts | 6.1.0 | Apache-2.0 (`LICENSE`, `NOTICE`) |
| `echarts-liquidfill/` | echarts-liquidfill (silos con líquido) | 3.1.0 | BSD-3-Clause (`LICENSE`, tomada del repositorio oficial ecomfe/echarts-liquidfill; el `package.json` dice MIT, pero el texto del repositorio es BSD de 3 cláusulas) |
| `animejs/` | anime.js | 4.5.0 | MIT |
| `countup/` | countUp.js | 2.10.1 | MIT |
| `lenis/` | Lenis (scroll suave) | 1.3.27 | MIT |
| `lucide/` | Lucide (íconos) | ver `LICENSE` | ISC |
| `fuentes/` | IBM Plex Sans | ver `LICENSE-IBM-Plex-Sans.txt` | SIL OFL 1.1 |

Auditadas antes de incluirse. No se descargan en la página: se cargan con `<script src="vendor/...">` relativo.
