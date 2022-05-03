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
    fn_uint8array_from,
    fn_is_object_tostring,
    fn_is_object_typeof,
    fn_is_object_typeof_wrap,
    fn_for_of_object,
    fn_for_in_object,
    fn_for_of_object_values,
    fn_for_of_array,
    fn_for_of_keys_object,
    harmfullCodeInject,
    fn_set_kArg,
    fn_set_arg,
    fn_set_pArg,
    fn_get_kArg,
    fn_get_arg,
    fn_get_pArg,
    fn_object_create,
    fn_object_create_null,

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
//     benchmarkFunction.sync(fn_object_create, data => {
//         console.log("fn_object_create:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_object_create_null, data => {
//         console.log("fn_object_create_null:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_object_create, data => {
//         console.log("fn_object_create:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_object_create_null, data => {
//         console.log("fn_object_create_null:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_object_create, data => {
//         console.log("fn_object_create:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_object_create_null, data => {
//         console.log("fn_object_create_null:", data);
//         next();
//     });
// });








// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_set_kArg, data => {
//         console.log("fn_set_kArg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_set_arg, data => {
//         console.log("fn_set_arg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_set_pArg, data => {
//         console.log("fn_set_pArg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_get_kArg, data => {
//         console.log("fn_get_kArg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_get_arg, data => {
//         console.log("fn_get_arg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_get_pArg, data => {
//         console.log("fn_get_pArg:", data);
//         next();
//     });
// });


// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_set_kArg, data => {
//         console.log("fn_set_kArg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_set_arg, data => {
//         console.log("fn_set_arg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_set_pArg, data => {
//         console.log("fn_set_pArg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_get_kArg, data => {
//         console.log("fn_get_kArg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_get_arg, data => {
//         console.log("fn_get_arg:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_get_pArg, data => {
//         console.log("fn_get_pArg:", data);
//         next();
//     });
// });






callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_object, data => {
        console.log("fn_for_of_object:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_in_object, data => {
        console.log("fn_for_in_object:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_array, data => {
        console.log("fn_for_of_array:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_object_values, data => {
        console.log("fn_for_of_object_values:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_object, data => {
        console.log("fn_for_of_object:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_keys_object, data => {
        console.log("fn_for_of_keys_object:", data);
        next();
    });
});

callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_in_object, data => {
        console.log("fn_for_in_object:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_array, data => {
        console.log("fn_for_of_array:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_object_values, data => {
        console.log("fn_for_of_object_values:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_object, data => {
        console.log("fn_for_of_object:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_keys_object, data => {
        console.log("fn_for_of_keys_object:", data);
        next();
    });
});

callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_in_object, data => {
        console.log("fn_for_in_object:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_array, data => {
        console.log("fn_for_of_array:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_object_values, data => {
        console.log("fn_for_of_object_values:", data);
        next();
    });
});
callbackQueue.push(next => {
    benchmarkFunction.sync(fn_for_of_keys_object, data => {
        console.log("fn_for_of_keys_object:", data);
        next();
    });
});









// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_tostring, data => {
//         console.log("fn_is_object_tostring:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof, data => {
//         console.log("fn_is_object_typeof:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof_wrap, data => {
//         console.log("fn_is_object_typeof_wrap:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_tostring, data => {
//         console.log("fn_is_object_tostring:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof, data => {
//         console.log("fn_is_object_typeof:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof_wrap, data => {
//         console.log("fn_is_object_typeof_wrap:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_tostring, data => {
//         console.log("fn_is_object_tostring:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof, data => {
//         console.log("fn_is_object_typeof:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof_wrap, data => {
//         console.log("fn_is_object_typeof_wrap:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_tostring, data => {
//         console.log("fn_is_object_tostring:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof, data => {
//         console.log("fn_is_object_typeof:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_is_object_typeof_wrap, data => {
//         console.log("fn_is_object_typeof_wrap:", data);
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

// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_buffer_from, data => {
//         console.log("fn_buffer_from:", data);
//         next();
//     });
// });
// callbackQueue.push(next => {
//     benchmarkFunction.sync(fn_uint8array_from, data => {
//         console.log("fn_uint8array_from:", data);
//         next();
//     });
// });
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


// callbackQueue.push(next => {
//     benchmarkFunction.sync(harmfullCodeInject, data => {
//         console.log("harmfullCodeInject:", data);
//         next();
//     });
// });


callbackQueue.push(next => {
    api.get("/apis", apis => {
        console.log(apis);
        next();
    });
});