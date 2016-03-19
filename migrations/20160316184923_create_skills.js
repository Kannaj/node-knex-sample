var table = (table) => {
  table.increments().primary();
  table.string('name');
  table.timestamp('created_at').defaultTo(Date.now());
}


exports.up = function(knex, Promise) {
  return knex.schema.createTable('skills',table)
    .then(function(){
      console.log('Skills table created')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('skills',table)
    .then(() => {
      console.log('skills table deleted')
    })
};
