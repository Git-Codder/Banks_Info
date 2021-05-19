var bodyParser = require('body-parser'),
    express = require('express'),
    request = require('request'),
    app = express();
    
    app.use(express.static("public"));

    app.set('views', './views');
    app.set('view engine', 'ejs'); 
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    
    // array for table header
    var banksTitle = ['#', 'IFSC', 'Bank_id', 'Branch','Address', 'City', 'District', 'State'];

    // call router to connect database
    const pool = require('../Fyle_Chalange_Part_2/db');
    app.use(bodyParser.json());

    app.get("/", async(req,res) => {
        try {
            var ok = false;
            res.render("index.ejs",{ok : ok});
        } catch (err) {
            console.log(err.message);
        }
    });

    app.post("/", async(req,res,body) => {
        try {

            if(city == undefined){
                city = "Bangalore";
            }

            if(req.body.selected_city != undefined){
                var city = '%' + req.body.selected_city.toUpperCase() + '%';
            }else{
                var city = 'Bangalore';
            }


            if(req.body.selected_city != undefined){
                var limit = req.body.selected_limit;
            }else{
                var limit = 25;
            }

            if(req.body.selected_city != undefined){
                var offset = req.body.selected_offset;
            }else{
                var offset = 0;
            }
            
            const values = [ city, limit, offset];

            const data = await pool.query("SELECT * FROM branches WHERE branch LIKE $1 "
                                            + "or address LIKE $1 or city LIKE $1 or "
                                            + "district LIKE $1 or state LIKE $1"
                                            + "ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
                                            values);


            // var options = {
            //     method: 'GET',
            //     url: 'https://flye-backend-avikant.herokuapp.com/api/branches?q='+ city + '&limit=' + limit + '&offset=' + offset
            //     // url: 'https://flye-backend-avikant.herokuapp.com/api/branches/autocomplete?q=bangalore&limit=5&offset=1'
            // };

            // console.log(options.url);
            // request(options,async(err,res,body) => {
            //     try {
            //         var ok = true;
            //         console.log(body);
            //         res.render("index.ejs",{banksData: body, banksTitle: banksTitle, ok : ok});
            //     } catch (err) {
            //         console.log(err.message);
            //         res.render("index.ejs");
            //     }
            // });

            // console.log(data);
            var banksData = data.rows;
            // console.log(banksData);
            res.render("index.ejs",{banksData: banksData, banksTitle: banksTitle, ok : true});

        } catch (err) {
            console.log(err.message);
        }
    });
    
// server listening 
app.listen(3000, function () {
    console.log("App listening on port 3000!");
    });











    //     <table class="table table-hover" style=" width: 66%; margin-top: 2%; margin-left: 15%; margin-left: 15%; position: relative; " >
    //         <thead class="thead-dark">
    //         <tr>
    //             <% banksTitle.forEach(element => { %>
    //                 <th scope="col"><%= element %> </th>
    //             <%  }); %>
        
    //         </tr>
    //         </thead>

    //         <tbody>
    //             <% var cnt = 1; %> 
    //             <% banksData.forEach(data => { %>
    //                 <tr>
    //                     <th scope="row"><%= cnt %> </th>
    //                     <td> <%= data.ifsc %> </td>
    //                     <td> <%= data.bank_id %> </td>
    //                     <td> <%= data.branch %> </td>
    //                     <td> <%= data.address %> </td>
    //                     <td> <%= data.city %> </td>
    //                     <td> <%= data.district %> </td>
    //                     <td> <%= data.state %> </td>
                        
    //                 </tr>
    //             <%  cnt++; }); %>
    //         </tbody>

    //     </table>