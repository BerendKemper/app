"use strict";

// npm modules
const TaskClock = require("task-clock");
const IndentModel = require("indent-model");
const LocaleTimezoneDate = require("locale-timezone-date");
const FilestreamLogger = require("filestream-logger");
const App = require("emperjs");
const FileOperator = require("file-operator");

// github modules
// none

// internal modules
const data_01 = require("./lib/data");
const { benchmarkSync } = require("./lib/benchmark");


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
App.IncomingMessage.bodyParsers;
App.ServerResponse;
App.Socket;

App.logger.log = logger.log;
App.logger.error = logger.error;
const app = new App("http");

new FileOperator("./apis.json").$read(true).$onReady(apis => {
    app.loadApiRegister(apis);
    console.log("Registered Api endpoints:", app.apis);
    app.listen();

});

app.get("/favicon.ico", (request, response) => {
    response.sendFile("/public/icon/favicon.ico");
});

app.get("/", (request, response) => {
    response.sendFile("/public/html/index.html", false)
        .sendFile("/public/html/second.html", false)
        .sendFile("/public/html/third.html", false)
        .sendFile("/public/html/large.html");
});
app.get("/myBenchmarks", (request, response) => {
    response.sendFile("/public/html/benchmark.html");
});
app.get("/public/:dir/:file", (request, response) => {
    response.sendFile(`/public/${request.params.dir}/${request.params.file}`);
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


const makeBenchObject = fn => {
    if (!fn)
        throw new TypeError(`fn is falsy: ${fn}`);
    fn = new Function("return " + fn + ";")();
    if (typeof fn !== "function")
        throw new TypeError("fn is not a function");
    const benchObject = fn(); // initialization function
    if (typeof benchObject.measuringFunction !== "function")
        throw new TypeError("measuringFunction is not a function");
    if (benchObject.cleanupFunction && typeof benchObject.cleanupFunction !== "function")
        throw new TypeError("cleanupFunction is not a function");
    return benchObject;
};


app.post("/benchmark/sync", (request, response) => {
    try {
        const benchObject = makeBenchObject(request.body.fn);
        const benchResult = benchmarkSync(benchObject);
        response.sendJson(200, benchResult);
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
