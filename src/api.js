let express = require("express");
let bodyParser = require("body-parser");
let expressAsyncWrap = require("./utils/routing/expressAsyncWrap");
let loadRoutes = require("./utils/routing/loadRoutes");
let {notFound, serverError} = require("./utils/responses");

module.exports = async function(core, config, db) {
	let app = express();
	
	expressAsyncWrap(app);
	
	app.config = config;
	
	app.enable("trust proxy");
	
	app.use(bodyParser.json({
		limit: "32kb",
		strict: false,
	}));
	
	await loadRoutes(__dirname + "/routes", app, core, db);
	
	app.use(function(req, res) {
		notFound(res);
	});
	
	app.use(function(error, req, res, next) {
		serverError(res, error);
	});
	
	return app;
}
