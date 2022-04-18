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
    fn_cbqueue_old,
    fn_cbqueue_new,
    fn_args_spread,
    fn_args_spread2,
    fn_invoke,
    fn_invoke_call,
    fn_buffer_from,
    fn_uint8array_from
} from "../dev/benchmark.js";
import { CallbackQueue } from "../mod/callback-queue.js";


const benchmarkFunction = function load() {
    const isFunctionWithInit = fn => {
        if (typeof fn !== "function")
            throw new TypeError("fn must be a function");
        const benchObject = fn();
        if (typeof benchObject.measuringFunction !== "function")
            throw new TypeError("measuringFunction must be a function");
        if (benchObject.cleanupFunction && typeof benchObject.cleanupFunction !== "function")
            throw new TypeError("cleanupFunction must be a function");
        return benchObject;
    };
    return {
        sync(fn, callback) {
            const benchObject = isFunctionWithInit(fn);
            benchObject.measuringFunction();
            if (benchObject.cleanupFunction) benchObject.cleanupFunction();
            benchObject.measuringFunction = null;
            benchObject.cleanupFunction = null;
            api.post("/benchmark/sync", { fn: fn.toString() }, callback);
        },
        // async(fn, callback) {
        // 	isFunctionWithInit(fn);
        // 	fn()(() => {
        // 		api.post("/benchmark/async", { fn: fn.toString() }, callback);
        // 	});
        // }
    };
}();
const callbackQueue = new CallbackQueue();



// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_old, data => {
//         console.log("fn_cbqueue_old:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_old, data => {
//         console.log("fn_cbqueue_old:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_new, data => {
//         console.log("fn_cbqueue_new:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_new, data => {
//         console.log("fn_cbqueue_new:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_old, data => {
//         console.log("fn_cbqueue_old:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_old, data => {
//         console.log("fn_cbqueue_old:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_new, data => {
//         console.log("fn_cbqueue_new:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_cbqueue_new, data => {
//         console.log("fn_cbqueue_new:", data);
//         next();
//     });
// });


///////////////////////////////


// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke, data => {
//         console.log("fn_invoke:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke_call, data => {
//         console.log("fn_invoke_call:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke, data => {
//         console.log("fn_invoke:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke_call, data => {
//         console.log("fn_invoke_call:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke, data => {
//         console.log("fn_invoke:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke_call, data => {
//         console.log("fn_invoke_call:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke, data => {
//         console.log("fn_invoke:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_invoke_call, data => {
//         console.log("fn_invoke_call:", data);
//         next();
//     });
// });

callbackQueue.push(next => {
    benchmarkFunction.sync(fn_buffer_from, data => {
        console.log("fn_buffer_from:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_uint8array_from, data => {
        console.log("fn_uint8array_from:", data);
        next();
    });
});
fn_buffer_from
fn_uint8array_from
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


callbackQueue.push(next => {
    api.get("/apis", apis => {
        console.log(apis);
        next();
    });
});