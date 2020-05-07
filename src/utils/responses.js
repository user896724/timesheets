let HttpStatus = require("http-status-codes");

function error(code) {
	return function(res, error=null) {
		res.status(code);
		
		try {
			res.json(error);
		} catch (e) {
			res.json(null);
		}
	}
}

let serverError = error(HttpStatus.INTERNAL_SERVER_ERROR);

function ok(code) {
	return function(res, json=null) {
		res.status(HttpStatus.CREATED);
		res.json(json);
	}
}

module.exports = {
	notFound: error(HttpStatus.NOT_FOUND),
	conflict: error(HttpStatus.CONFLICT),
	badRequest: error(HttpStatus.BAD_REQUEST),
	
	created: ok(HttpStatus.CREATED),
	
	serverError(res, error) {
		console.error(error);
		serverError(res, error);
	},
};
