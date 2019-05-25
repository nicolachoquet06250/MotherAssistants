module.exports = class Parents {

	static get routes() {
		return {
			get: {
				'/': Parents.Home,
				'/mother': Parents.Mother,
				'/father': Parents.Father
			},
			post: {
				'/mother': Parents.Mother,
				'/father': Parents.Father,
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
};
