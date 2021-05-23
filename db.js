const Pool  = require('pg').Pool;
require('dotenv/config');

// create a client to handle the request of user related to database
const pool = new Pool({
    user: "postgres",
    password: process.env.PASSWORD,
    database: "fyle",
    host: "localhost",
    port: 5432
});

module.exports  = pool;