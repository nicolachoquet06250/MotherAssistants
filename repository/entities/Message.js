let Entity = require('../../modules/repository/Entity');

module.exports = class Message extends Entity {
	get props() {
		return {
			who: 'object',
			date: 'string',
			message: 'string'
		};
	}
};