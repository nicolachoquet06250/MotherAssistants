let options = require('../../modules/helpers/ViewOptions');

module.exports = class Api {
	constructor() {
		this.connector = require('../../modules/database/mongodb_connector');
	}
	static get routes() {
		return {
			get: {
				'/account/:account_id': Api.getAccount,
				'/accounts': Api.getAccounts
			},
			post: {}
		}
	}

	static get module() {
		return 'api';
	}

	static getConnector() {
		return new Api().connector;
	}

	static getAccount(req, res) {
		const connector = Api.getConnector();
		connector.onMongoConnect(client => {
			let DAO = connector.getDao(client, 'account');
			DAO.get({
				_id: req.param('account_id')
			}).then(docs => {
				let account = docs.map(doc => DAO.createEntity(doc).json)[0];
				res.send({
					account_id: req.param('account_id'),
					account
				});
				client.close();
			});
		}, err => res.send({ error: err }));
	}

	static getAccounts(req, res) {
		const connector = Api.getConnector();
		connector.onMongoConnect(client => {
			let DAO = connector.getDao(client, 'account');
			DAO.get({}).then(docs => {
				let accounts = docs.map(doc => DAO.createEntity(doc).json);
				res.send({ accounts });
				client.close();
			});
		}, err => res.send({ error: err }));
	}

};