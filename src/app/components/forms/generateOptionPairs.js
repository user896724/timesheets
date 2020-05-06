let _typeof = require("../../../utils/typeof");

module.exports = function(options, useKey, labelKey, valueKey, placeholder=null) {
	let pairs;
	
	if (_typeof(options) === "Object") {
		pairs = Object.entries(options).map(function([k, option]) {
			return {
				value: valueKey ? option[valueKey] : useKey ? k : option,
				label: (
					_typeof(option) === "String"
					? option
					: labelKey ? option[labelKey] : k
				),
			};
		});
	} else {
		pairs = options.map(function(option) {
			return {
				value: valueKey ? option[valueKey] : option,
				label: labelKey ? option[labelKey] : option,
			};
		});
	}
	
	if (placeholder) {
		pairs.unshift({
			value: "",
			label: placeholder,
		});
	}
	
	return pairs;
}
