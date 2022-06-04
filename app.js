"use strict";

const EmperServer = require("./lib/emperserver")

const { makeBenchObject, benchmarkSync } = require("./lib/benchmark");
const data_01 = require("./lib/data");

const server = new EmperServer();


console.log("server instanceof http.Server?", server instanceof require("http").Server);
console.log("http.Server property requestTimeout:", server.requestTimeout);


EmperServer.IncomingMessage.bodyParsers["application/json"]
EmperServer.IncomingMessage.bodyParsers["application/x-www-form-urlencoded"]
//////////////////////////////////
//    File system endpoints     //
//////////////////////////////////



server.get("/favicon.ico", (request, response) => {
    response.sendFile("./public/icon/favicon.ico");
}, { record: false });

server.get("/", (request, response) => {
    response.sendFile("./public/html/index.html")
        .sendFile("./public/html/second.html")
        .sendFile("./public/html/third.html")
        .sendFile("./public/txt/large.txt");
});

server.get("/dev", (request, response) => {
    response.sendFile("./public/html/dev.html");
});

server.get("/myBenchmarks", (request, response) => {
    response.sendFile("./public/html/benchmark.html");
});

server.get("/public/:dir/:file", (request, response) => {
    response.sendFile(`./public/${request.params.dir}/${request.params.file}`);
});


//////////////////////////////////
//        Some middleware       //
//////////////////////////////////

server.use("/monkey/says/hoehoe", function f1(request, response, next) {
    console.log("I am invoked in any request starting at path /monkey/says/hoehoe");
    console.log("i am no longer a CallbackQueue", this);
    next();
});
server.use("/monkey/says/", function f2(request, response, next) {
    console.log("I am invoked in any request starting at path /monkey/says/");
    next();
});
server.use("/", function f0(request, response, next) {
    console.log("I am invoked in every request and i am always invoked first");
    next();
});

server.get("/monkey/says/hoehoe", function (request, response) {
    response.end("1");
});


//////////////////////////////////
//      Some REST endpoints     //
//////////////////////////////////

server.get("/apis", (request, response) => {
    response.sendJson(200, server.apis);
}, { record: false });

server.get("/artists", (request, response) => {
    const users = data_01.artists.data;
    response.sendJson(200, users);
}, { record: false });

server.get("/artists/:id", (request, response) => {
    const artist = data_01.artists[request.params.id];
    if (!artist)
        return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
    const user = artist.data;
    response.sendJson(200, user);
}, { record: false });

server.get("/artists/:id/albums", (request, response) => {
    const artist = data_01.artists[request.params.id];
    if (!artist)
        return response.sendError(404, new Error(`The Artist "${request.params.id}" does not exist`));
    const albums = artist.albums;
    response.sendJson(200, albums);
}, { record: false });

//////////////////////////////////
//       Socket endpoint        //
//////////////////////////////////

server.get("/socket", (request, response) => {
    console.log(!!request, !!response);
    console.log(request.upgrade);
    // request.socket.write(Buffer.from("mongol"));
}, { record: false });

//////////////////////////////////
//        test endpoint         //
//////////////////////////////////

server.post("/body", (request, response) => {
    console.log(request.body)
    response.sendJson(200, request.body);
});
server.post("/body/:monkey", (request, response) => {
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
server.post("/benchmark/sync", (request, response) => {
    try {
        const benchObject = makeBenchObject(request.body.fn);
        const benchResult = benchmarkSync(benchObject);
        response.sendJson(200, benchResult);
    } catch (error) {
        return response.sendError(409, error);
    }
});



/*
server.post("/benchmark/async", (request, response) => {
    try {
        const fn = makeFunction(request.data.fn);
        benchmarkAsync(fn, opsPerSec => response.sendJson(200, { "ops/sec": opsPerSec }));
    } catch (error) {
        return response.sendError(409, error);
    }
});
//*/


server.start();