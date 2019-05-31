let ObjectID = require("mongodb").ObjectID;
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
		this.Collection = this.connector.db(this.db_name).collection(this.collection);
	}
	async get(options = {}, options2 = null) {
		if('_id' in options) {
			options._id = new ObjectID(options._id);
		}
		return (options2 === null ? this.Collection.find(options) : this.Collection.find(options, options2)).toArray();
	}
	add(...elements) {}
	update(where, newObj) {}
	delete() {}
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