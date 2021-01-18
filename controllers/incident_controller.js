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


var inRoutes = express.Router();
//Change from express.Router() to express();

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

qrRoutes.post('/app/incident', function(req,res){
    models.qrentry.create({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        picture: req.body.picture,
        name: req.body.name,
        unit: req.body.unit
    })
    const response={
        name: req.body.title
    }  
    res.status(200).send(JSON.stringify(response))
})

module.exports = {"inRoutes" : inRoutes};