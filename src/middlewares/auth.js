// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

// Lembre-se que este segredo deve ser o mesmo do SessionController
const authConfig = {
  secret: 'um-segredo-muito-seguro-mude-depois',
};

module.exports = (request, response, next) => {
  const authHeader = request.headers.authorization;

  // 1. Verifica se o token foi enviado
  if (!authHeader) {
    return response.status(401).json({ error: 'Token não fornecido.' });
  }

  // 2. O token vem no formato "Bearer [token]". Vamos separar as duas partes.
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return response.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ error: 'Token mal formatado.' });
  }

  // 3. Verifica se o token é válido
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: 'Token inválido.' });
    }

    // Se for válido, salvamos o ID do usuário na requisição para uso futuro
    request.userId = decoded.id;
    return next(); // Permite que a requisição continue para o próximo passo (o controller)
  });
};