export const fn_forOf_objectValues_preInit = () => {
	const _object = { a: 9, b: 8, c: 7, d: 6, e: 5, f: 4, g: 3, h: 2, i: 1, j: 0 };
	const _preInit_objValues = Object.values(_object);
	return () => {
		let value;
		for (const item of _preInit_objValues) {
			value = item;
		}
	};
};
export const fn_forOf_objectValues = () => {
	const _object = { a: 9, b: 8, c: 7, d: 6, e: 5, f: 4, g: 3, h: 2, i: 1, j: 0 };
	return () => {
		let value;
		for (const item of Object.values(_object)) {
			value = item;
		}
	};
};
export const fn_forIn_object = () => {
	const _object = { a: 9, b: 8, c: 7, d: 6, e: 5, f: 4, g: 3, h: 2, i: 1, j: 0 };
	return () => {
		let value;
		for (const prop in _object) {
			value = _object[prop];
		}
	};
};


export const fn_forOf_array = () => {
	const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	return () => {
		let value;
		for (const item of _array) {
			value = item;
		}
	};
};
export const fn_forIn_array = () => {
	const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	return () => {
		let value;
		for (const i in _array) {
			value = _array[i];
		}
	};
};
export const fn_forEach_array = () => {
	const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	return () => {
		let value;
		_array.forEach(val => value = val);
	};
};
export const fn_for_array = () => {
	const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	return () => {
		const arrLen = _array.length;
		let value;
		for (let i = 0; i < arrLen; i++) {
			value = _array[i];
		}
	};
};
export const fn_while_array = () => {
	const _array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	return () => {
		const arrLen = _array.length;
		let i = -1;
		let value;
		while (++i < arrLen) {
			value = _array[i];
		}
	};
};