let ObjectID = require("mongodb").ObjectID;
let Join = require('mongo-join').Join;
module.exports = class DAO {
	get collection() {
		return '';
	}
	get entity() {
		return '';
	}
	constructor(connector, db_name) {
		this.db_name = db_name;
		this.connector = connector;
		this.Entity = require(`../../repository/entities/${this.entity}`);
		this.Database = this.connector.db(this.db_name);
		this.Collection = this.Database.collection(this.collection);
	}
	async get(options = {}, options2 = null) {
		if('_id' in options) options._id = new ObjectID(options._id);
		return (options2 === null
			? this.Collection.find(options) : this.Collection.find(options, options2)).toArray();
	}
	add(...elements) {
		elements = elements.map(element => element.json);
		return new Promise((resolve, reject) =>
			this.Collection.insertMany(elements, (err, result) => err ? reject(err) : resolve(result)));
	}
	update(where, updated, forceOne = false) {
		return new Promise((resolve, reject) => {
			if('_id' in where) where._id = new ObjectID(where._id);
			let callback = (err, res) => err ? reject(err) : resolve(res);
			let updateObject = { $set: updated };
			forceOne ? this.Collection.updateOne(where, updateObject, callback)
				: this.Collection.updateMany(where, updateObject, callback);
		});
	}
	join(request, ...objects) {
		return new Promise((resolve, reject) => {
			if('_id' in request) request._id = new ObjectID(request._id);
			this.Collection.find(request, (err, cursor) => {
				let join = new Join(this.Database);
				for(let obj of objects) join.on(obj);
				join.toArray(cursor, (err, docs) => err ? reject(err) : resolve(docs));
			});
		});
	}
	delete(where, forceOne = false) {
		return new Promise((resolve, reject) => {
			let callback = (err, obj) => err ? reject(err) : resolve(obj);
			forceOne ? this.Collection.deleteOne(where, callback)
				: this.Collection.deleteMany(where, callback);
		});
	}
	createEntity(obj = {}) {
		let entity = new (this.Entity)(this.connector, this.db_name);
		for(let prop in entity.props) {
			if(obj[prop] !== undefined) {
				entity[prop] = obj[prop];
			}
		}
		return entity;
	}
};