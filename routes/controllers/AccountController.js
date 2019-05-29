module.exports = class Account {
	constructor() {
		this.connector = require('../../modules/database/mongodb_connector');
		this.pwHelper = require('../../modules/helpers/Passwords');
		this.Logger = require('../../modules/helpers/Logger');
		this.Session = require('../../modules/helpers/Session');
	}
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
		res.render('account/index', {
			title: 'Account Home',
			logged: new Account().Session.Connected(req),
			app_name: 'MotherAssistants',
			current_year: (new Date()).getFullYear()
		});
	}

	static SignIn(req, res) {
		let ctrl = new Account();
		console.log(ctrl.Session.Connected(req));
		if(ctrl.Session.Connected(req)) {
			res.redirect('/');
		}
		else {
			res.render('account/signin', {
				title: 'Account Get Signin',
				current_page: 'sign_in',
				logged: ctrl.Session.Connected(req),
				app_name: 'MotherAssistants',
				current_year: (new Date()).getFullYear()
			});
		}
	}

	static SignInPost(req, res) {
		let ctrl = new Account();
		let post = req.body;
		if(post.email && post.password) {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, Account.module);
				DAO.get({
					email: post.email
				}).then(accounts => {
					accounts = accounts.map(account => DAO.createEntity(account));
					if(ctrl.pwHelper.comparePassword(post.password, accounts[0].password)) {
						ctrl.Session.SaveAccountSession(req, accounts[0]);
						res.redirect('/home');
					}
					else {
						res.render('account/signin', {
							title: 'Account Post Signin',
							current_page: 'sign_in',
							logged: ctrl.Session.Connected(req),
							app_name: 'MotherAssistants',
							error: {
								message: 'Vous avez entré des identifiants incorrectes'
							},
							current_year: (new Date()).getFullYear()
						});
					}
				}).catch(err => {
					res.render('account/signin', {
						title: 'Account Post Signin',
						current_page: 'sign_in',
						logged: ctrl.Session.Connected(req),
						app_name: 'MotherAssistants',
						error: {
							message: err
						},
						current_year: (new Date()).getFullYear()
					});
					res.end();
				});
				client.close();
			});
		}
		else {
			res.render('account/signin', {
				title: 'Account Post Signin',
				current_page: 'sign_in',
				logged: ctrl.Session.Connected(req),
				app_name: 'MotherAssistants',
				error: {
					message: 'Vous n\'avez pas remplis tous le formulaire'
				},
				current_year: (new Date()).getFullYear()
			});
		}
	}

	static SignOn(req, res) {
		let ctrl = new Account();
		if(ctrl.Session.Connected(req)) {
			res.redirect('/');
		}
		else {
			res.render('account/signon', {
				title: 'Account Get Signon',
				current_page: 'sign_on',
				logged: ctrl.Session.Connected(req),
				app_name: 'MotherAssistants',
				current_year: (new Date()).getFullYear()
			});
		}
	}

	static SignOnPost(req, res) {
		let profile_pic = req.files.profile_pic;
		let post = req.body;
		let complete_name = `${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}`;
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
			else {
				res.status(403).render('errors/error', {
					title: 'Server Error',
					message: `Le Formulaire n'est pas complet`,
					error: {
						status: 500,
						stack: ''
					},
					logged: ctrl.Session.Connected(req),
					app_name: 'MotherAssistants',
					current_year: (new Date()).getFullYear()
				});
			}
			client.close();
		}, err => {
			res.status(500).render('errors/error', {
				title: 'Server Error',
				message: err,
				error: {
					status: 500,
					stack: ''
				},
				logged: ctrl.Session.Connected(req),
				app_name: 'MotherAssistants',
				current_year: (new Date()).getFullYear()
			});
		});
	}
};