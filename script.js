// =======================================================
// NOVAS FUNÇÕES PARA CARREGAR DADOS NAS TELAS CORRETAS
// =======================================================

/**
 * Busca os dados do ônibus do aluno (status, motorista, etc.)
 * e os exibe na tela de Rastreio.
 */
async function carregarDadosRastreio() {
    const onibusId = localStorage.getItem("onibusAluno");
    if (!onibusId) return;

    const containerLegenda = document.getElementById("legendaRastreio");
    containerLegenda.innerHTML = "<p>Carregando informações...</p>";

    try {
        const res = await fetch(`${API_URL}/onibus/${onibusId}`);
        const onibus = await res.json();

        // Cria o HTML com os dados do ônibus e insere no container
        containerLegenda.innerHTML = `
            <p><strong>Rota:</strong> ${onibus.nome}</p>
            <p><strong>Motorista:</strong> ${onibus.motorista}</p>
            <p><strong>Status:</strong> ${onibus.status}</p>
            <p><strong>Localização:</strong> ${onibus.ultima_localizacao}</p>
            <p><small>Última atualização: ${onibus.ultimo_update}</small></p>
        `;

    } catch (err) {
        console.error("Erro ao carregar dados de rastreio:", err);
        containerLegenda.innerHTML = "<p>Não foi possível carregar os dados do ônibus.</p>";
    }
}

/**
 * Busca as notificações do ônibus do aluno
 * e as exibe na tela de Notificações.
 */
async function carregarNotificacoesDoAluno() {
    const onibusId = localStorage.getItem("onibusAluno");
    if (!onibusId) return;

    const container = document.getElementById("notificacoesContainer");
    container.innerHTML = "<p>Carregando notificações...</p>";

    try {
        // Busca o ônibus para pegar as notificações aninhadas
        const res = await fetch(`${API_URL}/onibus/${onibusId}`);
        const onibus = await res.json();
        const notificacoes = onibus.notificacoes;

        if (!notificacoes || notificacoes.length === 0) {
            container.innerHTML = "<p>Nenhuma notificação para sua rota.</p>";
            return;
        }
        
        // Limpa o container antes de adicionar as novas notificações
        container.innerHTML = "";

        // Cria e adiciona um elemento HTML para cada notificação
        for (const notificacao of notificacoes) {
            const divNotificacao = document.createElement("div");
            divNotificacao.className = "card"; // Reutilizando sua classe .card para estilizar
            divNotificacao.innerHTML = `
                <h4>${notificacao.titulo}</h4>
                <p>${notificacao.mensagem}</p>
            `;
            container.appendChild(divNotificacao);
        }

    } catch (err) {
        console.error("Erro ao carregar notificações:", err);
        container.innerHTML = "<p>Não foi possível carregar as notificações.</p>";
    }
}

// ===============================================
// VERSÃO CORRIGIDA E MAIS ROBUSTA DA FUNÇÃO mostrarTela
// ===============================================

function mostrarTela(idTela) {
    // 1. Primeiro, esconde TODAS as telas que têm a classe ".tela"
    const todasAsTelas = document.querySelectorAll('.tela');
    todasAsTelas.forEach(tela => {
        tela.classList.remove('ativa');
        tela.style.display = 'none'; // Garante que a tela seja escondida
    });

    // 2. Depois, mostra APENAS a tela com o ID que queremos
    const telaParaMostrar = document.getElementById(idTela);
    if (telaParaMostrar) {
        telaParaMostrar.classList.add('ativa');
        telaParaMostrar.style.display = 'block'; // Garante que a tela seja exibida

        // 3. Carrega os dados APENAS se for uma tela que precisa deles
        if (idTela === 'telaRastreio') {
            carregarDadosRastreio();
        } 
        else if (idTela === 'telaNotificacoes') {
            carregarNotificacoesDoAluno();
        }
    } else {
        // Um aviso caso a gente tente chamar uma tela que não existe
        console.error(`Erro: A tela com o ID "${idTela}" não foi encontrada no HTML!`);
    }
}