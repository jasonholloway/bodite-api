var expect = require('chai').expect;
var agent = require('supertest');
var proxyquire = require('proxyquire');
var passport = require('passport');
var DummyStrategy = require('passport-dummy').Strategy;


var fakeKeys = {
    key1: '124fdqwf',
    key2: 'asdsadk324'
}

var app = proxyquire('../server', 
            { 
                './keySource': { 
                    getKeys: function() {                             
                        return Promise.resolve(fakeKeys);
                    } 
                }
            });


describe('API', function() {


    beforeEach(function() {
        passport.use('bearer', new DummyStrategy(
            function(done) {
                return done(null, {username: 'dummy'});
            }
        ));
    });



    describe('key endpoint', function() {

        it('is exposed', function(cb) {
            agent(app)
            .get('/api/keys')
            .expect(function(r) {       
                expect(r.status).to.not.equal(404);
            })
            .end(cb);
        });


        it('returns key collection', function(cb) {
            agent(app)
            .get('/api/keys')
            .set('Accepts', 'application/json')
            .expect(200)
            .expect(fakeKeys)
            .end(cb);         
        });
        







        it.skip('rejects without token', function(cb) {
            agent(app)
            .get('api/keys')
            .expect(401)
            .end(cb);
        });
        
        it.skip('accepts with token', function(cb) {
            agent(app)
            .get('api/keys')
            .set('Accepts', 'application/json')
            .set('Token', '12345678')
            .expect(200)
            .end(cb);
        });

    });


    
})


