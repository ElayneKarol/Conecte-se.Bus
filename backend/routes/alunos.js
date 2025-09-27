const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===============================
// LISTAR TODOS OS ALUNOS OU BUSCAR POR MATRÍCULA (LOGIN)
// ===============================
router.get("/", async (req, res) => {
  try {
    const { matricula } = req.query;

    if (matricula) {
      // Se vier matrícula, busca só o aluno correspondente
      const result = await pool.query("SELECT * FROM alunos WHERE matricula = $1", [matricula]);
      return res.json(result.rows);
    }

    // Caso contrário, lista todos
    const result = await pool.query("SELECT * FROM alunos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    res.status(500).json({ error: "Erro ao buscar alunos" });
  }
});

// ===============================
// CADASTRAR NOVO ALUNO
// ===============================
router.post("/", async (req, res) => {
  try {
    const { nome, matricula, fazenda, escola, onibus_id } = req.body;

    if (!nome || !matricula || !escola || !onibus_id) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, fazenda, escola, onibus_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nome, matricula, fazenda, escola, onibus_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    res.status(500).json({ error: "Erro ao cadastrar aluno" });
  }
});

// ===============================
// DETALHAR UM ALUNO
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM alunos WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
    res.status(500).json({ error: "Erro ao buscar aluno" });
  }
});

module.exports = router;
