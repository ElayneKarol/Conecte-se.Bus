// =======================================================
// CONFIGURAÇÃO INICIAL - COLOQUE SUA URL DO MOCKAPI AQUI!
// =======================================================
const API_URL = "https://68de7c35d7b591b4b78f82cf.mockapi.io/api/v1";

// =======================================================
// FUNÇÕES DE LOGIN E CADASTRO
// =======================================================

/**
 * Realiza o login do aluno usando a matrícula.
 */
async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/alunos?matricula=${usuario}`);
    if (!res.ok) {
        throw new Error(`Erro na rede: Status ${res.status}`);
    }
    const dados = await res.json();

    if (dados.length === 0) {
      alert("Usuário não encontrado. Faça o cadastro.");
      mostrarTela("telaCadastro");
    } else {
      localStorage.setItem("onibusAluno", dados[0].onibus_id);
      alert("✅ Login realizado com sucesso!");
      mostrarTela("telaMenu");
    }
  } catch (err) {
    console.error("❌ Erro ao conectar com o servidor (login):", err);
    alert("Erro ao conectar com o servidor. Verifique a URL da API e os dados no MockAPI.");
  }
}

/**
 * Cadastra um novo aluno.
 */
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
    const res = await fetch(`${API_URL}/alunos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, matricula, fazenda, escola, onibus_id: onibus })
    });

    if (res.ok) {
      const aluno = await res.json();
      alert("Cadastro realizado com sucesso!");
      localStorage.setItem("onibusAluno", aluno.onibus_id);
      mostrarTela("telaMenu");
    } else {
      const erro = await res.json();
      alert("Erro no cadastro: " + (erro.error || 'Tente novamente.'));
    }
  } catch (err) {
    console.error("❌ Erro ao conectar com o servidor (cadastro):", err);
    alert("Erro ao conectar com o servidor.");
  }
}


// =======================================================
// FUNÇÕES PARA CARREGAR DADOS NAS TELAS
// =======================================================

/**
 * Busca e exibe os dados do ônibus na tela de Rastreio.
 */
async function carregarDadosRastreio() {
    const onibusId = localStorage.getItem("onibusAluno");
    if (!onibusId) return;

    const containerLegenda = document.getElementById("legendaRastreio");
    containerLegenda.innerHTML = "<p>Carregando informações...</p>";

    try {
        const res = await fetch(`${API_URL}/onibus/${onibusId}`);
        const onibus = await res.json();

        containerLegenda.innerHTML = `
            <p><strong>Rota:</strong> ${onibus.nome}</p>
            <p><strong>Motorista:</strong> ${onibus.motorista}</p>
            <p><strong>Status:</strong> ${onibus.status}</p>
            <p><strong>Localização:</strong> ${onibus.ultima_localizacao}</p>
            <p><small>Última atualização: ${onibus.ultimo_update}</small></p>
        `;
    } catch (err) {
        containerLegenda.innerHTML = "<p>Não foi possível carregar os dados do ônibus.</p>";
    }
}

/**
 * Busca e exibe as notificações na tela de Notificações.
 */
async function carregarNotificacoesDoAluno() {
    const onibusId = localStorage.getItem("onibusAluno");
    if (!onibusId) return;

    const container = document.getElementById("notificacoesContainer");
    container.innerHTML = "<p>Carregando notificações...</p>";

    try {
        const res = await fetch(`${API_URL}/onibus/${onibusId}`);
        const onibus = await res.json();
        const notificacoes = onibus.notificacoes;

        if (!notificacoes || notificacoes.length === 0) {
            container.innerHTML = "<p>Nenhuma notificação para sua rota.</p>";
            return;
        }
        
        container.innerHTML = ""; // Limpa antes de adicionar

        for (const notificacao of notificacoes) {
            const divNotificacao = document.createElement("div");
            divNotificacao.className = "card";
            divNotificacao.innerHTML = `
                <h4>${notificacao.titulo}</h4>
                <p>${notificacao.mensagem}</p>
            `;
            container.appendChild(divNotificacao);
        }
    } catch (err) {
        container.innerHTML = "<p>Não foi possível carregar as notificações.</p>";
    }
}


// =======================================================
// FUNÇÃO PRINCIPAL DE NAVEGAÇÃO - A CHAVE DO PROBLEMA
// =======================================================

/**
 * Gerencia a visibilidade das telas, combinando com o CSS.
 */
function mostrarTela(idTela) {
    // Esconde todas as seções que têm a classe ".tela"
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });

    // Mostra apenas a seção com o ID correto, adicionando a classe "ativa"
    const telaAtiva = document.getElementById(idTela);
    if (telaAtiva) {
        telaAtiva.classList.add('ativa');

        // Carrega os dados APENAS se a tela que abrimos precisar deles
        if (idTela === 'telaRastreio') {
            carregarDadosRastreio();
        } 
        else if (idTela === 'telaNotificacoes') {
            carregarNotificacoesDoAluno();
        }
    }
}

// =======================================================
// FUNÇÕES AUXILIARES (ainda não implementadas, mas evitam erros)
// =======================================================
function enviarFeedback() {
    alert("Feedback enviado com sucesso! (Funcionalidade em desenvolvimento)");
    mostrarTela('telaMenu');
}

function atualizarRotaSelecionada() {
    console.log("Função 'atualizarRotaSelecionada' chamada. (Funcionalidade em desenvolvimento)");
}