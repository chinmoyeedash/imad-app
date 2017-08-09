//Counter Code
var button = document.getElementById('counter');
var counter = 0;

button.onclick = function() {

//create a request to counter endpoint

var request = new XMLHttpRequest();
request.onreadystatechange = function () {
if(request.readystate === XMLHttpRequest.DONE)
{
if(request.status===200)
{
var counter = request.responseText;
var span = document.getElementById('count');
span.innerHTML = counter.toString();
}
}
//not yet done - no action reqd
};

//make a request
request.open('GET','http://chinmoyeedash31.imad.hasura-app.io/counter',true);
request.send(null);

};

