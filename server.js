var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var knex = require('./config');
//var _ = require('lodash');
var Promise = require('bluebird');
var _ = require('underscore');

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


//skills
router.route('/skills')
  .get(function(req,res){
    knex.select().table('skills')
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
      knex('skills').insert({name:req.body.name})
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

//projects

router.route('/projects')
  .get(function(req,res){
    /*
    //knex('projects').select(['projects.id as projectId','projects.name as projectName','projects.category_id','categories.name as categoryName','skills_projects.skill_id as skills']).innerJoin('categories','projects.category_id','categories.id').innerJoin('skills_projects','projects.id','skills_projects.project_id')
    knex('projects').select(['projects.id as projectId','projects.name as projectName','categories.name as categoryName']).innerJoin('categories','projects.category_id','categories.id')
    .then(function(collection){
      _.forEach(collection,function(obj){
        obj.skills = [];
        knex('skills_projects').select(['skills_projects.skill_id as skillId','skills.name as skillName']).innerJoin('skills','skills_projects.skill_id','skills.id').where('skills_projects.project_id',obj.projectId)
        .then(function(skillSet){
          _.forEach(skillSet,function(skill){
            obj.skills.push(skill.skillName);
            return obj;
          })
        })
        .then(function(){
          console.log('-------')
        })
      })
      .then(function(){
        res.json({
          error:false,
          data: collection
        })
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
  */
    knex('projects')
    .innerJoin('categories','projects.category_id','categories.id')
    .innerJoin('skills_projects','projects.id','skills_projects.project_id')
    .innerJoin('skills','skills.id','skills_projects.skill_id')
    .select([
      'projects.id as projectID',
      'projects.name as projectName',
     'categories.name as categoryName',
      knex.raw('GROUP_CONCAT(skills.name) as skills')
    ])
    .groupBy('projects.id')
    .then(function(coll){
      _.forEach(coll,function(obj){
        obj.skills = obj.skills.split(',')
      })
      res.json({
        error:false,
        data:coll
      })
    })
})


  .post(function(req,res){
      var name = req.body.name,
          category_name= req.body.category_name,
          skills = req.body.skills;
    //skill column in populated with null if skill doesnt already exist in the table.
      knex.transaction(function(trx){
        return trx
            .insert({name:req.body.name,category_id:knex('categories').where({name:req.body.category_name}).select('id')})
            .into('projects')
            .then(function(id){
              return Promise.map(skills,function(skill){
                return trx.insert({project_id:id[0],skill_id:knex('skills').where({name:skill}).select('id')})
                .into('skills_projects')
                .then(function(id){
                  console.log('id  : ',id)
                })
                .catch(function(err){
                  console.log('error!!!!',err)
                })
              })
            })
      })
      .then(function(inserts){
        console.log(inserts.length + ' rows saved ')
        return res.json({
          error:false,
          data:{
            inserts
          }
        })
      })
      .catch(function(err){
        return res.status(500).json({
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
