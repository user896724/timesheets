module.exports = function(node) {
	let os = {
		x: 0,
		y: 0
	};
	
	while (node) {
		os.x += node.offsetLeft + node.clientLeft;
		os.y += node.offsetTop + node.clientTop;
		
		node = node.offsetParent;
		
		if (node) {
			os.x -= node.scrollLeft;
			os.y -= node.scrollTop;
		}
	}
	
	return os;
};
