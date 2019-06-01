let Entity = require('../../modules/repository/Entity');
let Parent = require('./Parent');

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

	constructor(connector, db_name) {
		super(connector, db_name);
		this.uncle = [];
		this.tent = [];
		this.grand_mother = [];
		this.grand_father = [];
		this.mother = new Parent();
		this.father = new Parent();
		this.step_mother = new Parent();
		this.step_father = new Parent();
	}
};