let options = require('../../modules/helpers/ViewOptions');

module.exports = class Children {

	constructor() {
		this.Session = require('../../modules/helpers/Session');
		this.connector = require('../../modules/database/mongodb_connector');
	}
	static get routes() {
		return {
			get: {
				'/': Children.Home,
				'/get': Children.GetChild,
				'/son': Children.Son,
				'/daughter': Children.Daughter,
				'/diary': Children.Diary
			},
			post: {
				'/add': Children.AddChild,
				'/delete': Children.DeleteChild,
				'/son': Children.Son,
				'/daughter': Children.Daughter,
			}
		}
	}
	static get module() {
		return 'children';
	}

	static Home(req, res) {
		let ctrl = new Children();
		let children_keys = 0;
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, 'account');
				if(ctrl.Session.GetMyRole(req) === 'ma') {
					DAO.get({ _id: ctrl.Session.GetAccount(req).__id }, { children: 1 })
						.then(accounts => {
							let me = accounts.map(account => DAO.createEntity(account).json)[0];
							children_keys = [];
							for (let key in me.children) {
								children_keys.push(1);
							}
							res.render('children/index', options.BaseOptions
								.append('title', 'Mes enfants')
								.append('children', me.children)
								.append('nb_global_messages', children_keys)
								.append('nb_global_medias', children_keys)
								.append('current_page', 'children')
								.append('role', ctrl.Session.GetMyRole(req))
								.append('logged', ctrl.Session.Connected(req)).object);
						});
				}
				else if (ctrl.Session.GetMyRole(req) === 'parent') {
					res.render('children/index', options.BaseOptions
						.append('title', 'Mes enfants')
						.append('children', [
							ctrl.Session.GetAccount(req)
						])
						.append('nb_global_messages', 0)
						.append('nb_global_medias', 0)
						.append('current_page', 'children')
						.append('role', ctrl.Session.GetMyRole(req))
						.append('logged', ctrl.Session.Connected(req)).object);
				}
			});
		}
	}

	static AddChild(req, res) {
		let ctrl = new Children();
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let AccountDAO = ctrl.connector.getDao(client, 'account');
				let post = req.body;
				AccountDAO.get({ _id: ctrl.Session.GetAccount(req).__id }).then(accounts => {
					let child = ctrl.connector.getDao(client, 'child').createEntity({
						first_name: post.first_name,
						last_name: post.last_name,
						birth_day: post.birth_day
					});

					let Familly = ctrl.connector.getDao(client, 'employers').createEntity();
					Familly.mother = ctrl.connector.getDao(client, 'parent').createEntity({
						first_name: post.mother_first_name,
						last_name: post.mother_last_name,
						phone: post.mother_phone,
						password: post.generated_password_for_mother
					});
					Familly.father = ctrl.connector.getDao(client, 'parent').createEntity({
						first_name: post.father_first_name,
						last_name: post.father_last_name,
						phone: post.father_phone,
						password: post.generated_password_for_father
					});
					child.family = Familly.json;

					let me = accounts.map(account => AccountDAO.createEntity(account))[0];
					me.children.push(child.json);

					AccountDAO.update({ _id: ctrl.Session.GetAccount(req).__id}, { children: child.json }, false, true)
						.then(r => {
							client.close();
							res.redirect('/children');
						}).catch(err => {
							console.error(err);
							client.close();
						});
				});
			});
		}
	}

	static DeleteChild(req, res) {
		let ctrl = new Children();
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let AccountDAO = ctrl.connector.getDao(client, 'account');
				let post = req.body;
				AccountDAO.get({ _id: ctrl.Session.GetAccount(req).__id }).then(accounts => {
					let children = accounts.map(account => AccountDAO.createEntity(account))[0].children;
					delete children[parseInt(post.id)];
					let tmp = [];
					for(let child_id in children) {
						if(children[child_id] !== null) {
							tmp.push(children[child_id]);
						}
					}
					children = tmp;
					AccountDAO.update({ _id: ctrl.Session.GetAccount(req).__id}, { children:  children}, false, false)
						.then(r => {
							client.close();
							res.redirect('/children');
						}).catch(err => {
							console.error(err);
							client.close();
						});
				});
			});
		}
	}

	static GetChild(req, res) {
		let ctrl = new Children();
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, 'account');
				DAO.get({_id: ctrl.Session.GetAccount(req).__id}).then(accounts => {
					res.send(accounts.map(account =>
						DAO.createEntity(account).json)[0].children[parseInt(req.query.id)]);
					client.close();
				}).catch(console.error);
			});
		}
	}

	static Son(req, res) {
		let ctrl = new Children();
		res.render('children/son', options.BaseOptions
			.append('title', 'Children Son')
			.append('role', ctrl.Session.GetMyRole(req)).object);
	}

	static Daughter(req, res) {
		let ctrl = new Children();
		res.render('children/daughter', options.BaseOptions
			.append('title', 'Children Daughter')
			.append('role', ctrl.Session.GetMyRole(req)).object);
	}

	static Diary(req, res) {
		let ctrl = new Children();
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			let children = ctrl.Session.GetMyRole(req) === 'ma' ? ctrl.Session.GetAccount(req).children : [ctrl.Session.GetAccount(req)];
			res.render('children/diary', options.BaseOptions
				.append('title', 'Children Diary')
				.append('children', children)
				.append('current_page', 'diary')
				.append('role', ctrl.Session.GetMyRole(req))
				.append('logged', new Children().Session.Connected(req)).object)
		}
	}
};