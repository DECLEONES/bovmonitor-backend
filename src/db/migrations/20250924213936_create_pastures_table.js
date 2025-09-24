exports.up = function(knex) {
  return knex.schema.createTable('pastures', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('status').defaultTo('Disponível'); // Ex: Disponível, Ocupado, Em descanso

    // Chave estrangeira para o usuário
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pastures');
};