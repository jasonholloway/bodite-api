process.env.JWT_SECRET = 'Large otter';
process.env.JWT_LIFETIME = 100000000000; //2hr 46m
process.env.API_KEYS = JSON.stringify({ S3: 'asdlkjlksjad', CloudAnt: 'lkjlksdjoioi' });
process.env.API_USERS = JSON.stringify([{ name: 'Jason', passwordHash: 'asdasdasd', passwordSalt: 'asda' }]);

var proxyquire = require('proxyquire').noPreserveCache();

function buildApp(fakes) {
    var fac = proxyquire('../server', fakes || {});                            
    return fac();
}

module.exports.buildApp = buildApp;

