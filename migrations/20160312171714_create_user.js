var table = (table) => {
  table.increments().primary();
  table.string('name');
  table.timestamp('created_at').defaultTo(Date.now());
}

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users',table)
        .then(function(){
          console.log('Users Table created')
        })
        .catch(function(){
          console.log('There was an error with the users table')
        })
};

exports.down = function(knex, Promise) {
  return knex.schema
              .dropTable('users',table)
              .then(() => {
                console.log('users table deleted')
              })
              .catch(() => {
                console.log('there was an error deleting users table')
              })
};
