exports.up = function(knex) {
  return knex.schema.createTable('weights', (table) => {
    table.increments('id').primary();
    table.decimal('weight', 8, 2).notNullable(); // Ex: 123456.78
    table.date('date').notNullable();

    // Chave estrangeira para conectar a pesagem ao animal
    table.integer('animal_id')
      .notNullable()
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE'); // Se o animal for deletado, suas pesagens também são

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('weights');
};
