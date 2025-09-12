/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('movies', (table) => {
    table.increments('id').primary();     // auto-increment id
    table.string('title').notNullable();  // movie title (required)
    table.integer('year');                // year of release
    table.string('director');             // optional director name
    table.text('metadata');               // extra info (JSON as string in sqlite)
    table.integer('genre_id')             // foreign key
         .unsigned()
         .references('id')
         .inTable('genres')
         .onDelete('SET NULL');           // if genre deleted, movie keeps null
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('movies');
};

