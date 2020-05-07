let yargs = require("yargs");
let fs = require("flowfs");
let buildDom = require("./buildDomComponent");
let buildSsr = require("./buildSsrComponent");

(async function() {
	try {
		let {
			name,
			path,
			buildPath,
			options,
			useCache,
		} = JSON.parse(yargs.argv._[0]);
		
		let buildFile = fs(buildPath);
		let cache = {};
		
		if (useCache && await buildFile.exists()) {
			let {
				client,
				server,
			} = await buildFile.readJson();
			
			cache.client = client.cache;
			
			if (server) {
				cache.server = server.cache;
			}
		}
		
		let json = {
			client: await buildDom(path, name, options, cache.client),
		};
		
		if (options.ssr) {
			json.server = await buildSsr(path, options, cache.server);
		}
		
		await buildFile.parent.mkdirp();
		
		await buildFile.writeJson(json);
	} catch (e) {
		console.error(e);
		
		process.exit(1);
	}
})();
