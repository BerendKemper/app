"use strict";

////////// Version 1 //////////
const depth = "depth/";
const isEndpoint = "endpoint/";
const v1_noFaultyRoute = { [depth]: -1 };
class PathFinder {
	constructor(request) {
		request.params = {};
		this.request = request;
		this.found = false;
		this.faultyRoute = v1_noFaultyRoute;
		this.fault = -1;
	};
	pursue(route, targets) {
		const sign = targets[0];
		targets = targets.slice(1);
		if (route[sign])
			return this.pursue(route[sign], targets);
		if (typeof sign !== "undefined") {
			for (const param in route)
				if (param[0] === "/") {
					const maybeTargetAPI = this.pursue(route[param], targets);
					if (this.found) {
						this.request.params[param.substr(1)] = sign;
						return maybeTargetAPI;
					}
				}
			if (route[depth] > this.faultyRoute[depth]) {
				this.faultyRoute = route;
				this.fault = sign;
			}
		}
		else if (route[isEndpoint]) {
			if (typeof route[this.request.method] === "function") {
				this.found = true;
				return route[this.request.method];
			}
			this.faultyRoute = route;
		}
		else if (route[depth] > this.faultyRoute[depth]) {
			this.faultyRoute = route;
			this.fault = sign;
		}
	};
};
export function RoutesV1() {
	this[depth] = 0;
};
RoutesV1.prototype.add = function add(path) {
	if (typeof path !== "string")
		throw new TypeError("path must be a String");
	if (!path.startsWith("/"))
		throw new TypeError('path must start with "/"');
	let route = this;
	const destination = path.split("/").slice(1);
	for (let _depth = 0; _depth < destination.length; _depth++) {
		let sign = destination[_depth];
		// if (httpMethods[sign])
		// 	throw new Error(`The path "${path}" contains the http method "${sign}". ${_package.name} does not allow using http methods in the path.`)
		if (sign[0] === ":")
			sign = "/" + sign.substr(1);
		if (!route[sign])
			route[sign] = { [depth]: _depth + 1 };
		route = route[sign];
	}
	route[isEndpoint] = true;
	return route;
};
RoutesV1.prototype.walk = function walk(request) {
	const targets = request.urlPathname.split("/").slice(1);
	const pathFinder = new PathFinder(request);
	const api = pathFinder.pursue(this, targets);
	if (api) {
		// request.socket._httpMessage.report = api.record;
		// api(request, request.socket._httpMessage);
		return api(request);
	}
	else if (pathFinder.faultyRoute[depth] < targets.length - 1)
		throw new Error(`Could not identify "/${pathFinder.fault}" in ${request.method} ${request.urlPathname}.`);
	// request.socket._httpMessage.sendError(400, new Error(`Could not identify "/${pathFinder.fault}" in ${request.method} ${request.urlPathname}.`));
	else if (pathFinder.faultyRoute[isEndpoint])
		throw new Error(`Method ${request.method} not allowed for ${request.urlPathname}.`);
	// request.socket._httpMessage.sendError(405, new Error(`Method ${request.method} not allowed for ${request.urlPathname}.`));
	else
		throw new Error(`The endpoint ${request.urlPathname} does not exist.`);
	// request.socket._httpMessage.sendError(400, new Error(`The endpoint ${request.urlPathname} does not exist.`));
};

////////// Version 2 //////////
class RouteV2 {
	#absolute = {};
	#relative = {};
	#endpoint = {};
	#distance;
	#fullpath;
	constructor(distance, fullpath = "", sign = "") {
		this.#distance = distance;
		this.#fullpath = fullpath + sign;
	};
	add(destination) {
		let sign = destination[this.#distance];
		if (this.#distance === destination.length)
			return this.#endpoint;
		if (sign[0] === ":") {
			sign = sign.substr(1);
			if (!this.#relative[sign])
				this.#relative[sign] = new RouteV2(this.#distance + 1, this.#fullpath, "/:" + sign);
			return this.#relative[sign].add(destination);
		}
		if (!this.#absolute[sign])
			this.#absolute[sign] = new RouteV2(this.#distance + 1, this.#fullpath, "/" + sign);
		return this.#absolute[sign].add(destination);
	};
	proceed(request, targets, failData) {
		const sign = targets[this.#distance];
		if (this.#absolute[sign])
			return this.#absolute[sign].proceed(request, targets, failData);
		if (this.#distance < targets.length) {
			for (const param in this.#relative) {
				const maybeTargetAPI = this.#relative[param].proceed(request, targets, failData);
				if (failData.found) {
					request.params[param] = sign;
					return maybeTargetAPI;
				}
			}
			if (this.#distance > failData.faultyRoute.distance) {
				failData.faultyRoute = this;
				failData.fault = sign;
			}
		}
		else if (typeof this.#endpoint[request.method] === "function") {
			failData.found = true;
			return this.#endpoint[request.method];
		}
		else if (this.#distance > failData.faultyRoute.distance) {
			failData.faultyRoute = this;
			failData.fault = sign;
		}
	};
	get distance() {
		return this.#distance;
	};
	get fullpath() {
		return this.#fullpath;
	};
};
const v2_noFaultyRoute = { distance: -1 };
export class RoutesV2 {
	#route = new RouteV2(0);
	add(path) {
		if (typeof path !== "string")
			throw new TypeError("path must be a String");
		if (path[0] !== "/")
			throw new TypeError('path must start with "/"');
		const destination = path.split("/").slice(1);
		return this.#route.add(destination);
	};
	walk(request) {
		request.params = {};
		const targets = request.urlPathname.split("/").slice(1);
		const failData = { fault: null, faultyRoute: v2_noFaultyRoute, found: false };
		const api = this.#route.proceed(request, targets, failData);
		if (api) {
			// request.socket._httpMessage.report = api.record;
			// api(request, request.socket._httpMessage);
			return api(request);
		}
		//*
		else if (failData.faultyRoute.distance < targets.length)
			throw new Error(`Could not identify "/${failData.fault}" in "${request.urlPathname}"`);
		// request.socket._httpMessage.sendError(400, new Error(`Could not identify "/${failData.fault}" in "${request.urlPathname}"`));
		else
			throw new Error(`Method ${request.method} not allowed in the endpoint "${failData.faultyRoute.fullpath}"`);
		// request.socket._httpMessage.sendError(405, new Error(`Method ${request.method} not allowed in the endpoint "${failData.faultyRoute.fullpath}"`));
		//*/
	};
};


const makeApi = (routes, method, path, fn) => {
	const api = routes.add(path);
	api[method] = fn;
};


const routesV1 = new RoutesV1();
makeApi(routesV1, "GET", "/", (request) => {
	// console.log("testing GET /", request);
});
makeApi(routesV1, "GET", "/static/:dir/:file", (request) => {
	// console.log("testing GET /v1/static/:dir/:file", request);
});
makeApi(routesV1, "GET", "/artists", (request) => {
	// console.log("testing GET /artists", request);
});
makeApi(routesV1, "GET", "/artists/:id", (request) => {
	// console.log("testing GET /artists/:id", request);
});
makeApi(routesV1, "GET", "/artists/:id/albums", (request) => {
	// console.log("testing GET /artists/:id/albums", request);
});
makeApi(routesV1, "POST", "/artists/:id/albums", (request) => {
	// console.log("testing POST /artists/:id/albums", request);
});
console.log(routesV1);
console.log("");


const routesV2 = new RoutesV2();
makeApi(routesV2, "GET", "/", (request) => {
	// console.log("testing GET /", request);
});
makeApi(routesV2, "GET", "/static/:dir/:file", (request) => {
	// console.log("testing GET /v1/static/:dir/:file", request);
});
makeApi(routesV2, "GET", "/artists", (request) => {
	// console.log("testing GET /artists", request);
});
makeApi(routesV2, "GET", "/artists/:id", (request) => {
	// console.log("testing GET /artists/:id", request);
});
makeApi(routesV2, "GET", "/artists/:id/albums", (request) => {
	// console.log("testing GET /artists/:id/albums", request);
});
makeApi(routesV2, "POST", "/artists/:id/albums", (request) => {
	// console.log("testing POST /artists/:id/albums", request);
});
console.log(routesV2);
console.log("");


const testPerformance = (label, fn) => {
	let i = -1;
	console.time(label);
	while (++i < 1000000) {
		fn();
	}
	console.timeEnd(label);
};


testPerformance("v1 GET /", () => routesV1.walk({ method: "GET", urlPathname: "/" }));
testPerformance("v2 GET /", () => routesV2.walk({ method: "GET", urlPathname: "/" }));
testPerformance("v1 GET /static/aap/mongol", () => routesV1.walk({ method: "GET", urlPathname: "/static/aap/mongol" }));
testPerformance("v2 GET /static/aap/mongol", () => routesV2.walk({ method: "GET", urlPathname: "/static/aap/mongol" }));
testPerformance("v1 GET /artists", () => routesV1.walk({ method: "GET", urlPathname: "/artists" }));
testPerformance("v2 GET /artists", () => routesV2.walk({ method: "GET", urlPathname: "/artists" }));
testPerformance("v1 GET /artists/noob", () => routesV1.walk({ method: "GET", urlPathname: "/artists/noob" }));
testPerformance("v2 GET /artists/noob", () => routesV2.walk({ method: "GET", urlPathname: "/artists/noob" }));
testPerformance("v1 GET /artists/mongol/albums", () => routesV1.walk({ method: "GET", urlPathname: "/artists/mongol/albums" }));
testPerformance("v2 GET /artists/mongol/albums", () => routesV2.walk({ method: "GET", urlPathname: "/artists/mongol/albums" }));
testPerformance("v1 POST /artists/aap/albums", () => routesV1.walk({ method: "POST", urlPathname: "/artists/aap/albums" }));
testPerformance("v1 POST /artists/aap/albums", () => routesV2.walk({ method: "POST", urlPathname: "/artists/aap/albums" }));
testPerformance("v1 POST /artists//albums", () => routesV1.walk({ method: "POST", urlPathname: "/artists//albums" }));
testPerformance("v2 POST /artists//albums", () => routesV2.walk({ method: "POST", urlPathname: "/artists//albums" }));


const tryForError = fn => {
	try {
		fn();
	} catch (error) {
		console.error(error);
	}
};
routesV1.walk({ method: "GET", urlPathname: "/" });
routesV2.walk({ method: "GET", urlPathname: "/" });
routesV1.walk({ method: "GET", urlPathname: "/static/aap/mongol" });
routesV2.walk({ method: "GET", urlPathname: "/static/aap/mongol" });
routesV1.walk({ method: "GET", urlPathname: "/artists" });
routesV2.walk({ method: "GET", urlPathname: "/artists" });
routesV1.walk({ method: "GET", urlPathname: "/artists/noob" });
routesV2.walk({ method: "GET", urlPathname: "/artists/noob" });
routesV1.walk({ method: "GET", urlPathname: "/artists/mongol/albums" });
routesV2.walk({ method: "GET", urlPathname: "/artists/mongol/albums" });
routesV1.walk({ method: "POST", urlPathname: "/artists/aap/albums" });
routesV2.walk({ method: "POST", urlPathname: "/artists/aap/albums" });
routesV1.walk({ method: "POST", urlPathname: "/artists//albums" });
routesV2.walk({ method: "POST", urlPathname: "/artists//albums" });
tryForError(() =>
	routesV2.walk({ method: "POST", urlPathname: "/users//albums" })
);
tryForError(() =>
	routesV2.walk({ method: "POST", urlPathname: "/artists/aap/tracks" })
);
tryForError(() =>
	routesV2.walk({ method: "GET", urlPathname: "/static/aap/mongol/fail/error" })
);
tryForError(() =>
	routesV2.walk({ method: "PUT", urlPathname: "/static/aap/mongol" })
);
