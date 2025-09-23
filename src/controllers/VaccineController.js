// src/controllers/VaccineController.js
const connection = require('../db/connection');

module.exports = {
  // Função para listar todas as vacinas de um animal específico
  async index(request, response) {
    const { animal_id } = request.params;

    try {
      const vaccines = await connection('vaccines')
        .where('animal_id', animal_id)
        .orderBy('application_date', 'desc') // Ordena da mais recente para a mais antiga
        .select('*');

      return response.json(vaccines);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar o histórico de vacinas.' });
    }
  },

  // Função para adicionar uma nova vacina a um animal
  async create(request, response) {
    const { animal_id } = request.params;
    const { name, application_date, next_dose_date } = request.body;

    try {
      // Garante que o animal existe antes de adicionar a vacina
      const animal = await connection('animals').where('id', animal_id).first();
      if (!animal) {
        return response.status(404).json({ error: 'Animal não encontrado.' });
      }

      const [newVaccine] = await connection('vaccines').insert({
        name,
        application_date,
        next_dose_date: next_dose_date || null, // Garante que seja null se não for fornecido
        animal_id,
      }).returning('*'); // Retorna o objeto da vacina criada

      return response.status(201).json(newVaccine);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao registar a vacina.' });
    }
  }
};