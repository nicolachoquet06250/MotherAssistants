let options = require('../../modules/helpers/ViewOptions');

module.exports = class Home {

	constructor() {
		this.Session = require('../../modules/helpers/Session');
	}

	static get routes() {
		return {
			get: {
				'/': Home.home,
				'/home': Home.home,
				'/contacts': Home.contacts,
				'/manifest.json': Home.manifest,
				'/sw.js': Home.serviceWorker,
				'/node_modules/materialize-social/materialize-social.css': Home.materializeSocialCss,
			}
		}
	}

	static get module() {
		return 'home';
	}

	static home(req, res) {
		res.render('home/index', options.BaseOptions
			.append('title', 'Mother-Assistants')
			.append('app', {
				presentation: [`Cette application vous servira à répertorier les enfants que vous gardez à un seul endroit, ainsi que leur parents et les informations qui les concernent.`,
					`ainsi, vous pourez communiquer avec les parents sur l'application, poster des photos accessibles par les 2 parents, ainsi que noter les différents activitées pratiqués la journée, les repas, les besoins, etc`,
					`tout ça sous forme de calandrier, ce qui rend plus simple la recherche d'un évenement en particulier `]
			})
			.append('current_page', 'home')
			.append('logged', new Home().Session.Connected(req)).object);
	}

	static contacts(req, res) {
		res.render('home/contacts', options.BaseOptions
			.append('title', 'Contactez nous')
			.append('current_page', 'contacts')
			.append('logged', new Home().Session.Connected(req)).object)
	}

	static manifest(req, res) {
		res.send(require('fs').readFileSync(`${__dirname}/../../manifest.json`).toString());
		res.end();
	}

	static serviceWorker(req, res) {
		res.type('application/javascript');
		res.send(require('fs').readFileSync(`${__dirname}/../../sw.js`).toString());
		res.end();
	}

	static materializeSocialCss(req, res) {
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.end(require('fs').readFileSync(`${__dirname}/../../node_modules/materialize-social/materialize-social.css`).toString());
	}
};