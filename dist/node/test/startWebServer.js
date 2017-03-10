"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const webpack = require("webpack");
function startWebServer() {
    fs.copySync(path.resolve(__dirname, '../../../test', 'testClient.html'), path.resolve(__dirname, '../../../dist/web/test/', 'testClient.html'));
    var packager = webpack({
        devtool: 'eval-source-map',
        entry: {
            testClient: path.join(__dirname, 'startWebClient.js')
        },
        output: {
            path: path.join(__dirname, '../../../dist/web/test/'),
            filename: 'startWebClient.js'
        },
        node: {
            net: 'empty',
            dgram: 'empty'
        }
    }, (error, stats) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(stats.toString({
                chunks: true,
                colors: true
            }));
        }
    });
    var webserver = express();
    webserver.get('/', function (req, res) {
        return res.redirect(301, '/test/testClient.html');
    });
    webserver.use(express.static('dist/web'));
    webserver.listen(3000, function () {
        console.log('Webserver started at http://localhost:3000');
    });
}
exports.default = startWebServer;
//# sourceMappingURL=startWebServer.js.map