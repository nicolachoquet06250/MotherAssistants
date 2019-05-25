module.exports = class Account {

	static get routes() {
		return {
			get: {
				'/': Account.Home,
				'/signin': Account.SignIn,
				'/signon': Account.SignOn
			},
			post: {
				'/signin': Account.SignInPost,
				'/signon': Account.SignOnPost
			}
		}
	}

	static get module() {
		return 'account';
	}

	static Home(req, res, next) {
		res.render('index', { title: 'Get Home' });
	}

	static SignIn(req, res, next) {
		res.render('index', { title: 'Post Home' });
	}

	static SignInPost(req, res, next) {
		res.render('index', { title: 'Post Home' });
	}

	static SignOn(req, res, next) {
		res.render('index', { title: 'Post Home' });
	}

	static SignOnPost(req, res, next) {
		res.render('index', { title: 'Post Home' });
	}

};