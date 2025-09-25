const connection = require('../db/connection');

module.exports = {
  async index(req, res) {
    try {
      const pastures = await connection('pastures')
        .where('user_id', req.userId)
        .select('*');
      return res.json(pastures);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar pastos.' });
    }
  },

  async create(req, res) {
    try {
      const { name, description, status } = req.body;
      const user_id = req.userId;

      const [id] = await connection('pastures').insert({
        name,
        description,
        status,
        user_id,
      });

      return res.status(201).json({ id });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao cadastrar pasto.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;
      const user_id = req.userId;

      const updated = await connection('pastures')
        .where({ id: id, user_id: user_id })
        .update({
          name,
          description,
          status,
        });

      if (updated === 0) {
        return res.status(404).json({ error: 'Pasto não encontrado ou permissão negada.' });
      }

      return res.status(200).json({ message: 'Pasto atualizado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar pasto.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const deleted = await connection('pastures')
        .where({ id: id, user_id: user_id })
        .delete();

      if (deleted === 0) {
        return res.status(404).json({ error: 'Pasto não encontrado ou permissão negada.' });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar pasto.' });
    }
  }
};