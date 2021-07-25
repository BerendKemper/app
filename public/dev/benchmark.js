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



export const fn_queue_with_nextWrapper = () => {
	class CallbackQueue {
		#index = 0;
		#queue = [];
		#parent = null;
		constructor(parent) {
			if (typeof parent !== "undefined")
				this.#parent = parent;
		};
		#next() {
			if (++this.#index < this.#queue.length) {
				const { callback, context } = this.#queue[this.#index];
				this.#queue[this.#index] = null;
				return callback.call(this.#parent ?? this, this.#nextWrapper, context);
			}
			this.#queue = [];
			this.#index = 0;
		};
		#nextWrapper = () => this.#next();
		push(callback, context) {
			if (this.#queue.length === 0) {
				this.#queue.length = 1;
				return callback.call(this.#parent ?? this, this.#nextWrapper, context);
			}
			this.#queue.push({ callback, context });
		};
		clear() {
			this.#queue = [];
			this.#index = 0;
		};
		destroy() {
			this.#nextWrapper = null;
			this.#parent = null;
			this.#queue = [];
			this.#index = 0;
		};
		get index() {
			return this.#index;
		};
		get length() {
			return this.#queue.length
		};
	};
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

export const fn_queue_no_nextWrapper = () => {
	class CallbackQueue {
		#index = 0;
		#queue = [];
		#parent = null;
		constructor(parent) {
			if (typeof parent !== "undefined")
				this.#parent = parent;
		};
		#next() {
			if (++this.#index < this.#queue.length) {
				const { callback, context } = this.#queue[this.#index];
				this.#queue[this.#index] = null;
				return callback.call(this.#parent ?? this, () => this.#next(), context);
			}
			this.#index = 0;
			this.#queue = [];
		};
		push(callback, context) {
			if (this.#queue.length === 0) {
				this.#queue.length = 1;
				return callback.call(this.#parent ?? this, () => this.#next(), context);
			}
			this.#queue.push({ callback, context });
		};
		clear() {
			this.#index = 0;
			this.#queue = [];
		};
		destroy() {
			this.#parent = null;
			this.#index = 0;
			this.#queue = [];
		};
		get index() {
			return this.#index;
		};
		get length() {
			return this.#queue.length
		};
	};
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