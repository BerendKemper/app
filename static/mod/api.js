"use strict";
export const api = function loadMethods() {
	const headers = { 'Content-Type': 'application/json' };
	const parseResponse = response => response.headers.get("content-type") === "application/json" ? response.json() : response.text();
	const api = (url, body, callback) => {
		fetch(url, body)
			.then(parseResponse)
			.then(callback);
	};
	return {
		get: (url, callback) => api(url, {}, callback),
		post: (url, data, callback) => {
			const body = { method: "POST", headers };
			if (data)
				body.body = JSON.stringify(data);
			api(url, body, callback);
		},
		put: (url, data, callback) => {
			const body = { method: "PUT", headers };
			if (data)
				body.body = JSON.stringify(data);
			api(url, body, callback);
		},
		delete: (url, data, callback) => {
			const body = { method: "DELETE", headers };
			if (data)
				body.body = JSON.stringify(data);
			api(url, body, callback);
		}
	};
}();
