// src/controllers/AnimalController.js
const connection = require('../db/connection.js');

module.exports = {
// ...dentro do module.exports
async index(request, response) {
    const user_id = request.userId;
    // Pega os filtros 'sex' e 'category' do URL (query params)
    const { sex, category } = request.query;

    // Inicia a construção da consulta ao banco de dados
    let query = connection('animals')
        .where('user_id', user_id)
        .select('*');

    // Se um filtro de sexo foi fornecido, adiciona-o à consulta
    if (sex) {
        query.andWhere('sex', sex);
    }

    // Se um filtro de categoria foi fornecido, adiciona-o à consulta
    if (category) {
        query.andWhere('category', 'like', `%${category}%`);
    }

    // Executa a consulta final
    const animals = await query;

    return response.json(animals);
},
// ...

  // Método para cadastrar um novo animal
  async create(request, response) {
    const { name, sex, birth_date, category, tag } = request.body;
    const user_id = request.userId; // O ID do usuário logado

    try {
      const [id] = await connection('animals').insert({
        name,
        sex,
        birth_date,
        category,
        tag,
        user_id,
      }).returning('id');

      return response.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao cadastrar animal.' });
    }
  },

    // --- NOVA FUNÇÃO ---
  async update(request, response) {
    const { id } = request.params; // ID do animal a ser atualizado
    const { name, sex, birth_date, category, tag } = request.body; // Novos dados
    const user_id = request.userId;

    try {
      // Primeiro, verifica se o animal pertence ao usuário logado (segurança)
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

      // Se tudo estiver certo, atualiza o animal
      await connection('animals').where('id', id).update({
        name,
        sex,
        birth_date,
        category,
        tag
      });

      return response.json({ message: 'Animal atualizado com sucesso!' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno ao atualizar animal.' });
    }
  },

  // --- NOVA FUNÇÃO ---
  async delete(request, response) {
    const { id } = request.params; // Pega o ID do animal da URL (ex: /api/animals/5)
    const user_id = request.userId; // Pega o ID do usuário logado (do token)

    try {
      // Verifica se o animal pertence ao usuário que está tentando deletar
      const animal = await connection('animals')
        .where('id', id)
        .select('user_id')
        .first();

      if (!animal) {
        return response.status(404).json({ error: 'Animal não encontrado.' });
      }

      if (animal.user_id !== user_id) {
        // 403 Forbidden: o usuário não tem permissão
        return response.status(403).json({ error: 'Operação não permitida.' });
      }

      // Se tudo estiver certo, deleta o animal
      await connection('animals').where('id', id).delete();

      // Retorna uma resposta de sucesso sem conteúdo
      return response.status(204).send();

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno ao deletar animal.' });
    }
  }
};