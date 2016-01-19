var expect = require('chai').expect;
var agent = require('supertest');
var proxyquire = require('proxyquire');
var DummyStrategy = require('passport-dummy').Strategy;


var fakeKeys = {
    key1: '124fdqwf',
    key2: 'asdsadk324'
}

var createServer = proxyquire('../server', 
                        { 
                            './keySource': { 
                                getKeys: function() {                             
                                    return Promise.resolve(fakeKeys);
                                } 
                            }
                        });
                        
var app;


function useDummyAuth(a) {
    a.passport.use('bearer', new DummyStrategy(
        function(done) {
            return done(null, {username: 'dummy'});
        }
    ));
}


beforeEach(function() {        
    app = createServer();
});

describe('key endpoint', function() {
    var keysUrl = '/api/keys';
            

    it('is exposed', function(cb) {
        useDummyAuth(app);
        
        agent(app)
        .get(keysUrl)
        .expect(function(r) {       
            expect(r.status).to.not.equal(404);
        })
        .end(cb);
    });


    it('returns key collection', function(cb) {
        useDummyAuth(app);
        
        agent(app)
        .get(keysUrl)
        .set('Accepts', 'application/json')
        .expect(200)
        .expect(fakeKeys)
        .end(cb);         
    });
    
    
    it('rejects without token', function(cb) {
        agent(app)
        .get(keysUrl)
        .expect(401)
        .end(cb);
    });
    
    
    it.skip('accepts with token', function(cb) {
        agent(app)
        .get(keysUrl)
        .set('Token', '12345678')
        .expect(200)
        .end(cb);
    });


});


