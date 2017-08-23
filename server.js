var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;

var config = {
    user: 'chinmoyeedash31',
    database: 'chinmoyeedash31',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool=new Pool(config);
console.log(pool);
app.get('/dbtest', function (req, res) {
console.log('IMAD test');
  pool.query('select * from articles',function(err,result) {
      if (err) {
         //console.log(err.toString());
         res.status(500).send(err.toString());
      }
      else {
          //console.log('result='+result);
          res.send(JSON.stringify(result));
      }
    });
});
app.get('/favicon.ico', function (req, res) {
console.log('IMAD searching for favicon');
  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));

});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
var counter=0;
app.get('/counter',function (req,res) {
   
    counter++;
 console.log('IMAD counter test'+counter);
    res.send(counter.toString());
    
});
var names=[];
app.get('/submitbtn', function (req, res) {
    console.log('IMAD submit test');
    var newname=req.query.name;
    names.push(newname);
    res.send(JSON.stringify(names));
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
