# 🌐 NextWork – Global Solution 2 | FIAP 2025

### Tema:  
**O Futuro do Trabalho**

---

## 👥 Integrantes do Grupo

| Nome                             | RM     |
| -------------------------------- | ------ |
| **Anna Clara Ruggeri da Silva**  | 565553 |
| **Giovana Bernardino Carnevali** | 566196 |
| **Henrique Vicente Vicente**     | 564116 |

---

## 🚀 Sobre o Projeto

O **NextWork** é uma plataforma web colaborativa desenvolvida para **empresas e organizações**, com o objetivo de **conectar profissionais, competências e propósito** através da tecnologia.

Inspirado no tema da **Global Solution 2 da FIAP**, o projeto propõe uma simulação de rede profissional moderna e funcional, que representa o futuro do trabalho — mais **conectado, inteligente e sustentável**.

Além da interface web, o NextWork inclui um **protótipo IoT com ESP32**, que monitora **luminosidade, ruído e temperatura do ambiente corporativo**, transmitindo os dados em tempo real via **Node-RED e MQTT**.  
Essas informações simulam um **ambiente de trabalho inteligente**, capaz de adaptar suas condições para promover **bem-estar e produtividade** aos colaboradores.

---

## 💡 Problema

Em um cenário onde o trabalho híbrido e as novas formas de colaboração digital se tornam cada vez mais presentes, as empresas enfrentam desafios como:

- Dificuldade em conectar talentos de forma inteligente;  
- Falta de integração entre pessoas e tecnologia;  
- Ambientes de trabalho pouco adaptáveis ao bem-estar e produtividade.  

---

## 🌱 Solução Proposta

O **NextWork** une **tecnologia web e IoT** para criar um ecossistema corporativo inteligente e colaborativo:

- 💻 **Plataforma Web**: Desenvolvida com **React** e **Tailwind CSS**, a aplicação permite a visualização de perfis profissionais dinâmicos, com busca em tempo real, filtros por área de atuação, dark mode e modais interativos com informações completas.  
  O layout foi projetado para oferecer **experiência fluida e responsiva**, simulando o funcionamento de uma rede corporativa moderna.  

- 🤖 **Protótipo IoT (ESP32)**: O sistema embarcado realiza a **leitura simultânea** dos sensores de **luminosidade (LDR)**, **ruído (potenciômetro)** e **temperatura (DHT22)**.  
  A partir dessas medições, o ESP32 envia relatórios periódicos via **MQTT** ao **Node-RED**, gerando diagnósticos automáticos sobre o ambiente, como:  
  > “Ambiente tranquilo — ótimo para foco criativo”  
  > “Ambiente equilibrado — conforto e concentração”  
  > “Ambiente barulhento ou muito iluminado — foco prejudicado”

- 🧠 **Integração Inteligente**: A interface do NextWork consome os dados disponibilizados pelo Node-RED por meio de uma **requisição Fetch API**.  
  Os valores são atualizados automaticamente na interface, refletindo o estado real do ambiente e reforçando a conexão entre **mundo físico e digital** dentro das empresas.

---

## ⚙️ Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|--------------|
| **Frontend Web** | React.js, Tailwind CSS, Fetch API |
| **IoT** | ESP32, DHT22, LDR, Potenciômetro |
| **Backend** | Node-RED, MQTT, HTTP Endpoint |
| **Protocolo de Comunicação** | MQTT (Broker: HiveMQ) |
| **Simulação** | Wokwi IoT Simulator |

---

## 🔌 Funcionamento IoT (ESP32 + Node-RED)

### 🔹 Fluxo de Comunicação

1. O **ESP32** lê dados do **LDR**, **Potenciômetro (simulando captação de ruído)** e **DHT22**.  
2. As informações são publicadas via **MQTT** no tópico `esp32/sensores`.  
3. O **Node-RED** recebe os dados, interpreta o JSON e armazena as últimas leituras.  
4. Um **endpoint HTTP** `/sensores` é criado para disponibilizar esses dados em formato JSON.  
5. O **NextWork (React)** consome o endpoint com `fetch()` e exibe as informações na tela em tempo real.

Essa integração entre hardware e software demonstra como a **Internet das Coisas (IoT)** pode auxiliar empresas na criação de **espaços de trabalho inteligentes**, ajustando condições ambientais conforme a necessidade dos colaboradores.

---

### 🧠 Explicação Técnica – MQTT e HTTP Endpoint

#### 🔸 MQTT (Message Queuing Telemetry Transport)
- É um **protocolo leve e eficiente** ideal para sistemas IoT.  
- O **ESP32** atua como **publisher**, enviando mensagens para o **broker público HiveMQ**.  
- O **Node-RED** se comporta como **subscriber**, recebendo, processando e armazenando os dados enviados.  

#### 🔸 Endpoint HTTP
- Criado no Node-RED para **expor os dados mais recentes** via requisições HTTP GET.  
- A aplicação web consome o endpoint `http://localhost:1880/sensores` usando **Fetch API**.  
- Se o ESP32 estiver desconectado, o Node-RED retorna `null`, e a interface exibe o aviso:  
  > “Dados não captados pelos sensores”  

Essa lógica evita leituras antigas e garante **transparência nos dados em tempo real**.

---

## 🧭 Instruções de Uso

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/GS2025-2/netWork.git
cd netWork
````

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Execute o projeto React

```bash
npm run dev
```

### 4️⃣ Configure o Node-RED

* Importe o fluxo disponível em `node-red/fluxo.json` no repositório `https://github.com/GS2025-2/Edge-Computing-And-Computer-Systems.git`
* Verifique o endpoint HTTP em:
  👉 **[http://localhost:1880/sensores](http://localhost:1880/sensores)**

### 5️⃣ Execute a simulação do ESP32

🔗 [Abrir simulação no Wokwi](https://wokwi.com/projects/447328787500644353)

---

## 🌎 Link Vercel

📺 [Link NetWork](https://front-drab-eight.vercel.app/)

---

## 🏁 Conclusão

O **NextWork** representa o futuro do trabalho sob a ótica da **inovação e do bem-estar corporativo**.
A combinação de **interfaces modernas**, **dados em tempo real** e **conectividade IoT** demonstra como a tecnologia pode apoiar empresas na criação de ambientes mais humanos, sustentáveis e produtivos.

Com esse projeto, reforçamos o papel da **FIAP** na formação de profissionais visionários e preparados para o **mundo corporativo 4.0**, onde **pessoas, competências e propósito** caminham lado a lado. 

---

✨ *Projeto desenvolvido para Global Solution 2 – FIAP 2025.*

```
