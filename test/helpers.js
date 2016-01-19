process.env.JWT_SECRET = 'Large otter';
process.env.JWT_LIFETIME = 100000000000; //2hr 46m

var proxyquire = require('proxyquire').noPreserveCache();

function buildApp(fakes) {
    var fac = proxyquire('../server', fakes || {});                            
    return fac();
}

module.exports.buildApp = buildApp;

