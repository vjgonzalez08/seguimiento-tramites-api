require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT),
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
  },
  SCHEMA1: process.env.SCHEMA1,
  SCHEMA2: process.env.SCHEMA2,
};
