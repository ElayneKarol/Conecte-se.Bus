// =======================================================
// VERSÃO OFFLINE - SEM API, USANDO LOCALSTORAGE
// =======================================================

// Dados simulados de ônibus (para o rastreio)
const onibusExemplo = {
  id: 1,
  nome: "Rota A - Zona Rural",
  motorista: "José da Silva",
  status: "Em trânsito",
  ultima_localizacao: "Fazenda Boa Esperança",
  ultimo_update: "05/10/2025 14:32",
  notificacoes: [
    { titulo: "Atraso na rota", mensagem: "O ônibus sofreu um pequeno atraso devido à chuva." },
    { titulo: "Rota normalizada", mensagem: "O trajeto voltou ao horário habitual." }
  ]
};

// =======================================================
// LOGIN E CADASTRO (LOCALSTORAGE)
// =======================================================
function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // Carrega alunos salvos localmente
  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

  // Verifica se o aluno existe
  const aluno = alunos.find(a => a.matricula === usuario && a.senha === senha);

  if (!aluno) {
    alert("Usuário não encontrado. Faça o cadastro.");
    mostrarTela("telaCadastro");
  } else {
    localStorage.setItem("onibusAluno", aluno.onibus_id);
    alert("✅ Login realizado com sucesso!");
    mostrarTela("telaMenu");
  }
}

function cadastrarAluno() {
  const nome = document.getElementById("nomeAluno").value;
  const matricula = document.getElementById("matricula").value;
  const fazenda = document.getElementById("fazenda").value;
  const escola = document.getElementById("escola").value;
  const onibus = document.getElementById("onibusSelecionado").value;
  const senha = prompt("Defina uma senha para este aluno:");

  if (!nome || !matricula || !escola || !onibus || !senha) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  // Carrega alunos existentes
  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

  // Verifica duplicidade
  if (alunos.some(a => a.matricula === matricula)) {
    alert("Matrícula já cadastrada!");
    return;
  }

  // Cria novo aluno
  const novoAluno = { nome, matricula, fazenda, escola, onibus_id: onibus, senha };
  alunos.push(novoAluno);
  localStorage.setItem("alunos", JSON.stringify(alunos));

  alert("Cadastro realizado com sucesso!");
  localStorage.setItem("onibusAluno", onibus);
  mostrarTela("telaMenu");
}

// =======================================================
// RASTREIO E NOTIFICAÇÕES (SIMULAÇÃO)
// =======================================================
function carregarDadosRastreio() {
  const containerLegenda = document.getElementById("legendaRastreio");
  const onibusId = localStorage.getItem("onibusAluno");

  if (!onibusId) {
    containerLegenda.innerHTML = "<p>Nenhum ônibus associado a este aluno.</p>";
    return;
  }

  containerLegenda.innerHTML = `
    <p><strong>Rota:</strong> ${onibusExemplo.nome}</p>
    <p><strong>Motorista:</strong> ${onibusExemplo.motorista}</p>
    <p><strong>Status:</strong> ${onibusExemplo.status}</p>
    <p><strong>Localização:</strong> ${onibusExemplo.ultima_localizacao}</p>
    <p><small>Última atualização: ${onibusExemplo.ultimo_update}</small></p>
  `;
}

function carregarNotificacoesDoAluno() {
  const container = document.getElementById("notificacoesContainer");
  container.innerHTML = "";

  for (const notificacao of onibusExemplo.notificacoes) {
    const divNotificacao = document.createElement("div");
    divNotificacao.className = "card";
    divNotificacao.innerHTML = `
      <h4>${notificacao.titulo}</h4>
      <p>${notificacao.mensagem}</p>
    `;
    container.appendChild(divNotificacao);
  }
}

// =======================================================
// NAVEGAÇÃO ENTRE TELAS
// =======================================================
function mostrarTela(idTela) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });
  const telaAtiva = document.getElementById(idTela);
  if (telaAtiva) {
    telaAtiva.classList.add("ativa");

    if (idTela === "telaRastreio") {
      carregarDadosRastreio();
    } else if (idTela === "telaNotificacoes") {
      carregarNotificacoesDoAluno();
    }
  }
}

// =======================================================
// FUNÇÕES AUXILIARES
// =======================================================
function enviarFeedback() {
  alert("Feedback enviado com sucesso! (Simulação local)");
  mostrarTela("telaMenu");
}

function atualizarRotaSelecionada() {
  console.log("Função 'atualizarRotaSelecionada' chamada (offline).");
}
