module.exports = class {
	constructor(connector, dbname) {
		this.dbname = dbname;
		this.connector = connector;
		this.Entity = require(`../repository/entities/${this.entity}`);
		this.Collection = this.connector.db(this.dbname).collection(this.collection);
	}
	get() {}
	add(...elements) {}
	update(where, newObj) {}
	delete() {}
	createEntity(obj) {
		let entity = new (this.Entity)(this.connector.client, this.connector.dbName);
		for(let prop in entity.props) {
			if(obj[prop] !== undefined) {
				entity[prop] = obj[prop];
			}
		}
		return entity;
	}
};