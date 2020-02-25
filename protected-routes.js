var express = require('express'),
    jwt     = require('express-jwt'),
    config  = require('./config'),

var app = module.exports = express.Router();

// Validate access_token
var jwtCheck = jwt({
  secret: config.secret,
  audience: config.audience,
  issuer: config.issuer
});

// Check for scope
function requireScope(scope) {
  return function (req, res, next) {
    var has_scopes = req.user.scope === scope;
    if (!has_scopes) { 
        res.sendStatus(401); 
        return;
    }
    next();
  };
}

app.use('/api/protected', jwtCheck, requireScope('full_access'));


app.get('/api/protected/posts', function(req, res) {
  
});

app.get('/api/protected/posts/:id', function(req, res) {
  
});

app.post('/api/protected/posts', function(req, res) {

});
