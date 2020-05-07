let {unauthorized} = require("../utils/responses");

module.exports = function(req, res, next) {
	if (!req.user) {
		return unauthorized(res);
	}
	
	next();
}
