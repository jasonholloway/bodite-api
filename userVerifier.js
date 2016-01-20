var _ = require('lodash');
var userSource = require('./userSource');
var crypto = require('crypto-js');



function UserVerifier() {
    //...
}


UserVerifier.prototype.hashPassword = function(password, salt) {
    
}


UserVerifier.prototype.test = function(password, salt, hash) {    
    return this.hash(salt + password) === hash;
}


UserVerifier.prototype.hash = function(inp) {
    return crypto.SHA256(inp).toString();
}


UserVerifier.prototype.verifyUser = function(name, password) {    
    var self = this;
    
    return userSource.findUser(name)
            .then(function(user) {
                if(user && self.test(password, user.passwordSalt, user.passwordHash)) {                    
                    return {
                        name: user.name  
                    };
                }        
                
                return null;
            });    
}


module.exports = new UserVerifier();