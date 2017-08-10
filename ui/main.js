//Counter Code
var button = document.getElementById('counter');
button.onclick = function() {

//create a request to counter endpoint

var request = new XMLHttpRequest();
request.onreadystatechange = function () {
if(request.readyState === XMLHttpRequest.DONE)
{
    if(httpRequest.status===200)
    {
        var counter = request.responseText;
        console.log(counter);
        var span = document.getElementById('count');
        span.innerHTML = counter;
    }
}
    //not yet done - no action reqd
    };
    
    //make a request
    request.open('GET','http://chinmoyeedash31.imad.hasura-app.io/counter',true);
    request.send(null);

};

// Submit name

var submitbtn = document.getElementById('submitbtn'); 
submitbtn.onclick = function () {
    // Make a request to the server and send the name
    // Capture a list of names and render it as a list
    
   /* var names = ['name1','name2','name3','name4'];
    var list ='';
    for (var i=0; i< names.length; i++) {
        list += '<li>' + names[i] + '</li>';
    }
    var ul = document.getElementById('namelist');
    ul.innerHTML = list;*/
    
    var request=new XMLHttpRequest();
    request.onreadystatechange=function() {
    if (request.readyState===XMLHttpRequest.DONE) {
        if (request.status===200) {
            var names=JSON.parse(request.responseText);
             console.log(names);
            var list='';
            for(var i=0;i<names.length;i++){
                list=list + '<li>'+names[i]+'</li>';
                
            }
            console.log(list);
            var ul = document.getElementById('namelist');
            ul.innerHTML = list;
        }
    }
    };
    
    var nameInput = document.getElementById('nameinput');
var newname = nameInput.value;
console.log('newname :'+newname);
    request.open('GET','http://chinmoyeedash31.imad.hasura-app.io/submitbtn?name='+newname,true);
    request.send(null);
};

var myimg= document.getElementById('myimg');

var marginLeft = 0;
function moveRight()
{
    marginLeft = marginLeft + 10;
    var marg=marginLeft + 'px';
    console.log(marg);
    myimg.style.marginLeft = marg ;
}
myimg.onclick = function()
{
var interval= setInterval(moveRight,100);

};
        
