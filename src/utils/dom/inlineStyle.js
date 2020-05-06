let flattenArray = require("../flattenArray");
let camelToKebab = require("../camelToKebab");

let nonSizeProps = [
	"opacity",
	"flex-grow",
];

module.exports = function(...styles) {
	let all = Object.assign({}, ...flattenArray(styles));
	let str = "";
	
	for (let k in all) {
		let prop = camelToKebab(k);
		let value = all[k];
		
		if (typeof value === "number" && value !== 0 && !nonSizeProps.includes(prop)) {
			value += "px";
		}
		
		str += prop + ": " + value + ";";
	}
	
	return str;
}
