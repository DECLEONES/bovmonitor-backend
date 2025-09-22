const knex = require('knex');
const configuration = require('../../knexfile');

// Esta linha é a chave: ela verifica se o ambiente é 'production' (como na Render)
// e escolhe a configuração correta. Senão, usa a de 'development'.
const config = process.env.NODE_ENV === 'production' ? configuration.production : configuration.development;

const connection = knex(config);

module.exports = connection;