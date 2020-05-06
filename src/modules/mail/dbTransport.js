let DateTime = require("../types/DateTime");

module.exports = function(db) {
	return async function(options) {
		await db.insert("emails", {
			sentAt: DateTime.now(),
			...options,
		});
	}
}
