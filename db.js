const Pool = require("pg").Pool

const pool = new Pool({
    user: "vms",
    password: "vms",
    database: "vmsnode_development",
    host: "localhost",
    port:5432
});

// pool.query("SELECT * from users", (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

module.exports = pool;