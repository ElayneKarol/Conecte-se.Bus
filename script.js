const API_URL = "https://conectese-backend.onrender.com"; // sua API no Render

// ============================
// LOGIN E CADASTRO
// ============================
// Login usando matrícula
async function login() {
  const usuario = document.getElementById("usuario").value; // matrícula
  const senha = document.getElementById("senha").value;     // opcional

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const url = `${API_URL}/api/alunos?matricula=${usuario}`;
    console.log("🔍 Fazendo requisição para:", url);

    const res = await fetch(url);
    console.log("📩 Status da resposta:", res.status);

    const dados = await res.json();
    console.log("📊 Dados recebidos:", dados);

    if (dados.length === 0) {
      alert("Usuário não encontrado. Faça o cadastro.");
      mostrarTela("telaCadastro");
    } else {
      // já encontrou no banco
      localStorage.setItem("onibusAluno", dados[0].onibus_id);
      alert("✅ Login realizado com sucesso!");
      mostrarTela("telaMenu");
    }
  } catch (err) {
    console.error("❌ Erro ao conectar com o servidor:", err);
    alert("Erro ao conectar com o servidor.");
  }
}

// ============================
// CADASTRO DO ALUNO
// ============================
async function cadastrarAluno() {
  const nome = document.getElementById("nomeAluno").value;
  const matricula = document.getElementById("matricula").value;
  const fazenda = document.getElementById("fazenda").value;
  const escola = document.getElementById("escola").value;
  const onibus = document.getElementById("onibusSelecionado").value;

  if (!nome || !matricula || !escola || !onibus) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const url = `${API_URL}/api/alunos`;
    console.log("📝 Enviando cadastro para:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, matricula, fazenda, escola, onibus_id: onibus })
    });

    console.log("📩 Status da resposta cadastro:", res.status);

    if (res.ok) {
      const aluno = await res.json();
      console.log("✅ Aluno cadastrado:", aluno);

      alert("Cadastro realizado com sucesso!");
      localStorage.setItem("onibusAluno", aluno.onibus_id);
      mostrarTela("telaMenu");
    } else {
      const erro = await res.json();
      console.error("❌ Erro no cadastro:", erro);
      alert("Erro no cadastro: " + erro.error);
    }
  } catch (err) {
    console.error("❌ Erro ao conectar com o servidor (cadastro):", err);
    alert("Erro ao conectar com o servidor.");
  }
}
