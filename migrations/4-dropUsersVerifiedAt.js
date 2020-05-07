module.exports = {
	up: `
		alter table users
		drop column verifiedAt;
	`,
	
	down: `
		alter table users
		add column verifiedAt datetime null after createdAt,
		add key (verifiedAt);
	`,
};
