const LocaleTimezoneDate = require("locale-timezone-date");
const TaskClock = require("task-clock");
const FileOperator = require("file-operator");
module.exports = class SchedulerApiRecorder extends TaskClock {
    #onReady = null;
    #app = null;
    constructor(app, options) {
        (options = options || {}).autoStart = false;
        super(options);
        this.#onReady = options.onReady;
        this.#app = app;
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
        this.#app.apis.$write(true).$onReady(this.#onWrittenOldRegister, newRegister, this);
    }
    #onReadFirstRegister(newRegister, self) {
        self.#app.loadApiRegister(newRegister).destroyUnusedRecords();
        console.log("Registered Api endpoints:", self.#app.apis);
        if (typeof self.#onReady === "function")
            self.#onReady();
    }
    #onWrittenOldRegister(oldRegister, newRegister, self) {
        self.#app.loadApiRegister(newRegister).destroyUnusedRecords();
        oldRegister.$close();
    }
    get DateModel() {
        return LocaleTimezoneDate;
    }
}