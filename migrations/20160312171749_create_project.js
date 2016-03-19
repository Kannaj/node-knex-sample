var table = (table) => {
  table.increments().primary();
  table.string('name');
  table.integer('category_id').references('categories.id');
  table.timestamp('created_at').defaultTo(Date.now());
}

exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects',table)
      .then(function(){
        console.log('Projects table created')
      })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects',table)
    .then(() => {
      console.log('projects table deleted')
    })
};
