let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
    get entity() {
        return 'Message';
    }

    get collection() {
        return 'messages';
    }

    async get(s_callback, e_callback = null) {
        return this.Collection.find({}).toArray((err, documents) => err ? (e_callback !== null ? e_callback(err) : null) : s_callback(documents));
    }

    add(...messages) {
        accounts = messages.map(user => user.json);
        return new Promise((resolve, reject) => this.Collection.insertMany(messages, (err, result) => err ? reject(err) : resolve(result)));
    }

    update(where, updatedMessages, forceOne = false, s_callback = null, e_callback = null) {
        let callback = (err, res) => err ? (e_callback !== null ? e_callback(err) : null) : (s_callback !== null ? s_callback(res) : null);
        let updateObject = { $set: updatedMessages };
        forceOne ? this.Collection.updateOne(where, updateObject, callback) : this.Collection.updateMany(where, updateObject, callback);
    }

    delete(where, forceOne = false, s_callback = null, e_callback = null) {
        let callback = (err, obj) => err ? (e_callback !== null ? e_callback(err) : null) : (s_callback !== null ? s_callback(obj) : null);
        forceOne ? this.Collection.deleteOne(where, callback) : this.Collection.deleteMany(where, callback);
    }
};