// src/controllers/PastureController.js
const connection = require('../db/connection.js');

module.exports = {
  // Método para LISTAR todos os pastos do usuário
  async index(request, response) {
    const user_id = request.userId;

    try {
      const pastures = await connection('pastures')
        .where('user_id', user_id)
        .select('*');

      return response.json(pastures);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar pastos.' });
    }
  },

  // Método para CRIAR um novo pasto
  async create(request, response) {
    const { name, description, status } = request.body;
    const user_id = request.userId;

    try {
      const [id] = await connection('pastures').insert({
        name,
        description,
        status,
        user_id,
      }).returning('id');

      return response.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao cadastrar pasto.' });
    }
  },

  // Método para ATUALIZAR um pasto
  async update(request, response) {
    const { id } = request.params;
    const { name, description, status } = request.body;
    const user_id = request.userId;

    try {
      const pasture = await connection('pastures')
        .where('id', id)
        .select('user_id')
        .first();

      if (!pasture) {
        return response.status(404).json({ error: 'Pasto não encontrado.' });
      }

      if (pasture.user_id !== user_id) {
        return response.status(403).json({ error: 'Operação não permitida.' });
      }

      await connection('pastures').where('id', id).update({
        name,
        description,
        status
      });

      return response.json({ message: 'Pasto atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno ao atualizar o pasto.' });
    }
  },

  // Método para DELETAR um pasto
  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.userId;

    try {
      const pasture = await connection('pastures')
        .where('id', id)
        .select('user_id')
        .first();

      if (!pasture) {
        return response.status(404).json({ error: 'Pasto não encontrado.' });
      }

      if (pasture.user_id !== user_id) {
        return response.status(403).json({ error: 'Operação não permitida.' });
      }

      await connection('pastures').where('id', id).delete();

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno ao deletar o pasto.' });
    }
  }
};