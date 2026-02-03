const express = require('express');
const router = express.Router();

const {
  getTotalTramitesDevueltosHandler,
  getTramitesDevueltosConRespuestaHandler,
  getTramitesDevueltosSinRespuestaHandler,
  getCorteDatosSapHandler,
} = require('./conservacion.controller');

router.get('/devueltos', getTotalTramitesDevueltosHandler);
router.get('/devueltos-con-respuesta', getTramitesDevueltosConRespuestaHandler);
router.get('/devueltos-sin-respuesta', getTramitesDevueltosSinRespuestaHandler);
router.get('/corte-datos', getCorteDatosSapHandler);

module.exports = router;
