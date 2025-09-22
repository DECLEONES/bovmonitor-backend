// src/controllers/SessionController.js
const connection = require('../db/connection.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Um "segredo" para assinar o token. Em um projeto real, isso viria do .env
const authConfig = {
  secret: 'um-segredo-muito-seguro-mude-depois',
  expiresIn: '7d', // Token expira em 7 dias
};

module.exports = {
  async create(request, response) {
    const { email, password } = request.body;

    // 1. Verificar se o usuário existe
    const user = await connection('users').where('email', email).first();

    if (!user) {
      return response.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // 2. Verificar se a senha está correta
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return response.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    // 3. Se tudo estiver correto, gerar o token
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    // 4. Retornar os dados do usuário e o token
    return response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }
};