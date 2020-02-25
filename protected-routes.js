var express = require('express'),
	jwt = require('express-jwt'),
	_ = require('lodash'),
	config = require('./config');
const helpService = require('./services/helpService');
const userService = require('./services/userService');
var app = module.exports = express.Router();

// Validate access_token
var jwtCheck = jwt({
	secret: config.secret,
	// audience: config.audience,
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

app.get('/api/protected/user/', function (req, res) {
	let requester = req.user.aud;
	let user = userService.getUser(requester);
	user = _.omit(user,'password');
	return res.status(200).send(user);
});
app.post('/api/protected/helps', function (req, res) {
	let requester = req.user.aud;
	let avcode = req.body.avcode;
	if(!requester || !avcode){
		return res.status(400).send("You should provide av code");
	}
	let help = helpService.publishHelp(avcode, requester);
	if(help){
		return res.status(200).send(help);
	}else{
		return res.status(400).send("You have not enought coin to publish or av code has been published");
	}
	
});
app.get('/api/protected/helps', function (req, res) {
	let requester = req.user.aud;
	let helps = helpService.getHelpItems(requester);
	return res.status(200).send(helps);
});

app.get('/api/protected/helps/:avcode', function (req, res) {
	let avcode = req.params.avcode;
	console.log('avcode',avcode);
	let help = helpService.getHelp(avcode);
	if(help){
		return res.status(200).send(help);
	}else{
		return res.status(404).send('av code not exists');
	}
});

app.put('/api/protected/helps/:avcode/helpers', function (req, res) {
	let avcode = req.params.avcode;
	let helper = req.user.aud;
	let score = req.body.score;
	let _helper = helpService.doHelp(avcode,helper,score);
	if(_helper){
		_helper = _.omit(_helper,'password');
		return res.status(200).send(_helper);
	}else{
		return res.status(400).send('do help failed');
	}
});