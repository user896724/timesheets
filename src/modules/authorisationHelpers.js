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
};

module.exports = helpers;
