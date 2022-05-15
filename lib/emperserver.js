"use strict";

const App = require("emperjs")("http");
const FileOperator = require("file-operator");
const FilestreamLogger = require("filestream-logger");
const LocaleTimezoneDate = require("locale-timezone-date");
const SchedulerApiRecorder = require("./schedulerApiRecorder");
const logger = require("./logger");

class EmperServer extends App {
    start() {
        const app = this;
        new SchedulerApiRecorder(app, {
            start: new LocaleTimezoneDate().startOfDate({ ms: false }),
            interval: { h: 24 },
            onReady: function () {
                app.listen(null, function () {
                    console.log(`Listening on: ${this.url}`);
                });
            }
        });
    }
};
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