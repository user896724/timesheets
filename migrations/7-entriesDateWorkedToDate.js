module.exports = {
	up: `
		alter table entries
		modify column dateWorked date;
	`,
	
	down: `
		alter table entries
		modify column dateWorked datetime;
	`,
};
