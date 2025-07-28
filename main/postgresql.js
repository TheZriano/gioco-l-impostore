// Connessione al database postgreSQL

const { Pool } = require("pg");
require("dotenv").config();

let pool
if (process.env.DB_URL){
  pool = new Pool({
  connectionString:process.env.DB_URL         // Es. 5432
});
}else{
  pool = new Pool({
  user: process.env.DB_USER,         // Es. 'postgres'
  host: process.env.DB_HOST,         // Es. 'localhost'
  database: process.env.DB_NAME,     // Es. 'miodb'
  password: process.env.DB_PASSWORD, // Es. 'password123'
  port: process.env.DB_PORT,         // Es. 5432
});
}



async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  //console.log("Query eseguita", { text, duration, rows: res.rowCount });
  return res;
}

module.exports = {
  query,
};