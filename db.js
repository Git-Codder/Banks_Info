const Pool  = require('pg').Pool;

// create a client to handle the request of user related to database
const pool = new Pool({
    user: "postgres",
    password: "myPassword",
    database: "fyle",
    host: "localhost",
    port: 5432
});

module.exports  = pool;