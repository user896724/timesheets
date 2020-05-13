let {find} = require("../utils/collections");

function findRels(user, type=null, entityType=null, entityId=null) {
	return user.relationships.filter(function(rel) {
		return (
			(!type || rel.type === type)
			&& (!entityType || rel.entityType === entityType)
			&& (!entityId || rel.entityId === entityId)
		);
	});
}

function hasRel(user, type=null, entityType=null, entityId=null) {
	return findRels(user, type, entityType, entityId).length > 0;
}

let helpers = {
	isAdmin(user) {
		return hasRel(user, "admin", "site");
	},
	
	isManager(user, companyId=null) {
		return hasRel(user, "manager", "company", companyId);
	},
	
	isManagerOf(manager, user) {
		let managerRelationships = findRels(manager, "manager", "company");
		let userRelationships = findRels(user, "worker", "company");
		
		for (let managerRel of managerRelationships) {
			if (userRelationships.filter(function(rel) {
				return rel.entityId === managerRel.entityId;
			}).length > 0) {
				return true;
			}
		}
		
		return false;
	},
	
	getCompanyId(user) {
		return findRels(user, "manager", "company")[0].entityId;
	},
};

module.exports = helpers;
