var http = require('http');
var server = http.createServer(function(request, response) {
  response.writeHead(200,{"Content-Type":"text/plain"});
  response.end('hello');

});
server.listen(3000);
console.log('server running');
