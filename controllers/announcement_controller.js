var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var models = require('../models');
var Sequelize = require('sequelize');

var ancRoutes = express.Router();

ancRoutes.get('/announcement', function(req, res){
    res.render('announcement/announcement.ejs', {errors: ""});
});

ancRoutes.post('/announcement', function(req,res){
            models.announcement.create({
                title: req.body.title,
                description: req.body.description
            }).then(function(){
                res.redirect('/announcement.ejs');
            });
});


module.exports = {"ancRoutes" : ancRoutes};


