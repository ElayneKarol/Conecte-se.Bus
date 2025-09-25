const express = require("express");
const pool = require("../db");
const router = express.Router();

// Listar todas as manutenções
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM manutencoes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar manutenções" });
  }
});

// Buscar manutenção por ônibus
router.get("/:onibus_id", async (req, res) => {
  try {
    const { onibus_id } = req.params;
    const result = await pool.query("SELECT * FROM manutencoes WHERE onibus_id = $1", [onibus_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar manutenção" });
  }
});

module.exports = router;
