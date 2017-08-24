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
  pool.query('select * from test',function(err,result) {
      if (err) {
         //console.log(err.toString());
         res.status(500).send(err.toString());
      }
      else {
          //console.log('result='+result);
          res.send(JSON.stringify(result.rows));
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
/*var articles = {
    'article-one': {
        title: 'One',
        heading: '--One--',
        date: '9-dec-17',
        content:`<p>
                  This is the content of my first article.
                </p>`
        
    },
    'article-two': {
        title: 'Two',
        heading: 'Two',
        date: '2-jan-16',
        content:`<p>
                  This is the content of my second article.
                </p>`},
    'article-three': {
        title: 'Three',
        heading: 'Three',
        date: '21-Aug-17',
        content:`<p>
                  This is the content of my third article.
                </p>`}
};*/

//server side templating
function createTemplate (data){
    var title= data.title;
    var heading= data.heading;
    var date= data.date;
    var content= data.content;
    console.log(content);
    
    var htmlTemplate=`
        <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
           <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                
                <hr>
                
                <div>
                    <h3>
                    ${heading}
                    </h3>
                </div>
                
                <div>
                    ${date}
                </div>
                
                <div>
                    ${content}
                </div>
           </div>
        </body>
        </html>
    `;
    return htmlTemplate;
}

app.get('/:articleName', function (req, res){
    
    var articleName = req.params.articleName;
    //res.header('Content-Type', 'text/html');
    //res.send(createTemplate(articles[articleName]));
    
    //very wrong way as it can easily lead to sql injection .. where user puts his own string which we are directly putting in our query.
    
    //eg:type this in place of articleone in the browser and u can check it deletes content from ur table ..(dangerous)   
    //';delete from "articles" where 'a'='a 
    //pool.query("select * from articles where title= '"+articleName+"'",function(err,result) {
        
    //important to do parameterisation to avoid sql injection
    //
     pool.query("select * from articles where title= $1",[articleName],function(err,result) {
   
      if (err) {
         //console.log(err.toString());
         res.status(500).send(err.toString());
      }
      else {
          if (result.rows.length===0){
              res.status(404).send("article not found");
          }
          var article=result.rows[0];
          //console.log('result='+result);
          res.send(createTemplate(article));
      }
    });

    
    
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
