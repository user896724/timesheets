let moment = require("moment");

/*
wrapper over moment with clearer, immutable api
*/

let formats = {
	date: "YYYY-MM-DD",
	datetime: "YYYY-MM-DD HH:mm:ss",
};

let typeFromLength = {
	[formats.date.length]: "date",
	[formats.datetime.length]: "datetime",
};

class DateTime {
	constructor(type, m) {
		this.type = type;
		this.moment = m;
		this.format = formats[type];
		this.string = this.moment.format(this.format);
		this.isDate = type === "date";
		this.isDateTime = !this.isDate;
	}
	
	isAfter(dateTime) {
		return this.moment.isAfter(dateTime.moment);
	}
	
	add(...args) {
		return new DateTime(this.type, this.moment.clone().add(...args));
	}
	
	startOf(...args) {
		return new DateTime(this.type, this.moment.clone().startOf(...args));
	}
	
	diff(dateTime, ...args) {
		return this.moment.diff(dateTime.moment, ...args);
	}
	
	fromNow() {
		return this.moment.fromNow();
	}
	
	toString() {
		return this.moment.format(this.format);
	}
	
	toJSON() {
		return this.toString();
	}
	
	static fromString(string) {
		let type = typeFromLength[string.length];
		let format = formats[type];
		
		let m = moment(string, format);
		
		return new DateTime(type, m);
	}
	
	static now() {
		return new DateTime("datetime", moment());
	}
	
	static today() {
		return new DateTime("date", moment().startOf("day"));
	}
	
	static dateTime(string) {
		return new DateTime("datetime", moment(string));
	}
	
	static date(string) {
		return new DateTime("date", moment(string));
	}
	
	static fromDb(type, string) {
		return new DateTime(type, moment(string));
	}
	
	static isDateTime(value) {
		return value instanceof DateTime;
	}
}

module.exports = DateTime;
