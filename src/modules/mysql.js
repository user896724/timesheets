let mysql = require("mysql");
let {ConnectionString} = require("connection-string");
let DateTime = require("../modules/types/DateTime");
let _typeof = require("../utils/typeof");

class Mysql {
	constructor(url) {
		let {
			user,
			password,
			hostname: host,
			port,
			path: database,
		} = new ConnectionString(url);
		
		password = password || "";
		port = port || 3306;
		
		this.db = mysql.createPool({
			host,
			user,
			password,
			port,
			database,
			multipleStatements: true,
			
			typeCast(field, next) {
				if (field.type === "JSON") {
					return JSON.parse(field.string());
				} else if (field.type === "TINY") {
					return field.string() === "1";
				} else if (field.type === "DATE" || field.type === "DATETIME") {
					let value = field.string();
					
					if (value) {
						return DateTime.fromDb(field.type.toLowerCase(), value);
					} else {
						return null;
					}
				} else {
					return next();
				}
			},
			
			queryFormat: (query, values) => {
				return this.formatQuery(query, values);
			},
		});
		
		this.minDateTime = "1000-01-01 00:00:00";
	}
	
	format(value) {
		let type = _typeof(value);
		
		if (DateTime.isDateTime(value)) {
			value = this.db.escape(value.toString());
		} else if (type === "Object" || type === "Array") {
			if (value.__isList) {
				let values = value.array.map(v => this.format(v)).join(", ");
				
				if (!values) {
					values = value.nullValue;
				}
				
				value = "(" + values + ")";
			} else {
				value = this.db.escape(JSON.stringify(value));
			}
		} else if (type === "Boolean") {
			value = value ? 1 : 0;
		} else {
			value = this.db.escape(value);
		}
		
		return value;
	}
	
	formatQuery(query, values) {
		if (_typeof(values) === "Object") {
			return query.replace(/:([a-zA-Z_]\w*)/g, (_, p) => this.format(values[p]));
		} else {
			let i = 0;
			
			return query.replace(/\?/g, _ => this.format(values[i++]));
		}
	}
	
	query(q, params) {
		return new Promise((resolve, reject) => {
			this.db.query(q, params, function(err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
	
	table(q, params) {
		return this.query(q, params);
	}

	async cell(q, params) {
		let row = await this.row(q, params) || {};
		
		return Object.values(row)[0] || null;
	}
	
	async col(q, params) {
		return (await this.query(q, params)).map(row => Object.values(row)[0]);
	}
	
	async row(q, params) {
		return (await this.query(q, params))[0] || null;
	}
	
	async exists(q, params) {
		return !!await this.row(q, params);
	}
	
	buildWhere(fields) {
		return Object.entries(fields).filter(function([key, value]) {
			return value !== undefined;
		}).map(function([key, value]) {
			if (value === null) {
				return "`" + key + "` is null";
			} else {
				return "`" + key + "` = :" + key;
			}
		}).join(" and ");
	}
	
	buildUpdateQuery(row) {
		return Object.keys(row).map(key => "`" + key + "` = :" + key).join(", ");
	}
	
	buildInsertQuery(row) {
		let keys = Object.keys(row);
		let placeholders = keys.map(key => ":" + key);
		
		return {
			fields: "(" + keys.map(k => "`" + k + "`").join(", ") + ")",
			placeholders: "(" + placeholders.join(", ") + ")",
			values: row,
		};
	}
	
	buildMultiInsertQuery(rows) {
		let keys = Object.keys(rows[0]);
		let placeholders = keys.map(_ => "?").join(", ");
		
		return {
			fields: "(" + keys.map(k => "`" + k + "`").join(", ") + ")",
			placeholders: rows.map(_ => "(" + placeholders + ")").join(", "),
			values: [].concat(...rows.map(row => Object.values(row))),
		};
	}
	
	insert(table, data) {
		let details;
		
		if (_typeof(data) === "Array") {
			if (data.length === 0) {
				return;
			}
			
			details = this.buildMultiInsertQuery(data);
		} else {
			details = this.buildInsertQuery(data);
		}
		
		let {fields, placeholders, values} = details;
		
		return this.query(`
			insert into ${table} ${fields}
			values ${placeholders}
		`, values);
	}
	
	update(table, id, row) {
		let updates = this.buildUpdateQuery(row);
		
		return this.query(`
			update ${table}
			set ${updates}
			where id = :id
		`, Object.assign({}, row, {
			id,
		}));
	}
	
	upsert(table, row) {
		let updates = this.buildUpdateQuery(row);
		let {fields, placeholders} = this.buildInsertQuery(row);
		
		return this.query(`
			insert into ${table} ${fields}
			values ${placeholders}
			on duplicate key update ${updates}
		`, row);
	}
	
	find(table, fields) {
		return this.row(`
			select * from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	findAll(table, fields) {
		return this.table(`
			select * from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	delete(table, fields) {
		return this.query(`
			delete from ${table}
			where ${this.buildWhere(fields)}
		`, fields);
	}
	
	end() {
		this.db.end();
	}
	
	/*
	"where f in ()" is a parse error, so we specify the type of list and put
	an appropriate placeholder in if there are no values
	*/
	
	list(array) {
		return {
			__isList: true,
			array,
			nullValue: "'[dummy \\'in\\' list item]'",
		};
	}
	
	idList(array) {
		return {
			__isList: true,
			array,
			nullValue: 0,
		};
	}
	
	/*
	we don't know the field type when inserting/updating, so any values that
	aren't obviously json (objects/arrays) need stringifying explicitly
	*/
	
	json(value) {
		return JSON.stringify(value);
	}
	
	now() {
		return DateTime.now();
	}
	
	today() {
		return DateTime.today();
	}
}

module.exports = async function(url) {
	let instance = new Mysql(url);
	
	await instance.query("select 1"); // throw if not connected
	
	return instance;
}
