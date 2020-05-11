let {unauthorized, notFound, badRequest, ok} = require("../utils/responses");
let requireAuth = require("../middleware/requireAuth");
let authorisationHelpers = require("../modules/authorisationHelpers");
let Router = require("../utils/routing/Router");

module.exports = function(app, core, db) {
	let {
		Entry,
		User,
	} = core;
	
	let router = Router(app);
	
	router.use(requireAuth, async function(req, res, next) {
		let {user} = req;
		
		let userId = req.body.userId || req.query.userId;
		
		if (!userId) {
			if (authorisationHelpers.isAdmin(user)) {
				return next();
			} else {
				return unauthorized(res);
			}
		}
		
		userId = Number(userId);
		
		if (user.id !== userId) {
			let owner = await User.by.id(userId);
			
			if (!authorisationHelpers.isAdmin(user) && !authorisationHelpers.isManagerOf(user, owner)) {
				return unauthorized(res);
			}
		}
		
		next();
	});
	
	router.post("/", async function(req, res) {
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
	
	router.get("/", async function(req, res) {
		let {
			userId,
			from,
			to,
			page,
			orderBy,
			orderDir,
		} = req.query;
		
		let order = null;
		
		if (orderBy) {
			order = {
				field: orderBy,
				dir: orderDir,
			};
		}
		
		if (userId) {
			userId = Number(userId);
		}
		
		if (from) {
			from = DateTime.fromString(from);
		}
		
		if (to) {
			to = DateTime.fromString(to);
		}
		
		page = Number(page) || 0;

		let {
			rows,
			total,
			itemsPerPage,
		} = await Entry.list(userId, from, to, order, page);
		
		res.json({
			page,
			rows,
			total,
			itemsPerPage,
		});
	});
	
	router.delete("/:id", async function(req, res) {
		let id = Number(req.params.id);
		let entry = await Entry.by.id(id);
		
		if (!entry) {
			return notFound(res);
		}
		
		await entry.delete();
		
		ok(res);
	});
	
	app.use("/entries", router);
}
