"use strict";
import { api } from "../mod/api.js";
import {
	fn_forIn_object,
	fn_forOf_objectValues,
	fn_forOf_objectValues_preInit,
	fn_forOf_array,
	fn_forEach_array,
	fn_forIn_array,
	fn_for_array,
	fn_while_array,

} from "../mod/benchmark.js";
import { CallbackQueue } from "../mod/callback-queue.js";


const benchmarkFunction = function load() {
	const isFunctionWithInit = func => {
		if (typeof func !== "function")
			throw new TypeError("fn must be a function");
		func = func();
		if (typeof func !== "function")
			throw new TypeError("fn must be a function");
	};
	return {
		sync(fn, callback) {
			isFunctionWithInit(fn);
			fn()();
			api.post("/benchmark/sync", { fn: fn.toString() }, callback);
		},
		async(fn, callback) {
			isFunctionWithInit(fn);
			fn()(() => {
				api.post("/benchmark/async", { fn: fn.toString() }, callback);
			});
		}
	};
}();
const callbackQueue = new CallbackQueue();

/*
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_forOf_array, data => {
		console.log("fn_forOf_array ops/sec:", data["ops/sec"]);
		callback();
	});
});
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_forIn_array, data => {
		console.log("fn_forIn_array ops/sec:", data["ops/sec"]);
		callback();
	});
});
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_forEach_array, data => {
		console.log("fn_forEach_array ops/sec:", data["ops/sec"]);
		callback();
	});
});
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_for_array, data => {
		console.log("fn_for_array ops/sec:", data["ops/sec"]);
		callback();
	});
});
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_while_array, data => {
		console.log("fn_while_array ops/sec:", data["ops/sec"]);
		console.log("\n\n");
		callback();
	});
});



callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_forIn_object, data => {
		console.log("fn_forIn_object ops/sec:", data["ops/sec"]);
		callback();
	});
});
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_forOf_objectValues, data => {
		console.log("fn_forOf_objectValues ops/sec:", data["ops/sec"]);
		callback();
	});
});
callbackQueue.push(callback => {
	benchmarkFunction.sync(fn_forOf_objectValues_preInit, data => {
		console.log("fn_forOf_objectValues_preInit ops/sec:", data["ops/sec"]);
		console.log("\n\n");
		callback();
	});
});
//*/


callbackQueue.push(callback => {
	api.get("/apis", apis => {
		console.log(apis);
		callback();
	});
});