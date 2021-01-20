var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
var kenx = require('knex');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const user = require('../models/user');
const methodOverride = require('method-override');
const { Result } = require('express-validator');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const Knex = require('knex');


var inRoutes = express.Router();
//Change from express.Router() to express();
const upload = multer()

inRoutes.use(fileUpload());

inRoutes.use(bodyParser.json()) // for parsing application/json
inRoutes.use(bodyParser.urlencoded({ extended: true }))
inRoutes.use(methodOverride('_method'));

const client = kenx({
    client: "pg",
    connection: {
    connectionString: process.env.DATABASE_URL
    },
    dialectOptions: {
        ssl: {
          require: true,
          // Ref.: https://github.com/brianc/node-postgres/issues/2009
          rejectUnauthorized: false,
        },
      }
});

inRoutes.post('/app/incident', function(req,res) {
    models.incident.create({
        title: req.body.title,
        description: req.body.description,
        status: "Pending",
        name: req.body.name,
        unit: req.body.unit
    })
    const response={
        title: req.body.title,
        id: req.body.id,
        name: req.body.name
    }  
    res.status(200).send(JSON.stringify(response))
})

inRoutes.get('/app/incident/reported', function(req, res){
    client.select("*").from("incidents").then(data => {
    res.status(200).send(JSON.stringify({incident:data}));
    }).catch(err => res.status(400).json(err));
})

inRoutes.put('/app/incident/status', function(req,res){
    client('incidents').where({id: req.body.id}).update(req.body).returning('status').then(data =>{
        res.status(200).send(JSON.stringify({incident:data}));
        console.log({incident:data})
    })
})

inRoutes.get('/app/incident/get', function(req,res){
    client('incidents').select("*").where({username: req.body.username}).then(data =>{
        res.status(200).send(JSON.stringify({incident:data}));
        console.log({incident:data})
    })
})

module.exports = {"inRoutes" : inRoutes};