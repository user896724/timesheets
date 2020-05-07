module.exports = class {
	constructor() {
		this.handlers = [];
	}
	
	send(message) {
		for (let handler of this.handlers) {
			handler.show(message);
		}
	}
	
	clear(ref) {
		for (let handler of this.handlers) {
			handler.clear(ref);
		}
	}

	receive(handler) {
		this.handlers.push(handler);
		
		return function() {
			this.handlers = this.handlers.filter(h => h !== handler);
		}
	}
}
