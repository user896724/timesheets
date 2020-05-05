let root = __dirname + "/..";

module.exports = function(overrides) {
	return Object.assign({
		buildDir: "/tmp/svelte/timesheets",
		template: `${root}/dev/template.html`,
		dir: `${root}/dev/pages`,
		type: "html",
		buildScript: `${root}/scripts/svelte/build.js`,
		watch: false,
		transpile: true,
		minify: true,
		clientCss: true,
		saveJs: false,
		dev: false,
	}, overrides);
};
