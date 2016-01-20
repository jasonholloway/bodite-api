var expect = require('chai').expect;
var agent = require('supertest');
var sinon = require('sinon');
var jwt = require('jsonwebtoken');
var helpers = require('./helpers');
var buildApp = helpers.buildApp;


describe('login endpoint', function() {       
    var loginUrl = '/api/login';
    
    it('is exposed', function(cb) {
        var app = buildApp({
            './userVerifier': { verifyUser: sinon.stub().returns(Promise.resolve({})) }
        });
        
        agent(app)
        .post(loginUrl)
        .expect(function(r) {
            expect(r.status).to.not.equal(404);
        })
        .end(cb);            
    });
            
            
    it('checks against userSource and returns token', function(cb) {        
        var verifySpy = sinon.stub().returns(Promise.resolve({ name: 'Jason' }));
                
        var app = buildApp({
            './userVerifier' : { verifyUser: verifySpy }
        });
        
        agent(app)
        .post(loginUrl)
        .send({ name: 'jason', password: 'tralalala' })        
        .expect(function(r) {
            expect(verifySpy.calledOnce).to.be.true;        
            expect(verifySpy.calledWith('jason', 'tralalala')).to.be.true;
        })
        .end(cb);
    });
            
    
    it('requests token from tokenSource, which is then returned', function(cb) {        
        var app = buildApp({
            './userVerifier' : { verifyUser: sinon.stub().returns(Promise.resolve({ name: 'Humbert' })) },
        });
        
        agent(app)
        .post(loginUrl)
        .send({ name: '', password: '' })
        .expect(function(r) {            
            var data = jwt.verify(r.body.token, app.jwtSecret);
            
            expect(data.user.name).to.equal('Humbert');            
        })
        .end(cb);
    })
    
    
    it('bad credentials incur 401 rejection', function(cb) {        
        var app = buildApp({
            './userVerifier' : { verifyUser: sinon.stub().returns(Promise.resolve(false)) }
        });
        
        agent(app)
        .post(loginUrl)
        .send({ name: 'Penelope', password: 'trout99' })
        .expect(401)
        .end(cb);
    })
    
    
});
