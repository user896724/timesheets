module.exports = {
	apps: [
		{
			name: "timesheets-api",
			script: "src/main.js",
			watch: true,
			ignore_watch: [
				".git",
				"src/app",
				"src/emails",
			],
		},
	],
};
