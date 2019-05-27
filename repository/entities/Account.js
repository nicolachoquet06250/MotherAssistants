let Entity = require('../../modules/repository/Entity');
let Employers = require('./Employers');

module.exports = class extends Entity {
	get props() {
		return {
			first_name: 'string',
			last_name: 'string',
			email: 'string',
			password: 'string',
			birth_day: 'string',
			employers: 'Employers',
			messages: 'Message[]',
			children: 'Child[]',
			max_number_places: 'integer'
		};
	}

	constructor(connector, dbname) {
		super(connector, dbname);
		super.messages = [];
		super.employers = new Employers(connector, dbname);
		super.children = [];
	}
};