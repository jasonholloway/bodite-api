

function UserSource() {
    
}


UserSource.prototype.verify = function(user) {
    return {
        name: user.name
    }    
}


exports.modules = new UserSource();