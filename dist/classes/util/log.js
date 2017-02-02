"use strict";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["MUTE"] = 0] = "MUTE";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["VERBOSE"] = 4] = "VERBOSE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
;
exports.logLevel = LogLevel.MUTE;
function log(...args) {
    console.log('log(' + exports.logLevel + ')');
    if (exports.logLevel >= LogLevel.VERBOSE) {
        console.log.apply(console, args);
    }
}
exports.log = log;
function info(...args) {
    if (exports.logLevel >= LogLevel.INFO) {
        console.info.apply(console, args);
    }
}
exports.info = info;
function warn(...args) {
    if (exports.logLevel >= LogLevel.WARN) {
        console.warn.apply(console, args);
    }
}
exports.warn = warn;
function error(...args) {
    if (exports.logLevel >= LogLevel.ERROR) {
        console.error.apply(console, args);
    }
}
exports.error = error;
//# sourceMappingURL=log.js.map