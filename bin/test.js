var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node.js\n');
}).listen(8124, "52.7.166.211/");
console.log('Server running at http://http://52.7.166.211/');
