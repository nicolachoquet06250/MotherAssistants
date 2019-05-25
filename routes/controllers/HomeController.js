module.exports = class Home {

	static get routes() {
		return {
			get: {
				'/': Home.home,
				'/home': Home.home,
				'/manifest.json': Home.manifest
			}
		}
	}

	static get module() {
		return 'home';
	}

	static home(req, res, next) {
		let mongodb = require('../../modules/database/mongodb_connector');
		mongodb.client.connect(err => {
			if(err === null) {
				console.log('connection ok');
				let db = mongodb.client.db(mongodb.dbName);
				db.collection('users');
				db.collection('activities');

				mongodb.client.close();
			}
		});
		res.render('index', { title: 'Express' });
	}


	static manifest(req, res, next) {
		let fs = require('fs');
		res.send(fs.readFileSync(`${__dirname}/../../manifest.json`).toString());
		res.end();
	}
};