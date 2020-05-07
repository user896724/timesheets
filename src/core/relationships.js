module.exports = function(core, db) {
	let rel = {
		async add(userId, type, entityType, entityId) {
			if (await db.find("relationships", {
				userId,
				type,
				entityType,
				entityId,
			})) {
				return;
			}
			
			return db.insert("relationships", {
				userId,
				type,
				entityType,
				entityId,
			});
		},
		
		remove(userId, type, entityType, entityId) {
			return db.delete("relationships", {
				userId,
				type,
				entityType,
				entityId,
			});
		},
		
		addManager(companyId, userId) {
			return rel.add(userId, "manager", "company", companyId);
		},
	};
	
	return rel;
}
