const express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
require('dotenv').config()

//db dependencies
//knex is SQL Query builder
const kenx = require("knex");
const db = require('./query');
const { Client } = require('pg');
const assert = require('assert');

var AccountRoutes = require('./controllers/account_controller');
var ancRoutes = require('./controllers/announcement_controller');
var qrRoutes = require('./controllers/qr_controller');
var inRoutes = require('./controllers/incident_controller');
const { MemoryStore } = require('express-session');

var port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// The session we will store in client’s browser cookies is encrypted using our session secret and only our web application which knows the session secret can read the session which we will create to store the current logged in user’s email address.

app.use(session({
    resave: false, 
    saveUninitialized: true, 
    secret: 'aF,.j)wBhq+E9n#aHHZ91Ba!VaoMfC', 
    store: new MemoryStore(),
    cookie: { 
      maxAge:  Date.now() + (30 * 86400 * 1000) ,
      expires:  Date.now() + (30 * 86400 * 1000) 
    }
  }));

app.use('/', AccountRoutes.AccountRoutes);
app.use('/',ancRoutes.ancRoutes);
app.use('/',qrRoutes.qrRoutes);
app.use('/',inRoutes.inRoutes);

var listener = app.listen(port, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 5000
});

