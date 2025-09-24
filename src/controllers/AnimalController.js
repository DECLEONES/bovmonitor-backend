// src/controllers/AnimalController.js
const connection = require('../db/connection.js');

module.exports = {
  // ... (a função 'index' continua a mesma)
  async index(request, response) {
    // ... (sem alterações aqui)
  },

  // Método para cadastrar um novo animal (MODIFICADO)
  async create(request, response) {
    // 1. Adicionamos 'breed' e 'origin' para serem lidos do corpo da requisição
    const { name, sex, birth_date, category, tag, breed, origin } = request.body;
    const user_id = request.userId;

    try {
      const [id] = await connection('animals').insert({
        name,
        sex,
        birth_date,
        category,
        tag,
        // 2. Adicionamos os novos campos para serem inseridos no banco
        breed,
        origin,
        user_id,
      }).returning('id');

      return response.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao cadastrar animal.' });
    }
  },

  // Método para atualizar um animal (MODIFICADO)
  async update(request, response) {
    const { id } = request.params;
    // 1. Adicionamos 'breed' e 'origin' para serem lidos do corpo da requisição
    const { name, sex, birth_date, category, tag, breed, origin } = request.body;
    const user_id = request.userId;

    try {
      const animal = await connection('animals')
        .where('id', id)
        .select('user_id')
        .first();

      if (!animal) {
        return response.status(404).json({ error: 'Animal não encontrado.' });
      }

      if (animal.user_id !== user_id) {
        return response.status(403).json({ error: 'Operação não permitida.' });
      }

      await connection('animals').where('id', id).update({
        name,
        sex,
        birth_date,
        category,
        tag,
        // 2. Adicionamos os novos campos para serem atualizados no banco
        breed,
        origin
      });

      return response.json({ message: 'Animal atualizado com sucesso!' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno ao atualizar animal.' });
    }
  },

  // ... (a função 'delete' continua a mesma)
  async delete(request, response) {
    // ... (sem alterações aqui)
  }
};