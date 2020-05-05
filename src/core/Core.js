let User = require("./User");
let Company = require("./Company");
let relationships = require("./relationships");

module.exports = class {
	constructor(db) {
		this.User = User(this, db);
		this.Company = Company(this, db);
		this.relationships = relationships(this, db);
	}
}
