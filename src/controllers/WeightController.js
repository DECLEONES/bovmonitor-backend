// src/controllers/WeightController.js
const connection = require('../db/connection.js');

module.exports = {
  // Método para LISTAR todos os pesos de UM animal
  async index(request, response) {
    const { animal_id } = request.params; // Pega o ID do animal da URL
    const user_id = request.userId; // Pega o ID do usuário logado

    try {
      // --- Verificação de Segurança ---
      // Garante que o animal pertence ao usuário logado
      const animal = await connection('animals')
        .where('id', animal_id)
        .select('user_id')
        .first();

      if (!animal || animal.user_id !== user_id) {
        return response.status(403).json({ error: 'Operação não permitida.' });
      }
      // --- Fim da Verificação ---

      const weights = await connection('weights')
        .where('animal_id', animal_id)
        .orderBy('date', 'desc') // Ordena do mais recente para o mais antigo
        .select('*');

      return response.json(weights);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar pesos.' });
    }
  },

  // Método para CRIAR um novo registro de peso para UM animal
  async create(request, response) {
    const { animal_id } = request.params;
    const { weight, date } = request.body;
    const user_id = request.userId;

    if (!weight || !date) {
      return response.status(400).json({ error: 'Peso e data são obrigatórios.' });
    }

    try {
      // --- Verificação de Segurança (igual à de cima) ---
      const animal = await connection('animals')
        .where('id', animal_id)
        .select('user_id')
        .first();

      if (!animal || animal.user_id !== user_id) {
        return response.status(403).json({ error: 'Operação não permitida.' });
      }
      // --- Fim da Verificação ---

      const [id] = await connection('weights').insert({
        weight,
        date,
        animal_id,
      }).returning('id');

      return response.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao registrar peso.' });
    }
  }
};