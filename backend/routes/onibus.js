const express = require("express");
const router = express.Router();
const pool = require("../db");

// ============================
// 1) Listar todos os ônibus
// ============================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM onibus ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar ônibus" });
  }
});

// ============================
// 2) Buscar ônibus por ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM onibus WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ônibus não encontrado" });
    }

    const o = result.rows[0];

    const rotaFormatada = {
      id: o.id,
      numero: o.id,
      rota: o.rota,
      horario_saida: o.horario_saida,
      horario_chegada: o.horario_chegada,
      coordenadas: [
        [o.latitude_inicio, o.longitude_inicio],
        [o.latitude_fim, o.longitude_fim]
      ],
      pontos: ["Início", "Destino"]
    };

    res.json(rotaFormatada);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar rota" });
  }
});

module.exports = router;
