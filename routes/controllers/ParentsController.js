let options = require('../../modules/helpers/ViewOptions');

module.exports = class Parents {

	constructor() {
		this.Session = require('../../modules/helpers/Session');
	}

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
		res.render('parents/index', options.BaseOptions
			.append('title', 'Parents Home').object);
	}

	static Mother(req, res) {
		res.render('parents/mother', options.BaseOptions
			.append('title', 'Parents Mother').object);
	}

	static Father(req, res) {
		res.render('parents/father', options.BaseOptions
			.append('title', 'Parents Father').object);
	}

	static Messages(req, res) {
		res.render('parents/messages', options.BaseOptions
			.append('title', 'Parents Messages')
			.append('current_page', 'messages')
			.append('logged', new Parents().Session.Connected(req))
			.object)
	}
};
