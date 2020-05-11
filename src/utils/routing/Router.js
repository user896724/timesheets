let express = require("express");
let expressAsyncWrap = require("./expressAsyncWrap");

module.exports = function(app) {
	let router = express.Router();
	
	expressAsyncWrap(router);
	
	router.app = app;
	
	return router;
}
