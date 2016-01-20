var expect = require('chai').expect;
var agent = require('supertest');
var sinon = require('sinon');
var helpers = require('./helpers');
var proxyquire = require('proxyquire').noPreserveCache();


function buildVerifier(mocks) {
    var subject = proxyquire('../userVerifier', mocks || {});
    return subject;
}



var buildApp = helpers.buildApp;

describe('userVerifier', function() {
   
    it('returns null when user not found', function(cb) {
       var verifier = buildVerifier({ './userSource': { findUser: sinon.stub().returns(Promise.resolve(null)) }});
       
       verifier.verifyUser('Jason', 'wibblewibble')
                .then(function(user) {
                    expect(user).to.be.null;
                    cb();
                })
                .catch(cb); 
    });
   
   
    it('returns null when user found but not verified', function(cb) {             
       var user = { name: 'Jason', passwordHash: 'awdwdwd', passwordSalt: 'powrjr' };
       
       var verifier = buildVerifier({ './userSource': { findUser: sinon.stub().returns(Promise.resolve(user)) }});
       
       verifier.verifyUser('Jason', 'clapclapclap')
                .then(function(user) {                    
                    expect(user).to.be.null;                    
                    cb();
                })
                .catch(cb);
    });
   
   
   
    it('returns user when found and verified', function(cb) {        
        
       var user = { name: 'Jason', passwordHash: '', passwordSalt: 'large' };
       
       var verifier = buildVerifier({ './userSource': { findUser: sinon.stub().returns(Promise.resolve(user)) }});
       
       user.passwordHash = verifier.hash('largeporcupine');
       
       
       verifier.verifyUser('Jason', 'porcupine')
                .then(function(user) {                    
                    expect(user).to.not.be.null;
                    expect(user.name).to.equal('Jason');
                    cb();
                })
                .catch(cb);
    });
    
});