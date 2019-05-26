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
		// let connector = require('../../modules/database/mongodb_connector');
		//
		// connector.onMongoConnect(client => {
			res.render('home/index', {
				title: 'Mother-Assistants',
				app: {
					presentation: [`Cette application vous servira à répertorier les enfants que vous gardez à un seul endroit, ainsi que leur parents et les informations qui les concernent.`,
									`ainsi, vous pourez communiquer avec les parents sur l'application, poster des photos accessibles par les 2 parents, ainsi que noter les différents activitées pratiqués la journée, les repas, les besoins, etc`,
									`tout ça sous forme de calandrier, ce qui rend plus simple la recherche d'un évenement en particulier `]
				},
				current_page: 'home',
				logged: false
			});
		// }, err => {
		// 	res.status(403).render('error', {
		// 		message: 'Forbidden',
		// 		error: {
		// 			status: 403,
		// 			stack: err
		// 		}
		// 	})
		// });
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