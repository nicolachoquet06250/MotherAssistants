let options = require('../../modules/helpers/ViewOptions');

module.exports = class Children {

	constructor() {
		this.Session = require('../../modules/helpers/Session');
	}
	static get routes() {
		return {
			get: {
				'/': Children.Home,
				'/son': Children.Son,
				'/daughter': Children.Daughter,
				'/diary': Children.Diary
			},
			post: {
				'/son': Children.Son,
				'/daughter': Children.Daughter,
			}
		}
	}

	static get module() {
		return 'children';
	}

	static Home(req, res) {
		res.render('children/index', options.BaseOptions
				.append('title', 'Children Home').object);
	}

	static Son(req, res) {
		res.render('children/son', options.BaseOptions
			.append('title', 'Children Son').object);
	}

	static Daughter(req, res) {
		res.render('children/daughter', options.BaseOptions
			.append('title', 'Children Daughter').object);
	}

	static Diary(req, res) {
		res.render('children/diary', options.BaseOptions
			.append('title', 'Children Diary')
			.append('current_page', 'diary')
			.append('logged', new Children().Session.Connected(req)).object)
	}
};