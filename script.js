// Variáveis globais
let mapaRastreio, linhaRota, marcadorRota, animacaoInterval;
let rotaAtual = null;

// ============================
// INICIALIZAÇÃO DO RASTREIO
// ============================
async function carregarMapaRastreio() {
  mapaRastreio = L.map("mapRastreio").setView([-5.79, -37.79], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapaRastreio);

  // Carregar ônibus da API
  const res = await fetch("http://localhost:3000/api/onibus");
  const onibus = await res.json();

  const seletor = document.getElementById("seletorOnibus");
  seletor.innerHTML = ""; // limpar
  onibus.forEach(o => {
    const opt = document.createElement("option");
    opt.value = o.id;
    opt.textContent = `Ônibus ${o.numero} - ${o.rota}`;
    seletor.appendChild(opt);
  });

  // Selecionar salvo
  const salvo = localStorage.getItem("onibusAluno");
  if (salvo) seletor.value = salvo;

  atualizarRotaSelecionada();
}

// ============================
// ATUALIZAR ROTA SELECIONADA
// ============================
async function atualizarRotaSelecionada() {
  const id = document.getElementById("seletorOnibus").value;
  if (!id) return;

  localStorage.setItem("onibusAluno", id);

  // Buscar rota no backend
  const res = await fetch(`http://localhost:3000/api/onibus/${id}`);
  rotaAtual = await res.json();

  if (linhaRota) mapaRastreio.removeLayer(linhaRota);
  if (marcadorRota) mapaRastreio.removeLayer(marcadorRota);
  if (animacaoInterval) clearInterval(animacaoInterval);

// Montar coordenadas com base no que vem do banco
const coordenadas = [
  [rotaAtual.latitude_inicio, rotaAtual.longitude_inicio],
  [rotaAtual.latitude_fim, rotaAtual.longitude_fim]
];

// Desenhar rota
linhaRota = L.polyline(coordenadas, { color: "green", weight: 5 }).addTo(mapaRastreio);
mapaRastreio.fitBounds(linhaRota.getBounds());

// Marcar pontos de início e fim
L.marker(coordenadas[0]).addTo(mapaRastreio).bindPopup("Início");
L.marker(coordenadas[1]).addTo(mapaRastreio).bindPopup("Destino");

  // Ícone do ônibus
  const onibusIcone = L.icon({
    iconUrl: "assets/img/bus.png",
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

let idx = 0;
marcadorRota = L.marker(coordenadas[0], { icon: onibusIcone }).addTo(mapaRastreio);

animacaoInterval = setInterval(() => {
  idx = (idx + 1) % coordenadas.length;
  marcadorRota.setLatLng(coordenadas[idx]);
}, 2000);


  // Atualizar painel
  document.getElementById("legendaRastreio").innerHTML = `
    <p><strong>Ônibus:</strong> ${rotaAtual.numero}</p>
    <p><strong>Rota:</strong> ${rotaAtual.rota}</p>
    <p><strong>Horário de saída:</strong> ${rotaAtual.horario_saida}</p>
    <p><strong>Chegada prevista:</strong> ${rotaAtual.horario_chegada}</p>
  `;
}

// ============================
// NOTIFICAÇÕES
// ============================
async function gerarNotificacoes() {
  const id = localStorage.getItem("onibusAluno");
  if (!id) return;

  const res = await fetch(`http://localhost:3000/api/notificacoes/${id}`);
  const dados = await res.json();

  const container = document.getElementById("notificacoesContainer");
  container.innerHTML = "";

  if (dados.length === 0) {
    container.innerHTML = "<p>Sem notificações no momento 🚍</p>";
    return;
  }

  dados.forEach(n => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<p>🔔 ${n.mensagem} <br><small>${new Date(n.data).toLocaleString()}</small></p>`;
    container.appendChild(div);
  });
}

// ============================
// TROCA DE TELAS
// ============================
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");

  if (id === "telaRastreio") {
    setTimeout(() => {
      if (!mapaRastreio) {
        carregarMapaRastreio();
      } else {
        mapaRastreio.invalidateSize();
        atualizarRotaSelecionada();
      }
    }, 300);
  }

  if (id === "telaNotificacoes") gerarNotificacoes();
}

// ============================
// LOGIN E CADASTRO
// ============================

// Função para login (neste momento sem autenticação real)
async function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    // Verifica no backend se aluno existe
    const res = await fetch(`http://localhost:3000/api/alunos?matricula=${usuario}`);
    const dados = await res.json();

    if (dados.length === 0) {
      // Se não existir, mostra cadastro
      alert("Usuário não encontrado. Faça o cadastro.");
      mostrarTela("telaCadastro");
    } else {
      // Se existir, vai direto pro menu
      mostrarTela("telaMenu");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor.");
  }
}


// Função para cadastro -> vai para o menu
function irParaMenu() {
  const onibus = document.getElementById("onibusSelecionado").value;
  if (!onibus) {
    alert("Selecione o ônibus do aluno.");
    return;
  }

  // Salva no navegador o ônibus escolhido
  localStorage.setItem("onibusAluno", onibus);
  mostrarTela("telaMenu");
}

// Feedback
function enviarFeedback() {
  alert("Feedback enviado com sucesso! Obrigado!");
  mostrarTela("telaMenu");
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
    const res = await fetch("http://localhost:3000/api/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        matricula,
        fazenda,
        escola,
        onibus_id: onibus
      })
    });

    if (res.ok) {
      const aluno = await res.json();
      alert("Cadastro realizado com sucesso!");

      // salvar ônibus do aluno para usar depois no rastreio
      localStorage.setItem("onibusAluno", aluno.onibus_id);

      mostrarTela("telaMenu");
    } else {
      const erro = await res.json();
      alert("Erro no cadastro: " + erro.error);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor.");
  }
}
