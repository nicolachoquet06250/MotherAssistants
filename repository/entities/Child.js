let Entity = require('../../modules/repository/Entity');
let Employers = require('../entities/Employers');

module.exports = class Child extends Entity {
	get props() {
		return {
			first_name: 'string',
			last_name: 'string',
			birth_day: 'string',
			family: 'Employers',
			messages: 'Message[]'
		}
	};

	constructor(connector, db_name) {
		super(connector, db_name);
		this.family = new Employers();
		this.messages = [];
	}
};