"use strict";

// npm modules
const FilestreamLogger = require("filestream-logger");
const App = require("emperjs")("http");
const FileOperator = require("file-operator");
const LocaleTimezoneDate = require("locale-timezone-date");

// internal modules
const data_01 = require("./lib/data");
const { makeBenchObject, benchmarkSync } = require("./lib/benchmark");
const logger = require("./lib/logger");
const SchedulerApiRecorder = require("./lib/schedulerApiRecorder");


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
App.logger.debug = logger.debug;
const app = new App();

// const app2 = new app(); // this will result in an Error. You could make a second app by makeing a second App2 = require("emperjs")("http"). Or even better write a second node js app


console.log("app instanceof http.Server?", app instanceof require("http").Server);
console.log("http.Server property requestTimeout:", app.requestTimeout);



new SchedulerApiRecorder(app, {
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
//        Some middleware       //
//////////////////////////////////

app.use("/monkey/says/hoehoe", function f1(request, response, next) {
    console.log("I am invoked in any request starting at path /monkey/says/hoehoe");
    console.log("i am no longer a CallbackQueue", this);
    next();
});
app.use("/monkey/says/", function f2(request, response, next) {
    console.log("I am invoked in any request starting at path /monkey/says/");
    next();
});
app.use("/", function f0(request, response, next) {
    console.log("I am invoked in every request and i am always invoked first");
    next();
});

app.get("/monkey/says/hoehoe", function (request, response) {
    response.end("1");
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
app.post("/body/:monkey", (request, response) => {
    console.log(request.body)
    response.sendJson(200, request.body);
});



/**
 * DO NOT USE THIS BENCHMARK IN PRODUCTION!!!!!!!!!!!!!!
 * IT HAS SERIOUS ISSUES LIKE HACKERS CAN INFILTRATE YOUR COMPUTER
 * THEY COULD INFECT YOUR COMPUTER WITH VIRUS APPLICATIONS, BITCOIN MINERS ETC
 *
 * If you use this benchmark, use it only in enviroments that are not open to the internet.
*/
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
