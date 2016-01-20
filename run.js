var args = require('minimist')(process.argv);
var ApiServer = require('./ApiServer');


var port = process.env.PORT || 443;


console.log(args);

if(args.dumpUsers) {
    var userSource = require('./userSource');
    
    userSource.getUsers()
    .then(function(users) {
        console.log('users: ' + JSON.stringify(users));
    });    
}


var server = new ApiServer();

server.listen(port);

console.log('API available on port ' + port);