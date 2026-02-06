const { SCHEMA1, SCHEMA2 } = require('../../config/env');
const pool = require('../../config/db');

// Genera el total de trámites que han tenido devolución
async function obtenerTramitesDevueltos() {
  const query = `
    SELECT COUNT(*) AS total
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

// Genera el total de trámites que han tenido devolución y se les ha dado respuesta
async function obtenerTramitesDevueltosConRespuesta() {
  const query = `
    SELECT COUNT(*) AS total
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt > '1900-01-01'
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

// Trámites devueltos con respuesta que cumplen (<= 5 días)
async function obtenerTramitesDevueltosConRespuestaCumplen() {
  const query = `
    SELECT COUNT(*) AS total
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt > '1900-01-01'
      AND (z.fc_salida_tmt - z.fc_recepcion_tmt) <= 5
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

// Genera el total de trámites que han tenido devolución y NO se les ha dado respuesta
async function obtenerTramitesDevueltosSinRespuesta() {
  const query = `
    SELECT COUNT(*) AS total
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt = '1900-01-01'
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

/**
 *  (BLOQUE 2):
 * Trámites devueltos SIN respuesta clasificados por SLA.
 * SLA fijo: <= 5 días (desde fc_recepcion_tmt hasta CURRENT_DATE)
 *
 * Retorna:
 * - cumplen: COUNT(días <= 5)
 * - no_cumplen: COUNT(días > 5)
 */
async function obtenerTramitesDevueltosSinRespuestaSla() {
  const query = `
    SELECT
      SUM(CASE WHEN (CURRENT_DATE - z.fc_recepcion_tmt) <= 5 THEN 1 ELSE 0 END) AS cumplen,
      SUM(CASE WHEN (CURRENT_DATE - z.fc_recepcion_tmt) > 5 THEN 1 ELSE 0 END) AS no_cumplen
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt = '1900-01-01'
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

/**
 * (BLOQUE 4):
 * Días promedio de respuesta (solo trámites devueltos CON respuesta).
 * Promedio de (fc_salida_tmt - fc_recepcion_tmt).
 *
 * Retorna:
 * - promedio_dias: numeric (puede ser null si no hay datos)
 */
async function obtenerPromedioDiasRespuesta() {
  const query = `
    SELECT
      ROUND(AVG((z.fc_salida_tmt - z.fc_recepcion_tmt)::numeric), 2) AS promedio_dias
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt > '1900-01-01'
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

/**
 * (BLOQUE 4):
 * Días promedio SIN respuesta (solo trámites devueltos SIN respuesta).
 * Promedio de (CURRENT_DATE - fc_recepcion_tmt).
 *
 * Retorna:
 * - promedio_dias: numeric (puede ser null si no hay datos)
 */
async function obtenerPromedioDiasSinRespuesta() {
  const query = `
    SELECT
      ROUND(AVG((CURRENT_DATE - z.fc_recepcion_tmt)::numeric), 2) AS promedio_dias
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt = '1900-01-01'
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

// Corte Datos SAP con fecha y hora
async function obtenerCorteDatosSap() {
  const query = `
    SELECT 
      TO_CHAR(
        MAX(fecha_actualizacion),
        'YYYY-MM-DD HH24:MI'
      ) AS fecha_max
    FROM ${SCHEMA1}.zcatt_dlle_trmte
  `;

  const result = await pool.query(query);
  return result.rows[0];
}

/**
 * ✅ BLOQUE 5 (Gráfica):
 * Resumen: total de trámites devueltos agrupado por prediador (quien RECIBE).
 * Ordenado de mayor a menor.
 */
async function obtenerDevueltosPorPrediadorResumen() {
  const query = `
    SELECT
      u_pred.nombre_user AS prediador_nombre,
      u_pred.sap_user AS prediador_sap,
      COUNT(*)::int AS total_devueltos
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u_rev
      ON z.cd_func_entrega = u_rev.sap_user AND u_rev.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u_pred
      ON z.cd_func_recibe = u_pred.sap_user AND u_pred.id_role_user = 4
    WHERE z.fc_recepcion_tmt >= '2026-01-01'
      AND z.devuelto = 'X'
    GROUP BY u_pred.nombre_user, u_pred.sap_user
    ORDER BY total_devueltos DESC, u_pred.nombre_user ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * ✅ BLOQUE 5 (Tabla):
 * Detalle paginado con filtro por prediador y ordenamiento seguro.
 *
 * Params:
 * - prediadorSap (string | null)
 * - page (int >=1)
 * - pageSize (int)
 * - sortField (string)
 * - sortOrder ('ascend'|'descend')
 */
async function obtenerDevueltosPorPrediadorDetalle(params = {}) {
  const {
    prediadorSap = null,
    page = 1,
    pageSize = 10,
    sortField = 'dias_transcurridos',
    sortOrder = 'descend',
  } = params;

  const limit = Math.max(1, Math.min(Number(pageSize) || 10, 200));
  const offset = (Math.max(1, Number(page) || 1) - 1) * limit;

  const where = [];
  const values = [];

  // filtros base
  where.push(`z.fc_recepcion_tmt >= '2026-01-01'`);
  where.push(`z.devuelto = 'X'`);

  // roles (revisor entrega, prediador recibe)
  // (en el FROM ya están amarrados con joins)

  // filtro por prediador
  if (prediadorSap) {
    values.push(prediadorSap);
    where.push(`u_pred.sap_user = $${values.length}`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // ORDER BY seguro (whitelist)
  const sortDir = sortOrder === 'ascend' ? 'ASC' : 'DESC';
  let orderBy = `dias_transcurridos ${sortDir}`;

  switch (sortField) {
    case 'prediador_nombre':
      orderBy = `prediador_nombre ${sortDir}`;
      break;
    case 'prediador_sap':
      orderBy = `prediador_sap ${sortDir}`;
      break;
    case 'revisor_nombre':
      orderBy = `revisor_nombre ${sortDir}`;
      break;
    case 'revisor_sap':
      orderBy = `revisor_sap ${sortDir}`;
      break;
    case 'nm_solicitud':
      orderBy = `nm_solicitud ${sortDir}`;
      break;
    case 'fc_recepcion_tmt':
      orderBy = `fc_recepcion_tmt ${sortDir}`;
      break;
    case 'fc_salida_tmt':
      orderBy = `fc_salida_tmt ${sortDir}`;
      break;
    case 'estado':
      orderBy = `estado ${sortDir}`;
      break;
    case 'cumple_sla':
      orderBy = `cumple_sla ${sortDir}`;
      break;
    case 'dias_transcurridos':
    default:
      orderBy = `dias_transcurridos ${sortDir}`;
      break;
  }

  // total count
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u_rev
      ON z.cd_func_entrega = u_rev.sap_user AND u_rev.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u_pred
      ON z.cd_func_recibe = u_pred.sap_user AND u_pred.id_role_user = 4
    ${whereSql}
  `;

  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows?.[0]?.total || 0;

  // data page
  const dataQuery = `
    SELECT
      u_pred.nombre_user AS prediador_nombre,
      u_pred.sap_user AS prediador_sap,
      u_rev.nombre_user AS revisor_nombre,
      u_rev.sap_user AS revisor_sap,
      z.nm_solicitud,
      z.fc_recepcion_tmt,
      z.fc_salida_tmt,
      CASE WHEN z.fc_salida_tmt = '1900-01-01' THEN 'SIN RESPUESTA' ELSE 'CON RESPUESTA' END AS estado,
      CASE
        WHEN z.fc_salida_tmt = '1900-01-01' THEN (CURRENT_DATE - z.fc_recepcion_tmt)
        ELSE (z.fc_salida_tmt - z.fc_recepcion_tmt)
      END AS dias_transcurridos,
      CASE
        WHEN (
          CASE
            WHEN z.fc_salida_tmt = '1900-01-01' THEN (CURRENT_DATE - z.fc_recepcion_tmt)
            ELSE (z.fc_salida_tmt - z.fc_recepcion_tmt)
          END
        ) <= 5 THEN 'SI' ELSE 'NO'
      END AS cumple_sla,
      CASE
        WHEN z.fc_salida_tmt = '1900-01-01' THEN NULL
        ELSE z.fc_salida_tmt
      END AS fecha_salida_valida
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u_rev
      ON z.cd_func_entrega = u_rev.sap_user AND u_rev.id_role_user = 2
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u_pred
      ON z.cd_func_recibe = u_pred.sap_user AND u_pred.id_role_user = 4
    ${whereSql}
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const dataResult = await pool.query(dataQuery, values);

  return {
    total,
    page: Math.max(1, Number(page) || 1),
    pageSize: limit,
    rows: dataResult.rows || [],
  };
}

module.exports = {
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
};
