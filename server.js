var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var Passport = require('passport').Passport;
var BearerStrategy = require('passport-http-bearer').Strategy;

var keySource = require('./keySource');
var userVerifier = require('./userVerifier');


function createServer() {

    var app = express();
    var apiRouter = express.Router();

    var passport = app.passport = new Passport();
    
    
    if(!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET env var not declared!');
    }
    
    app.jwtSecret = process.env.JWT_SECRET;
    
    
    if(!process.env.JWT_LIFETIME) {
        throw new Error('JWT_LIFETIME env var not declared!');
    }
    
    app.jwtLifetime = process.env.JWT_LIFETIME;
    
    
    app.use(bodyParser.json());
    app.use(passport.initialize());

    passport.use('bearer', new BearerStrategy(
                                function(token, done) {
                                    jwt.verify(token, app.jwtSecret, 
                                        function(err, decoded) {                                            
                                            if(err) return done(err);                                            
                                            if(!decoded) return done(null, false);
                                            
                                            var age = Date.now() - decoded.created;
                                            if(age >= app.jwtLifetime) return done(null, false);
                                                
                                            return done(null, decoded);
                                        });                    
                                }));

    app.use('/api', apiRouter);


    apiRouter.post(
        '/login',
        function(req, res) {            
            userVerifier.verifyUser(req.body.name, req.body.password)
                        .then(function(user) {
                            if(user) {                
                                var token = jwt.sign({ 
                                                    user: user, 
                                                    created: Date.now() 
                                                }, 
                                                app.jwtSecret);   
                                                
                                            
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


    apiRouter.get(
        '/keys',
        passport.authenticate('bearer', { session: false }),
        function(req, res) {            
            keySource.getKeys()
                        .then(function(keys) {
                            res.status(200).send(keys);            
                        });        
        });
        
    return app;
}

module.exports = createServer;