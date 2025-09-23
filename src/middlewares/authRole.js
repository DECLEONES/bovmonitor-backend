// src/middlewares/authRole.js

// A função 'permit' recebe uma lista de funções permitidas
// Ex: permit(['ADMIN', 'FUNCIONARIO'])
function permit(allowedRoles) {

  // Retorna a função de middleware real
  return async (request, response, next) => {
    const user_id = request.userId;

    try {
      const connection = require('../db/connection');
      const user = await connection('users').where('id', user_id).select('role').first();

      if (user && allowedRoles.includes(user.role)) {
        next(); // O utilizador tem permissão, pode prosseguir
      } else {
        // O utilizador não tem permissão
        response.status(403).json({ error: 'Acesso negado. Você não tem permissão para executar esta ação.' });
      }
    } catch (error) {
      response.status(500).json({ error: 'Erro interno ao verificar permissões.' });
    }
  };
}

module.exports = permit;