let fs = require('fs');

module.exports = class Entity {
	constructor(connector, db_name) {
		this.db_name = db_name;
		this.connector = connector;
		this.initProperties();
	}

	initProperties() {
		for(let prop in this.props) {
			let value = null;
			if(this.props[prop].match(/([A-Z][a-z]+)\[]/)) {
				let entityName = this.props[prop].match(/([A-Z][a-z]+)\[]/)[1];
				if(fs.existsSync(`../../repository/entities/${entityName}.js`) && fs.existsSync(`../../repository/dao/${entityName}Dao.js`)) {
					let Dao = require(`../../repository/dao/${entityName}Dao`);
					value = new Dao(this.connector, this.db_name).createEntity();
				}
			}
			else if(this.props[prop].match(/([A-Z][a-z]+)/)) {
				let entityName = this.props[prop].match(/([A-Z][a-z]+)/)[1];
				if(fs.existsSync(`../../repository/entities/${entityName}.js`) && fs.existsSync(`../../repository/dao/${entityName}Dao.js`)) {
					let Dao = require(`../../repository/dao/${entityName}Dao`);
					value = new Dao(this.connector, this.db_name).createEntity();
				}
			}
			this[prop] = value;
		}
	}

	get json() {
		let obj = {};
		for(let prop in this.props) {
			let value = this[prop];
			if(typeof value === "object") {
				if(value instanceof Entity) {
					value = value.json;
				}
			}
			obj[prop] = value;
		}

		return obj;
	}
};