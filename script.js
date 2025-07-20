// Variáveis globais para mapa e rota
let mapaRastreio;
let marcadorRota;
let linhaRota;
let rotaAtual = null;
let indiceRota = 0;
let animacaoInterval;

// Dados das rotas
const rotas = {
  "01": {
    nome: "Rota Boa Vista → Escola Pedro II",
    pontoAtual: "Fazenda Boa Vista",
    horario: "06:50",
    chegada: "07:10",
    coordenadas: [
      [-5.698, -36.252],
      [-5.695, -36.248],
      [-5.693, -36.243]
    ]
  },
  "02": {
    nome: "Rota Caraúbas → Escola Marta",
    pontoAtual: "Fazenda Caraúbas",
    horario: "06:40",
    chegada: "07:00",
    coordenadas: [
      [-5.710, -36.260],
      [-5.708, -36.255],
      [-5.705, -36.250]
    ]
  },
  "03": {
    nome: "Rota 3 de Agosto → Escola Eloy",
    pontoAtual: "Fazenda 3 de Agosto",
    horario: "06:35",
    chegada: "06:55",
    coordenadas: [
      [-5.720, -36.270],
      [-5.717, -36.265],
      [-5.715, -36.258]
    ]
  }
};

// Inicializa o mapa
function carregarMapaRastreio() {
  mapaRastreio = L.map('mapRastreio').setView([-5.694, -36.245], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapaRastreio);

  setTimeout(() => mapaRastreio.invalidateSize(), 200);
  atualizarRotaSelecionada();
}

// Atualiza a rota e reinicia o marcador
function atualizarRotaSelecionada() {
  const id = document.getElementById("seletorOnibus").value;
  rotaAtual = rotas[id];

  if (linhaRota) mapaRastreio.removeLayer(linhaRota);
  if (marcadorRota) mapaRastreio.removeLayer(marcadorRota);
  if (animacaoInterval) clearInterval(animacaoInterval);

  linhaRota = L.polyline(rotaAtual.coordenadas, { color: 'green', weight: 5 }).addTo(mapaRastreio);

  rotaAtual.coordenadas.forEach((coord, i) => {
    const nomes = ["Garagem", rotaAtual.pontoAtual, "Escola"];
    L.circleMarker(coord, {
      radius: 6,
      color: "#2c3e50",
      fillColor: "#3498db",
      fillOpacity: 0.9
    }).addTo(mapaRastreio).bindPopup(nomes[i]);
  });

 const onibusIcone = L.icon({
  iconUrl: "assets/img/bus.png", // Ícone de ônibus real
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

  indiceRota = 0;

  // Adiciona o marcador do ônibus com ícone personalizado
  marcadorRota = L.marker(rotaAtual.coordenadas[indiceRota], { icon: onibusIcone }).addTo(mapaRastreio);
  mapaRastreio.panTo(rotaAtual.coordenadas[indiceRota]);

  // Inicia a animação do ônibus
  animarOnibus();

  // Atualiza painel com informações da rota
  document.getElementById("legendaRastreio").innerHTML = `
    <p><strong>${rotaAtual.nome}</strong></p>
    <p><strong>Status:</strong> Em movimento</p>
    <p><strong>Ponto atual:</strong> ${rotaAtual.pontoAtual}</p>
    <p><strong>Saída da garagem:</strong> 🕒 ${rotaAtual.horario}</p>
    <p><strong>Chegada prevista:</strong> 🕒 ${rotaAtual.chegada}</p>
  `;
}

// Anima o ônibus ao longo da rota
function animarOnibus() {
  const coords = rotaAtual.coordenadas;

  animacaoInterval = setInterval(() => {
    indiceRota++;
    if (indiceRota >= coords.length) {
      clearInterval(animacaoInterval);
      document.getElementById("legendaRastreio").innerHTML += `<p><strong>Status:</strong> Chegou ao destino</p>`;
      return;
    }

    marcadorRota.setLatLng(coords[indiceRota]);
    mapaRastreio.panTo(coords[indiceRota]);

    const pontos = ["Garagem", rotaAtual.pontoAtual, "Escola"];
    document.getElementById("legendaRastreio").innerHTML = `
      <p><strong>${rotaAtual.nome}</strong></p>
      <p><strong>Status:</strong> Em movimento</p>
      <p><strong>Ponto atual:</strong> ${pontos[indiceRota]}</p>
      <p><strong>Saída da garagem:</strong> 🕒 ${rotaAtual.horario}</p>
      <p><strong>Chegada prevista:</strong> 🕒 ${rotaAtual.chegada}</p>
    `;
  }, 2500);
}


// Atualiza o painel informativo
function atualizarLegenda() {
  const pontos = ["Garagem", rotaAtual.pontoAtual, "Escola"];
  document.getElementById("legendaRastreio").innerHTML = `
    <p><strong>${rotaAtual.nome}</strong></p>
    <p><strong>Status:</strong> Em movimento</p>
    <p><strong>Ponto atual:</strong> ${pontos[indiceRota]}</p>
    <p><strong>Saída da garagem:</strong> 🕒 ${rotaAtual.horario}</p>
    <p><strong>Chegada prevista:</strong> 🕒 ${rotaAtual.chegada}</p>
  `;
}

// Controla a troca de telas
function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');

  if (id === "telaRastreio") {
    const salvo = localStorage.getItem("onibusAluno");
    if (salvo) {
      document.getElementById("seletorOnibus").value = salvo;
    }

    // Espera a tela ser exibida, depois carrega ou atualiza mapa
    setTimeout(() => {
      if (!mapaRastreio) {
        carregarMapaRastreio();
      } else {
        mapaRastreio.invalidateSize();
        atualizarRotaSelecionada();
      }
    }, 300);
  }

  if (id === "telaRotaDetalhada") {
  setTimeout(() => {
    carregarMapaRotaDetalhada();
    mapaRotaDetalhada.invalidateSize();
  }, 300);
}

  if (id === "telaNotificacoes") gerarNotificacoes();
}

//login
function irParaCadastro() {
  mostrarTela('telaCadastro');
}

//cadastro
function irParaMenu() {
  const onibus = document.getElementById('onibusSelecionado').value;
  if (!onibus) {
    alert("Por favor, selecione o ônibus do aluno.");
    return;
  }

  localStorage.setItem("onibusAluno", onibus);
  mostrarTela('telaMenu');
}

//feedback
function enviarFeedback() {
  alert("Feedback enviado com sucesso! Obrigado pela sua contribuição.");
  mostrarTela('telaMenu');
}

//noti
function gerarNotificacoes() {
  const onibus = localStorage.getItem("onibusAluno");
  const container = document.getElementById("notificacoesContainer");
  container.innerHTML = "";

  const dados = {
    "01": [
      { tipo: "✅", texto: "Ônibus 01 passou por manutenção preventiva na garagem.", data: "17/07/2025 - 16:10" }
    ],
    "02": [
      { tipo: "⚠️", texto: "Ônibus 02 atrasado no ponto do Sítio Três Lagoas — Falha no motor", data: "17/07/2025 - 06:20" }
    ],
    "03": [
      { tipo: "⚠️", texto: "Ônibus 03 parado próximo à Fazenda Caraúbas — Pneu furado", data: "18/07/2025 - 07:42" }
    ]
  };

  if (dados[onibus]) {
    dados[onibus].forEach(n => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<p>${n.tipo} ${n.texto}<br><small>${n.data}</small></p>`;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = "<p>Nenhuma notificação para este ônibus.</p>";
  }
}

function carregarMapaRotaDetalhada() {
  if (window.mapaRotaDetalhada) {
    setTimeout(() => {
      mapaRotaDetalhada.invalidateSize();
    }, 300);
    return;
  }

  mapaRotaDetalhada = L.map('mapRotaDetalhada').setView([-5.695, -36.247], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapaRotaDetalhada);

  const rota = [
    [-5.698, -36.252], // 🚍 Garagem
    [-5.695, -36.248], // 📍 Fazenda Boa Vista
    [-5.693, -36.243]  // 🏫 Escola Pedro II
  ];

  const nomes = ["Garagem", "Fazenda Boa Vista", "Escola Pedro II"];
  const icones = ["🚍", "📍", "🏫"];

  // Marcadores
  rota.forEach((coord, i) => {
    L.marker(coord).addTo(mapaRotaDetalhada)
      .bindPopup(`<strong>${icones[i]} ${nomes[i]}</strong>`);
  });

  // Linha da rota
  L.polyline(rota, {
    color: 'green',
    weight: 5
  }).addTo(mapaRotaDetalhada);
}
