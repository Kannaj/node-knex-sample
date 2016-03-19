var knexfile = require('./knexfile.js');
var knex = require('knex')(knexfile.development);

module.exports = knex;
