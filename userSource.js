
var _ = require('lodash');

function UserSource() {
    
}


UserSource.prototype.getUsers = function() {        
    if(!process.env.API_USERS) {
        throw new Error('Env var API_USERS must be set!');
    }
    
    var users = JSON.parse(process.env.API_USERS);    
    return Promise.resolve(users);
    
        // { name: 'Jason', passwordHash: '12323144214', passwordSalt: 'adffe' }
    // ]);
}

UserSource.prototype.findUser = function(name) {
    return this.getUsers()
                .then(function(users) {    
                    return _.find(users, { name: name });
                });
}


module.exports = new UserSource();
