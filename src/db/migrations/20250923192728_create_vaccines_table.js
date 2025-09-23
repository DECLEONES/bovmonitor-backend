exports.up = function(knex) {
  return knex.schema.createTable('vaccines', (table) => {
    table.increments('id').primary();

    table.string('name').notNullable(); // Nome da vacina (ex: Febre Aftosa)
    table.date('application_date').notNullable(); // Data da aplicação
    table.date('next_dose_date'); // Data da próxima dose (opcional)

    table.integer('animal_id')
      .notNullable()
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE'); // Se o animal for apagado, as vacinas dele também são.

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('vaccines');
};