let {notFound, ok} = require("../utils/responses");

module.exports = function(app, core, db) {
	let {
		Invite,
	} = core;
	
	app.get("/invite/:code", async function(req, res) {
		let {code} = req.params;
		let {email} = req.query;
		
		let invite = await Invite.find({
			email,
			code,
		});
		
		if (!invite) {
			return notFound(res);
		}
		
		ok(res, invite);
	});
}
