const express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

var AccountRoutes = require('./controllers/account_controller');

var port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// The session we will store in client’s browser cookies is encrypted using our session secret and only our web application which knows the session secret can read the session which we will create to store the current logged in user’s email address.

app.use(session({
    resave: false, 
    saveUninitialized: true, 
    secret: 'aF,.j)wBhq+E9n#aHHZ91Ba!VaoMfC', 
    cookie: { maxAge: 60 * 1000 }
  }));

app.use('/', AccountRoutes.AccountRoutes);

var listener = app.listen(5000, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 5000
});