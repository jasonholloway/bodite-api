var express = require('express');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var keySource = require('./keySource');



var app = express();
var apiRouter = express.Router();


passport.use(new BearerStrategy(
    function(token, done) {
                
        return done(null, { name: 'user' }, { scope: 'all' });
                
        // User.findOne({ token: token }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) { return done(null, false); }
        //     return done(null, user, { scope: 'all' });
        // });
    }));

app.use(passport.initialize());


app.use('/api', apiRouter);

apiRouter.get(
    '/keys',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        keySource.getKeys()
                    .then(function(keys) {
                        res.status(200).send(keys);            
                    });        
    });
    



module.exports = app;