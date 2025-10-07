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
      [-5.7030, -36.2640],
      [-5.6980, -36.2550],
      [-5.6936, -36.2476] // Lajes
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

// =========================
// MAPA DE RASTREIO
// =========================
function iniciarMapaRastreio() {
  const idSelecionado = Number(document.getElementById("seletorOnibus").value);
  const rota = onibusData.find(o => o.id === idSelecionado);

  if (!rota) return;

  if (mapaRastreio) mapaRastreio.remove();

  mapaRastreio = L.map("mapRastreio").setView([-5.6936, -36.2476], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(mapaRastreio);

  const linha = L.polyline(rota.pontos, { color: "blue", weight: 4 }).addTo(mapaRastreio);

  rota.marcadores.forEach(ponto => {
    L.marker(ponto.coords)
      .addTo(mapaRastreio)
      .bindPopup(`📍 <b>${ponto.nome}</b>`);
  });

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
