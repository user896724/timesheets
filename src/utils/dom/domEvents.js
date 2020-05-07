module.exports = {
	on(el, e, handler, opts) {
		for (let event of e.split(" ")) {
			el.addEventListener(event, handler, opts);
		}
	},
	
	off(el, e, handler) {
		for (let event of e.split(" ")) {
			el.removeEventListener(event, handler);
		}
	},
};
