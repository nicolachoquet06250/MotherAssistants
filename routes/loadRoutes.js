let loadRouteHelper = (router, method, route, callback) => router[method](route, callback);

module.exports.loadRoute = (module, router) => {
	let moduleRoutes = require(`./controllers/${module.substr(0, 1).toUpperCase()}${module.substr(1, module.length - 1)}Controller`);
	if(moduleRoutes.routes.get !== undefined)
		for (let moduleRoute in moduleRoutes.routes.get)
			loadRouteHelper(router, 'get', moduleRoute, moduleRoutes.routes.get[moduleRoute]);
	if(moduleRoutes.routes.post !== undefined)
		for (let moduleRoute in moduleRoutes.routes.post)
			loadRouteHelper(router, 'post', moduleRoute, moduleRoutes.routes.post[moduleRoute]);
};

module.exports.loadRoutes = (app) => {
	let routes = require('../routes/conf/routes').routes;
	for(let route in routes) app.use(route, routes[route]);
};