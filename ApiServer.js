var assert = require('assert');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var Passport = require('passport').Passport;
var BearerStrategy = require('passport-http-bearer').Strategy;

var keySource = require('./keySource');
var userVerifier = require('./userVerifier');



function ApiServer() {    
    var self = this;
    
    var exp = self.express = express();
    var passport = self.passport = new Passport();
    
    assert(self.jwtSecret = process.env.JWT_SECRET, 
                    'JWT_SECRET env var undeclared!');
        
    assert(self.jwtLifetime = process.env.JWT_LIFETIME, 
                    'JWT_LIFETIME env var undeclared!');
        
    exp.use(bodyParser.json());
    exp.use(passport.initialize());

    passport.use('bearer', new BearerStrategy(
                                function(token, done) {
                                    jwt.verify(token, self.jwtSecret, 
                                        function(err, decoded) {                                            
                                            if(err) return done(err);                                            
                                            if(!decoded) return done(null, false);
                                            
                                            var age = Date.now() - decoded.created;
                                            if(age >= self.jwtLifetime) return done(null, false);
                                                
                                            return done(null, decoded);
                                        });                    
                                }));

    var api = self.api = express.Router();
    exp.use('/api', api);


    api.post(
        '/login',
        function(req, res) {            
            userVerifier.verifyUser(req.body.name, req.body.password)
                        .then(function(user) {
                            if(user) {                
                                var token = jwt.sign({ 
                                                    user: user, 
                                                    created: Date.now() 
                                                }, 
                                                self.jwtSecret);   
                                                
                                            
                                res.status(200).send({ token: token }); 
                            }
                            else {
                                res.status(401).send();   
                            }
                        })
                        .catch(function(err) {
                            throw err;
                        });            
        });


    api.get(
        '/keys',
        passport.authenticate('bearer', { session: false }),
        function(req, res) {            
            keySource.getKeys()
                        .then(function(keys) {
                            res.status(200).send(keys);            
                        });        
        });        
}




ApiServer.prototype.listen = function(port) {
    this.exp.listen(port);
}




module.exports = ApiServer;