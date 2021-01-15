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


var qrRoutes = express.Router();
//Change from express.Router() to express();

qrRoutes.use(bodyParser.json()) // for parsing application/json
qrRoutes.use(bodyParser.urlencoded({ extended: true }))
qrRoutes.use(methodOverride('_method'));

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

qrRoutes.post('/app/qr', function(req,res){
    client.select("ic").from("qrentries").where({ic: req.body.ic}).whereNull("checkout").then(data=>{
        if(data.length > 0){
            res.status(400).send({data});
        }
        else{
                models.qrentry.create({
                    name: req.body.name,
                    ic: req.body.ic,
                    address: req.body.address,
                    oriname: req.body.oriname,
                    oriic: req.body.oriic,
                    oriaddress: req.body.oriaddress,
                    qrimage: req.body.qrimage,
                    checkin: req.body.checkin,
                    checkout: req.body.checkout
         })
            const response={
                name: req.body.name
         }  
            res.status(200).send(JSON.stringify(response))
        }
    })
    // var matched_qr_promise = models.qrentry.findAll({
    //     where: Sequelize.or(
    //         {ic: req.body.ic},
    //     )
    // });
    // matched_qr_promise.then(function(checkout){ 
    //     if(checkout != "null")
    //     models.qrentry.create({
    //     name: req.body.name,
    //     ic: req.body.ic,
    //     address: req.body.address,
    //     oriname: req.body.oriname,
    //     oriic: req.body.oriic,
    //     oriaddress: req.body.oriaddress,
    //     qrimage: req.body.qrimage,
    //     checkin: req.body.checkin,
    //     checkout: req.body.checkout
    // })
    // const response={
    //     name: req.body.name
    // }
    // res.status(200).send(JSON.stringify(response))
    }
    );

qrRoutes.post('/app/qrstatus', function(req,res){
    client.select("id", "checkin").from("qrentries").where({ic: req.body.ic}).then(data =>{
        if(data.length>0){
            res.status(200).send(JSON.stringify({qrstatus:data}));
            console.log(data);
        }
        else{
            res.status(400).send();
        }
    })
})

qrRoutes.put('/app/checkin_out', function(req,res){
    client.select("id", "checkout").from("qrentries").where({id: req.body.id}).then(data =>{
    if(data.length>0){
            res.status(400).send();
    }
    else{
            client('qrentries').where({id: req.body.id}).update(req.body).returning('id').then(data =>{
            res.status(200).send(JSON.stringify({qrcheckin_out: data}));
            console.log(data);
        })
    }
})

module.exports = {"qrRoutes" : qrRoutes};