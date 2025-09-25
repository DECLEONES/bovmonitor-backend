// server.js

// 1. Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// --- ADICIONADO PARA DIAGNÓSTICO ---
console.log('--- INICIANDO APLICAÇÃO ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL (verificação):', process.env.DATABASE_URL ? 'Definida' : 'NÃO DEFINIDA');
// --- FIM DO DIAGNÓSTICO ---

// 2. Importa a biblioteca Express
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/routes');

// 3. Cria a aplicação Express
const app = express();

// 4. Define a porta do servidor
const PORT = process.env.PORT || 3000;

// 5. Adiciona middlewares
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// 6. Define uma rota de teste inicial
app.get('/', (req, res) => {
  res.send('API do BovMonitor Lite está funcionando!');
});

// 7. Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});