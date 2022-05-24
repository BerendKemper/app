"use strict";

const Server = require("emperjs")("http");
const FileOperator = require("file-operator");
const FilestreamLogger = require("filestream-logger");
const LocaleTimezoneDate = require("locale-timezone-date");
const SchedulerApiRecorder = require("./schedulerApiRecorder");
const logger = require("./logger");

class EmperServer extends Server {
    start() {
        const server = this;
        new SchedulerApiRecorder(server, {
            start: new LocaleTimezoneDate().startOfDate({ ms: false }),
            interval: { h: 24 },
            onReady: function () {
                server.listen(null, function () {
                    console.log(`Listening on: ${this.url}`);
                });
            }
        });
    }
};
///////////////////////////////////////////////////////////////


/*
Server.IncomingMessage = class Req extends Server.IncomingMessage { };
Server.ServerResponse = class Res extends Server.ServerResponse { };
console.log(Server.IncomingMessage, Server.ServerResponse);

Server.ApiRecord = class MyApiRecord extends Server.ApiRecord { };
console.log(Server.ApiRecord);

console.log(Server.IncomingMessage.dataParsers);
//*/


///////////////////////////////////////////////////////////////
EmperServer.logger.log = logger.log;
EmperServer.logger.error = logger.error;
EmperServer.logger.debug = logger.debug;

process.on("SIGINT", () => {
    function safeExit() {
        process.exit();
    }
    logger.error("Node JS is now shutting down due to pressing ctrl + c");
    FileOperator.saveAndExitAll({
        log: logger.log,
        callback() {
            FilestreamLogger.destroyAll(safeExit);
        }
    });
    setTimeout(safeExit, 2000);
});

module.exports = EmperServer;