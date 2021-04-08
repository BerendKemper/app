"use strict";
/**
 * 
 * @param {Function} measuringFunction 
 * @returns 
 */
const benchmarkSync = measuringFunction => {
	let start = process.hrtime();
	let ops = 0;
	let sec = 0;
	let nsec;
	while (sec < 5) {
		measuringFunction();
		[sec, nsec] = process.hrtime(start);
		ops++;
	}
	return ops / (sec + nsec / 1000000000);
};
/**
 * 
 * @param {Function} measuringFunction 
 * @param {Function} onFinish 
 */
const benchmarkAsync = (measuringFunction, onFinish) => {
	let start = process.hrtime();
	let ops = 0;
	let sec = 0;
	let nsec;
	const repeat = () => {
		[sec, nsec] = process.hrtime(start);
		ops++;
		sec < 5 ? measuringFunction(repeat) : onFinish(ops / (sec + nsec / 1000000000));
	};
	measuringFunction(repeat);
};
module.exports = { benchmarkSync, benchmarkAsync };