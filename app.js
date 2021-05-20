var bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request'),
    path  = require('path'),
    app = express();
    
    app.use(express.static("public"));

    app.set('views', './views');
    app.set('view engine', 'ejs'); 
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    
    app.use('/views', express.static(path.join(__dirname, '/views')))
    app.use(bodyParser.json());

    app.get("/", async(req,res) => {
        try {
            var url = 'http://localhost:5000/api/branches?q=';
            res.render("index.ejs");
        } catch (err) {
            console.log(err.message);
        }
    });

    
// server listening 
app.listen(3000, function () {
    console.log("App listening on port 3000!");
    });

