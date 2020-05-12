module.exports = {
	up: `
		update users set prefs = '{"preferredWorkingHoursPerDay": 8}'
		where prefs is null;
	`,
};
