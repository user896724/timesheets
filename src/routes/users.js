let {conflict, badRequest, unauthorized, created, ok} = require("../utils/responses");
let hash = require("../utils/hash");
let requireAuth = require("../middleware/requireAuth");
let users = require("../modules/users");

module.exports = function(app, core, db) {
	let {
		User,
	} = core;
	
	app.post("/users", async function(req, res) {
		let {
			name,
			email,
			password,
		} = req.body;
		
		if (await User.by.email(email)) {
			return conflict(res);
		}
		
		if (password.length < users.minPasswordLength) {
			return badRequest(res);
		}
		
		let user = await User.new({
			name,
			email,
			password: await hash.hash(password),
		});
		
		created(res, user);
	});
	
	app.patch("/users/:id", requireAuth, async function(req, res) {
		let {user} = req;
		let id = Number(req.params.id);
		
		if (user.id !== id) {
			return unauthorized(res);
		}
		
		if ("email" in req.body) {
			return badRequest(res);
		}
		
		await user.update(req.body);
		
		ok(res);
	});
}
