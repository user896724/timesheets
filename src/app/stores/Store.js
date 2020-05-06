let {remove} = require("../../utils/arrayMethods");

module.exports = class {
	constructor(value) {
		this.value = value;
		this.handlers = [];
	}
	
	subscribe(handler) {
		this.handlers.push(handler);
		
		handler(this.value);
		
		return () => {
			remove(this.handlers, handler);
		}
	}
}
