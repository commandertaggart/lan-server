"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("lan-server tests...");
const src_1 = require("../src");
src_1.setLogLevel(10);
var server = new src_1.LANServer('server.test', {
    name: "Test Server",
    autostart: true
});
var testMessage = new src_1.Message({ text: 'test' }, "test");
server.on('connection', (connection) => {
    console.log("client connected!");
    connection.on('message', console.log.bind(console, "[C>S]"));
    setInterval(() => connection.send(testMessage), 1000);
}).once('started', () => {
    src_1.LANServer.search("*", (serverInfo) => {
        console.log("found: " + serverInfo.name + " of type " + serverInfo.type);
        src_1.LANServer.stopSearch();
        serverInfo.connect((connection) => {
            console.log("connected to server!");
            connection.on('message', console.log.bind(console, "[S>C]"));
            setInterval(() => connection.send(testMessage), 1500);
        });
    });
});
//# sourceMappingURL=index.js.map