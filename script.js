// =======================================================
// MODO OFFLINE - DADOS LOCAIS
// =======================================================

let alunos = [
  { matricula: "admin", senha: "1234", nome: "Administrador", onibus_id: 1 }
];

let onibus = [
  { id: 1, nome: "Ônibus 01", motorista: "João", status: "No trajeto", ultima_localizacao: "Centro", ultimo_update: "Agora" }
];

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
  if (id === "telaRotaDetalhada") iniciarMapaRotaDetalhada();
}

// =========================
// MAPAS LEAFLET
// =========================
let mapaRastreio, mapaRota;

function iniciarMapaRastreio() {
  const idOnibus = Number(document.getElementById("seletorOnibus").value);
  const rota = onibusData.find(o => o.id === idOnibus);

  if (mapaRastreio) mapaRastreio.remove();

  mapaRastreio = L.map("mapRastreio").setView([-5.6936, -36.2476], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapaRastreio);

  const polyline = L.polyline(rota.pontos, { color: "blue", weight: 4 }).addTo(mapaRastreio);
  rota.pontos.forEach((p, i) => L.marker(p).addTo(mapaRastreio).bindPopup(`Ponto ${i + 1}`));
  mapaRastreio.fitBounds(polyline.getBounds());

  document.getElementById("legendaRastreio").innerHTML = `
    <p><strong>Rota:</strong> ${rota.nome}</p>
    <p><strong>Motorista:</strong> ${rota.motorista}</p>
  `;
}

function iniciarMapaRotaDetalhada() {
  if (mapaRota) mapaRota.remove();

  mapaRota = L.map("mapRotaDetalhada").setView([-5.6936, -36.2476], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapaRota);

  onibusData.forEach(rota => {
    const poly = L.polyline(rota.pontos, { color: "green", weight: 3 }).addTo(mapaRota);
    poly.bindPopup(`<strong>${rota.nome}</strong><br>Motorista: ${rota.motorista}`);
  });
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
