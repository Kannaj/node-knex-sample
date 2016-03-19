var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var knex = require('./config');
var router = express.Router();


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


router.route('/users')
  .get(function(req,res){
    knex.select().table('users')
  .then(function(collection){
    res.json({
      error:false,
      data: collection
    })
  })
  .catch(function(err){
    res.status(500).json({
      error:true,
      data:{
        message:err.message
      }
    })
  })
})
.post(function(req,res){
  knex('users').insert({name:req.body.name})
    .then(function(id){
      res.json({
        error:false,
        data: id
      })
    })
    .catch(function(err){
      res.status(500).json({
      error:true,
      data:{
        message:err.message
      }
      })
    })
})


router.route('/categories')
  .get(function(req,res){
    knex.select().table('categories')
      .then(function(collection){
        res.json({
          error:false,
          data: collection
        })
      })
      .catch(function(err){
        res.status(500).json({
          error:true,
          data:{
            message:err.message
          }
        })
      })
  })
    .post(function(req,res){
      knex('categories').insert({name:req.body.name})
        .then(function(id){
          res.json({
            error:false,
            id: id
          })
        })
        .catch(function(err){
          res.json({
            error:true,
            data:{
              message:err.message
            }
          })
        })
    })


router.route('/projects')
  .get(function(req,res){
    knex('projects').select(['projects.id as projectId','projects.name as projectName','projects.category_id','categories.name as categoryName']).innerJoin('categories','projects.category_id','categories.id')
    .then(function(collection){

      console.log(collection);
      res.json({
        error:false,
        data: collection
      })
    })
    .catch(function(err){
      res.json({
        error:true,
        data:{
          message:err.message
        }
      })
    })
  })
  .post(function(req,res){
    knex('projects').insert({name:req.body.name,category_id:knex('categories').where({name:req.body.category_name}).select('id')})
      .then(function(id){
        res.json({
          error:false,
          data: id
        })
      })
      .catch(function(err){
        res.status(500).json({
          error:true,
          data:{
            message:err.message
          }
        })
      })
  })

router.route('/categories/:id')
  .get(function(req,res){
    knex('projects').select(['projects.id as projectId','projects.name as projectName']).where({'projects.category_id':req.params.id})
      .then(function(coll){
        res.json({
          error:false,
          data: coll
        })
      })
      .catch(function(err){
        res.status(500).json({
          error:true,
          data:{
            message: err.message
          }
        })
      })
  })

app.use('/api',router);

app.listen(3000,function(){
  console.log('Express listening on Port 3000...')
})
