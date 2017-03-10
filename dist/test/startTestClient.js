"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
var testMessage = new src_1.Message({ number: 12345 }, "test");
function startTestClient() {
    src_1.LANServer.search("*", (serverInfo) => {
        console.log("found: " + serverInfo.name + " of type " + serverInfo.type);
        src_1.LANServer.stopSearch();
        serverInfo.connect((connection) => {
            console.log("connected to server!");
            connection.on('message', console.log.bind(console, "[S>C]"));
            setInterval(() => connection.send(testMessage), 1500);
        });
    });
}
exports.default = startTestClient;
//# sourceMappingURL=startTestClient.js.map