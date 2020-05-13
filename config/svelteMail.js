let root = __dirname + "/..";

module.exports = function(overrides) {
	return Object.assign({
		buildDir: "/tmp/svelte/timesheets-mail",
		template: `${root}/src/emails/template.html`,
		dir: `${root}/src/emails/pages`,
		type: "html",
		buildScript: `${root}/scripts/svelte/build.js`,
		ssr: true,
		watch: false,
		liveReload: false,
		clientCss: false,
		saveJs: false,
		dev: false,
	}, overrides);
}
