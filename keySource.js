
function KeySource() {
    
}


KeySource.prototype.getKeys = function() {
    if(!process.env.API_KEYS) {
        throw new Error('API_KEYS env var not available!');
    }
        
    var keys = JSON.parse(process.env.API_KEYS);
    
    return Promise.resolve(keys);
}


module.exports = new KeySource();
