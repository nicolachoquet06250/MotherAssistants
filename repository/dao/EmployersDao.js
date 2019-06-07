let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
    get entity() {
        return 'Employers';
    }

    get collection() {
        return 'employers';
    }
};