module.exports = {
	up: `
		alter table users
		add column prefs json after password;
	`,
	
	down: `
		alter table users
		drop column prefs;
	`,
};
