module.exports = class Home {

	static get routes() {
		return {
			get: {
				'/': Home.home,
				'/home': Home.home,
				'/manifest.json': Home.manifest,
				'/sw.js': Home.serviceWorker
			}
		}
	}

	static get module() {
		return 'home';
	}

	static home(req, res) {
		let connector = require('../../modules/database/mongodb_connector');

		res.send('host: ' + require('../../modules/database/bdd_host') + ', prefix: ' + require('../../modules/database/bdd_prefix'));
		res.end();

		// connector.onMongoConnect(client => {
		// 	res.render('home/index', { title: 'General Home' });
		// }, err => res.status(403).render('error', { message: 'Forbidden', error: { status: 403, stack: err } }));
	}


	static manifest(req, res) {
		let fs = require('fs');
		res.send(fs.readFileSync(`${__dirname}/../../manifest.json`).toString());
		res.end();
	}

	static serviceWorker(req, res) {
		let fs = require('fs');
		res.type('application/javascript');
		res.send(fs.readFileSync(`${__dirname}/../../sw.js`).toString());
		res.end();
	}
};