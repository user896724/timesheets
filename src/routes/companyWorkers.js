let {unauthorized, created} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");

module.exports = function(app, core, db) {
	let {
		Invite,
		relationships,
	} = core;
	
	app.post("/company/:id/workers", requireAuth, async function(req, res) {
		let companyId = Number(req.params.id);
		let {userId} = req.body;
		let {user} = req;
		
		if (userId !== user.id) {
			return unauthorized(res);
		}
		
		let invite = await Invite.find({
			companyId,
			email: user.email,
		});
		
		if (!invite) {
			return unauthorized(res);
		}
		
		await relationships.joinCompany(companyId, userId);
		await invite.delete();
		
		created(res);
	});
}
