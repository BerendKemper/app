"use strict";

const EmperServer = require("./lib/emperserver")

const data_01 = require("./lib/data");
const { makeBenchObject, benchmarkSync } = require("./lib/benchmark");



const app = new EmperServer();




console.log("app instanceof http.Server?", app instanceof require("http").Server);
console.log("http.Server property requestTimeout:", app.requestTimeout);






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


app.start();