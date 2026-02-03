const {
  obtenerTramitesDevueltos,
  obtenerTramitesDevueltosConRespuesta,
  obtenerTramitesDevueltosSinRespuesta,
  obtenerCorteDatosSap,
} = require('./conservacion.queries');

async function getTotalTramitesDevueltos() {
  return await obtenerTramitesDevueltos();
}

async function getTramitesDevueltosConRespuesta() {
  return await obtenerTramitesDevueltosConRespuesta();
}

async function getTramitesDevueltosSinRespuesta() {
  return await obtenerTramitesDevueltosSinRespuesta();
}

// Corte Datos SAP
async function getCorteDatosSap() {
  return await obtenerCorteDatosSap();
}

module.exports = {
  getTotalTramitesDevueltos,
  getTramitesDevueltosConRespuesta,
  getTramitesDevueltosSinRespuesta,
  getCorteDatosSap,
};
