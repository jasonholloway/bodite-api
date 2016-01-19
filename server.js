var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var Passport = require('passport').Passport;
var BearerStrategy = require('passport-http-bearer').Strategy;

var keySource = require('./keySource');
var userSource = require('./userSource');


function createServer() {

    var app = express();
    var apiRouter = express.Router();

    var passport = app.passport = new Passport();
    
    
    if(!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET env var not declared!');
    }
    
    var jwtSecret = app.jwtSecret = process.env.JWT_SECRET;
    
    app.use(bodyParser.json());
    app.use(passport.initialize());

    passport.use('bearer', new BearerStrategy(
                                function(token, done) {
                                    jwt.verify(token, jwtSecret, 
                                        function(err, decoded) {
                                            return err
                                                    ? done(err)
                                                    : done(null, decoded);
                                        });                    
                                }));

    app.use('/api', apiRouter);


    apiRouter.post(
        '/login',
        function(req, res) {
            var user = userSource.verify(req.body.name, req.body.password);
            
            if(user) {                
                var token = jwt.sign(
                                { 
                                    user: user, 
                                    created: Date.now() 
                                }, 
                                jwtSecret);   
                             
                res.status(200).send({ token: token }); 
            }
            else {
                res.status(401).send();   
            }
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