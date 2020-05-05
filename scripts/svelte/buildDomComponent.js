let fs = require("flowfs/mkdirp");
let rollup = require("rollup");
let svelte = require("rollup-plugin-svelte");
let resolve = require("rollup-plugin-node-resolve");
let commonjs = require("rollup-plugin-commonjs");
let json = require("@rollup/plugin-json");
let terser = require("terser");
let babel = require("./babel");
let sass = require("./sass");

let pathStartRe = /([A-Z]:|\/)/;

module.exports = async function(path, name, options, cache) {
	let inputOptions = {
		input: path,
		cache,
		
		plugins: [
			svelte({
				hydratable: true,
				
				preprocess: {
					style: sass,
				},
				
				css: !!options.clientCss,
				
				onwarn() {},
				
				dev: options.dev,
			}),
	
			resolve({
				browser: true,
			}),
			
			commonjs(),
			
			json(),
		],
	};
	
	/*
	if we're transpiling, do CJS instead of IIFE.  this is because babel with
	useBuiltIns: "usage" (required for converting async/await) adds CJS
	requires for core-js.  The babel code takes a CJS module, babels it, then
	rolls it up into an IIFE (so with transpilation it ends up being rolled up
	twice)
	*/
	
	let outputOptions = {
		name,
		format: options.transpile ? "cjs" : "iife",
	};
	
	let bundle = await rollup.rollup(inputOptions);
	
	let {output} = await bundle.generate(outputOptions);
	
	let js = output[0];
	
	if (options.saveJs) {
		fs(path).reparent(options.dir, options.buildDir).withExt(".client.js").write(js.code);
	}
	
	if (options.transpile) {
		js = await babel(path, name, js.code);
	}
	
	if (options.minify) {
		js = terser.minify(js.code);
	}
	
	return {
		cache: options.cache && bundle.cache,
		js,
		
		watchFiles: bundle.watchFiles.map(function(path) {
			/*
			some paths have markers from rollup plugins - strip these for watching
			
			some are also not absolute; these are also internal to rollup and can
			be stripped
			*/
			
			let start = path.match(pathStartRe);
			
			if (start) {
				return path.substr(start.index);
			} else {
				return false;
			}
		}).filter(Boolean),
	};
}
