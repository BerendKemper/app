"use strict";

// npm modules
const FilestreamLogger = require("filestream-logger");
const App = require("emperjs")("http");
const FileOperator = require("file-operator");

// internal modules
const data_01 = require("./lib/data");
const { benchmarkSync } = require("./lib/benchmark");
const response = require("emperjs/lib/response");
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

new FileOperator("./apis.json").$read(true).$onReady(apis => {
    app.loadApiRegister(apis).destroyUnusedRecords().listen(null, function () {
        console.log(this.apis);
        console.log(`Listening on: ${this.url}`);
    });
});

app.get("/favicon.ico", (request, response) => {
    response.sendFile("./public/icon/favicon.ico");
});

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

app.get("/socket", (request, response) => {
    console.log(!!request, !!response);
    console.log(request.upgrade);
    // request.socket.write(Buffer.from("mongol"));
});

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
