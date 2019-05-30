let app_conf = require('../../modules/conf/app');

module.exports = class ViewOptions {
	constructor() {
		this.options = {};
	}

	static get BaseOptions() {
		return new ViewOptions()
			.append('app_name', app_conf.name)
			.append('current_year', (new Date()).getFullYear());
	}

	static get VoidOptions() {
		return new ViewOptions();
	}

	append(key, value) {
		this.options[key] = value;
		return this;
	}

	delete(...keys) {
		for(let key in keys) {
			delete this.options[key];
		}
		return this;
	}

	get object() {
		return this.options;
	}

	add_error(error) {
		return this.append('error', error);
	}
};