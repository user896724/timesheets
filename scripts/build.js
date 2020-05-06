#!/usr/bin/env node

let fs = require("flowfs");
let svelteViewEngine = require("svelte-view-engine");
let svelte = require("../config/svelte");

(async function() {
	let root = __dirname + "/..";
	
	process.chdir(root);
	
	let config = svelte({
		dir: root + "/src/app",
	});
	
	let engine = svelteViewEngine(config);
	
	await engine.render(root + "/src/app/App.svelte", {
		_rebuild: true,
	});
	
	let [c] = Object.values(engine.pages);
	
	await fs("static/js").child("App.js").write(c.clientComponent.js.code);
})();
