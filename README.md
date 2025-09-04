# 🚍 Conecte-se – Transporte Escolar

Aplicação front-end que simula um aplicativo de acompanhamento do transporte escolar.  
O objetivo é permitir que pais e responsáveis acompanhem em tempo real o deslocamento dos ônibus escolares, consultem rotas, recebam notificações de manutenção e deixem feedbacks.

> ⚠️ **Status do Projeto:** protótipo front-end em desenvolvimento.  
> A parte de **back-end** (autenticação real, banco de dados, atualização de GPS em tempo real) será integrada futuramente.

---

## 📋 Funcionalidades

- **Login e Cadastro**
  - Criação de usuário e senha (simulado)
  - Registro do aluno com fazenda, escola, matrícula e ônibus vinculado

- **Menu Principal**
  - 📍 **Rastreio:** mapa interativo Leaflet simulando o trajeto do ônibus
  - 🛣️ **Mapeamento de Rota:** visualização estática das rotas e horários
  - 🛠️ **Checklist:** últimos registros de manutenção
  - 🔔 **Notificações:** status de falhas e avisos ao responsável
  - 💬 **Feedback:** envio de comentários e sugestões

- **Mapa**
  - Construído com [Leaflet.js](https://leafletjs.com/)
  - Ícone de ônibus animado nas rotas (simulação de GPS)
  - Marcadores de **garagem**, **fazenda** e **escola**

---

## 🛠️ Tecnologias

- **HTML5** e **CSS3**
- **JavaScript puro (ES6+)**
- [Leaflet.js](https://leafletjs.com/) para renderização de mapas
- [Font Awesome](https://fontawesome.com/) para ícones

---

## 📂 Estrutura do Projeto

assets/
img/
conecte-se.png
bus.png
index.html
style.css
script.js
README.md


---

## 🚧 Próximos Passos

- ✅ Ajuste e organização do front-end (telas, mapa e animações)
- 🔄 Integração futura com:
  - **API de autenticação real** (login/cadastro)
  - **Banco de dados** para armazenar alunos, rotas e notificações
  - **Serviço de GPS** com atualização de posição do ônibus em tempo real

---

## ▶️ Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/conecte-se.git
