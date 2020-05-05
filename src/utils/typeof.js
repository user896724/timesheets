module.exports = (v) => {
	return {}.toString.call(v).slice(8, -1);
};
