const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Importa as rotas
const alunosRoutes = require("./routes/alunos");
const onibusRoutes = require("./routes/onibus");
const notificacoesRoutes = require("./routes/notificacoes");
const manutencoesRoutes = require("./routes/manutencoes");

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
