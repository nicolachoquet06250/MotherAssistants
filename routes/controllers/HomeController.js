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
				// '/socket.io/socket.io.js': Home.socketIOClient
			},
			post: {
				'/contacts': Home.contactsPost,
				'/connected': Home.connectedPost,
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

	static contactsPost(req, res) {
		let mailer = require('nodemailer');
		let post = req.body;
		let transport = mailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: 'nicolachoquet06250@gmail.com',
				pass: '12041998Yann21071995Nicolas.'
			}
		});

		transport.sendMail({
			from: `${post.first_name} ${post.last_name}<nicolachoquet06250@gmail.com>`,
			to: post.email,
			subject: 'Contact',
			html: `<p>${post.message}</p>`
		}, (err, success) => {
			if(success) {
				console.log('mail success', success);
				res.type('application/json');
				res.send({
					success: true,
					message: 'Votre email de contact à bien été envoyé'
				});
				res.end();
			}
			if(err) {
				console.log('mail error', err);
				res.type('application/json');
				res.send({
					success: false,
					message: `Une erreur est survenue lors de l'envoie de votre email !`
				});
				res.end();
			}
			transport.close();
		});
	}

	static manifest(req, res) {
		res.type('application/json');
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

	// static socketIOClient(req, res) {
	// 	res.writeHead(200, {'Content-Type': 'application/javascript'});
	// 	res.end(require('fs').readFileSync(`${__dirname}/../../node_modules/socket.io-client/dist/socket.io.js`).toString());
	// }

	static connectedPost(req, res) {
		let ctrl = new Home();
		res.type('application/json');
		res.send({
			connected: ctrl.Session.Connected(req),
			_id: req.session.__id
		})
	}
};