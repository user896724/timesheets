let User = require("./User");
let Company = require("./Company");
let Invite = require("./Invite");
let Entry = require("./Entry");
let relationships = require("./relationships");

module.exports = class {
	constructor(db) {
		this.User = User(this, db);
		this.Company = Company(this, db);
		this.Invite = Invite(this, db);
		this.Entry = Entry(this, db);
		this.relationships = relationships(this, db);
	}
}
