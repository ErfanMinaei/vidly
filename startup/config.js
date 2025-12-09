const config = require('config');

module.exports = function(){
    // cheking the privet key is set or not 
    if(!config.get('jwtPrivateKey')){
      throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
}