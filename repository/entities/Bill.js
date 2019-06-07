let Entity = require('../../modules/repository/Entity');

module.exports = class extends Entity {
	get props() {
		return {
			email: "string",
			name: "string"
		};
	}
};