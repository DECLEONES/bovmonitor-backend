// server.js

// 1. Carrega as variáveis de ambiente do arquivo .env
// Isso permite usar process.env.PORT, process.env.DB_HOST, etc.
require('dotenv').config();

// 2. Importa a biblioteca Express
const express = require('express');
const cors = require('cors'); // 1. IMPORTE o cors
const routes = require('./src/routes/routes'); // 1. IMPORTE as rotas

// 3. Cria a aplicação Express
const app = express();

// 4. Define a porta do servidor. Ele vai tentar usar a porta definida no .env,
//    ou a porta 3000 se não encontrar.
const PORT = process.env.PORT || 3000;

// 5. Adiciona um "middleware" para que o Express entenda requisições com corpo em JSON.
//    Isso é essencial para receber dados quando formos cadastrar um novo animal.
app.use(cors()); // 2. USE o cors. Isso permite que qualquer origem acesse sua API.
app.use(express.json());
app.use('/api', routes); // 2. USE as rotas com o prefixo /api

// 6. Define uma rota de teste inicial
//    Quando você acessar http://localhost:3000/ no navegador, verá esta mensagem.
app.get('/', (req, res) => {
  res.send('API do BovMonitor Lite está funcionando!');
});

// 7. Inicia o servidor para que ele comece a "ouvir" por requisições na porta definida.
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 