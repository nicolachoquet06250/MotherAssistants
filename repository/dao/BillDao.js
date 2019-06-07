let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
	get entity() {
		return 'Bill';
	}

	get collection() {
		return 'bills';
	}
};