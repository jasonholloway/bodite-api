var argv = require('optimist').argv;
var ApiServer = require('./ApiServer');

var server = new ApiServer();


var port = process.env.PORT || 443;


if(argv.dumpUsers) {
    console.log('ta-da');
}

server.listen(port);

console.log('API available on port ' + port);