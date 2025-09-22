// src/controllers/UserController.js
const connection = require('../db/connection.js'); // Garantindo que tem o .js
const bcrypt = require('bcryptjs');

module.exports = {
  async create(request, response) {
    const { name, email, password } = request.body;
    const password_hash = await bcrypt.hash(password, 8);

    try {
      await connection('users').insert({
        name,
        email,
        password_hash,
      });

      return response.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error(error); // Linha de debug
      return response.status(400).json({ error: 'Erro ao cadastrar usuário. Verifique se o email já existe.' });
    }
  } // <-- A vírgula foi removida daqui
};