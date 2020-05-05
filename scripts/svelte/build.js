let yargs = require("yargs");
let fs = require("flowfs");
let buildDom = require("./buildDomComponent");
//let buildSsr = require("./buildSsrComponent");

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
				//server,
			} = await buildFile.readJson();
			
			cache.client = client.cache;
			//cache.server = server.cache;
		}
		
		let client = await buildDom(path, name, options, cache.client);
		//let server = await buildSsr(path, options, cache.server);
		
		await buildFile.parent.mkdirp();
		
		await buildFile.writeJson({
			client,
			//server,
		});
	} catch (e) {
		console.error(e);
		
		process.exit(1);
	}
})();
