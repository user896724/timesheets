let bluebird = require("bluebird");
let {unauthorized, notFound, badRequest, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");
let DateTime = require("../modules/types/DateTime");
let authorisationHelpers = require("../modules/authorisationHelpers");
let Router = require("../utils/routing/Router");

module.exports = function(app, core, db) {
	let {
		Entry,
		User,
	} = core;
	
	let router = Router(app);
	
	router.use(requireAuth);
	
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
	
	async function ownerAuth(req, res, next) {
		let {user} = req;
		
		let ownerId = req.body.userId || req.query.userId;
		
		if (!ownerId) {
			if (authorisationHelpers.isAdmin(user)) {
				return next();
			} else {
				return unauthorized(res);
			}
		}
		
		if (!await userCanModify(user, Number(ownerId))) {
			return unauthorized(res);
		}
		
		next();
	}
	
	router.post("/", ownerAuth, async function(req, res) {
		let {
			userId,
			entry: {
				dateWorked,
				description,
				hours,
			},
		} = req.body;
		
		let entry = await Entry.new({
			userId,
			dateWorked,
			description,
			hours,
		});
		
		ok(res, entry);
	});
	
	router.get("/", ownerAuth, async function(req, res) {
		let {
			userId,
			from,
			to,
		} = req.query;
		
		if (userId) {
			userId = Number(userId);
		}
		
		if (from) {
			from = DateTime.fromString(from);
		}
		
		if (to) {
			to = DateTime.fromString(to);
		}
		
		let rows = await Entry.list(userId, from, to);
		
		res.json(rows);
	});
	
	router.delete("/:id", async function(req, res) {
		let {user} = req;
		let id = Number(req.params.id);
		let entry = await Entry.by.id(id);
		
		if (!entry) {
			return notFound(res);
		}
		
		if (!await userCanModify(user, entry.id)) {
			return unauthorized(res);
		}
		
		await entry.delete();
		
		ok(res);
	});
	
	router.put("/", async function(req, res) {
		let {user} = req;
		
		let entries = await bluebird.map(req.body, async function(entry) {
			return {
				entry: await Entry.by.id(entry.id),
				update: entry,
			};
		});
		
		let authorized = true;
		
		await bluebird.all(entries.map(async function({entry}) {
			if (!await userCanModify(user, entry.id)) {
				authorized = false;
			}
		}));
		
		if (!authorized) {
			return unauthorized(res);
		}
		
		await bluebird.map(entries, async function({entry, update}) {
			await entry.update(update);
		});
		
		ok(res);
	});
	
	app.use("/entries", router);
}
