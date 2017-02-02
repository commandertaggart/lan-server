export declare enum LogLevel {
    MUTE = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    VERBOSE = 4,
}
export declare var logLevel: LogLevel;
export declare function log(...args: any[]): void;
export declare function info(...args: any[]): void;
export declare function warn(...args: any[]): void;
export declare function error(...args: any[]): void;
