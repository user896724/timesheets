/*
NOTE keyCode back compat probably not necessary, at least in non-critical
code.  Fine to use .key directly, is...() a bit unwieldy in some places.
*/

module.exports = {
	isEnter(e) {
		return e.key === "Enter" || e.keyCode === 13;
	},
	
	isArrow(e) {
		return [
			"LeftArrow",
			"UpArrow",
			"RightArrow",
			"DownArrow",
		].includes(e.key) || [
			37,
			38,
			39,
			40,
		].includes(e.keyCode);
	},
	
	isBackspace(e) {
		return e.key === "Backspace" || e.keyCode === 8;
	},
	
	dirUpDown(e) {
		if (e.key === "UpArrow" || e.keyCode === 38) {
			return -1;
		} else if (e.key === "DownArrow" || e.keyCode === 40) {
			return 1;
		} else {
			return null;
		}
	},
	
	isTab(e) {
		return e.key === "Tab" || e.keyCode === 9;
	},
	
	isSpace(e) {
		return e.key === " " || e.keyCode === 32;
	},
};
