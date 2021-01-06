var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var models = require('../models');
var Sequelize = require('sequelize');
const accontroller = require('./account_controller')
const kenx = require('knex');

var ancRoutes = express.Router();

// const client = kenx({
//     client: "pg",
//     connection: {
//     user: "vms",
//     password: "vms",
//     database: "vmsnode_development",
//     host: "localhost",
//     port:5432
//     }
// });

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


ancRoutes.get('/announcement', function(req, res){
    if (req.session.username){
        client.select("*").from("announcements").then(data => {
        res.render("announcement/announcement.ejs", {announcements  : data});
        console.log("Success");
        }).catch(err => res.status(400).json(err));
    }
    else{
        res.redirect('/login');
    }
})

ancRoutes.post('/announcement', function(req,res){
            models.announcement.create({
                title: req.body.title,
                description: req.body.description
            }).then(function(){
                res.redirect('/announcement');
            });
});

ancRoutes.delete("/anc/delete/:id", (req, res) => {
    client.select("*").from("announcements").where( { id: req.params.id }).del().then(function(){
        res.redirect('/announcement');
    });
})

module.exports = {"ancRoutes" : ancRoutes};


