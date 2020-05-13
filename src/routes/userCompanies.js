let {conflict, unauthorized, badRequest, created, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");
let authorisationHelpers = require("../modules/authorisationHelpers");

module.exports = function(app, core, db) {
	let {
		Company,
		relationships,
	} = core;
	
	app.post("/user/:id/companies", requireAuth, async function(req, res) {
		let adminUserId = Number(req.params.id);
		
		let {
			name,
		} = req.body;
		
		let {user} = req;
		
		if (authorisationHelpers.isManager(user)) {
			return conflict(res);
		}
		
		if (adminUserId !== user.id) {
			return unauthorized(res);
		}
		
		if (!name) {
			return badRequest(res);
		}
		
		let company = await Company.new({
			name,
		});
		
		await relationships.addManager(company.id, adminUserId);
		
		created(res, company);
	});
}
