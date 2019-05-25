module.exports = class {
	constructor(connector, dbname) {
		this.dbname = dbname;
		this.connector = connector;
		this.initProperties();
	}

	initProperties() {
		for(let prop in this.props) {
			this[prop] = null;
		}
	}

	get json() {
		let obj = {};
		for(let prop in this.props) {
			obj[prop] = this[prop];
		}

		return obj;
	}
};