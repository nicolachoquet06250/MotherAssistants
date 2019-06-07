let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
    get entity() {
        return 'Child';
    }

    get collection() {
        return 'children';
    }
};