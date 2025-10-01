const express = require('express');
const cors = require('cors'); // Importe o pacote cors
const app = express();

// ==========================
// Configuração do CORS
// ==========================
app.use(cors({
  origin: "https://elaynekarol.github.io", // só libera o seu GitHub Pages
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ==========================
// Importa as rotas
// ==========================
const alunosRoutes = require("./backend/routes/alunos");
const onibusRoutes = require("./backend/routes/onibus");
const notificacoesRoutes = require("./backend/routes/notificacoes");
const manutencoesRoutes = require("./backend/routes/manutencoes");

// ==========================
// Rota inicial
// ==========================
app.get("/", (req, res) => {
  res.send("API rodando 🚌");
});

// ==========================
// Usa as rotas
// ==========================
app.use("/api/alunos", alunosRoutes);
app.use("/api/onibus", onibusRoutes);
app.use("/api/notificacoes", notificacoesRoutes);
app.use("/api/manutencoes", manutencoesRoutes);

// ==========================
// Start servidor
// ==========================
const PORT = process.env.PORT || 3000; // Render define a porta automaticamente
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
