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

	static Home(req, res) {
		res.render('account/index', { title: 'Account Home' });
	}

	static SignIn(req, res) {
		res.render('account/signin', { title: 'Account Get Signin' });
	}

	static SignInPost(req, res) {
		res.render('account/signin', { title: 'Account Post Signin' });
	}

	static SignOn(req, res) {
		res.render('account/signon', { title: 'Account Get Signon' });
	}

	static SignOnPost(req, res) {
		res.render('account/signon', { title: 'Account Post Singon' });
	}

};