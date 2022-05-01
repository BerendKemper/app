"use strict";
/**
 * DO NOT USE THIS BENCHMARK IN PRODUCTION!!!!!!!!!!!!!!
 * IT HAS SERIOUS ISSUES LIKE HACKERS CAN INFILTRATE YOUR COMPUTER
 * THEY COULD INFECT YOUR COMPUTER WITH VIRUS APPLICATIONS, BITCOIN MINERS ETC
 *
 * If you use this benchmark, use it only in enviroments that are not open to the internet.
*/
const makeBenchObject = fn => {
    if (!fn)
        throw new TypeError(`fn is falsy: ${fn}`);
    fn = new Function("return " + fn + ";")();
    if (typeof fn !== "function")
        throw new TypeError("fn is not a function");
    const benchObject = fn(); // initialization function
    if (typeof benchObject.measuringFunction !== "function")
        throw new TypeError("measuringFunction is not a function");
    if (benchObject.cleanupFunction && typeof benchObject.cleanupFunction !== "function")
        throw new TypeError("cleanupFunction is not a function");
    return benchObject;
};
/**
 * DO NOT USE THIS BENCHMARK IN PRODUCTION!!!!!!!!!!!!!!
 * IT HAS SERIOUS ISSUES LIKE HACKERS CAN INFILTRATE YOUR COMPUTER
 * THEY COULD INFECT YOUR COMPUTER WITH VIRUS APPLICATIONS, BITCOIN MINERS ETC
 *
 * If you use this benchmark, use it only in enviroments that are not open to the internet.
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
    if (cleanupFunction)
        cleanupFunction();
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
module.exports = { makeBenchObject, benchmarkSync };