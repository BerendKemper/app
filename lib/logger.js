const TaskClock = require("task-clock");
const IndentModel = require("indent-model");
const LocaleTimezoneDate = require("locale-timezone-date");
const FilestreamLogger = require("filestream-logger");

const tabs5_4 = new IndentModel({ tabSize: 5, smallestSpace: 4 });
class Logger extends TaskClock {
    formatter(data, callback) {
        const isoStr = new LocaleTimezoneDate().toLocaleISOString();
        const logString = tabs5_4.tabify(isoStr, ...data);
        callback(logString);
        console.log(logString);
    }
    debugFormat(data, callback) {
        const logString = tabs5_4.tabify(...data);
        callback(logString);
        console.log(logString);
    }
    constructor() {
        super({ start: new Date(new Date().setHours(0, 0, 0, 0)), interval: { h: 24 }, autoStart: false });
        const yyyymmdd = new LocaleTimezoneDate().yyyymmdd()
        this.log = new FilestreamLogger("log", { dir: "loggers", name: yyyymmdd, formatter: this.formatter });
        this.error = new FilestreamLogger("error", { dir: "loggers", name: yyyymmdd, formatter: this.formatter, extend: [this.log] });
        this.debug = new FilestreamLogger("debug", { dir: "loggers", name: yyyymmdd, formatter: this.debugFormat });
        this.start();
    }
    task(now, tick) {
        const yyyymmdd = now.yyyymmdd();
        this.log.setName(yyyymmdd);
        this.error.setName(yyyymmdd);
    }
    get DateModel() {
        return LocaleTimezoneDate;
    }
};
module.exports = new Logger();