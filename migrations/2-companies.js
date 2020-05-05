module.exports = {
	up: `
		create table companies (
			id int unsigned not null auto_increment,
			createdAt datetime,
			name char(255),
			primary key (id)
		);
	`,
	
	down: `
		drop table companies;
	`,
};
