let jwt = require("jsonwebtoken");

module.exports = function(app, core) {
	return async function(req, res, next) {
		let token = req.headers["authorization"];
		
		if (token) {
			token = token.replace(/^bearer\s+/i, "");
			
			try {
				let userId = await jwt.verify(token, app.config.tokenSecret);
				
				req.user = await core.User.by.id(userId);
			} catch (e) {}
		}
		
		next();
	}
}
