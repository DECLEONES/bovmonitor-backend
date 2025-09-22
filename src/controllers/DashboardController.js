// src/controllers/DashboardController.js
const connection = require('../db/connection.js');

module.exports = {
  async index(request, response) {
    const user_id = request.userId;

    try {
      // Usamos Promise.all para executar todas as consultas em paralelo
      const [
        totalCount,
        genderCount,
        categoryCount
      ] = await Promise.all([
        // 1. Contagem total de animais
        connection('animals').where('user_id', user_id).count('id as total').first(),

        // 2. Contagem por sexo
        connection('animals').where('user_id', user_id)
          .groupBy('sex')
          .select('sex')
          .count('id as count'),

        // 3. Contagem por categoria
        connection('animals').where('user_id', user_id)
          .groupBy('category')
          .select('category')
          .count('id as count'),
      ]);

      // Formata os dados para facilitar o uso no front-end
      const stats = {
        total: totalCount.total || 0,
        males: genderCount.find(g => g.sex === 'Macho')?.count || 0,
        females: genderCount.find(g => g.sex === 'Fêmea')?.count || 0,
        byCategory: categoryCount || []
      };

      return response.json(stats);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar dados para o dashboard.' });
    }
  }
};