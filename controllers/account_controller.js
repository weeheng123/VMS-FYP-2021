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


var accountRoutes = express();
//Change from express.Router() to express();

// let users = [];

accountRoutes.use(bodyParser.json()) // for parsing application/json
accountRoutes.use(bodyParser.urlencoded({ extended: true }))
accountRoutes.use(methodOverride('_method'));

accountRoutes.get('/login', function(req, res){
    if (req.session.username){
        res.redirect('/register');
    }
    else{
    res.render('account/login', {loginErrors: 'Welcome to Cisco Security VMS'});
    }
}); 

accountRoutes.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
})

// accountRoutes.get('/register', function(req, res){
//     res.render('account/register', {errors: ""});
// });

//when using local
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

//when using production
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

//Query database and res.render data onto register.ejs
accountRoutes.get('/register', function(req, res){
    if (req.session.username){
        client.select("*").from("users").then(data => {
        res.render("account/register.ejs", {users: data});
        }).catch(err => res.status(400).json(err));
    }
    else{
        res.redirect('/login');
    }
})

//Query database and DELETE data from database
accountRoutes.delete("/user/delete/:id", (req, res) => {
    client.select("*").from("users").where( { id: req.params.id }).del().then(function(){
        res.redirect('/register');
    });
})

accountRoutes.post('/register', function(req,res){
    var matched_users_promise = models.user.findAll({
        where: Sequelize.or(
            {username: req.body.username},
        )
    });
    matched_users_promise.then(function(users){
        if(users.length == 0){
            const passwordHash = 
            bcrypt.hashSync(req.body.password, 10);
            models.user.create({
                username: req.body.username,
                password: passwordHash,
                unit: req.body.unit,
                ic: req.body.ic,
                role: req.body.role
            }).then(function(){
                res.redirect('/register');
            });
        }
        else{
            res.render('account/register',{errors: "Username already in use"});
        }
    })
});


accountRoutes.post('/login', function(req,res){
    var matched_users_promise = models.management.findAll({
        where: Sequelize.and(
            {username: req.body.username},
        )
    });
    matched_users_promise.then(function(users){
        if(users.length > 0){
            let user = users[0];
            let passwordHash = user.password;
            if(bcrypt.compareSync(req.body.password, passwordHash)){
                req.session.username = req.body.username;
                res.redirect('/register');
            }
            else{
                res.redirect('/register');
            }
        }
        else{
            res.render('account/login',{loginErrors: 'Error: Username or Password not found'});
            // console.log(error);
        }
    });
});

accountRoutes.post('/app/login', function(req,res){
    var matched_users_promise = models.user.findAll({
        where: Sequelize.and(
            {username: req.body.username},
        )
    });
    matched_users_promise.then(function(users){
        if(users.length > 0){
            let user = users[0];
            let passwordHash = user.password;
            const userArray ;
            if(bcrypt.compareSync(req.body.password, passwordHash)){
                client.select("role","username").from("users").where( { username: req.body.username }).then(data =>{
                    res.status(200).send(JSON.stringify({users:data})
                    console.log({users:data});
                })
                // console.log(rolequery.role);
                // res.status(200).send(JSON.stringify(objToSend))
            }
            else{
                res.status(404).send();
            }
        }
        else{
           res.status(404).send();
            
        }
    });
});
    
module.exports = {
    "AccountRoutes" : accountRoutes,
    client
};