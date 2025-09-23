const path = require('path'); // Importa o módulo 'path' do Node.js
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); // Garante que o .env é encontrado a partir da raiz

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      // Usa o caminho absoluto para a pasta de migrações
      directory: path.resolve(__dirname, 'src', 'db', 'migrations')
    }
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      // Usa o caminho absoluto para a pasta de migrações
      directory: path.resolve(__dirname, 'src', 'db', 'migrations')
    }
  }
};