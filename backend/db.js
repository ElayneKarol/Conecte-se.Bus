require("dotenv").config();
const { Pool } = require("pg");

console.log("Tentando conectar ao banco com config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false } // Render precisa de SSL
});

pool.connect()
  .then(() => console.log("✅ Conexão com banco bem-sucedida!"))
  .catch(err => console.error("❌ Erro ao conectar no banco:", err));

module.exports = pool;
