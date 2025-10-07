// =========================
// DADOS LOCAIS (OFFLINE)
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
      [-5.7030, -36.2640],
      [-5.6980, -36.2550],
      [-5.6936, -36.2476]
    ],
    marcadores: [
      { nome: "Fazenda Boa Vista", coords: [-5.7030, -36.2640] },
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
      [-5.7100, -36.2700],
      [-5.7000, -36.2600],
      [-5.6936, -36.2476]
    ],
    marcadores: [
      { nome: "Fazenda Caraúbas", coords: [-5.7100, -36.2700] },
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
      [-5.7200, -36.2600],
      [-5.7050, -36.2550],
      [-5.6936, -36.2476]
    ],
    marcadores: [
      { nome: "Fazenda 3 de Agosto", coords: [-5.7200, -36.2600] },
      { nome: "Centro de Lajes", coords: [-5.6936, -36.2476] }
    ]
  }
];

let mapaRastreio = null;
let marcadorOnibus = null;
let animacaoInterval = null;

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

// =========================
// MAPA DE RASTREIO
// =========================
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
  const speed = 0.002; // quanto menor, mais lento

  animacaoInterval = setInterval(() => {
    const start = rota.pontos[0];
    const end = rota.pontos[rota.pontos.length - 1];

    const lat = start[0] + (end[0] - start[0]) * progress;
    const lon = start[1] + (end[1] - start[1]) * progress;
    marcadorOnibus.setLatLng([lat, lon]);

    progress += speed;
    if (progress >= 1) progress = 0; // reinicia o trajeto
  }, 100);

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

// =========================
// TELAS / NAVEGAÇÃO
// =========================
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
