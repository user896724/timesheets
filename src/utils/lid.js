/*
Generate locally unique ids
*/

let id = new Date().valueOf();

module.exports = function() {
	return (++id).toString(36);
}
