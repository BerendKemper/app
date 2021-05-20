"use strict";
/**
 *
 * @param {Function} measuringFunction
 * @returns
 */
const benchmarkSync = benchObject => {
	const { measuringFunction, cleanupFunction } = benchObject;
	const start = process.hrtime();
	let ops = 0;
	let sec = 0;
	let nsec;
	while (sec < 5) {
		measuringFunction();
		[sec, nsec] = process.hrtime(start);
		ops++;
	}
	if (cleanupFunction) cleanupFunction();
	benchObject.measuringFunction = null;
	benchObject.cleanupFunction = null;
	return {
		"ops/sec": ops / (sec + nsec / 1000000000),
	};
};
// /**
//  *
//  * @param {Function} measuringFunction
//  * @param {Function} onFinish
//  */
// const benchmarkAsync = (measuringFunction, onFinish) => {
// 	let start = process.hrtime();
// 	let ops = 0;
// 	let sec = 0;
// 	let nsec;
// 	const repeat = () => {
// 		[sec, nsec] = process.hrtime(start);
// 		ops++;
// 		sec < 5 ? measuringFunction(repeat) : onFinish({
// 			"ops/sec": ops / (sec + nsec / 1000000000),
// 		});
// 	};
// 	measuringFunction(repeat);
// };
module.exports = { benchmarkSync };