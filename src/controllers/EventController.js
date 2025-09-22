// src/controllers/EventController.js
const connection = require('../db/connection.js');

module.exports = {
  // Método para LISTAR todos os eventos do usuário
  async index(request, response) {
    const user_id = request.userId;

    try {
      // Busca todos os eventos do usuário, ordenando pelos mais recentes
      // Também busca o nome do animal, caso o evento esteja associado a um
      const events = await connection('events')
        .leftJoin('animals', 'events.animal_id', 'animals.id')
        .where('events.user_id', user_id)
        .orderBy('events.event_date', 'desc')
        .select([
            'events.*', // Seleciona todos os campos da tabela de eventos
            'animals.name as animal_name' // E renomeia 'name' da tabela 'animals' para 'animal_name'
        ]);

      return response.json(events);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar eventos.' });
    }
  },

  // Método para CRIAR um novo evento
  async create(request, response) {
    const { title, description, event_date, type, animal_id } = request.body;
    const user_id = request.userId;

    if (!title || !event_date) {
      return response.status(400).json({ error: 'Título e data do evento são obrigatórios.' });
    }

    try {
      // Se um animal_id for fornecido, verifica se ele pertence ao usuário
      if (animal_id) {
        const animal = await connection('animals')
          .where({ id: animal_id, user_id: user_id })
          .first();
        if (!animal) {
          return response.status(403).json({ error: 'Animal não encontrado ou não pertence a este usuário.' });
        }
      }

      const [id] = await connection('events').insert({
        title,
        description,
        event_date,
        type,
        animal_id: animal_id || null, // Garante que será null se não for fornecido
        user_id,
      }).returning('id');

      return response.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao registrar evento.' });
    }
  }
};