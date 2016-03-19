var table = (table) => {
  table.increments().primary();
  table.string('name');
  table.timestamp('created_at').defaultTo(Date.now());
}


exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories',table)
      .then(function(){
        console.log('categories table created')
      })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories',table)
    .then(() => {
      console.log('categories')
    })
};
