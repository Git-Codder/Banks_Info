var bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request'),
    app = express();

    // call router to connect database
    const pool = require('../Fyle_Chalange/db');

    app.use(bodyParser.json());

    // API call to get the all bank detail of particular branch along with limit and offset value
    app.get("/api/branches/autocomplete", async(req,res) => {
        try {

            var rqData = {
                branch: '%' + req.query.q.toUpperCase() + '%',
                limit:  req.query.limit,
                offset: req.query.offset
            };

            const values = [ rqData.branch, rqData.limit, rqData.offset];

            const data = await pool.query("SELECT * FROM branches WHERE branch LIKE $1" 
                                          + "ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
                                            values);

            res.json(data.rows);

        } catch (err) {
           console.log(err.message); 
        }
    });


    // API call to get the all branches in a particular city along with limit and offset value
    app.get("/api/branches", async(req,res) => {
        try {

            var rqData = {
                city  : '%' + req.query.q.toUpperCase() + '%',
                limit :  req.query.limit,
                offset: req.query.offset
            };

            const values = [ rqData.city, rqData.limit, rqData.offset];

            const data = await pool.query("SELECT * FROM branches WHERE branch LIKE $1 "
                                            + "or address LIKE $1 or city LIKE $1 or "
                                            + "district LIKE $1 or state LIKE $1"
                                            + "ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
                                            values);

            res.json(data.rows);

        } catch (err) {
           console.log(err.message); 
        }
    });


// server listening 
app.listen(3000, function () {
    console.log("App listening on port 3000!");
    });