const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: ["https://elaynekarol.github.io"], // libera o seu GitHub Pages
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());


// Importa as rotas
const alunosRoutes = require("./backend/routes/alunos");
const onibusRoutes = require("./backend/routes/onibus");
const notificacoesRoutes = require("./backend/routes/notificacoes");
const manutencoesRoutes = require("./backend/routes/manutencoes");

// Rota inicial
app.get("/", (req, res) => {
  res.send("API rodando 🚌");
});

// Usa as rotas
app.use("/api/alunos", alunosRoutes);
app.use("/api/onibus", onibusRoutes);
app.use("/api/notificacoes", notificacoesRoutes);
app.use("/api/manutencoes", manutencoesRoutes);

// Start servidor
const PORT = process.env.PORT || 3000; // Render substitui isso automaticamente
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
