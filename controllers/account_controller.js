var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
var kenx = require('knex');
const bcrypt = require('bcrypt');
const { Connection } = require('pg');

var accountRoutes = express();
//Change from express.Router() to express();

accountRoutes.get('/login', function(req, res){
    if (req.session.username){
        res.redirect('/register');
    }
    else{
    res.render('account/login');
    }
}); 

accountRoutes.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
})

// accountRoutes.get('/register', function(req, res){
//     res.render('account/register', {errors: ""});
// });

const client = kenx({
    client: "pg",
    connection: {
    user: "vms",
    password: "vms",
    database: "vmsnode_development",
    host: "localhost",
    port:5432
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
    var matched_users_promise = models.user.findAll({
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
            res.redirect('/login');
            console.log(error);
        }
    });
});
    
module.exports = {"AccountRoutes" : accountRoutes};