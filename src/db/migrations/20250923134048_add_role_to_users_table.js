exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    // Adiciona a coluna 'role' (função)
    table.string('role')
      .notNullable()
      .defaultTo('USUARIO'); // Define 'USUARIO' como o padrão
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    // Remove a coluna 'role' se precisarmos de reverter a migration
    table.dropColumn('role');
  });
};
