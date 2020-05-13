let {unauthorized, notFound, created, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");

module.exports = function(app, core, db) {
	let {
		Company,
		Invite,
		relationships,
	} = core;
	
	app.get("/company/:id/workers", requireAuth, async function(req, res) {
		let companyId = Number(req.params.id);
		let {user} = req;
		
		if (!user.isManager(companyId)) {
			return unauthorized(res);
		}
		
		let company = await Company.by.id(companyId);
		
		if (!company) {
			return notFound(res);
		}
		
		let workers = await company.workers;
		
		ok(res, workers);
	});
	
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
	
	app.delete("/company/:companyId/worker/:userId", requireAuth, async function(req, res) {
		let companyId = Number(req.params.companyId);
		let userId = Number(req.params.userId);
		let {user} = req;
		
		if (!user.isManager(companyId)) {
			return unauthorized(res);
		}
		
		let company = await Company.by.id(companyId);
		
		if (!company) {
			return notFound(res);
		}
		
		await company.removeWorker(userId);
		
		ok(res);
	});
}
