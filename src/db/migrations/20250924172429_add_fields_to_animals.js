exports.up = function(knex) {
  return knex.schema.table('animals', function(table) {
    table.string('breed');
    table.string('origin');
  });
};

exports.down = function(knex) {
  return knex.schema.table('animals', function(table) {
    table.dropColumn('breed');
    table.dropColumn('origin');
  });
};