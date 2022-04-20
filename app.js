"use strict";

// npm modules
const FilestreamLogger = require("filestream-logger");
const App = require("emperjs")("http");
const FileOperator = require("file-operator");
const TaskClock = require("task-clock");
const LocaleTimezoneDate = require("locale-timezone-date");

// internal modules
const data_01 = require("./lib/data");
const { benchmarkSync } = require("./lib/benchmark");
const logger = require("./lib/logger");


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
App.IncomingMessage;
App.IncomingMessage.bodyParsers
App.ServerResponse;
App.Socket;
App.mimetypes;


App.logger.log = logger.log;
App.logger.error = logger.error;
App.logger.debug = logger.debug;
const app = new App();
// const app2 = new app(); // this will result in an Error. You could make a second app by makeing a second App2 = require("emperjs")("http"). Or even better write a second node js app
console.log("app instanceof http.Server?", app instanceof require("http").Server);
console.log("http.Server property requestTimeout:", app.requestTimeout);

class SchedulerApiRecorder extends TaskClock {
    #onReady = null;
    constructor(options) {
        (options = options || {}).autoStart = false;
        super(options);
        this.#onReady = options.onReady;
        this.start();
        // The option autoStart must be false the start method be invoked after super becuase
        //    1. The constructor of TaskClock immediately invokes the task method.
        //    2. The result is that the constructor of SchedulerApiRecorder has not finished.
        //    3. The consequence of the constructor not having finished is that the private methods are inaccessible.
        //
        // The super constructor of SchedulerApiRecorder must finish constructing before accessing private properties.
    }
    task(now, tick) {
        const newRegister = new FileOperator(`./apis/${now.yyyymmdd()}.json`);
        if (tick === 1)
            return newRegister.$read(true).$onReady(this.#onReadFirstRegister, this);
        app.apis.$write(true).$onReady(this.#onWrittenOldRegister, newRegister);
    }
    #onReadFirstRegister(newRegister, self) {
        app.loadApiRegister(newRegister).destroyUnusedRecords();
        console.log("Registered Api endpoints:", app.apis);
        if (typeof self.#onReady === "function")
            self.#onReady();
    }
    #onWrittenOldRegister(oldRegister, newRegister) {
        app.loadApiRegister(newRegister).destroyUnusedRecords();
        oldRegister.$close();
    }
    get DateModel() {
        return LocaleTimezoneDate;
    }
}

new SchedulerApiRecorder({
    start: new LocaleTimezoneDate().startOfDate({ ms: false }),
    interval: { h: 24 },
    onReady: function () {
        app.listen(null, function () {
            console.log(`Listening on: ${this.url}`);
        });
    }
});

//////////////////////////////////
//    File system endpoints     //
//////////////////////////////////

app.get("/favicon.ico", (request, response) => {
    response.sendFile("./public/icon/favicon.ico");
}, { record: false });

app.get("/", (request, response) => {
    response.sendFile("./public/html/index.html")
        .sendFile("./public/html/second.html")
        .sendFile("./public/html/third.html")
        .sendFile("./public/txt/large.txt");
});

app.get("/myBenchmarks", (request, response) => {
    response.sendFile("./public/html/benchmark.html");
});

app.get("/public/:dir/:file", (request, response) => {
    response.sendFile(`./public/${request.params.dir}/${request.params.file}`);
});

//////////////////////////////////
//      Some REST endpoints     //
//////////////////////////////////

app.get("/apis", (request, response) => {
    response.sendJson(200, app.apis);
}, { record: false });

app.get("/artists", (request, response) => {
    const users = data_01.artists.data;
    response.sendJson(200, users);
}, { record: false });

app.get("/artists/:id", (request, response) => {
    const artist = data_01.artists[request.params.id];
    if (!artist)
        return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
    const user = artist.data;
    response.sendJson(200, user);
}, { record: false });

app.get("/artists/:id/albums", (request, response) => {
    const artist = data_01.artists[request.params.id];
    if (!artist)
        return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
    const albums = artist.albums;
    response.sendJson(200, albums);
}, { record: false });

//////////////////////////////////
//       Socket endpoint        //
//////////////////////////////////

app.get("/socket", (request, response) => {
    console.log(!!request, !!response);
    console.log(request.upgrade);
    // request.socket.write(Buffer.from("mongol"));
}, { record: false });

//////////////////////////////////
//        test endpoint         //
//////////////////////////////////

app.post("/body", (request, response) => {
    console.log(request.body)
    response.sendJson(200, request.body);
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
function safeExit() {
    process.exit();
}
process.on("SIGINT", () => {
    logger.error("Node JS is now shutting down due to pressing ctrl + c");
    FileOperator.saveAndExitAll({
        log: logger.log,
        callback() {
            FilestreamLogger.destroyAll(safeExit);
        }
    });
    setTimeout(safeExit, 2000);
});
