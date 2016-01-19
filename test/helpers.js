process.env.JWT_SECRET = 'Large otter';


var proxyquire = require('proxyquire').noPreserveCache();

function buildApp(fakes) {
    var fac = proxyquire('../server', fakes || {});                            
    return fac();
}

module.exports.buildApp = buildApp;

