let util = require("util");
let crypto = require("crypto");

let randomBytes = util.promisify(crypto.randomBytes);

module.exports = async function(n) {
	return (await randomBytes(n)).toString("hex");
}
