export const fn_forOf_objectValues_preInit = () => {
    const _object = { a: 9, b: 8, c: 7, d: 6, e: 5, f: 4, g: 3, h: 2, i: 1, j: 0 };
    const _preInit_objValues = Object.values(_object);
    return {
        measuringFunction() {
            let value;
            for (const item of _preInit_objValues) {
                value = item;
            }
        }
    };
};
export const fn_forOf_objectValues = () => {
    const _object = { a: 9, b: 8, c: 7, d: 6, e: 5, f: 4, g: 3, h: 2, i: 1, j: 0 };
    return {
        measuringFunction() {
            let value;
            for (const item of Object.values(_object)) {
                value = item;
            }
        }
    };
};
export const fn_forIn_object = () => {
    const _object = { a: 9, b: 8, c: 7, d: 6, e: 5, f: 4, g: 3, h: 2, i: 1, j: 0 };
    return {
        measuringFunction() {
            let value;
            for (const prop in _object) {
                value = _object[prop];
            }
        }
    };
};


export const fn_forOf_array = () => {
    const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return {
        measuringFunction() {
            let value;
            for (const item of _array) {
                value = item;
            }
        }
    };
};
export const fn_forIn_array = () => {
    const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return {
        measuringFunction() {
            let value;
            for (const i in _array) {
                value = _array[i];
            }
        }
    };
};
export const fn_forEach_array = () => {
    const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return {
        measuringFunction() {
            let value;
            _array.forEach(val => value = val);
        }
    };
};
export const fn_for_array = () => {
    const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return {
        measuringFunction() {
            const arrLen = _array.length;
            let value;
            for (let i = 0; i < arrLen; i++) {
                value = _array[i];
            }
        }
    };
};
export const fn_while_array = () => {
    const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return {
        measuringFunction() {
            const arrLen = _array.length;
            let i = -1;
            let value;
            while (++i < arrLen) {
                value = _array[i];
            }
        }
    };
};



export const fn_cbqueue_old = () => {
    class CallbackQueue {
        #index = 0;
        #queue = [];
        #parent = null;
        #nextCb = null;
        constructor(parent) {
            this.#parent = typeof parent === "undefined" ? this : parent;
            this.#nextCb = arg => this.#next(arg);
        }
        #next(arg) {
            if (++this.#index < this.#queue.length) {
                const { callback, context } = this.#queue[this.#index];
                this.#queue[this.#index] = null;
                return callback.call(this.#parent, this.#nextCb, context, arg);
            }
            this.#index = 0;
            this.#queue = [];
        }
        /**@param {callback} callback*/
        push(callback, context) {
            if (this.#queue.length === 0) {
                this.#queue.length = 1;
                callback.call(this.#parent, this.#nextCb, context);
                return this;
            }
            this.#queue.push({ callback, context });
            return this;
        }
        clear() {
            this.#index = 0;
            this.#queue = [];
            return this;
        }
        destroy() {
            this.#parent = null;
            this.#nextCb = null;
            this.#queue = null;
        }
        get index() {
            return this.#index;
        }
        get lastIndex() {
            return this.#index >= this.#queue.length - 1;
        }
        get length() {
            return this.#queue.length;
        }
    }
    let queue = new CallbackQueue();
    function queueTick(next, param) {
        const asignParam = param;
        next();
    };
    function lastTick(next, param) {
        this.clear();
    };
    return {
        measuringFunction() {
            let i = -1;
            while (++i < 500000)
                queue.push(queueTick, i);
            queue.push(lastTick, i);
        },
        cleanupFunction() {
            queue.destroy();
            queue = null;
        }
    };
};

export const fn_cbqueue_new = () => {
    class CallbackQueue {
        #index = 0;
        #queue = [];
        #parent = null;
        #nextCb = null;
        constructor(parent) {
            this.#parent = typeof parent === "undefined" ? this : parent;
            this.#nextCb = (...args) => this.#next(...args);
        }
        #next(...args2) {
            if (++this.#index < this.#queue.length) {
                const [callback, ...args] = this.#queue[this.#index];
                this.#queue[this.#index] = null;
                return callback.call(this.#parent, this.#nextCb, ...args, ...args2);
            }
            this.#index = 0;
            this.#queue = [];
        }
        /**@param {callback} callback*/
        push(callback, ...args) {
            if (this.#queue.length === 0) {
                this.#queue.length = 1;
                callback.call(this.#parent, this.#nextCb, ...args);
                return this;
            }
            this.#queue.push(arguments);
            return this;
        }
        clear() {
            this.#index = 0;
            this.#queue = [];
            return this;
        }
        destroy() {
            this.#parent = null;
            this.#nextCb = null;
            this.#queue = null;
        }
        get index() {
            return this.#index;
        }
        get lastIndex() {
            return this.#index >= this.#queue.length - 1;
        }
        get length() {
            return this.#queue.length;
        }
    }
    let queue = new CallbackQueue();
    function queueTick(next, ...args) {
        next();
    };
    function lastTick(next, ...args) {
        this.clear();
    };
    return {
        measuringFunction() {
            let i = -1;
            while (++i < 500000)
                queue.push(queueTick, i);
            queue.push(lastTick, i);
        },
        cleanupFunction() {
            queue.destroy();
            queue = null;
        }
    };
};


export const fn_args_spread = () => {
    function fn_second(fn, ...args) {
        return fn(...args);
    }
    function fn_spread(fn, ...args) {
        fn_second(fn, ...args);
    }
    return {
        measuringFunction() {
            fn_spread(function (...args) { }, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
        }
    };
};

export const fn_args_spread2 = () => {
    function fn_second(fn) {
        return fn(fn, ...arguments);
    }
    function fn_spread(fn) {
        fn_second(fn, ...arguments);
    }
    return {
        measuringFunction() {
            fn_spread(function () { }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
    };
};

export const fn_invoke = () => {
    function fn_toTest(fn) { }
    return {
        measuringFunction() {
            fn_toTest({});
        }
    };
};

export const fn_invoke_call = () => {
    function fn_toTest(fn) { }
    return {
        measuringFunction() {
            fn_toTest.call({});
        }
    };
};

export const fn_buffer_from = () => {
    return {
        measuringFunction() {
            typeof Buffer !== "undefined" && Buffer.from("abcdefghijklmnopqrstuvwxyz");
        },
        cleanupFunction() {
            console.log(typeof Buffer !== "undefined", typeof Buffer !== "undefined" && Buffer);
        }
    };
};
export const fn_uint8array_from = () => {
    function charCode(c) {
        return c.charCodeAt()
    }
    return {
        measuringFunction() {
            typeof Buffer !== "undefined" && Uint8Array.from("abcdefghijklmnopqrstuvwxyz", charCode);
        }
    };
};