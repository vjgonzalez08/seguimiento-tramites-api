const { Pool } = require('pg');
const { db } = require('./env');

const pool = new Pool({
  host: db.host,
  port: Number(db.port),
  user: db.user,
  password: db.password, // debe llegar como string
  database: db.database,
});

module.exports = pool;
