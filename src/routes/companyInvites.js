let {conflict, unauthorized, badRequest, notFound, created, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");
let authorisationHelpers = require("../modules/authorisationHelpers");

module.exports = function(app, core, db) {
	let {
		Invite,
		Company,
	} = core;
	
	app.post("/company/:id/invites", requireAuth, async function(req, res) {
		let companyId = Number(req.params.id);
		
		let {
			email,
		} = req.body;
		
		let {user} = req;
		
		if (!authorisationHelpers.isManager(user, companyId)) {
			return unauthorized(res);
		}
		
		if (await Invite.exists(companyId, email)) {
			return conflict(res);
		}
		
		if (!email) {
			return badRequest(res);
		}
		
		let invite = await Invite.create(companyId, email);
		let company = await Company.by.id(companyId);
		
		await app.mail(email, "Join " + company.name + " on TimeSheets", "Invite", {
			company,
			code: invite.code,
		});
		
		created(res, invite);
	});
	
	app.get("/company/:id/invites", requireAuth, async function(req, res) {
		let companyId = Number(req.params.id);
		let {user} = req;
		
		if (!authorisationHelpers.isManager(user, companyId)) {
			return unauthorized(res);
		}
		
		let invites = await Invite.list(companyId);
		
		ok(res, invites);
	});
	
	app.delete("/company/:companyId/invite/:inviteId", requireAuth, async function(req, res) {
		let companyId = Number(req.params.companyId);
		let inviteId = Number(req.params.inviteId);
		let {user} = req;
		
		if (!authorisationHelpers.isManager(user, companyId)) {
			return unauthorized(res);
		}
		
		let invite = await Invite.by.id(inviteId);
		
		if (!invite) {
			return notFound(res);
		}
		
		await invite.delete();
		
		ok(res);
	});
}
