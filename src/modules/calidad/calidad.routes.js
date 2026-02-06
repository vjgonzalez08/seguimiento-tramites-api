const express = require('express');
const router = express.Router();

const {
  getTotalTramitesDevueltosHandler,
  getTramitesDevueltosConRespuestaHandler,
  getTramitesDevueltosSinRespuestaHandler,
  getTramitesDevueltosCumplenHandler,
  getTramitesDevueltosSinRespuestaSlaHandler,
  getPromedioDiasRespuestaHandler,     
  getPromedioDiasSinRespuestaHandler,  
  getCorteDatosSapHandler,
  getDevueltosPorPrediadorResumenHandler,
  getDevueltosPorPrediadorDetalleHandler,
} = require('./calidad.controller');

router.get('/devueltos', getTotalTramitesDevueltosHandler);
router.get('/devueltos-con-respuesta', getTramitesDevueltosConRespuestaHandler);
router.get('/devueltos-sin-respuesta', getTramitesDevueltosSinRespuestaHandler);
router.get('/cumplen', getTramitesDevueltosCumplenHandler);
router.get('/sin-respuesta-sla', getTramitesDevueltosSinRespuestaSlaHandler);
router.get('/promedio-respuesta', getPromedioDiasRespuestaHandler);
router.get('/promedio-sin-respuesta', getPromedioDiasSinRespuestaHandler);
router.get('/corte-datos', getCorteDatosSapHandler);
router.get('/prediadores/resumen', getDevueltosPorPrediadorResumenHandler);
router.get('/prediadores/detalle', getDevueltosPorPrediadorDetalleHandler);

module.exports = router;
