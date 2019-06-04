module.exports.routes = {
	'/': require('../modules/home'),
	'/parents': require('../modules/parents'),
	'/account': require('../modules/account'),
	'/children': require('../modules/children'),
	'/websocket': require('../modules/websocket')
};

module.exports.modules = [
	'home',
	'parents',
	'account',
	'children',
	'websocket'
];