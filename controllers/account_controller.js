var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

var accountRoutes = express.Router();

accountRoutes.get('/login', function(req, res){
    res.render('account/login');
}); 

accountRoutes.get('/register', function(req, res){
    res.render('account/register', {errors: ""});
});

accountRoutes.post('/register', function(req,res){
    var matched_users_promise = models.User.findAll({
        where: Sequelize.or(
            {username: req.body.username},   
        )
    });
    matched_users_promise.then(function(users){
        if(users.length == 0){
            const passwordHash = 
            bcrypt.hashSync(req.body.password, 10);
            models.User.create({
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
    var matched_users_promise = models.User.findAll({
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
                res.redirect('/');
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