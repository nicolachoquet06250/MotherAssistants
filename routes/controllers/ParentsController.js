module.exports = class Parents {

	static get routes() {
		return {
			get: {
				'/': Parents.Home,
				'/mother': Parents.Mother,
				'/father': Parents.Father,
				'/son': Parents.Son,
				'/daughter': Parents.Daughter,
			},
			post: {
				'/mother': Parents.Mother,
				'/father': Parents.Father,
				'/son': Parents.Son,
				'/daughter': Parents.Daughter,
			}
		};
	}

	static get module() {
		return 'parents';
	}

	static Home(req, res, next) {
		res.render('index', { title: 'Parents Home' });
	}

	static Mother(req, res, next) {
		res.render('index', { title: 'Parents Mother' });
	}

	static Father(req, res, next) {
		res.render('index', { title: 'Parents Father' });
	}

	static Son(req, res, next) {
		res.render('index', { title: 'Parents Son' });
	}

	static Daughter(req, res, next) {
		res.render('index', { title: 'Parents Daughter' });
	}
};
