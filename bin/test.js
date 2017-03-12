var http = require('http');
var server = http.createServer(function(request, response) {
  response.writeHead(200,{"Content-Type":"text/plain"});
  responses.end('hello');

});
server.listen(3000);
console.log('server running');
//https://www.youtube.com/watch?v=N3vgozk66dI
