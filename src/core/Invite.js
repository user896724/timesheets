let randomId = require("../utils/randomId");

module.exports = function(core, db) {
	class Invite {
		constructor(details={}) {
			Object.assign(this, {
				id: null,
				companyId: null,
				email: "",
				code: "",
			}, details);
		}
		
		static async create(companyId, email) {
			let invite = new Invite({
				companyId,
				email,
				code: await randomId(32),
			});
			
			await invite.save();
			
			return invite;
		}
		
		static async find(fields) {
			let row = await db.find("invites", fields);
			
			if (row) {
				let invite = new Invite();
				
				await invite.load(row);
				
				return invite;
			} else {
				return null;
			}
		}
		
		static exists(companyId, email) {
			return db.exists(`
				select * from invites
				where companyId = :companyId
				and email = :email
			`, {
				companyId,
				email,
			});
		}
		
		static list(companyId) {
			return db.query("select * from invites where companyId = ?", [companyId]);
		}
		
		async load(row) {
			Object.assign(this, row);
		}
		
		async update(details) {
			Object.assign(this, details);
			
			await this.save();
		}
		
		async save() {
			let row = this.toRow();
			let isNew = this.id === null;
			
			if (isNew) {
				let {insertId} = await db.insert("invites", row);
				
				this.id = insertId;
			} else {
				await db.update("invites", this.id, row);
			}
		}
	
		async delete() {
			await db.delete("invites", {
				id: this.id,
			});
		}
		
		toRow() {
			return {
				companyId: this.companyId,
				email: this.email,
				code: this.code,
			};
		}
	
		toJSON() {
			return {
				id: this.id,
				companyId: this.companyId,
				email: this.email,
				code: this.code,
			};
		}
	}
	
	Invite.by = {
		id(id) {
			return Invite.find({id});
		},
		
		code(code) {
			return Invite.find({code});
		},
	};
	
	return Invite;
}
