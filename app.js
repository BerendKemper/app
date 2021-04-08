"use strict";

// Node Js Api's 
const http = require("http");
const path = require("path");

// npm modules
const TaskClock = require("task-clock");
const IndentModel = require("indent-model");
const LocaleTimezoneDate = require("locale-timezone-date");
const makeLogger = require("filestream-logger");

// github modules
const App = require("framework");

// internal modules
const data_01 = require("./lib/data");
const { benchmarkSync, benchmarkAsync } = require("./lib/benchmark");



///////////////////////////////////////////////////////////////



const tabs5_4 = new IndentModel({ tabSize: 5, smallestSpace: 4 });
const formatter = (data, callback) => {
	const isoStr = new LocaleTimezoneDate().toLocaleISOString();
	const logString = tabs5_4.tabify(isoStr, ...data);
	callback(logString);
	console.log(logString);
};

const logger = {};
logger.log = makeLogger("log", { dir: "loggers", name: new LocaleTimezoneDate().yyyymmdd(), formatter });
logger.error = makeLogger("error", { dir: "loggers", name: new LocaleTimezoneDate().yyyymmdd(), formatter, extend: [logger.log] });
// console.log("loggers:", logger);

class LoggerClock extends TaskClock {
	constructor() {
		super({ start: new Date(new Date().setHours(0, 0, 0, 0)), interval: { h: 24 } });
	};
	task(now, tick) {
		const yyyymmdd = now.yyyymmdd();
		logger.log.setName(yyyymmdd);
		logger.error.setName(yyyymmdd);
	};
	get DateModel() {
		return LocaleTimezoneDate;
	};
};
const clock = new LoggerClock();



///////////////////////////////////////////////////////////////


/*
App.IncomingMessage = class Req extends App.IncomingMessage { };
App.ServerResponse = class Res extends App.ServerResponse { };
console.log(App.IncomingMessage, App.ServerResponse);

App.ApiRegister = class MyApiRegister extends App.ApiRegister { };
App.ApiRegister.ApiRecord = class MyApiRecord extends App.ApiRegister.ApiRecord { };
console.log(App.ApiRegister, App.ApiRegister.ApiRecord);
//*/


///////////////////////////////////////////////////////////////



const app = new App(http, { logger: { log: logger.log, error: logger.error } });
// console.log("Request DataParser:", app.requestDataParser);
app.get("/favicon.ico", (request, response) => {
	response.pipeFile("/favicon.ico");
});

app.get("/", (request, response) => {
	response.pipeFile("/static/html/index.html");
});
app.get("/myBenchmarks", (request, response) => {
	response.pipeFile("/static/html/benchmark.html");
});
app.get("/static/:dir/:file", (request, response) => {
	response.pipeFile(`/static/${request.params.dir}/${request.params.file}`);
});

app.get("/apis", (request, response) => {
	response.sendJson(app.registeredApis);
});
app.get("/artists", (request, response) => {
	const users = data_01.artists.data;
	response.sendJson(users);
});
app.get("/artists/:id", (request, response) => {
	const artist = data_01.artists[request.params.id];
	if (!artist)
		return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
	const user = artist.data;
	response.sendJson(user);
});
app.get("/artists/:id/albums", (request, response) => {
	const artist = data_01.artists[request.params.id];
	if (!artist)
		return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
	const albums = artist.albums;
	response.sendJson(albums);
});


const makeFunction = fn => {
	if (!fn)
		throw new TypeError(`fn is falsy: ${fn}`);
	fn = new Function("return " + fn + ";")();
	if (typeof fn !== "function")
		throw new TypeError("fn is not a function");
	fn = fn(); // initialization function
	if (typeof fn !== "function")
		throw new TypeError("fn is not a function");
	return fn;
};
app.post("/benchmark/sync", (request, response) => {
	try {
		const fn = makeFunction(request.data.fn);
		const opsPerSec = benchmarkSync(fn);
		response.sendJson({ "ops/sec": opsPerSec });
	} catch (error) {
		return response.sendError(409, error);
	}
});
/*
app.post("/benchmark/async", (request, response) => {
	try {
		const fn = makeFunction(request.data.fn);
		benchmarkAsync(fn, opsPerSec => response.sendJson({ "ops/sec": opsPerSec }));
	} catch (error) {
		return response.sendError(409, error);
	}
});
//*/

// console.log("Registered Api endpoints:", app.registeredApis);
app.listen();