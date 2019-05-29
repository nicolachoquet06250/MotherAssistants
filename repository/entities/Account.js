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
			nb_approvals: 'integer',
			profile_pic: 'string',
		};
	}

	constructor(connector, db_name) {
		super(connector, db_name);
		super.messages = [];
		super.employers = new Employers(connector, db_name);
		super.children = [];
	}
};