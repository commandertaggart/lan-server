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
var logLevel = LogLevel.MUTE;
function log(...args) {
    if (logLevel >= LogLevel.VERBOSE) {
        console.log.apply(console, args);
    }
}
exports.log = log;
function info(...args) {
    if (logLevel >= LogLevel.INFO) {
        console.info.apply(console, args);
    }
}
exports.info = info;
function warn(...args) {
    if (logLevel >= LogLevel.WARN) {
        console.warn.apply(console, args);
    }
}
exports.warn = warn;
function error(...args) {
    if (logLevel >= LogLevel.ERROR) {
        console.error.apply(console, args);
    }
}
exports.error = error;
function setLogLevel(level) { logLevel = level; }
exports.setLogLevel = setLogLevel;
//# sourceMappingURL=log.js.map