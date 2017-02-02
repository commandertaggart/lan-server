
console.log("lan-server tests...");

var ls = require('../dist');

ls.setLogLevel(10);

var server = new ls.LANServer('server.test', {
	name: "Test Server",
	autostart: true
});

var testMessage = new ls.Message();
testMessage.setProperty('text', 'test');

server.on('connection', (connection) => {
	console.log("client connected!");
	connection.on('message', console.log.bind(console, "[C>S]"));
	setInterval(() => connection.send(testMessage), 1000);
}).once('started', () => {

	ls.LANServer.search("*", (serverInfo) => {
		console.log("found: " + serverInfo.name + " of type " + serverInfo.type);
		ls.LANServer.stopSearch();

		serverInfo.connect((connection) => {
			console.log("connected to server!");
			connection.on('message', console.log.bind(console, "[S>C]"));
			setInterval(() => connection.send(testMessage), 1500);
		});
	});
});
