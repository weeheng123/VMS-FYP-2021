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

inRoutes.post('/app/incident', upload.single(req.files.picture), async(req,res) => {
    models.qrentry.create({
        title: req.title,
        description: req.description,
        status: req.status,
        picture: req.files.picture,
        name: req.name,
        unit: req.unit
    })
    // const {data} = req.files.picture; 
    // await kenx.insert({
    //     title: req.body.title, 
    //     description: req.body.description, 
    //     name: req.body.name,
    //     unit: req.body.unit,
    //     status: "Pending",
    //     picture:data, 
    // }).into("incident")
    const response={
        title: req.body.title
    }  
    res.status(200).send(JSON.stringify(response))
})

module.exports = {"inRoutes" : inRoutes};