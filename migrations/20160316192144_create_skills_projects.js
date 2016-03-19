var table = (table) => {
  table.increments().primary();
  table.integer('skill_id').references('skills.id');
  table.integer('project_id').references('projects.id');
}


exports.up = function(knex, Promise) {
  return knex.schema.createTable('skills_projects',table)
      .then(function(){
        console.log('skills_projects table created')
      })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('skills_projects',table)
    .then(() => {
      console.log('table deleted')
    })
};
