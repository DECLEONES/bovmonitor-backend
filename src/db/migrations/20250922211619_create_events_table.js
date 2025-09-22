exports.up = function(knex) {
  return knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable(); // Ex: "Vacina Febre Aftosa"
    table.text('description'); // Campo para detalhes adicionais
    table.date('event_date').notNullable();
    table.string('type').defaultTo('Sanidade'); // Tipos: Sanidade, Manejo, Reprodução, etc.

    // Chave estrangeira para o usuário dono do evento
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Chave estrangeira OPCIONAL para o animal
    // Um evento pode ser de um animal específico ou do rebanho todo (animal_id = null)
    table.integer('animal_id')
      .references('id')
      .inTable('animals')
      .onDelete('SET NULL'); // Se o animal for deletado, o evento permanece, mas sem o vínculo

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('events');
};