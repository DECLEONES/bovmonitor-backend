// No topo do arquivo, vamos importar o 'path'
const path = require('path');

// Agora, vamos dizer ao dotenv exatamente onde o .env está
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// --- O RESTO DO SEU CÓDIGO PERMANECE IGUAL ---

// Logs de Diagnóstico
console.log('--- INICIANDO APLICAÇÃO ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL (verificação):', process.env.DATABASE_URL ? 'Definida' : 'NÃO DEFINIDA');

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/routes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API do BovMonitor Lite está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});