let http = require("http");
let repl = require("repl");
let mysql = require("./modules/mysql");
let Core = require("./core/Core");
let config = require("../config/api");
let api = require("./api");

(async function() {
	process.chdir(__dirname);
	
	let db = await mysql(config.db);
	let core = new Core(db);
	
	if (!config.replOnly) {
		http.createServer(await api(core, config, db)).listen(config.port);
	}
	
	Object.assign(repl.start("> ").context, {
		core,
		config,
	});
})();
