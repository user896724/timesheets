let jwt = require("jsonwebtoken");
let {unauthorized, ok} = require("../utils/responses");
let hash = require("../utils/hash");
let users = require("../modules/users");

module.exports = function(app, core, db) {
	let {
		User,
	} = core;
	
	app.post("/login", async function(req, res) {
		let {
			email,
			password,
		} = req.body;
		
		let match = false;
		let user = await User.by.email(email);
		
		if (user) {
			match = await hash.compare(password, user.password);
		}
		
		if (!match) {
			return unauthorized(res);
		}
		
		ok(res, {
			user,
			authToken: jwt.sign(user.id, app.config.tokenSecret),
		});
	});
}
