let express = require("express");
let fs = require("flowfs");
let svelteViewEngine = require("svelte-view-engine");
let _typeof = require("../src/utils/typeof");

module.exports = async function(config) {
	let app = express();
	
	app.enable("trust proxy");
	
	let engine = svelteViewEngine(config.svelte);

	let {
		dir,
		type,
	} = config.svelte;
	
	app.engine(type, (...args) => engine.render(...args));
	app.set("view engine", type);
	app.set("views", dir);
	
	app._engine = engine;
	
	if (config.watch) {
		require("./watch")(engine);
	}
	
	/*
	rebuild the page on hard reload in Chrome
	
	svelte-view-engine checks the props for _rebuild and chrome sets
	cache-control to no-cache for hard reloads
	*/
	
	app.use(function(req, res, next) {
		if (req.headers["cache-control"] === "no-cache") {
			res.locals._rebuild = true;
		}
		
		next();
	});
	
	app.get("/favicon.ico", function(req, res) {
		res.send("");
	});
	
	app.get("/", function(req, res) {
		res.render("Index");
	});
	
	app.use(express.static("../static"));
	
	app.use(function(req, res) {
		res.status(404);
		res.send("404");
	});
	
	return app;
}
