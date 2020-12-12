const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "weeheng123",
    database: "vmsuser_database",
    host: "localhost",
    port:5432
});

module.exports = pool;