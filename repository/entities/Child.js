let Entity = require('../../modules/repository/Entity');

module.exports = class Child extends Entity {
	get props() {
		return {
			first_name: 'string',
			last_name: 'string',
			birth_day: 'string'
		}
	};
};