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


    app.use(function (req, res, next) {
        /*var err = new Error('Not Found');
         err.status = 404;
         next(err);*/
      
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
      
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
      
      //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      
        // Pass to next layer of middleware
        next();
    });
    
    app.use('/', express.static(path.join(__dirname, '/')))
    app.use('/views', express.static(path.join(__dirname, '/views')))
    app.use(bodyParser.json());

    app.get("/", async(req,res) => {
        try {
            res.render("index.ejs");
        } catch (err) {
            console.log(err.message);
        }
    });
 
// server listening 
app.listen(process.env.PORT || 5000,process.env.IP,function(){
    console.log("App is listening Now....!");
});

