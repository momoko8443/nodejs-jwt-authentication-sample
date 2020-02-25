const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db/db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({
	helps: [],
	users: []
}).write()

module.exports = {
	addUser(username, password, coin) {
		return db.get('users').push({
			username: username,
			password: password,
			coin: 10
		}).write();
	},
	getUser(username) {
		return db.get('users').find({
			username: username
		}).value();
	},
	incrementUserCoin(username, increment) {
		let currentCoin = this.getUser(username).coin;
		return db.get('users').find({
			username: username
		}).assign({
			coin: currentCoin + increment
		}).write();
	},
	reduceUserCoin(username, decrease) {
		let currentCoin = this.getUser(username).coin;
		return db.get('users').find({
			username: username
		}).assign({
			coin: currentCoin - decrease
		}).write();
	},
	addHelp(avcode, requester) {
		let now = new Date().getTime();
		let help = {
			id: now + '_' + avcode,
			avcode: avcode,
			requester: requester,
			score: 0,
			helpers: [],
			create_time: now
		}
		return db.get('helps').push(help).write();
	},
	getHelp(avcode) {
		return db.get('helps').find({
			avcode: avcode
		}).value();
	},
	isHelped(avcode, helper) {
		let currentHelpers = db.get('helps').find({
			avcode: avcode
		}).value().helpers;
		for (let i = 0; i < currentHelpers.length; i++) {
			if (currentHelpers[i].helper === helper) {
				return true;
				break;
			}
		}
		return false;
	},
	appendHelper(avcode, helper, score) {
		let currentHelpers = db.get('helps').find({
			avcode: avcode
		}).value().helpers;
		let currentScore = db.get('helps').find({
			avcode: avcode
		}).value().score;
		return db.get('helps').find({
			avcode: avcode
		}).assign({
			helpers: currentHelpers.concat({
				helper: helper,
				score: score
			}),
			score: currentScore + score
		}).write();
	},
	getHelpItems() {
		return db.get('helps')
		.filter((val) => {
			return val.score < 30
		})
		.sortBy('score').take(10).value();
	}
}