module.exports = {
	splice(array, i, deleteElements, insertElements) {
		if (insertElements) {
			array.splice(i, deleteElements, insertElements);
		} else {
			array.splice(i, deleteElements);
		}
		
		return array;
	},
	
	push(array, elements) {
		array.push(elements);
		
		return array;
	},
	
	pop(array) {
		array.pop();
		
		return array;
	},
	
	shift(array) {
		array.shift();
		
		return array;
	},
	
	unshift(array, elements) {
		array.unshift(elements);
		
		return array;
	},
	
	remove(array, item) {
		let index;
		
		while ((index = array.indexOf(item)) !== -1) {
			array.splice(index, 1);
		}
		
		return array;
	},
	
	sort(array, compare) {
		array.sort(compare);
		
		return array;
	},
	
	reverse(array) {
		array.reverse();
		
		return array;
	},
	
	concat(array) {
		let args = [].slice.call(arguments, 1);
		
		return array.concat.apply(array, args);
	},
};
