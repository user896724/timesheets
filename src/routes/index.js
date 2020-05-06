module.exports = function(app, core, db) {
	app.get("/", async function(req, res) {
		await app.mail("to", "subject", "Welcome", {
			name: "test",
		});
		
		res.end("");
	});
}
