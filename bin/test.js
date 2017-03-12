var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node.js\n');
}).listen(8124, "127.0.0.1");
console.log('Server running at http://52.7.166.211:8124/');

//https://howtonode.org/how-to-install-nodejs
//https://www.youtube.com/watch?v=N3vgozk66dI
