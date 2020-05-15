module.exports = {
	parse(str) {
		if (str.charAt(0) === "?") {
			str = str.substr(1);
		}
		
		if (!str) {
			return {};
		}
		
		let result = {};
		let pairs = str.split("&");
		
		for (let pair of pairs) {
			let [key, val] = pair.split("=");
			
			if (val) {
				val = decodeURIComponent(val);
			} else {
				val = true;
			}
			
			result[key] = val;
		}
	
		return result;
	},
	
	build(params) {
		let pairs = [];
		
		for (let [k, v] of Object.entries(params)) {
			if (v) {
				pairs.push(`${k}=${encodeURIComponent(v)}`);
			}
		}
		
		return pairs.length > 0 ? "?" + pairs.join("&") : "";
	},
};
