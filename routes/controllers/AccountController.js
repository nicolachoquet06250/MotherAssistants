let options = require('../../modules/helpers/ViewOptions');

module.exports = class Account {
	constructor() {
		this.connector = require('../../modules/database/mongodb_connector');
		this.pwHelper = require('../../modules/helpers/Passwords');
		this.Session = require('../../modules/helpers/Session');
	}
	static get routes() {
		return {
			get: {
				'/': Account.Home,
				'/signIn': Account.SignIn,
				'/signOn': Account.SignOn,
				'/signOut': Account.Signout
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
		let ctrl = new Account();
		if(ctrl.Session.Connected(req)) {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, Account.module);

				DAO.get({_id: req.session.__id}).then(accounts => {
					res.render('account/index', options.BaseOptions
						.append('title', 'Mon compte')
						.append('current_page', 'account')
						.append('user', accounts.map(account => DAO.createEntity(account))[0])
						.append('logged', ctrl.Session.Connected(req))
						.object);
				}, () => res.redirect('/home'));
			});
		}
		else res.redirect('/home')
	}

	static SignIn(req, res) {
		let ctrl = new Account();
		if(ctrl.Session.Connected(req)) res.redirect('/');
		else res.render('account/signin', options.BaseOptions
				.append('title', 'Account Get Signin')
				.append('current_page', 'sign_in')
				.append('logged', ctrl.Session.Connected(req))
				.object);
	}

	static Signout(req, res) {
		delete req.session.__id;
		res.redirect('/home');
	}

	static SignInPost(req, res) {
		let ctrl = new Account();
		let post = req.body;
		if(post.email && post.password) {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, Account.module);
				DAO.get({ email: post.email }).then(accounts => {
					accounts = accounts.map(
						account => DAO.createEntity(account));
					if(ctrl.pwHelper
						.comparePassword(post.password, accounts[0].password)) {
						ctrl.Session.SaveAccountSession(req, accounts[0]);
						res.redirect('/home');
					}
					else res.render('account/signin', options.BaseOptions
							.append('title', 'Account Post Signin')
							.append('current_page', 'sign_in')
							.append('logged', ctrl.Session.Connected(req))
							.add_error({
								message: 'Vous avez entré des identifiants incorrectes'
							}).object);
				}).catch(err => {
					res.render('account/signin', options.BaseOptions
						.append('title', 'Account Post Signin')
						.append('current_page', 'sign_in')
						.append('logged', ctrl.Session.Connected(req))
						.add_error({ message: err }).object);
					res.end();
				});
				client.close();
			});
		}
		else
			res.render('account/signin', options.BaseOptions
				.append('title', 'Account Post Signin')
				.append('current_page', 'sign_in')
				.append('logged', ctrl.Session.Connected(req))
				.add_error({
					message: `'Vous n'avez pas remplis tous le formulaire'`
				}).object);
	}

	static SignOn(req, res) {
		let ctrl = new Account();
		if(ctrl.Session.Connected(req)) res.redirect('/');
		else res.render('account/signon', options.BaseOptions
				.append('title', 'Account Get Signon')
				.append('current_page', 'sign_on')
				.append('logged', ctrl.Session.Connected(req))
				.object);
	}

	static SignOnPost(req, res) {
		let profile_pic = req.files.profile_pic;
		let post = req.body;
		let complete_name =
			    `${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}`;
		if(profile_pic.name.length > 0) {
			profile_pic.mv(`${__dirname}/../../uploads/${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}`,
				() => {});
			post['profile_pic'] = complete_name;
		}
		let ctrl = new Account();
		let connector = ctrl.connector;
		connector.onMongoConnect(client => {
			let AccountDao = connector.getDao(client, Account.module);
			if(post.first_name && post.last_name && post.email && post.password && post.nb_approvals) {
				post.nb_approvals = parseInt(post.nb_approvals);
				post.password = ctrl.pwHelper.cryptPassword(post.password);
				let Account = AccountDao.createEntity(post);
				AccountDao.add(Account).then(() => client.close()).catch(console.error);
				res.redirect('/account/signIn');
			}
			else res.status(403).render('errors/error', options.BaseOptions
					.append('title', 'Forbidden')
					.append('current_page', 'sign_on')
					.append('logged', ctrl.Session.Connected(req))
					.append('message', `Le Formulaire n'est pas complet`)
					.add_error({ status: 403, stack: '' }).object);
			client.close();
		}, () =>
			res.status(500).render('errors/error', options.BaseOptions
				.append('title', 'Server Error')
				.append('current_page', 'sign_on')
				.append('logged', ctrl.Session.Connected(req))
				.append('message', `Le Formulaire n'est pas complet`)
				.add_error({ status: 500, stack: '' }).object)
		);
	}
};