module.exports.routes = {
	'/': require('../modules/home'),
	'/parents': require('../modules/parents'),
	'/account': require('../modules/account'),
	'/children': require('../modules/children')
};

module.exports.modules = [
	'home',
	'parents',
	'account',
	'children'
];