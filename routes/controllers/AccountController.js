let options = require('../../modules/helpers/ViewOptions');

module.exports = class Account {
	constructor() {
		this.connector = require('../../modules/database/mongodb_connector');
		this.pwHelper = require('../../modules/helpers/Passwords');
		this.Session = require('../../modules/helpers/Session');
		this.fs = require('fs');
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
				'/signInMA': Account.SignInPostMA,
				'/signInParent': Account.SignInPostParent,
				'/signOn': Account.SignOnPost,
				'/pre_update/profile_pic': Account.PreUpdateProfilePic,
				'/update/profile_pic': Account.UpdateProfilePic,
				'/delete/old/pre_update/profile_pic': Account.DeletePreUpdatedProfilePic
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
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let me = ctrl.Session.GetAccount(req);
				if(ctrl.Session.GetMyRole(req) === 'parent') {
					let parent_role = me.parent_role;
					me = me.family[me.parent_role];
					me.parent_role = parent_role;
				}
				res.render('account/index', options.BaseOptions
					.append('title', 'Mon compte')
					.append('current_page', 'account')
					.append('role', ctrl.Session.GetMyRole(req))
					.append('user', me)
					.append('logged', ctrl.Session.Connected(req))
					.object);
			});
		}
	}

	static SignIn(req, res) {
		let ctrl = new Account();
		if(ctrl.Session.Connected(req)) res.redirect('/');
		else {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, 'account');
				DAO.get({}).then(accounts => {
					accounts = accounts.map(account => {
						account = DAO.createEntity(account).json;
						return {
							first_name: account.first_name,
							last_name: account.last_name,
							profile_pic: account.profile_pic,
							_id: account._id
						}
					});
					res.render('account/signin', options.BaseOptions
						.append('title', 'Account Get Signin')
						.append('current_page', 'sign_in')
						.append('role', ctrl.Session.GetMyRole(req))
						.append('motherassistants', accounts)
						.append('logged', ctrl.Session.Connected(req))
						.object);
				});
			});
		}
	}

	static Signout(req, res) {
		new Account().Session.DeleteAccountSession(req);
		res.redirect('/home');
		res.end();
	}

	static SignInPostMA(req, res) {
		let ctrl = new Account();
		let post = req.body;
		if(post.email && post.password) {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, Account.module);
				DAO.get({ email: post.email }).then(accounts => {
					let me = accounts.map(account => DAO.createEntity(account).json)[0];
					if(ctrl.pwHelper.comparePassword(post.password, me.password)) {
						me.role = 'ma';
						ctrl.Session.SaveAccountSession(req, me);
						res.redirect('/home');
						res.end();
					}
					else {
						DAO.get({}).then(accounts => {
							accounts = accounts.map(account => DAO.createEntity(account));
							res.render('account/signin', options.BaseOptions
								.append('title', 'Account Post Signin')
								.append('current_page', 'sign_in')
								.append('motherassistants', accounts)
								.append('role', ctrl.Session.GetMyRole(req))
								.append('logged', ctrl.Session.Connected(req))
								.add_error({
									message: 'Vous avez entré des identifiants incorrectes'
								}).object);
						});
					}
				}).catch(err => {
					res.render('account/signin', options.BaseOptions
						.append('title', 'Account Post Signin')
						.append('current_page', 'sign_in')
						.append('role', ctrl.Session.GetMyRole(req))
						.append('logged', ctrl.Session.Connected(req))
						.add_error({ message: err }).object);
					res.end();
				});
				client.close();
			});
		}
		else {
			DAO.get({}).then(accounts => {
				accounts = accounts.map(account => DAO.createEntity(account));
				res.render('account/signin', options.BaseOptions
					.append('title', 'Account Post Signin')
					.append('current_page', 'sign_in')
					.append('role', ctrl.Session.GetMyRole(req))
					.append('logged', ctrl.Session.Connected(req))
					.add_error({
						message: `'Vous n'avez pas remplis tous le formulaire'`
					}).object);
			});
		}
	}

	static SignInPostParent(req, res) {
		let ctrl = new Account();
		let post = req.body;
		if(post.my_mother_assistant && post.password && post.phone) {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, Account.module);
				DAO.get({ _id: post.my_mother_assistant }).then(accounts => {
					let ma = accounts.map(account => DAO.createEntity(account).json)[0];
					let _child = null;
					for(let role in ma.children) {
						for(let child_key in ma.children) {
							let child = ma.children[child_key];
							for(let role in child.family) {
								if(child.family[role].phone === post.phone && child.family[role].password === post.password) {
									_child = child;
									_child._id = child_key;
									_child.motherassistant = {
										_id: ma._id
									};
									_child.parent_role = role;
									_child.role = 'parent';
									break;
								}
							}
							if(_child !== null) break;
						}
						if(_child !== null) break;
					}
					if(_child !== null) {
						ctrl.Session.SaveAccountSession(req, _child);
						res.redirect('/home');
					}
					else {
						res.render('account/signin', options.BaseOptions
							.append('title', 'Account Post Signin')
							.append('current_page', 'sign_in')
							.append('role', ctrl.Session.GetMyRole(req))
							.append('logged', ctrl.Session.Connected(req))
							.add_error({
								message: 'Vous avez entré des identifiants incorrectes'
							}).object);
					}
				}).catch(err => {
					res.render('account/signin', options.BaseOptions
						.append('title', 'Account Post Signin')
						.append('current_page', 'sign_in')
						.append('role', ctrl.Session.GetMyRole(req))
						.append('logged', ctrl.Session.Connected(req))
						.add_error({
							message: err
						}).object);
					res.end();
				});
				client.close();
			});
		}
		else {
			res.render('account/signin', options.BaseOptions
				.append('title', 'Account Post Signin')
				.append('current_page', 'sign_in')
				.append('role', ctrl.Session.GetMyRole(req))
				.append('logged', ctrl.Session.Connected(req))
				.add_error({
					message: `'Vous n'avez pas remplis tous le formulaire'`
				}).object);
		}
	}

	static SignOn(req, res) {
		let ctrl = new Account();
		if(ctrl.Session.Connected(req)) res.redirect('/');
		else res.render('account/signon', options.BaseOptions
				.append('title', 'Account Get Signon')
				.append('current_page', 'sign_on')
				.append('role', ctrl.Session.GetMyRole(req))
				.append('logged', ctrl.Session.Connected(req))
				.object);
	}

	static SignOnPost(req, res) {
		let files = req.files;
		let profile_pic = files.profile_pic;
		let post = req.body;
		let ctrl = new Account();
		let complete_name =
			    `${files.profile_pic.md5}.${Account.mimes2ext[files.profile_pic.mimetype]}`;
		if(profile_pic.name.length > 0) {
			ctrl.fs.rename(`${__dirname}/../../${files.profile_pic.tempFilePath}`,
				`${__dirname}/../../uploads/${files.profile_pic.md5}.${Account.mimes2ext[files.profile_pic.mimetype]}`, () => {});
			post['profile_pic'] = complete_name;
		}
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
					.append('role', ctrl.Session.GetMyRole(req))
					.append('logged', ctrl.Session.Connected(req))
					.append('message', `Le Formulaire n'est pas complet`)
					.add_error({ status: 403, stack: '' }).object);
			client.close();
		}, () =>
			res.status(500).render('errors/error', options.BaseOptions
				.append('title', 'Server Error')
				.append('current_page', 'sign_on')
				.append('role', ctrl.Session.GetMyRole(req))
				.append('logged', ctrl.Session.Connected(req))
				.append('message', `Le Formulaire n'est pas complet`)
				.add_error({ status: 500, stack: '' }).object)
		);
	}

	static UpdateProfilePic(req, res) {
		let ctrl = new Account();
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, 'account');
				DAO.get({ _id: ctrl.Session.GetAccount(req).__id }).then(accounts => {
					let me = accounts.map(account => DAO.createEntity(account).json)[0];
					me.profile_pic = ctrl.Session.GetAccount(req).old_pre_updated_profile_pic;
					DAO.update({ _id: ctrl.Session.GetAccount(req).__id }, { profile_pic: ctrl.Session.GetAccount(req).old_pre_updated_profile_pic }, true, false)
						.then(r => {
							console.log(r);
							res.redirect('/account');
						}).catch(console.error);
				})
			});
		}
	}

	static PreUpdateProfilePic(req, res) {
		let ctrl = new Account();
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			let files = req.files;
			if(files.profile_pic) {
				console.log(files.profile_pic);
				ctrl.fs.rename(`${__dirname}/../../${files.profile_pic.tempFilePath}`,
					`${__dirname}/../../uploads/${files.profile_pic.md5}.${Account.mimes2ext[files.profile_pic.mimetype]}`,
						err => {
							if(err) {
								res.type('application/json');
								res.send({ success: false, error: err });
								res.end();
							}
							else {
								ctrl.Session.UpdateAccountProp(req, 'old_pre_updated_profile_pic', `${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}`);
								res.type('application/json');
								res.send({ success: true, url: `/uploads/${req.files.profile_pic.md5}.${Account.mimes2ext[req.files.profile_pic.mimetype]}` });
								res.end();
							}
						});
			}
		}
	}

	static DeletePreUpdatedProfilePic(req, res) {
		delete new Account().Session.GetAccount(req).old_pre_updated_profile_pic;
		res.send('');
	}
};