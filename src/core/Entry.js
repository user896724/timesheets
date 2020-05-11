module.exports = function(core, db) {
	let itemsPerPage = 10;

	class Entry {
		constructor(details={}) {
			Object.assign(this, {
				id: null,
				createdAt: null,
				userId: null,
				dateWorked: null,
				description: "",
				hours: null,
			}, details);
		}
		
		static async new(row) {
			let entry = new Entry({
				createdAt: db.now(),
				...row,
			});
			
			await entry.save();
			
			return entry;
		}
		
		static async find(fields) {
			let row = await db.find("entries", fields);
			
			if (row) {
				let entry = new Entry();
				
				await entry.load(row);
				
				return entry;
			} else {
				return null;
			}
		}
		
		static async list(userId, from, to, order, page=0) {
			let where = [db.buildWhere({
				userId,
			})];
			
			if (from) {
				where.push("dateWorked >= :from");
			}
			
			if (to) {
				where.push("dateWorked <= :to");
			}
			
			let whereString = where.join(" and ");
			
			if (whereString) {
				whereString = "where " + whereString;
			}
			
			page *= itemsPerPage;
			
			let query = select => `
				select ${select} from entries
				join users on users.id = entries.userId
				${whereString}
				${order ? "order by " + order.field + " " + order.dir : ""}
				limit :itemsPerPage offset :page
			`;
			
			let params = {
				userId,
				from,
				to,
				itemsPerPage,
				page,
			}
			
			let total = await db.cell(query("count(*)"), params);
			let rows = await db.query(query("entries.*, users.name as user"), params);
			
			return {
				total,
				rows,
				itemsPerPage,
			};
		}
		
		get notes() {
			return db.table("select * from entryNotes where id = ?", [this.id]);
		}
		
		async load(row) {
			Object.assign(this, row);
		}
		
		async update(details) {
			Object.assign(this, details);
			
			await this.save();
		}
		
		addNote(userId, note) {
			return db.insert("entryNotes", {
				createdAt: db.now(),
				userId,
				entryId: this.id,
				note,
			});
		}
		
		async save() {
			let row = this.toRow();
			let isNew = this.id === null;
			
			if (isNew) {
				let {insertId} = await db.insert("entries", row);
				
				this.id = insertId;
			} else {
				await db.update("entries", this.id, row);
			}
		}
	
		async delete() {
			await db.delete("entries", {
				id: this.id,
			});
			
			await db.delete("entryNotes", {
				entryId: this.id,
			});
		}
		
		toRow() {
			return {
				createdAt: this.createdAt,
				userId: this.userId,
				dateWorked: this.dateWorked,
				description: this.description,
				hours: this.hours,
			};
		}
	
		toJSON() {
			return {
				id: this.id,
				userId: this.userId,
				dateWorked: this.dateWorked,
				description: this.description,
				hours: this.hours,
			};
		}
	}
	
	Entry.by = {
		id(id) {
			return Entry.find({id});
		},
	};
	
	return Entry;
}
