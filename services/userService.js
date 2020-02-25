const dao = require('../dao/db');
const sha256 = require('sha256');
module.exports = {
    createUser(username, password){
        return dao.addUser(username, sha256(password), 10);
    },
    getUser(username){
        return dao.getUser(username);
    }
}