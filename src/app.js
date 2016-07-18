//alles nog veranderen 
var express = require ("express");
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );      
app.use( bodyParser.urlencoded({    
	extended: true
})); 
app.use(express.static('./static'));


//var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
var connectionString = "postgres://postgres:ww@localhost/bulletinboard"; //moet nog veranderd worden
pg.connect(connectionString, function (err, client, done) {
	client.query('select * from bericht', function (err, result) { // moet nog veranderd worden
		//console.log(result.rows);

		done();
		pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
	});
});

app.set ("views", "src/views");
app.set ("view engine","jade");

app.get("/", function (req,res){
      res.render("index");
  });

app.post("/",function (request,response){
	var bodymessage = request.body.body;
        var titlemessage = request.body.title
    	pg.connect(connectionString, function (err, client, done) {
            client.query('insert into bericht (title,body) values ($1,$2)', [titlemessage,bodymessage], function (err) {
		if(err) {
			throw err;	
		}
		done();
		pg.end();   
                response.redirect("/end")
              });
	});
})

app.get('/end', function (request, response){
	pg.connect(connectionString, function (err, client) {
	client.query('select * from bericht', function(err, result) { 
            if(err){
                throw err;
            }
            
		response.render ("end", {
			bericht: result.rows
		})
	});
});
});

var server = app.listen(3000 , function (){
    
        console.log("example app listening on port : " + server.address().port)
})
