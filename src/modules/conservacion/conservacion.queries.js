const { SCHEMA1, SCHEMA2 } = require('../../config/env');
const pool = require('../../config/db');

// Genera el total de trámites que han tenido devolución
async function obtenerTramitesDevueltos() {
  const query = `
    SELECT COUNT(*) AS total
    FROM ${SCHEMA1}.zcatt_dlle_trmte AS z
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u1
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 1
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 3
    WHERE z.fc_recepcion_tmt >= '2025-01-01'
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
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 1
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 3
    WHERE z.fc_recepcion_tmt >= '2025-01-01'
      AND z.devuelto = 'X'
      AND z.fc_salida_tmt > '1900-01-01'
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
      ON z.cd_func_entrega = u1.sap_user AND u1.id_role_user = 1
    INNER JOIN ${SCHEMA2}.tbl_users_sgt_tte AS u2
      ON z.cd_func_recibe = u2.sap_user AND u2.id_role_user = 3
    WHERE z.fc_recepcion_tmt >= '2025-01-01'
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

module.exports = {
  obtenerTramitesDevueltos,
  obtenerTramitesDevueltosConRespuesta,
  obtenerTramitesDevueltosSinRespuesta,
  obtenerCorteDatosSap,
};
