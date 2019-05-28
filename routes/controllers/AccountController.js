module.exports = class Account {

	static get routes() {
		return {
			get: {
				'/': Account.Home,
				'/signIn': Account.SignIn,
				'/signOn': Account.SignOn
			},
			post: {
				'/signIn': Account.SignInPost,
				'/signOn': Account.SignOnPost
			}
		}
	}

	static get module() {
		return 'account';
	}

	static get mimes2ext() {
		return {
			'image/png': 'png',
			'image/jpeg': 'jpg',
			'image/gif': 'gif',
			'text/xml+svg': 'svg',
			'image/webp': 'webp',
		};
	}

	static Home(req, res) {
		res.render('account/index', { title: 'Account Home', logged: false });
	}

	static SignIn(req, res) {
		res.render('account/signin', { title: 'Account Get Signin', current_page: 'sign_in', logged: false });
	}

	static SignInPost(req, res) {
		res.render('account/signin', { title: 'Account Post Signin', current_page: 'sign_in', logged: false });
	}

	static SignOn(req, res) {
		res.render('account/signon', { title: 'Account Get Signon', current_page: 'sign_on', logged: false });
	}

	static SignOnPost(req, res) {
		let fs = require('fs');
		let Logger = require('../../modules/helpers/Logger');
		let profile_pic = req.files.profile_pic;
		let post = req.body;
		let complete_name = `${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}`;
		if(profile_pic.name.length > 0) {
			profile_pic.mv(`${__dirname}/../../uploads/${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}`,
				() => {});

			post['profile_pic'] = complete_name;
		}

		post.nb_approvals = parseInt(post.nb_approvals);
		Logger.Console = post;
		res.render('account/signon', {
			title: 'Account Post Signon',
			current_page: 'sign_on',
			logged: false
		});
	}
};