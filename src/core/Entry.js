module.exports = function(core, db) {
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
