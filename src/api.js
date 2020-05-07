let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let expressAsyncWrap = require("./utils/routing/expressAsyncWrap");
let loadRoutes = require("./utils/routing/loadRoutes");
let {notFound, serverError} = require("./utils/responses");
let authenticate = require("./middleware/authenticate");
let mail = require("./modules/mail/mail");

module.exports = async function(core, config, db) {
	let app = express();
	
	app.enable("trust proxy");
	
	expressAsyncWrap(app);
	
	app.config = config;
	
	app.mail = mail(config, db);
	
	app.use(cors({
		origin: config.corsOrigins,
		optionsSuccessStatus: 200,
	}));
	
	app.use(bodyParser.json({
		limit: "32kb",
		strict: false,
	}));
	
	app.use(authenticate(app, core));
	
	await loadRoutes(__dirname + "/routes", app, core, db);
	
	app.use(function(req, res) {
		notFound(res);
	});
	
	app.use(function(error, req, res, next) {
		serverError(res, error);
	});
	
	return app;
}
