let {promisify} = require("util");
let bcryptjs = require("bcryptjs");

let hash = promisify(bcryptjs.hash);
let compare = promisify(bcryptjs.compare);

module.exports = {
	async hash(str) {
		return hash(str, 8);
	},

	async compare(input, hash) {
		return compare(input, hash);
	},
};
