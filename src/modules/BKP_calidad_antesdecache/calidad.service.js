const {
  obtenerTramitesDevueltos,
  obtenerTramitesDevueltosConRespuesta,
  obtenerTramitesDevueltosConRespuestaCumplen,
  obtenerTramitesDevueltosSinRespuesta,
  obtenerTramitesDevueltosSinRespuestaSla,
  obtenerPromedioDiasRespuesta,     
  obtenerPromedioDiasSinRespuesta, 
  obtenerCorteDatosSap,
  obtenerDevueltosPorPrediadorResumen,
  obtenerDevueltosPorPrediadorDetalle,
} = require('./calidad.queries');

async function getTotalTramitesDevueltos() {
  return await obtenerTramitesDevueltos();
}

async function getTramitesDevueltosConRespuesta() {
  return await obtenerTramitesDevueltosConRespuesta();
}

// ✅ trámites con respuesta que cumplen SLA (<= 5 días)
async function getTramitesDevueltosConRespuestaCumplen() {
  return await obtenerTramitesDevueltosConRespuestaCumplen();
}

async function getTramitesDevueltosSinRespuesta() {
  return await obtenerTramitesDevueltosSinRespuesta();
}

// ✅ sin respuesta clasificado por SLA
async function getTramitesDevueltosSinRespuestaSla() {
  return await obtenerTramitesDevueltosSinRespuestaSla();
}

// ✅  promedio días de respuesta
async function getPromedioDiasRespuesta() {
  return await obtenerPromedioDiasRespuesta();
}

// ✅  promedio días sin respuesta
async function getPromedioDiasSinRespuesta() {
  return await obtenerPromedioDiasSinRespuesta();
}

async function getCorteDatosSap() {
  return await obtenerCorteDatosSap();
}

// ✅ BLOQUE 5
async function getDevueltosPorPrediadorResumen() {
  return await obtenerDevueltosPorPrediadorResumen();
}

async function getDevueltosPorPrediadorDetalle(params) {
  return await obtenerDevueltosPorPrediadorDetalle(params);
}

module.exports = {
  getTotalTramitesDevueltos,
  getTramitesDevueltosConRespuesta,
  getTramitesDevueltosConRespuestaCumplen,
  getTramitesDevueltosSinRespuesta,
  getTramitesDevueltosSinRespuestaSla,
  getPromedioDiasRespuesta,    
  getPromedioDiasSinRespuesta, 
  getCorteDatosSap,
  getDevueltosPorPrediadorResumen,
  getDevueltosPorPrediadorDetalle,
};
