// ============================
// CONFIGURAÇÃO DA API
// ============================
const API_URL = "https://conectese-backend.onrender.com"; // seu backend no Render

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

  try {
    const res = await fetch(`${API_URL}/api/onibus`);
    const onibus = await res.json();

    const seletor = document.getElementById("seletorOnibus");
    seletor.innerHTML = ""; // limpar
    onibus.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o.id;
      opt.textContent = `Ônibus ${o.numero} - ${o.rota}`;
      seletor.appendChild(opt);
    });

    const salvo = localStorage.getItem("onibusAluno");
    if (salvo) seletor.value = salvo;

    atualizarRotaSelecionada();
  } catch (err) {
    console.error("Erro ao carregar ônibus:", err);
    alert("Erro ao carregar ônibus do servidor.");
  }
}

// ============================
// ATUALIZAR ROTA SELECIONADA
// ============================
async function atualizarRotaSelecionada() {
  const id = document.getElementById("seletorOnibus").value;
  if (!id) return;

  localStorage.setItem("onibusAluno", id);

  try {
    const res = await fetch(`${API_URL}/api/onibus/${id}`);
    rotaAtual = await res.json();

    if (linhaRota) mapaRastreio.removeLayer(linhaRota);
    if (marcadorRota) mapaRastreio.removeLayer(marcadorRota);
    if (animacaoInterval) clearInterval(animacaoInterval);

    const coordenadas = [
      [rotaAtual.latitude_inicio, rotaAtual.longitude_inicio],
      [rotaAtual.latitude_fim, rotaAtual.longitude_fim]
    ];

    linhaRota = L.polyline(coordenadas, { color: "green", weight: 5 }).addTo(mapaRastreio);
    mapaRastreio.fitBounds(linhaRota.getBounds());

    L.marker(coordenadas[0]).addTo(mapaRastreio).bindPopup("Início");
    L.marker(coordenadas[1]).addTo(mapaRastreio).bindPopup("Destino");

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

    document.getElementById("legendaRastreio").innerHTML = `
      <p><strong>Ônibus:</strong> ${rotaAtual.numero}</p>
      <p><strong>Rota:</strong> ${rotaAtual.rota}</p>
      <p><strong>Horário de saída:</strong> ${rotaAtual.horario_saida}</p>
      <p><strong>Chegada prevista:</strong> ${rotaAtual.horario_chegada}</p>
    `;
  } catch (err) {
    console.error("Erro ao carregar rota:", err);
    alert("Erro ao carregar rota.");
  }
}

// ============================
// LOGIN
// ============================
async function login() {
  const usuario = document.getElementById("usuario").value; // matrícula
  const senha = document.getElementById("senha").value;     // senha

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/alunos?matricula=${usuario}`);
    const dados = await res.json();

    if (dados.length === 0) {
      alert("Usuário não encontrado. Faça o cadastro.");
      mostrarTela("telaCadastro");
    } else {
      // Aqui você pode verificar senha se quiser
      localStorage.setItem("onibusAluno", dados[0].onibus_id);
      mostrarTela("telaMenu");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    alert("Erro ao conectar com o servidor.");
  }
}

// ============================
// CADASTRAR ALUNO
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
    const res = await fetch(`${API_URL}/api/alunos`, {
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
      alert("Erro no cadastro: " + erro.error);
    }
  } catch (err) {
    console.error("Erro no cadastro:", err);
    alert("Erro ao conectar com o servidor.");
  }
}
