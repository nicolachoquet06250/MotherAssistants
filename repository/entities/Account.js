let Entity = require('../../modules/repository/Entity');

module.exports = class extends Entity {
	get props() {
		return {
			_id: 'string',
			first_name: 'string',
			last_name: 'string',
			email: 'string',
			password: 'string',
			birth_day: 'string',
			children: 'Child[]',
			nb_approvals: 'integer',
			profile_pic: 'string',
		};
	}

	constructor(connector, db_name) {
		super(connector, db_name);
		super.children = [];
	}
};