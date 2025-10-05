// =======================================================
// MODO OFFLINE - DADOS LOCAIS
// =======================================================

let alunos = [
  { matricula: "admin", senha: "1234", nome: "Administrador", onibus_id: 1 }
];

let onibus = [
  { id: 1, nome: "Ônibus 01", motorista: "João", status: "No trajeto", ultima_localizacao: "Centro", ultimo_update: "Agora" }
];

// =======================================================
// LOGIN E CADASTRO
// =======================================================

async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const aluno = alunos.find(a => a.matricula === usuario && a.senha === senha);
  if (aluno) {
    localStorage.setItem("onibusAluno", aluno.onibus_id);
    alert("✅ Login realizado com sucesso!");
    mostrarTela("telaMenu");
  } else {
    alert("Usuário não encontrado ou senha incorreta.");
    mostrarTela("telaCadastro");
  }
}

function cadastrarAluno() {
  const nome = document.getElementById("nomeAluno").value;
  const matricula = document.getElementById("matricula").value;
  const fazenda = document.getElementById("fazenda").value;
  const escola = document.getElementById("escola").value;
  const onibusSelecionado = document.getElementById("onibusSelecionado").value;
  const senha = prompt("Crie uma senha:");

  if (!nome || !matricula || !escola || !onibusSelecionado || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  alunos.push({ nome, matricula, fazenda, escola, onibus_id: Number(onibusSelecionado), senha });
  alert("Aluno cadastrado com sucesso!");
  mostrarTela("telaMenu");
}

// =======================================================
// TELAS E DADOS
// =======================================================

function carregarDadosRastreio() {
  const onibusId = localStorage.getItem("onibusAluno");
  const info = onibus.find(o => o.id == onibusId);
  const container = document.getElementById("legendaRastreio");

  if (info) {
    container.innerHTML = `
      <p><strong>Rota:</strong> ${info.nome}</p>
      <p><strong>Motorista:</strong> ${info.motorista}</p>
      <p><strong>Status:</strong> ${info.status}</p>
      <p><strong>Localização:</strong> ${info.ultima_localizacao}</p>
      <p><small>Última atualização: ${info.ultimo_update}</small></p>
    `;
  } else {
    container.innerHTML = "<p>Nenhum dado disponível.</p>";
  }
}

function mostrarTela(idTela) {
  document.querySelectorAll('.tela').forEach(tela => {
    tela.classList.remove('ativa');
  });
  document.getElementById(idTela).classList.add('ativa');
  if (idTela === 'telaRastreio') carregarDadosRastreio();
}
