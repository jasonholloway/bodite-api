var app = require('./server');

var port = process.env.port || 8691;

app.listen(port);

console.log('API available on port ' + port);