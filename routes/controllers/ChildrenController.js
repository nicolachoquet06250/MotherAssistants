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
		if(!ctrl.Session.Connected(req)) res.redirect('/home');
		else {
			ctrl.connector.onMongoConnect(client => {
				let DAO = ctrl.connector.getDao(client, 'account');

				DAO.get({
					_id: req.session.__id
				}, { children: 1 }).then(accounts => {
					let me = accounts.map(account => DAO.createEntity(account).json)[0];
					res.render('children/index', options.BaseOptions
						.append('title', 'Mes enfants')
						.append('children', me.children)
						.append('current_page', 'children')
						.append('logged', ctrl.Session.Connected(req)).object);
				});
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
				AccountDAO.get({ _id: req.session.__id }).then(accounts => {
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

					AccountDAO.update({ _id: req.session.__id}, { children: child.json }, false, true, r => {
						client.close();
						res.redirect('/children');
					}, err => {
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
				AccountDAO.get({ _id: req.session.__id }).then(accounts => {
					let children = accounts.map(account => AccountDAO.createEntity(account))[0].children;
					delete children[parseInt(post.id)];
					let tmp = [];
					for(let child_id in children) {
						if(children[child_id] !== null) {
							tmp.push(children[child_id]);
						}
					}
					children = tmp;
					AccountDAO.update({ _id: req.session.__id}, { children:  children}, false, false, r => {
						client.close();
						res.redirect('/children');
					}, err => {
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
				DAO.get({_id: req.session.__id}).then(accounts => {
					res.send(accounts.map(account =>
						DAO.createEntity(account).json)[0].children[parseInt(req.query.id)]);
					client.close();
				}).catch(console.error);
			});
		}
	}

	static Son(req, res) {
		res.render('children/son', options.BaseOptions
			.append('title', 'Children Son').object);
	}

	static Daughter(req, res) {
		res.render('children/daughter', options.BaseOptions
			.append('title', 'Children Daughter').object);
	}

	static Diary(req, res) {
		res.render('children/diary', options.BaseOptions
			.append('title', 'Children Diary')
			.append('current_page', 'diary')
			.append('logged', new Children().Session.Connected(req)).object)
	}
};