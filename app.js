"use strict";

// npm modules
const TaskClock = require("task-clock");
const IndentModel = require("indent-model");
const LocaleTimezoneDate = require("locale-timezone-date");
const FilestreamLogger = require("filestream-logger");
const App = require("emperjs");

// github modules
const FileOperator = require("file-operator");

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
logger.log = new FilestreamLogger("log", { dir: "loggers", name: new LocaleTimezoneDate().yyyymmdd(), formatter });
logger.error = new FilestreamLogger("error", { dir: "loggers", name: new LocaleTimezoneDate().yyyymmdd(), formatter, extend: [logger.log] });
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

App.ApiRecord = class MyApiRecord extends App.ApiRecord { };
console.log(App.ApiRecord);

console.log(App.IncomingMessage.dataParsers);
//*/


///////////////////////////////////////////////////////////////


App.logger.log = logger.log;
App.logger.error = logger.error;
const app = new App("http");

new FileOperator("./apis.json").$read(true).$onReady(apis => {
	app.loadApiRegister(apis);
	console.log("Registered Api endpoints:", app.apis);
	app.listen();
});



app.get("/favicon.ico", (request, response) => {
	response.sendFile("/favicon.ico");
});

app.get("/", (request, response) => {
	response.sendFile("/static/html/index.html", false)
		.sendFile("/static/html/second.html", false)
		.sendFile("/static/html/third.html", false)
		.sendFile("/static/html/large.html");
});
app.get("/myBenchmarks", (request, response) => {
	response.sendFile("/static/html/benchmark.html");
});
app.get("/static/:dir/:file", (request, response) => {
	response.sendFile(`/static/${request.params.dir}/${request.params.file}`);
});

app.get("/apis", (request, response) => {
	response.sendJson(200, app.apis);
});
app.get("/artists", (request, response) => {
	const users = data_01.artists.data;
	response.sendJson(200, users);
});
app.get("/artists/:id", (request, response) => {
	const artist = data_01.artists[request.params.id];
	if (!artist)
		return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
	const user = artist.data;
	response.sendJson(200, user);
});
app.get("/artists/:id/albums", (request, response) => {
	const artist = data_01.artists[request.params.id];
	if (!artist)
		return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
	const albums = artist.albums;
	response.sendJson(200, albums);
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
		response.sendJson(200, { "ops/sec": opsPerSec });
	} catch (error) {
		return response.sendError(409, error);
	}
});
/*
app.post("/benchmark/async", (request, response) => {
	try {
		const fn = makeFunction(request.data.fn);
		benchmarkAsync(fn, opsPerSec => response.sendJson(200, { "ops/sec": opsPerSec }));
	} catch (error) {
		return response.sendError(409, error);
	}
});
//*/


process.on("SIGINT", () => {
	logger.error("Node JS is now shutting down due to pressing ctrl + c");
	FileOperator.saveAndExitAll({
		log: logger.log,
		callback() {
			FilestreamLogger.destroyAll(() => process.exit());
		}
	});
});