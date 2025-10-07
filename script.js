// =========================
// DADOS LOCAIS
// =========================
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
      [-5.6895, -36.2650],
      [-5.6905, -36.2550],
      [-5.6936, -36.2476]
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
      [-5.7080, -36.2600],
      [-5.7000, -36.2500],
      [-5.6936, -36.2476]
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
      [-5.7105, -36.2400],
      [-5.7030, -36.2450],
      [-5.6936, -36.2476]
    ],
    marcadores: [
      { nome: "Fazenda 3 de Agosto", coords: [-5.706, -36.265] },
      { nome: "Sítio Novo", coords: [-5.700, -36.255] },
      { nome: "Escola Eloy", coords: [-5.692, -36.246] }
    ]
  }
];
let mapaRastreio = null;

// =========================
// LOGIN / CADASTRO
// =========================
function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) return alert("Preencha todos os campos!");

  const aluno = alunos.find(a => a.matricula === usuario && a.senha === senha);
  if (aluno) {
    localStorage.setItem("onibusAluno", aluno.onibus_id);
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
  alert("Cadastro realizado!");
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

// =========================
// TELAS / NAVEGAÇÃO
// =========================
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");

  if (id === "telaRastreio") iniciarMapaRastreio();
}

// =======================================================
// FUNÇÃO PARA INICIAR E ATUALIZAR O MAPA DE RASTREIO
// =======================================================
function iniciarMapaRastreio() {
  const seletor = document.getElementById("seletorOnibus");
  const idSelecionado = Number(seletor.value);
  const rota = onibusData.find(o => o.id === idSelecionado);

  if (mapaRastreio) mapaRastreio.remove();

  // Cria o mapa centralizado em Lajes/RN
  mapaRastreio = L.map("mapRastreio").setView([-5.6936, -36.2476], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapaRastreio);

  // Adiciona linha azul do trajeto
  const linha = L.polyline(rota.pontos, { color: "blue", weight: 4 }).addTo(mapaRastreio);

  // Adiciona marcadores das fazendas e escolas
  rota.marcadores.forEach(ponto => {
    const marker = L.marker(ponto.coords).addTo(mapaRastreio);
    marker.bindPopup(`📍 <b>${ponto.nome}</b>`);
  });

  mapaRastreio.fitBounds(linha.getBounds());

  // Atualiza a legenda
  atualizarLegendaRastreio(rota);
}

// =======================================================
// FUNÇÃO PARA ATUALIZAR A LEGENDA ABAIXO DO MAPA
// =======================================================
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

function iniciarMapaRotaDetalhada() {
  if (mapaRota) mapaRota.remove();

  mapaRota = L.map("mapRotaDetalhada").setView([-5.6936, -36.2476], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapaRota);

  onibusData.forEach(rota => {
    const linha = L.polyline(rota.pontos, { color: "green", weight: 3 }).addTo(mapaRota);
    linha.bindPopup(`<strong>${rota.nome}</strong><br>Motorista: ${rota.motorista}`);
  });
}
// =======================================================
// ATUALIZA ROTA AO MUDAR SELEÇÃO
// =======================================================
function atualizarRotaSelecionada() {
  iniciarMapaRastreio();
}

// =======================================================
// MAPA DE RASTREAMENTO - CENTRALIZADO EM LAJES/RN
// =======================================================
function iniciarMapaRastreio() {
  const coordenadasLajes = [-5.6931, -36.2474]; // 📍 Lajes - RN

  // Cria o mapa dentro do div com id "mapRastreio"
  const map = L.map('mapRastreio').setView(coordenadasLajes, 13);

  // Adiciona o mapa base do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Adiciona um marcador em Lajes
  L.marker(coordenadasLajes)
    .addTo(map)
    .bindPopup('📍 Lajes - RN<br>Área de cobertura do transporte escolar.')
    .openPopup();
}

// =======================================================
// ALTERA A FUNÇÃO mostrarTela() PARA INCLUIR O MAPA
// =======================================================
function mostrarTela(idTela) {
  document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
  document.getElementById(idTela).classList.add('ativa');

  // Quando abrir a tela de rastreio, inicializa o mapa
  if (idTela === 'telaRastreio') {
    carregarDadosRastreio();
    setTimeout(iniciarMapaRastreio, 300); // pequeno atraso para garantir renderização
  }
}
