module.exports = {
	notFound(res) {
		res.status(404);
		res.json(null);
	},
	
	serverError(res, error) {
		console.error(error);
		
		res.status(500);
		
		try {
			res.json(error);
		} catch (e) {
			res.json("Unknown error");
		}
	},
};
