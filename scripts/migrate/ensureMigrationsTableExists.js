module.exports = async function(db) {
	try {
		await db.query("select 1 from migrations limit 1");
	} catch (e) {
		await db.query(`
			create table migrations (
				id bigint unsigned not null auto_increment,
				appliedAt datetime,
				version int unsigned,
				name char(255),
				primary key (id),
				key (appliedAt),
				key (version)
			);
		`);
	}
}
