const express = require("express");
const router = express.Router();
const pool = require("../db");

// Listar notificações por ônibus
router.get("/:onibus_id", async (req, res) => {
  try {
    const { onibus_id } = req.params;
    const result = await pool.query(
      "SELECT id, mensagem, criado_em FROM notificacoes WHERE onibus_id = $1 ORDER BY criado_em DESC",
      [onibus_id]
    );

    // Já retorna no formato certo
    const notificacoes = result.rows.map(n => ({
      id: n.id,
      mensagem: n.mensagem,
      criado_em: n.data
    }));

    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar notificações" });
  }
});

module.exports = router;
