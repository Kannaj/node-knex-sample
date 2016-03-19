var table = (table) => {
  table.increments().primary();
  table.integer('user_id').references('users.id');
  table.integer('project_id').references('projects.id');
}


exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_projects',table)
      .then(function(){
        console.log('users_projects table created')
      })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_projects',table)
    .then(() => {
      console.log('table deleted')
    })
};
