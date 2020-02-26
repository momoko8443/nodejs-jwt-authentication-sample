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
			coin: coin
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
			status: 1,
			create_time: now
		}
		db.get('helps').push(help).write();
		return help;
	},
	getHelp(avcode) {
		return db.get('helps').find({
			avcode: avcode
		}).value();
	},
	updateHelp(avcode,newPart){
		return db.get('helps').find({
			avcode: avcode
		}).assign(newPart).write();
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
	getLatestHelpItems(helper) {
		return db.get('helps')
		.filter((item) => {
			return item.status === 1 && item.score < 30 && !helped;
		})
		.sortBy('score').take(10).value();
	},
	getAllHelpItems(helper){
		return db.get('helps')
		.filter((item) => {
			return item.status === 1;
		})
		.sortBy('score').value();
	}
}