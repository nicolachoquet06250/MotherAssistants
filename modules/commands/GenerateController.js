let Command = require('./Command');
let fs = require('fs');

module.exports = class GenerateController extends Command {
	static get controllerFileName() {
		return `${GenerateController.controllerName.substr(0, 1).toUpperCase()}${GenerateController.controllerName.substr(1, GenerateController.controllerName.length - 1)}Controller.js`;
	}
	static get controllerPath() {
		return `${__dirname}/../../routes/controllers/${GenerateController.controllerFileName}`;
	}
	static get modulePath() {
		return `${__dirname}/../../routes/modules/${GenerateController.controllerName}.js`
	}
	static get confPath() {
		return `${__dirname}/../../routes/conf/routes`;
	}

	static get controllerTemplate() {
		return `module.exports = class ${GenerateController.controllerName.substr(0, 1).toUpperCase()}${GenerateController.controllerName.substr(1, GenerateController.controllerName.length - 1)} {

	static get routes() {
		return {
			get: {
				'/route/path': ${GenerateController.controllerName.substr(0, 1).toUpperCase()}${GenerateController.controllerName.substr(1, GenerateController.controllerName.length - 1)}.GetHome
			},
			post: {
				'/route/path': ${GenerateController.controllerName.substr(0, 1).toUpperCase()}${GenerateController.controllerName.substr(1, GenerateController.controllerName.length - 1)}.PostHome
			}
		}
	}

	static get module() {
		return '${GenerateController.controllerName}';
	}

	static GetHome(req, res, next) {
		res.render('index', { title: 'Get Home' });
	}

	static PostHome(req, res, next) {
		res.render('index', { title: 'Post Home' });
	}
};`;
	}
	static get moduleTemplate() {
		return `let express = require('express');
let router = express.Router();
let loadRoutes = require('../loadRoutes').loadRoute;

loadRoutes('${GenerateController.controllerName}', router);

module.exports = router;
`;
	}

	run(argv) {
		GenerateController.controllerName = argv.shift();
		new Promise((resolve, reject) => {
			fs.writeFile(GenerateController.controllerPath, GenerateController.controllerTemplate,
				err => err ? console.error(err) : console.log(`${GenerateController.controllerFileName} controller has been generated !`));

			fs.writeFile(`${GenerateController.modulePath}`, GenerateController.moduleTemplate,
				err => err ? console.error(err) : console.log(`${GenerateController.controllerName}.js module has been generated !`));
				resolve();
		}).then(() => {
			console.log(`controller creation is finished !`);
			console.log(`add this line to the routes array in '${GenerateController.confPath}.js' file and add module reference in modules reference in the same file.`);
		});
	}
};