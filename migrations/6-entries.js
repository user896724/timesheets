module.exports = {
	up: `
		create table entries (
			id int unsigned not null auto_increment,
			createdAt datetime,
			userId int unsigned,
			dateWorked datetime,
			description longtext,
			hours decimal(4, 2),
			key (userId),
			key (dateWorked),
			primary key (id)
		);
		
		create table entryNotes (
			id bigint unsigned not null auto_increment,
			createdAt datetime,
			userId int unsigned,
			entryId int unsigned,
			note longtext,
			key (createdAt),
			key (entryId),
			primary key (id)
		);
	`,
	
	down: `
		drop table entries;
		drop table entryNotes;
	`,
};
