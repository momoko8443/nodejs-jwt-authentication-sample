var express = require('express'),
	_ = require('lodash'),
	config = require('./config'),
	jwt = require('jsonwebtoken');
const userService = require('./services/userService');
const sha256 = require('sha256');
var app = module.exports = express.Router();


function createIdToken(user) {
	return jwt.sign(_.omit(user, 'password'), config.secret, {
		expiresIn: 60 * 60 * 24 * 365
	});
}

function createAccessToken(username) {
	return jwt.sign({
		iss: config.issuer,
		aud: username,
		exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
		scope: 'full_access',
		sub: "lalaland|gonto",
		jti: genJti(), // unique identifier for the token
		alg: 'HS256',
	}, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
	let jti = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 16; i++) {
		jti += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return jti;
}

app.post('/users', function (req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (!username || !password) {
		return res.status(400).send("You must send the username and the password");
	}
	let exists = userService.getUser(username);
	if (exists) {
		return res.status(400).send("A user with that username already exists");
	}else{
		let user = userService.createUser(username, password);
		res.status(201).send({
			id_token: createIdToken(user),
			access_token: createAccessToken(username)
		});
	}
	
});

app.post('/token', function (req, res) {

	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		return res.status(400).send("You must send the username and the password");
	}

	let exists = userService.getUser(username);
	if (!exists) {
		return res.status(401).send("The username or password don't match");
	}

	if (exists.password !== sha256(password)) {
		return res.status(401).send("The username or password don't match");
	}
	res.status(201).send({
		id_token: createIdToken(exists),
		access_token: createAccessToken(username)
	});
});