let Entity = require('../../modules/repository/Entity');

module.exports = class Employers extends Entity {
	get props() {
		return {
			mother: 'Parent',
			father: 'Parent',
			step_father: 'Parent',
			step_mother: 'Parent',
			grand_mother: 'Parent[]',
			grand_father: 'Parent[]',
			uncle: 'Parent[]',
			tent: 'Parent[]'
		};
	}
};