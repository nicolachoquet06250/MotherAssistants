let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
    get entity() {
        return 'Parent';
    }

    get collection() {
        return 'parents';
    }
};