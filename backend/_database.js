const pg = require("pg");

// Config dependerá do banco de dados da sua máquina
const config = {
  host: "localhost",
  user: "postgres",
  database: "cs_db",
  password: "pgadmin",
  port: 5433,
};

const pool = new pg.Pool(config);
module.exports = pool;
