let Writable = require("./Writable");

module.exports = class extends Writable {
	constructor(key, value) {
		let existing = localStorage.getItem(key);
		
		try {
			existing = JSON.parse(existing);
		} catch (e) {
			existing = null;
			localStorage.setItem(key, "null");
		}
		
		value = existing || value;
		
		super(value);
		
		this.key = key;
		this._store();
	}
	
	_store() {
		localStorage.setItem(this.key, JSON.stringify(this.value));
	}
	
	set(value) {
		super.set(value);
		
		this._store();
	}
}
