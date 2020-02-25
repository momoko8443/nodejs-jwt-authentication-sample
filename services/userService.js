const dao = require('../dao/db');

module.exports = {
    createUser(username, password){
        
        return dao.addUser(username)
    }
}