module.exports.routes = {
	'/': require('../modules/home'),
	'/parents': require('../modules/parents'),
	'/account': require('../modules/account'),
	'/children': require('../modules/children'),
	'/websocket': require('../modules/websocket'),
	'/api': require('../modules/api')
};

module.exports.modules = [
	'home',
	'parents',
	'account',
	'children',
	'websocket',
	'api'
];