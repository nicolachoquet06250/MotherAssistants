module.exports.routes = {
	'/': require('../modules/home'),
	'/parents': require('../modules/parents'),
	'/account': require('../modules/account')
};

module.exports.modules = [
	'home',
	'parents',
	'account'
];