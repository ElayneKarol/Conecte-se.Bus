const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET todas as rotas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rotas");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET posição atual de um ônibus
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM onibus WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
