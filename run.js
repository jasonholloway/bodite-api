var serverFactory = require('./server');

var server = serverFactory();


var port = process.env.PORT || 443;

server.listen(port);

console.log('API available on port ' + port);