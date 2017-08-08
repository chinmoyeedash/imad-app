var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;

var config = {
    user: 'chinmoyeedash31',
    database: 'chinmoyeedash31',
    host: '/db.imad.hasura-app.io',
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
  pool.query('select * from User',function(err,result) {
      if (err) {
         console.log(err.toString());
         res.status(500).send(err.toString());
      }
      else {
          console.log(result);
          res.send(JSON.stringify(result));
      }
    });
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
var counter=1;
app.get('/counter',function (req,res) {
    counter++;
    res.send(counter.toString());
    
});

app.get('/submitbtn', function (req, res) {
    console.log('IMAD submit test');
    //submit name
    var nameInput = doc.getElementById('name');
    var name = nameInput.value;
    var submitbtn = doc.getElementById('submit_btn');
    submitbtn.onclick = function () {
    //make a request to the server
    
    //capture a list of names and render it as a list
    var names = ['name1','name2','name3'];
    var list = '';
    for(var i=0;i< names.length; i++)
    {
        list +='<li>' + names[i] + '</li>';
    }
     var ul = document.getElementById('namelist');
     ul.innerHTML = list;
};
}
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
