exports.up = function(knex) {
  return knex.schema.createTable('animals', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('sex').notNullable();
    table.date('birth_date');
    table.string('category');
    table.string('tag');
    table.string('status').defaultTo('Ativo');

    // Chave estrangeira para conectar o animal ao usuário dono
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); // Se o usuário for deletado, seus animais também são

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('animals');
};