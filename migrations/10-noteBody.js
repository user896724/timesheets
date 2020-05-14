module.exports = {
	up: `
		alter table entryNotes
		change column note body longtext;
	`,
	
	down: `
		alter table entryNotes
		change column body note longtext;
	`,
};
