let http = require("http");
let config = require("../config/dev");
let app = require("./app");

(async function() {
	process.chdir(__dirname);
	
	http.createServer(await app(config)).listen(config.port);
})();
