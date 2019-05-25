module.exports = class Children {

	static get routes() {
		return {
			get: {
				'/': Children.Home,
				'/son': Children.Son,
				'/daughter': Children.Daughter,
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

	static Home(req, res, next) {
		res.render('index', { title: 'Parents Home' });
	}

	static Son(req, res, next) {
		res.render('index', { title: 'Parents Son' });
	}

	static Daughter(req, res, next) {
		res.render('index', { title: 'Parents Daughter' });
	}
};