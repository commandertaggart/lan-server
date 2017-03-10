
console.log("lan-server tests...");

import { setLogLevel, LANServer, LANServerInfo, LANConnection, Message } from '../src';
import startTestClient from './startTestClient';
import startWebServer from './startWebServer';

setLogLevel(10);

var server:LANServer = new LANServer('server.test', {
	name: "Test Server",
	autostart: true
});

var testMessage:Message = new Message({ text: 'test' }, "test");

server.on('connection', (connection:LANConnection) => {
	console.log("client connected!");
	connection.on('message', console.log.bind(console, "[C>S]"));
	setInterval(() => connection.send(testMessage), 1000);
}).once('started', () => {
	startTestClient();
});

startWebServer();
