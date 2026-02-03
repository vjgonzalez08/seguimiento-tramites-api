const {
  getTotalTramitesDevueltos,
  getTramitesDevueltosConRespuesta,
  getTramitesDevueltosSinRespuesta,
  getCorteDatosSap,
} = require('./conservacion.service');

function normalizeCountTotal(total) {
  if (total && typeof total === 'object' && total.total !== undefined) {
    const n = Number(total.total);
    return Number.isNaN(n) ? 0 : n;
  }

  const n = Number(total);
  return Number.isNaN(n) ? 0 : n;
}

async function getTotalTramitesDevueltosHandler(req, res) {
  try {
    const total = await getTotalTramitesDevueltos();
    res.json({ success: true, total: normalizeCountTotal(total) });
  } catch (error) {
    console.error('Error al obtener trámites devueltos:', error);
    res.status(500).json({ success: false, message: 'Error al consultar BD' });
  }
}

async function getTramitesDevueltosConRespuestaHandler(req, res) {
  try {
    const total = await getTramitesDevueltosConRespuesta();
    res.json({ success: true, total: normalizeCountTotal(total) });
  } catch (error) {
    console.error('Error al obtener trámites devueltos con respuesta:', error);
    res.status(500).json({ success: false, message: 'Error al consultar BD' });
  }
}

async function getTramitesDevueltosSinRespuestaHandler(req, res) {
  try {
    const total = await getTramitesDevueltosSinRespuesta();
    res.json({ success: true, total: normalizeCountTotal(total) });
  } catch (error) {
    console.error('Error al obtener trámites devueltos sin respuesta:', error);
    res.status(500).json({ success: false, message: 'Error al consultar BD' });
  }
}

// ✅ NUEVO: Corte Datos SAP
async function getCorteDatosSapHandler(req, res) {
  try {
    const data = await getCorteDatosSap();

    res.json({
      success: true,
      fecha_max: data?.fecha_max || null,
    });
  } catch (error) {
    console.error('Error al obtener corte datos SAP:', error);
    res.status(500).json({ success: false, message: 'Error al consultar BD' });
  }
}

module.exports = {
  getTotalTramitesDevueltosHandler,
  getTramitesDevueltosConRespuestaHandler,
  getTramitesDevueltosSinRespuestaHandler,
  getCorteDatosSapHandler,
};
