"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const fs = require("fs-extra");
function startWebServer() {
    fs.copySync(path.resolve(__dirname, '../../test', 'testClient.html'), 'dist/test/testClient.html');
    var webserver = express();
    webserver.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'testClient.html'));
    });
    webserver.use(express.static('dist/test'));
    webserver.listen(3000, function () {
        console.log('Webserver started at http://localhost:3000');
    });
}
exports.default = startWebServer;
//# sourceMappingURL=startWebServer.js.map