// src/controllers/UserController.js
const connection = require('../db/connection.js');
const bcrypt = require('bcryptjs');

module.exports = {
  async create(request, response) {
    const { name, email, password } = request.body;
    
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      await connection('users').insert({
        name,
        email,
        password: hashedPassword,
        // --- ADICIONADO AQUI ---
        // Todo novo usuário cadastrado pela rota padrão recebe a role 'USUARIO'
        role: 'USUARIO', 
      });

      return response.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao cadastrar usuário. Verifique se o email já existe.' });
    }
  },

  // ... (o restante do seu código, como a função update, continua o mesmo)
  async update(request, response) {
    // ... (sem alterações aqui)
  }
};