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
		
		static async list(userId, from, to) {
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
			
			let params = {
				userId,
				from,
				to,
			}
			
			let rows = await db.query(`
				select
					entries.*,
					users.name as user,
					(
						select sum(hours) from entries e
						where e.dateWorked = entries.dateWorked
						and e.userId = entries.userId
					) / (
						select prefs->>"$.preferredWorkingHoursPerDay"
						from users u
						where u.id = users.id
					) as ratio
				from entries
				join users on users.id = entries.userId
				${whereString}
			`, params);
			
			return rows;
		}
		
		get notes() {
			return db.query(`
				select entryNotes.*, users.name as author
				from entryNotes
				inner join users on users.id = entryNotes.userId
				where entryId = ?
				order by createdAt desc
			`, [this.id]);
		}
		
		async addNote(userId, body) {
			let row = {
				createdAt: db.now(),
				userId,
				entryId: this.id,
				body,
			};
			
			await db.insert("entryNotes", row);
			
			return row;
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
