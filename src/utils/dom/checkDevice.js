let isTouch = false;

if (window.matchMedia) {
	isTouch = matchMedia("(pointer: coarse)").matches;
}

module.exports = {
	isTouch,
};
