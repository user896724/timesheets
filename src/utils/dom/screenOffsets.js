module.exports = function(el) {
	let {x, y, width, height} = el.getBoundingClientRect();
	
	return {
		top: x,
		left: y,
		bottom: window.innerHeight - y - height,
		right: window.innerWidth - x - width,
		width,
		height,
	};
}
