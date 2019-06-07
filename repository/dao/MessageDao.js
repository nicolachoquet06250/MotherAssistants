let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
    get entity() {
        return 'Message';
    }

    get collection() {
        return 'messages';
    }
};