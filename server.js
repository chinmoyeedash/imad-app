var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto = require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');

var config = {
    user: 'chinmoyeedash31',
    database: 'chinmoyeedash31',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
//cookie set for a month, default secret value set

app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

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

function hash(input,salt){
    //Provides a synchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation. Digest algorithm applied to derive a key of the requested byte length (keylen) from the password, salt and iterations. If the digest algorithm is not specified, a default of 'sha1' is used.
    
    //hash evaluates to same value of same algo (eg. sha512), but hackers can maintain commonly hashed values of common strings used fpr a webapp then they can lookup table and can find out but now salt is used to  
 var key = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
console.log(key.toString('hex'));  // 'c5e478d...1469e50'
return ["pbkdf2","10000",salt,key.toString('hex')].join('$');
    
}

app.get('/hash/:input',function(req,res){
    var hashedString=hash(req.params.input,"SomeRandomString");
    res.send(hashedString);
});
//post request to test it ..need to use curl for testing purpose
 app.post('/register',function(req,res) {
     
     //from JSON request to look for these keys useranem and password inside body we use bodyParser
     
     var username=req.body.username;
     var password=req.body.password;
     
     //create random salt
     var salt=crypto.randomBytes(128).toString('hex');
     //hash the password with the salt
     var dbString=(hash(password,salt));
     //insert into db 
     pool.query('INSERT INTO "users"(username,password) VALUES($1,$2)',[username,dbString],function(err,result) {
         if (err) {
            //console.log(err.toString());
            res.status(500).send(err.toString());
        }
      else {
           res.send(JSON.parse('{"message":"user created successfully "}'));
        }
     });
});


app.post('/login',function(req,res) {
     //from JSON request to look for these keys useranem and password inside body we use bodyParser
     console.log("Ready to login");
     var username=req.body.username;
     var password=req.body.password;
     console.log("username="+username+"pwd="+password);
     pool.query('SELECT * FROM "users" where username=$1',[username],function(err,result){
         if (err) {
         //console.log(err.toString());
         res.status(500).send(err.toString());
      }
      else {
          if (result.rows.length===0){
               res.setHeader('Content-Type', 'application/json');
              res.status(403).send(JSON.parse('{"message":"username/password invalid"}'));
          }
          var dbString=result.rows[0].password;
          //split returna an array from line 55 "pbkdf2","10000",salt,key.toString('hex') and we need the 3rd value from that array
          var salt=dbString.split('$')[2];
          var hashedPassword=hash(password,salt); //hash of password from login page and original salt
          if (dbString===hashedPassword) {
              //set session before sending message
               // Set the session
               // req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
              res.setHeader('Content-Type', 'application/json');
                res.send(JSON.parse('{"message":"Credential Correct"}'));
              //res.status(200).send("Credentials are correct");
          } else {
              res.setHeader('Content-Type', 'application/json');
               
              res.status(403)(JSON.parse('{"message":"Invalid username/password"}'));
          }
      } 
     });
});

//to test if session is getting created properly
app.get('/check-login',function (req,res){
    //if req has session,session has auth and auth has userid in it
     if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout',function(req,res) {
   delete req.session.auth;
   req.send("Logged out");
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
/*
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
}*/
var articles = {
'article-one': {
title : 'Article one i kanth',
heading : 'Article one',
date : 'sep14,2017',
content : `
<p>
This is content of my first article. This is content of my first article. This is content of my first article.
This is content of my first article. This is content of my first article.
</p>
<p>
This is content of my first article. This is content of my first article. This is content of my first article.
This is content of my first article. This is content of my first article.
</p>
<p>
This is content of my first article. This is content of my first article. This is content of my first article.
This is content of my first article. This is content of my first article.
</p>`
},
'article-two' : {
title : 'Article two i kanth',
heading : 'Article two',
date : 'sep11,2017',
content : `
<p>
This is content of my second article.
</p>
`},
'article-three' : {
title : 'Article three i kanth',
heading : 'Article three',
date : 'sep9,2017',
content : `
<p>
This is content of my third article.
</p>
`}
};

function createTemplate(data){
    console.log("data="+data);
var title=data.title;
var date=data.date;
var heading=data.heading;
var content=data.content;
var htmlTemplate=
`<html>
<head>
<title>
${title}
</title>
<link href="/ui/style.css" rel="stylesheet" />
</head>
<body>
<div class = "container">
<div>
<a href="/">Home</a>
</div>
<hr/>
<h3>
${heading}
</h3>
<div>
${date}
</div>
<div>
${content}
</div>
</div>
</body>
</html>`;
return htmlTemplate;

}

app.get('/:articleName', function (req, res){
    
    var articleName = req.params.articleName;
    //res.header('Content-Type', 'text/html');
    console.log("name="+articleName+"array="+articles[articleName]);
    res.send(createTemplate(articles[articleName]));
    
    //very wrong way as it can easily lead to sql injection .. where user puts his own string which we are directly putting in our query.
    
    //eg:type this in place of articleone in the browser and u can check it deletes content from ur table ..(dangerous)   
    //';delete from "articles" where 'a'='a 
    //pool.query("select * from articles where title= '"+articleName+"'",function(err,result) {
        
    //important to do parameterisation to avoid sql injection
    //
   /*  pool.query("select * from articles where title= $1",[articleName],function(err,result) {
   
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
    });*/

    
    
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
