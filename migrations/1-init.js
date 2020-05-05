module.exports = {
	up: `
		create table users (
			id int unsigned not null auto_increment,
			createdAt datetime,
			companyId int unsigned,
			name char(255),
			email char(255),
			password char(255),
			primary key (id),
			key (email)
		);
		
		create table relationships (
			id int unsigned not null auto_increment,
			userId int unsigned,
			type enum(
				"manager",
				"worker",
				"admin"
			),
			entityType enum(
				"company",
				"site"
			),
			entityId int unsigned null,
			primary key (id),
			key (userId),
			key (type),
			key (entityType),
			key (entityId)
		);
		
		create table emails (
			id int unsigned not null auto_increment,
			sentAt datetime,
			\`from\` char(255),
			\`to\` char(255),
			subject char(255),
			template char(32),
			locals json,
			body longtext,
			attachments json,
			primary key (id),
			key (sentAt),
			key (\`from\`),
			key (\`to\`),
			key (template)
		);
	`,
	
	down: `
		drop table users;
		drop table relationships;
		drop table emails;
	`,
};
