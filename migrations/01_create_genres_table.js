/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('genres', (table) => {
    table.increments('id').primary();       // auto-increment id
    table.string('name').notNullable().unique(); // genre name (must be unique)
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('genres');
};

