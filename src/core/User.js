let jsonCopy = require("../utils/jsonCopy");
let authorisationHelpers = require("../modules/authorisationHelpers");
let defaultPrefs = require("../modules/defaultPrefs");

module.exports = function(core, db) {
	class User {
		constructor(details={}) {
			Object.assign(this, {
				id: null,
				createdAt: null,
				name: "",
				email: "",
				password: "",
				prefs: jsonCopy(defaultPrefs),
			}, details);
			
			this.relationships = [];
		}
		
		isAdmin() {
			return authorisationHelpers.isAdmin(this);
		}
		
		isManager(companyId) {
			return authorisationHelpers.isManager(this, companyId);
		}
		
		static async new(row) {
			let user = new User({
				createdAt: db.now(),
				...row,
			});
			
			await user.save();
			
			return user;
		}
		
		static async find(fields) {
			let row = await db.find("users", fields);
			
			if (row) {
				let user = new User();
				
				await user.load(row);
				
				return user;
			} else {
				return null;
			}
		}
		
		async load(row) {
			Object.assign(this, row);
			
			this.relationships = await db.table(`
				select * from relationships
				where userId = ?
			`, [this.id]);
		}
		
		async update(details) {
			Object.assign(this, details);
			
			await this.save();
		}
		
		async save() {
			let row = this.toRow();
			let isNew = this.id === null;
			
			if (!isNew) {
				await db.query("delete from relationships where userId = ?", [this.id]);
			}
			
			if (isNew) {
				let {insertId} = await db.insert("users", row);
				
				this.id = insertId;
			} else {
				await db.update("users", this.id, row);
			}
			
			await db.insert("relationships", this.relationships.map(rel => ({
				userId: this.id,
				...rel,
			})));
		}
	
		async delete() {
			await db.delete("users", {
				id: this.id,
			});
			
			await db.delete("relationships", {
				userId: this.id,
			});
		}
		
		toRow() {
			return {
				createdAt: this.createdAt,
				name: this.name,
				email: this.email,
				password: this.password,
				prefs: this.prefs,
			};
		}
	
		toJSON() {
			return {
				id: this.id,
				email: this.email,
				name: this.name,
				relationships: this.relationships,
				prefs: this.prefs,
			};
		}
	}
	
	User.by = {
		email(email) {
			return User.find({email});
		},
		
		id(id) {
			return User.find({id});
		},
	};
	
	return User;
}
