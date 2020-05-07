let yargs = require("yargs");
let svelteMail = require("./svelteMail");

require("dotenv").config();

yargs.alias({
	r: "replOnly",
	p: "port",
});

yargs.boolean("replOnly");
yargs.number("port");

let {
	HOME,
	ENV,
} = process.env;

let args = yargs.argv;
let env = args.env || ENV || "dev";

function common(overrides) {
	return Object.assign({
		env,
		port: 3120,
		mailFrom: "Timesheets<timesheets@localhost>",
		replOnly: false,
		nodeEnv: "production",
		svelteMail: svelteMail(),
		corsOrigins: [
			/^http:\/\/tt$/,
		],
	}, overrides);
}

let envs = {
	dev: common({
		watch: true,
		nodeEnv: "development",
		
		svelteMail: svelteMail({
			init: true,
			watch: true,
			liveReload: true,
			liveReloadPort: 48011,
			transpile: false,
			minify: false,
			rebuildOnRenderError: true,
			renderBeforeInit: true,
			dev: true,
		}),
	}),
	
	vps: common(),
};

let config = envs[env];

let overrides = {
	port: "PORT",
	db: "DB",
	tokenSecret: "TOKEN_SECRET",
	nodeEnv: "NODE_ENV",
	replOnly: null,
};

for (let [argsKey, envKey] of Object.entries(overrides)) {
	if (argsKey in args) {
		config[argsKey] = args[argsKey];
	} else if (envKey && (envKey in process.env)) {
		config[argsKey] = process.env[envKey];
	}
}

// pm2 doesn't pass NODE_ENV through (used by svelte-view-engine)
process.env.NODE_ENV = config.nodeEnv;

module.exports = config;
