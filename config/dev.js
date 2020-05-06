let yargs = require("yargs");
let svelte = require("./svelteDev");

yargs.alias({
	p: "port",
});

yargs.number("port");

let {
	HOME,
} = process.env;

let args = yargs.argv;

let config = {
	watch: true,
	port: 3110,
	nodeEnv: "development",
	
	svelte: svelte({
		init: true,
		watch: true,
		liveReload: true,
		liveReloadPort: 48010,
		transpile: false,
		minify: false,
		saveJs: true,
		rebuildOnRenderError: true,
		renderBeforeInit: true,
		dev: true,
	}),
}

let overrides = ["port"];

for (let key of overrides) {
	if (key in args) {
		config[key] = args[key];
	}
}

// pm2 doesn't pass NODE_ENV through (used by svelte-view-engine)
process.env.NODE_ENV = config.nodeEnv;

module.exports = config;
