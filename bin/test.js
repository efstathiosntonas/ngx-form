var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
});

var server = app.listen(3000, function(){
  console.log('Magic is happening on port 3000')
});



//https://howtonode.org/how-to-install-nodejs
//https://www.youtube.com/watch?v=N3vgozk66dI
