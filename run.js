var serverFactory = require('./server');

var server = serverFactory();


var port = process.env.API_PORT || 8691;

server.listen(port);

console.log('API available on port ' + port);