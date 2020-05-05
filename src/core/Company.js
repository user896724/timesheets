module.exports = function(core, db) {
	class Company {
		constructor(details={}) {
			Object.assign(this, {
				id: null,
				createdAt: null,
				name: "",
			}, details);
		}
		
		static async new(row) {
			let company = new Company({
				createdAt: db.now(),
				...row,
			});
			
			await company.save();
			
			return company;
		}
		
		static async find(fields) {
			let row = await db.find("companies", fields);
			
			if (row) {
				let company = new Company();
				
				await company.load(row);
				
				return company;
			} else {
				return null;
			}
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
				let {insertId} = await db.insert("companies", row);
				
				this.id = insertId;
			} else {
				await db.update("companies", this.id, row);
			}
		}
	
		async delete() {
			await db.delete("companies", {
				id: this.id,
			});
		}
		
		toRow() {
			return {
				createdAt: this.createdAt,
				name: this.name,
			};
		}
	
		toJSON() {
			return {
				id: this.id,
				name: this.name,
			};
		}
	}
	
	Company.by = {
		id(id) {
			return Company.find({id});
		},
	};
	
	return Company;
}
