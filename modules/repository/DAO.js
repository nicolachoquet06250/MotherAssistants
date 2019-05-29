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
	get() {}
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