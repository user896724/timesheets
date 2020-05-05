let _typeof = require("../../src/utils/typeof");

module.exports = async function(db, migration) {
	if (_typeof(migration) === "AsyncFunction") {
		await migration(db);
	} else {
		await db.query(migration);
	}
}
