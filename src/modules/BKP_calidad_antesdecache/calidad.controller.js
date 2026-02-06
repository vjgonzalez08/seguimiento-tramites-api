const {
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
} = require('./calidad.service');

function normalizeCountTotal(total) {
  if (total && typeof total === 'object' && total.total !== undefined) {
    const n = Number(total.total);
    return Number.isNaN(n) ? 0 : n;
  }

  const n = Number(total);
  return Number.isNaN(n) ? 0 : n;
}

function normalizeCountValue(v) {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

// ✅ normaliza promedios (pueden venir null)
function normalizeAvgValue(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

async function getTotalTramitesDevueltosHandler(req, res) {
  try {
    const total = await getTotalTramitesDevueltos();
    res.json({ success: true, total: normalizeCountTotal(total) });
  } catch (error) {
    console.error('Error al obtener trámites devueltos:', error);
    res.status(500).json({ success: false });
  }
}

async function getTramitesDevueltosConRespuestaHandler(req, res) {
  try {
    const total = await getTramitesDevueltosConRespuesta();
    res.json({ success: true, total: normalizeCountTotal(total) });
  } catch (error) {
    console.error('Error al obtener trámites devueltos con respuesta:', error);
    res.status(500).json({ success: false });
  }
}

async function getTramitesDevueltosSinRespuestaHandler(req, res) {
  try {
    const total = await getTramitesDevueltosSinRespuesta();
    res.json({ success: true, total: normalizeCountTotal(total) });
  } catch (error) {
    console.error('Error al obtener trámites devueltos sin respuesta:', error);
    res.status(500).json({ success: false });
  }
}

// ✅ datos para solid gauge (cumplen SLA con respuesta)
async function getTramitesDevueltosCumplenHandler(req, res) {
  try {
    const totalConRespuesta = await getTramitesDevueltosConRespuesta();
    const cumplen = await getTramitesDevueltosConRespuestaCumplen();

    res.json({
      success: true,
      total_con_respuesta: normalizeCountTotal(totalConRespuesta),
      cumplen: normalizeCountTotal(cumplen),
    });
  } catch (error) {
    console.error('Error al obtener cumplimiento SLA:', error);
    res.status(500).json({ success: false });
  }
}

// ✅ sin respuesta clasificado por SLA
async function getTramitesDevueltosSinRespuestaSlaHandler(req, res) {
  try {
    const data = await getTramitesDevueltosSinRespuestaSla();

    res.json({
      success: true,
      cumplen: normalizeCountValue(data?.cumplen),
      no_cumplen: normalizeCountValue(data?.no_cumplen),
    });
  } catch (error) {
    console.error('Error al obtener SLA sin respuesta:', error);
    res.status(500).json({ success: false });
  }
}

// ✅  promedio días de respuesta
async function getPromedioDiasRespuestaHandler(req, res) {
  try {
    const data = await getPromedioDiasRespuesta();
    res.json({
      success: true,
      promedio_dias: normalizeAvgValue(data?.promedio_dias),
    });
  } catch (error) {
    console.error('Error al obtener promedio días respuesta:', error);
    res.status(500).json({ success: false });
  }
}

// ✅ promedio días sin respuesta
async function getPromedioDiasSinRespuestaHandler(req, res) {
  try {
    const data = await getPromedioDiasSinRespuesta();
    res.json({
      success: true,
      promedio_dias: normalizeAvgValue(data?.promedio_dias),
    });
  } catch (error) {
    console.error('Error al obtener promedio días sin respuesta:', error);
    res.status(500).json({ success: false });
  }
}

async function getCorteDatosSapHandler(req, res) {
  try {
    const data = await getCorteDatosSap();
    res.json({
      success: true,
      fecha_max: data?.fecha_max || null,
    });
  } catch (error) {
    console.error('Error al obtener corte datos SAP:', error);
    res.status(500).json({ success: false });
  }
}

/**
 * ✅ BLOQUE 5 (Gráfica)
 * GET /conservacion/prediadores/resumen
 */
async function getDevueltosPorPrediadorResumenHandler(req, res) {
  try {
    const rows = await getDevueltosPorPrediadorResumen();
    res.json({ success: true, rows: rows || [] });
  } catch (error) {
    console.error('Error al obtener resumen por prediador:', error);
    res.status(500).json({ success: false });
  }
}

/**
 * ✅ BLOQUE 5 (Tabla)
 * GET /conservacion/prediadores/detalle?prediadorSap=&page=&pageSize=&sortField=&sortOrder=
 */
async function getDevueltosPorPrediadorDetalleHandler(req, res) {
  try {
    const {
      prediadorSap = null,
      page = '1',
      pageSize = '10',
      sortField = 'dias_transcurridos',
      sortOrder = 'descend',
    } = req.query;

    const data = await getDevueltosPorPrediadorDetalle({
      prediadorSap: prediadorSap || null,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortField,
      sortOrder,
    });

    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Error al obtener detalle por prediador:', error);
    res.status(500).json({ success: false });
  }
}

module.exports = {
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
};
