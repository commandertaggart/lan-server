"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("lan-server tests...");
const src_1 = require("../src");
const startTestClient_1 = require("./startTestClient");
const startWebServer_1 = require("./startWebServer");
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
    startTestClient_1.default();
});
startWebServer_1.default();
//# sourceMappingURL=index.js.map