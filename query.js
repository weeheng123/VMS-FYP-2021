const Pool = require("pg").Pool
const express = require('express');
var app = express();
const pool = new Pool({
    user: "vms",
    password: "vms",
    database: "vmsnode_development",
    host: "localhost",
    port:5432
});

module.exports = pool;

