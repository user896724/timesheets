let {conflict, badRequest, created} = require("../utils/responses");
let hash = require("../utils/hash");
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
}
