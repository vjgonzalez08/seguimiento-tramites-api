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

/**
 * Cache simple en memoria (por proceso Node).
 * - Ideal para KPIs/resúmenes que cambian 1 vez al día.
 * - No requiere Redis ni librerías.
 */
const _cache = new Map();
/**
 * TTL recomendado para tu caso (datos cambian 1 vez/día):
 *  - 30 min: ya reduce MUCHO tráfico y evita quedarte con datos viejos si hay correcciones.
 *  - Si quieres más agresivo luego, lo subimos a 6h o 24h.
 */
const DEFAULT_TTL_MS = 30 * 60 * 1000;

async function cached(key, fetchFn, ttlMs = DEFAULT_TTL_MS) {
  const now = Date.now();
  const hit = _cache.get(key);

  if (hit && hit.expiresAt > now) return hit.value;

  const value = await fetchFn();
  _cache.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

// (Opcional) permite invalidar cache desde controller si más adelante quieres un endpoint /clear-cache
function clearCache(prefix = null) {
  if (!prefix) {
    _cache.clear();
    return;
  }
  for (const k of _cache.keys()) {
    if (k.startsWith(prefix)) _cache.delete(k);
  }
}

async function getTotalTramitesDevueltos() {
  return cached('kpi:devueltos', () => obtenerTramitesDevueltos());
}

async function getTramitesDevueltosConRespuesta() {
  return cached('kpi:devueltosConRespuesta', () => obtenerTramitesDevueltosConRespuesta());
}

// ✅ trámites con respuesta que cumplen SLA (<= 5 días)
async function getTramitesDevueltosConRespuestaCumplen() {
  return cached('kpi:conRespuestaCumplen', () => obtenerTramitesDevueltosConRespuestaCumplen());
}

async function getTramitesDevueltosSinRespuesta() {
  return cached('kpi:devueltosSinRespuesta', () => obtenerTramitesDevueltosSinRespuesta());
}

// ✅ sin respuesta clasificado por SLA
async function getTramitesDevueltosSinRespuestaSla() {
  return cached('kpi:sinRespuestaSla', () => obtenerTramitesDevueltosSinRespuestaSla());
}

// ✅ promedio días de respuesta
async function getPromedioDiasRespuesta() {
  return cached('kpi:promedioRespuesta', () => obtenerPromedioDiasRespuesta());
}

// ✅ promedio días sin respuesta
async function getPromedioDiasSinRespuesta() {
  return cached('kpi:promedioSinRespuesta', () => obtenerPromedioDiasSinRespuesta());
}

async function getCorteDatosSap() {
  return cached('kpi:corteDatosSap', () => obtenerCorteDatosSap());
}

// ✅ BLOQUE 5 — resumen (gráfica)
async function getDevueltosPorPrediadorResumen() {
  return cached('b5:resumenPrediador', () => obtenerDevueltosPorPrediadorResumen());
}

// ✅ BLOQUE 5 — detalle (tabla)
// NO cacheamos aquí todavía: depende de page/pageSize/sort/filter.
// Lo optimizamos en el siguiente paso (frontend cache + debounce/cancel).
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
  clearCache, // queda listo si luego quieres invalidación manual
};
