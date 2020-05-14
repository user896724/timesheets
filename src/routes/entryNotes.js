let bluebird = require("bluebird");
let {unauthorized, notFound, badRequest, created, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");
let DateTime = require("../modules/types/DateTime");
let authorisationHelpers = require("../modules/authorisationHelpers");

module.exports = function(app, core, db) {
	let {
		Entry,
		User,
	} = core;
	
	async function userCanModify(user, ownerId) {
		if (user.id === ownerId) {
			return true;
		}
		
		let owner = await User.by.id(ownerId);
		
		if (authorisationHelpers.isAdmin(user) || authorisationHelpers.isManagerOf(user, owner)) {
			return true;
		}
		
		return false;
	}

	app.post("/entry/:id/notes", requireAuth, async function(req, res) {
		let {
			body,
		} = req.body;
		
		if (!body) {
			return badRequest(res);
		}
		
		let {user} = req;
		let id = Number(req.params.id);
		let entry = await Entry.by.id(id);
		
		if (!entry) {
			return notFound(res);
		}
		
		if (!await userCanModify(user, entry.userId)) {
			return unauthorized(res);
		}
		
		let note = await entry.addNote(user.id, body);
		
		created(res, note);
	});

	app.get("/entry/:id/notes", requireAuth, async function(req, res) {
		let {user} = req;
		let id = Number(req.params.id);
		let entry = await Entry.by.id(id);
		
		if (!entry) {
			return notFound(res);
		}
		
		if (!await userCanModify(user, entry.userId)) {
			return unauthorized(res);
		}
		
		let notes = await entry.notes;
		
		ok(res, notes);
	});
}
