let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
	get entity() {
		return 'Account';
	}

	get collection() {
		return 'accounts';
	}
};