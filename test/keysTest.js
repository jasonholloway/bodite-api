var expect = require('chai').expect;
var agent = require('supertest');
var sinon = require('sinon');
var helpers = require('./helpers');
var buildApp = helpers.buildApp;

var jwt = require('jsonwebtoken');

var DummyStrategy = require('passport-dummy').Strategy;



function useDummyAuth(a) {
    a.passport.use('bearer', new DummyStrategy(
        function(done) {            
            return done(null, {username: 'dummy'});
        }
    ));
}



describe('key endpoint', function() {
    var keysUrl = '/api/keys';
            

    it('is exposed', function(cb) {        
        var app = buildApp();        
        useDummyAuth(app);
        
        agent(app)
        .get(keysUrl)
        .expect(function(r) {       
            expect(r.status).to.not.equal(404);
        })
        .end(cb);
    });


    it('returns key collection', function(cb) {        
        var fakeKeys = {
            key1: '124fdqwf',
            key2: 'asdsadk324'
        }
        
        var app = buildApp({
            './keySource': { getKeys: sinon.stub().returns(Promise.resolve(fakeKeys)) }
        });
        
        useDummyAuth(app);
        
        agent(app)
        .get(keysUrl)
        .set('Accepts', 'application/json')
        .expect(200)
        .expect(fakeKeys)
        .end(cb);         
    });
    
    
    it('rejects without token', function(cb) {
        var app = buildApp();
        
        agent(app)
        .get(keysUrl)
        .expect(401)
        .end(cb);
    });
    
    
    it('accepts token and returns happy', function(cb) {
        var app = buildApp({
            './keySource': { getKeys: sinon.stub().returns(Promise.resolve({})) }
        });
        
        var token = jwt.sign({ 
                            user: { name: 'Brian' }, 
                            created: Date.now() 
                        }, app.jwtSecret);
        
        agent(app)
        .get(keysUrl)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(cb);
    });
    
    
    it('respects live token', function(cb) {
        var app = buildApp({
            './keySource': { getKeys: sinon.stub().returns(Promise.resolve({})) }
        });
        
        var token = jwt.sign({ 
                        user: { name: 'Brian' },
                        created: Date.now() 
                    }, app.jwtSecret);
        
        agent(app)
        .get(keysUrl)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(e) {
            if(e) cb(e);
        });
        
        agent(app)
        .get(keysUrl)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(cb);
    });


    it('rejects dead token', function(cb) {
        var app = buildApp({
            './keySource': { getKeys: sinon.stub().returns(Promise.resolve({})) }
        });
        
        var token = jwt.sign({ 
                        user: { name: 'Brian' },
                        created: Date.now() 
                    }, app.jwtSecret);
        
        agent(app)
        .get(keysUrl)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)        
        .expect(function(r) {
            app.jwtLifetime = 0;
                        
            agent(app)
            .get(keysUrl)
            .set('Authorization', 'Bearer ' + token)
            .expect(401)
            .end(cb);
        })                
        .end(function(e) {
            if(e) cb(e);
        });
    });



});


