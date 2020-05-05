let User = require("./User");

module.exports = class {
	constructor(db) {
		this.User = User(this, db);
	}
}
