let {conflict, unauthorized, badRequest, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");
let authorisationHelpers = require("../modules/authorisationHelpers");

module.exports = function(app, core, db) {
	let {
		Company,
		relationships,
	} = core;
	
	app.post("/companies", requireAuth, async function(req, res) {
		let {
			name,
			adminUserId,
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
		
		ok(res, company);
	});
}
