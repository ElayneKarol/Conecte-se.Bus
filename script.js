// DADOS LOCAIS (OFFLINE)
let alunos = [
  { matricula: "admin", senha: "1234", nome: "Administrador", onibus_id: 1 }
];

const onibusData = [
  {
    id: 1,
    nome: "Ônibus 01 - Rota Boa Vista",
    motorista: "João",
    status: "No trajeto",
    ultima_localizacao: "Fazenda Boa Vista",
    ultimo_update: "Agora",
    pontos: [
      [-5.7030, -36.2640],  // Fazenda Boa Vista
      [-5.6985, -36.2580],  // Sítio Riacho
      [-5.6950, -36.2520],  // Fazenda Boa Vista II
      [-5.6936, -36.2476]   // Centro de Lajes
    ],
    marcadores: [
      { nome: "Fazenda Boa Vista", coords: [-5.7030, -36.2640] },
      { nome: "Sítio Riacho", coords: [-5.6985, -36.2580] },
      { nome: "Centro de Lajes", coords: [-5.6936, -36.2476] }
    ]
  },
  {
    id: 2,
    nome: "Ônibus 02 - Rota Caraúbas",
    motorista: "Maria Souza",
    status: "Em trânsito",
    ultima_localizacao: "Fazenda Caraúbas",
    ultimo_update: "Há 5 minutos",
    pontos: [
      [-5.7400, -36.3000],  // Fazenda Caraúbas (mais afastada)
      [-5.7280, -36.2850],  // Fazenda Lagoa Seca
      [-5.7150, -36.2700],  // Sítio São José
      [-5.7030, -36.2600],  // Fazenda Boa Fé
      [-5.6936, -36.2476]   // Centro de Lajes
    ],
    marcadores: [
      { nome: "Fazenda Caraúbas", coords: [-5.7400, -36.3000] },
      { nome: "Fazenda Lagoa Seca", coords: [-5.7280, -36.2850] },
      { nome: "Sítio São José", coords: [-5.7150, -36.2700] },
      { nome: "Centro de Lajes", coords: [-5.6936, -36.2476] }
    ]
  },
  {
    id: 3,
    nome: "Ônibus 03 - Rota 3 de Agosto",
    motorista: "José Gomes",
    status: "Saindo da garagem",
    ultima_localizacao: "Fazenda 3 de Agosto",
    ultimo_update: "Há 2 minutos",
    pontos: [
      [-5.7250, -36.2550],  // Fazenda 3 de Agosto
      [-5.7150, -36.2520],  // Fazenda Lagoa do Mato
      [-5.7050, -36.2500],  // Sítio Esperança
      [-5.6936, -36.2476]   // Centro de Lajes
    ],
    marcadores: [
      { nome: "Fazenda 3 de Agosto", coords: [-5.7250, -36.2550] },
      { nome: "Fazenda Lagoa do Mato", coords: [-5.7150, -36.2520] },
      { nome: "Centro de Lajes", coords: [-5.6936, -36.2476] }
    ]
  }
];

// NOTIFICAÇÕES SIMULADAS
const notificacoesData = [
  {
    onibus_id: 1,
    mensagens: [
      { titulo: "Saída confirmada", texto: "Ônibus Boa Vista saiu da garagem às 06:30." },
      { titulo: "Parada rápida", texto: "Ônibus Boa Vista fez parada na Fazenda Boa Vista." },
      { titulo: "Chegada prevista", texto: "Previsão de chegada na Escola Pedro II às 07:10." }
    ]
  },
  {
    onibus_id: 2,
    mensagens: [
      { titulo: "Atraso leve", texto: "Ônibus Caraúbas com 10 minutos de atraso devido à estrada." },
      { titulo: "Passagem confirmada", texto: "Passou pela Fazenda Lagoa Seca às 06:45." },
      { titulo: "Chegada prevista", texto: "Chegada prevista na Escola Marta às 07:20." }
    ]
  },
  {
    onibus_id: 3,
    mensagens: [
      { titulo: "Saída confirmada", texto: "Ônibus 3 de Agosto saiu às 06:15 da fazenda." },
      { titulo: "Trânsito livre", texto: "Rota fluindo normalmente até Lajes." },
      { titulo: "Aviso", texto: "Ônibus deve chegar à Escola Eloy às 06:55." }
    ]
  }
];

let mapaRastreio = null;
let marcadorOnibus = null;
let animacaoInterval = null;

// LOGIN / CADASTRO
function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) return alert("Preencha todos os campos!");

  const aluno = alunos.find(a => a.matricula === usuario && a.senha === senha);
  if (aluno) {
    localStorage.setItem("onibusAluno", aluno.onibus_id);
    alert("✅ Login realizado com sucesso!");
    mostrarTela("telaMenu");
  } else {
    alert("Usuário não encontrado ou senha incorreta.");
  }
}

function cadastrarAluno() {
  const nome = document.getElementById("nomeAluno").value;
  const matricula = document.getElementById("matricula").value;
  const escola = document.getElementById("escola").value;
  const onibusSelecionado = document.getElementById("onibusSelecionado").value;
  const senha = prompt("Crie uma senha:");

  if (!nome || !matricula || !escola || !onibusSelecionado || !senha)
    return alert("Preencha todos os campos!");

  alunos.push({ nome, matricula, escola, onibus_id: Number(onibusSelecionado), senha });
  alert("Aluno cadastrado com sucesso!");
  mostrarTela("telaMenu");
}

// MAPA DE RASTREIO
function iniciarMapaRastreio() {
  const idSelecionado = Number(document.getElementById("seletorOnibus").value);
  const rota = onibusData.find(o => o.id === idSelecionado);

  if (!rota) return;

  if (mapaRastreio) mapaRastreio.remove();
  if (animacaoInterval) clearInterval(animacaoInterval);

  mapaRastreio = L.map("mapRastreio").setView([-5.6936, -36.2476], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapaRastreio);

  const linha = L.polyline(rota.pontos, { color: "green", weight: 5 }).addTo(mapaRastreio);

  rota.marcadores.forEach(ponto => {
    L.marker(ponto.coords).addTo(mapaRastreio).bindPopup(`📍 <b>${ponto.nome}</b>`);
  });

  // 🚌 Emoji como marcador
  const emojiDiv = L.divIcon({
    html: "🚌",
    className: "emoji-bus",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  marcadorOnibus = L.marker(rota.pontos[0], { icon: emojiDiv }).addTo(mapaRastreio);

  let progress = 0;
  const speed = 0.006; // quanto menor, mais lento

  animacaoInterval = setInterval(() => {
    const start = rota.pontos[0];
    const end = rota.pontos[rota.pontos.length - 1];

    const lat = start[0] + (end[0] - start[0]) * progress;
    const lon = start[1] + (end[1] - start[1]) * progress;
    marcadorOnibus.setLatLng([lat, lon]);

    progress += speed;
    if (progress >= 1) progress = 0; // reinicia o trajeto
  }, 60);

  mapaRastreio.fitBounds(linha.getBounds());
  atualizarLegendaRastreio(rota);
}

function atualizarRotaSelecionada() {
  iniciarMapaRastreio();
}

function atualizarLegendaRastreio(rota) {
  const legenda = document.getElementById("legendaRastreio");
  legenda.innerHTML = `
    <p><strong>Rota:</strong> ${rota.nome}</p>
    <p><strong>Motorista:</strong> ${rota.motorista}</p>
    <p><strong>Status:</strong> ${rota.status}</p>
    <p><strong>Localização:</strong> ${rota.ultima_localizacao}</p>
    <p><small><strong>Última atualização:</strong> ${rota.ultimo_update}</small></p>
  `;
}

// TELAS / NAVEGAÇÃO
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");

  if (id === "telaRastreio") {
    setTimeout(iniciarMapaRastreio, 200);
  }
}

function enviarFeedback() {
  alert("Feedback enviado com sucesso!");
  mostrarTela("telaMenu");
}

// MAPA DE MAPEAMENTO DE ROTAS
function iniciarMapaRotaDetalhada() {
  const containerMapa = document.getElementById("mapRotaDetalhada");
  containerMapa.innerHTML = ""; // limpa caso recarregue

  // Cria o mapa centralizado em Lajes/RN
  const mapa = L.map("mapRotaDetalhada").setView([-5.6936, -36.2476], 12);

  // Camada base (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapa);

  // Cores diferentes para as 3 rotas
  const cores = ["green", "blue", "orange"];

  onibusData.forEach((rota, i) => {
    // Linha da rota
    const linha = L.polyline(rota.pontos, {
      color: cores[i],
      weight: 4,
      opacity: 0.8
    }).addTo(mapa);

    // Marcadores de referência
    rota.marcadores.forEach(ponto => {
      L.marker(ponto.coords)
        .addTo(mapa)
        .bindPopup(`📍 <b>${ponto.nome}</b><br>${rota.nome}`);
    });
  });

  // Ajusta o mapa para mostrar todas as rotas
  const todasCoords = onibusData.flatMap(r => r.pontos);
  mapa.fitBounds(L.polyline(todasCoords).getBounds());

  // Corrige o tamanho caso o mapa carregue após a tela mudar
  setTimeout(() => {
    mapa.invalidateSize();
  }, 300);
}

// FUNÇÃO DE TROCA DE TELAS
function mostrarTela(id) {
  // Oculta todas as telas
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");

  // Define ações específicas para cada tela
  if (id === "telaRastreio") {
    setTimeout(iniciarMapaRastreio, 200);
  } else if (id === "telaNotificacoes") {
    carregarNotificacoes();
  } else if (id === "telaRotaDetalhada") {
    setTimeout(iniciarMapaRotaDetalhada, 300); // <-- chama o mapa de mapeamento
  }
}


function carregarNotificacoes() {
  const id = Number(localStorage.getItem("onibusAluno")) || 1;
  const container = document.getElementById("notificacoesContainer");
  container.innerHTML = "<p>Carregando notificações...</p>";

  const grupo = notificacoesData.find(n => n.onibus_id === id);

  if (!grupo) {
    container.innerHTML = "<p>Sem notificações para este ônibus.</p>";
    return;
  }

  container.innerHTML = "";
  grupo.mensagens.forEach(msg => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h4>🔔 ${msg.titulo}</h4>
      <p>${msg.texto}</p>
    `;
    container.appendChild(card);
  });
}
