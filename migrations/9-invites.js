module.exports = {
	up: `
		create table invites (
			id int unsigned not null auto_increment,
			companyId int unsigned,
			email char(255),
			code char(255),
			primary key (id),
			key (companyId),
			key (email),
			key (code)
		);
	`,
	
	down: `
		drop table invites;
	`,
};
