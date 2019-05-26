let DAO = require('../../modules/repository/DAO');

module.exports = class extends DAO {
	get entity() {
		return 'Bill';
	}

	get collection() {
		return 'bills';
	}

	async get(s_callback, e_callback = null) {
		let bills = await this.Collection.find({}).toArray();
		return bills.map(bill => this.createEntity(bill));
		// return await this.Collection.find({}).toArray(/*(err, documents) => err ? (e_callback !== null ? e_callback(err) : null) : s_callback(documents)*/);
	}

	add(...bills) {
		bills = bills.map(user => user.json);
		return new Promise((resolve, reject) => this.Collection.insertMany(bills, (err, result) => err ? reject(err) : resolve(result)));
	}

	update(where, updatedBill, forceOne = false, s_callback = null, e_callback = null) {
		let callback = (err, res) => err ? (e_callback !== null ? e_callback(err) : null) : (s_callback !== null ? s_callback(res) : null);
		let updateObject = { $set: Bill };
		forceOne ? this.Collection.updateOne(where, updateObject, callback) : this.Collection.updateMany(where, updateObject, callback);
	}

	delete(where, forceOne = false, s_callback = null, e_callback = null) {
		let callback = (err, obj) => err ? (e_callback !== null ? e_callback(err) : null) : (s_callback !== null ? s_callback(obj) : null);
		forceOne ? this.Collection.deleteOne(where, callback) : this.Collection.deleteMany(where, callback);
	}
};