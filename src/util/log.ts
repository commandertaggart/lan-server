
export enum LogLevel {
	MUTE = 0,
	ERROR,
	WARN,
	INFO,
	VERBOSE
};

var logLevel:LogLevel = LogLevel.MUTE;

export function log(...args)
{
	if (logLevel >= LogLevel.VERBOSE)
	{ console.log.apply(console, args); }
}

export function info(...args)
{
	if (logLevel >= LogLevel.INFO)
	{ console.info.apply(console, args); }
}

export function warn(...args)
{
	if (logLevel >= LogLevel.WARN)
	{ console.warn.apply(console, args); }
}

export function error(...args)
{
	if (logLevel >= LogLevel.ERROR)
	{ console.error.apply(console, args); }
}

export function setLogLevel(level)
{ logLevel = level; }
