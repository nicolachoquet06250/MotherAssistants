let Entity = require('../../modules/repository/Entity');

module.exports = class Parent extends Entity {
	get props() {
		return {
			first_name: 'string',
			last_name: 'string',
			phone: 'string',
			password: 'string',
			messages: 'Message[]'
		};
	}

	constructor(connector, db_name) {
		super(connector, db_name);
		this.messages = [];
	}
};