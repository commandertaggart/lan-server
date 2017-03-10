
console.log("lan-server tests...");

import { setLogLevel, LANServer, LANServerInfo, LANConnection, Message } from '../src';

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

	LANServer.search("*", (serverInfo:LANServerInfo) => {
		console.log("found: " + serverInfo.name + " of type " + serverInfo.type);
		LANServer.stopSearch();

		serverInfo.connect((connection:LANConnection) => {
			console.log("connected to server!");
			connection.on('message', console.log.bind(console, "[S>C]"));
			setInterval(() => connection.send(testMessage), 1500);
		});
	});
});
