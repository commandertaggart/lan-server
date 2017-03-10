
import { LANServer, LANServerInfo, LANConnection, Message } from '../src';

var testMessage:Message = new Message({ number: 12345 }, "test");

export default function startTestClient() {

	LANServer.search("*", (serverInfo:LANServerInfo) => {
		console.log("found: " + serverInfo.name + " of type " + serverInfo.type);
		LANServer.stopSearch();

		serverInfo.connect((connection:LANConnection) => {
			console.log("connected to server!");
			connection.on('message', console.log.bind(console, "[S>C]"));
			setInterval(() => connection.send(testMessage), 1500);
		});
	});

}
