module.exports = class Parents {

	static get routes() {
		return {
			get: {
				'/': Parents.Home,
				'/mother': Parents.Mother,
				'/father': Parents.Father,
				'/messages': Parents.Messages
			},
			post: {
				'/mother': Parents.Mother,
				'/father': Parents.Father
			}
		};
	}

	static get module() {
		return 'parents';
	}

	static Home(req, res) {
		res.render('parents/index', { title: 'Parents Home' });
	}

	static Mother(req, res) {
		res.render('parents/mother', { title: 'Parents Mother' });
	}

	static Father(req, res) {
		res.render('parents/father', { title: 'Parents Father' });
	}

	static Messages(req, res) {
		res.render('parents/messages', { title: 'Parents Messages' })
	}
};
