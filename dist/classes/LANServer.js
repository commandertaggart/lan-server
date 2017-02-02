"use strict";
const net = require("net");
const dgram = require("dgram");
const events_1 = require("events");
const log_1 = require("../util/log");
const LANConnection_1 = require("./LANConnection");
const Message_1 = require("./messages/Message");
const SearchMessage_1 = require("./messages/SearchMessage");
const SearchResponseMessage_1 = require("./messages/SearchResponseMessage");
Message_1.Message.registerMessageType(SearchMessage_1.SearchMessage);
Message_1.Message.registerMessageType(SearchResponseMessage_1.SearchResponseMessage);
class LANServerInfo {
    constructor(type = "server", name, address, port) {
        this.type = type;
        this.name = name;
        this.address = address;
        this.port = port;
        log_1.log(`LANServerInfo(${type}, ${name}, ${address}, ${port})`);
    }
    connect(callback) {
        var socket = net.createConnection(this.port, this.address, () => {
            callback(new LANConnection_1.LANConnection(socket));
        });
    }
}
exports.LANServerInfo = LANServerInfo;
class LANServer extends events_1.EventEmitter {
    constructor(type, options = {}) {
        super();
        this._advertisingSocket = null;
        log_1.log("constructing server");
        this.setMaxListeners(Infinity);
        this._ = {
            type: type,
            name: options["name"] || "LAN Server",
            advertise: options["advertise"] || true,
            port: options["port"] || 0,
            autostart: options["autostart"] || false,
            address: null
        };
        log_1.log(`LANServer(${type}, {
	name: ${this._.name},
	advertise: ${this._.advertise},
	port: ${this._.port},
	autostart: ${this._.autostart}
})`);
        this._server = null;
        if (this._.autostart) {
            setImmediate(this.start.bind(this));
        }
    }
    start() {
        if (this._server) {
            log_1.error("Server already started.");
        }
        log_1.log("Starting server...");
        this._server = net.createServer();
        this._server.on('error', this.handleServerError.bind(this))
            .on('connection', this.handleServerConnection.bind(this));
        this._server.listen(this._.port, () => {
            log_1.log("Server started.");
            this._.address = this._server.address();
            if (this._.advertise) {
                this.once('advertising', (port) => { this.emit('started', this); });
                setImmediate(this.startAdvertising.bind(this));
            }
            else {
                this.emit('started', this);
            }
        });
    }
    stop() {
        log_1.log("Shutting down server.");
        this.stopAdvertising();
        if (this._server) {
            this._server.close();
            this._server = null;
            this._.address = null;
        }
    }
    startAdvertising() {
        if (this._advertisingSocket == null) {
            log_1.log("Advertising server...");
            this._advertisingSocket = dgram.createSocket('udp4');
            this._advertisingSocket.bind({ port: LANServer.advertisingPort }, () => {
                log_1.log("... listening on port " + this._advertisingSocket.address().port);
                this._advertisingSocket.setBroadcast(true);
                this._advertisingSocket.on('message', this.handleSearchPacket.bind(this));
                this.emit('advertising', LANServer.advertisingPort);
            });
        }
    }
    stopAdvertising() {
        if (this._advertisingSocket) {
            log_1.log("Server no longer advertising.");
            this._advertisingSocket.close();
            this._advertisingSocket = null;
        }
    }
    handleSearchPacket(data, remote) {
        log_1.log("Advertiser received packet ...", data.toString('utf8'));
        let message = Message_1.Message.fromBuffer(data);
        if (message && message.type == SearchMessage_1.SearchMessage.type) {
            let search = message;
            log_1.log(" ... packet is search message, looking for types: ", search.serverTypes);
            if (search.serverTypes.indexOf(this._.type) >= 0 ||
                search.serverTypes.indexOf("*") >= 0) {
                log_1.log(" ... searching for this type of server, responding ...");
                let response = new SearchResponseMessage_1.SearchResponseMessage();
                response.nonce = search.nonce;
                response.name = this._.name;
                response.serverType = this._.type;
                response.version = '0';
                response.address = this._.address.address;
                response.port = this._.address.port;
                this._advertisingSocket.send(response.toBuffer(), LANServer.advertisingPort + 1, remote.address);
                log_1.log(" ... response sent.");
            }
        }
    }
    handleServerError(err) {
        log_1.error("Error on server: ", err);
        this.stopAdvertising();
        this._server = null;
        this.emit('error', err);
    }
    handleServerConnection(socket) {
        log_1.log("Server receiving connection.");
        var connection = new LANConnection_1.LANConnection(socket);
        this.emit('connection', connection);
    }
    static search(type, callback) {
        log_1.log(`Searching for servers of type "${type}"`);
        LANServer._searches[type] = LANServer._searches[type] || [];
        LANServer._searches[type].push(callback);
        if (LANServer._searchTimer == null) {
            LANServer._searchTimer = setInterval(LANServer.searchInterval, 5000);
        }
        if (LANServer._searchSocket == null) {
            LANServer._searchNonce = require('uuid/v4')();
            LANServer._searchSocket = dgram.createSocket('udp4');
            LANServer._searchSocket.bind({ port: LANServer.advertisingPort + 1 }, () => {
                LANServer._searchSocket.setBroadcast(true);
                LANServer._searchSocket.on('message', LANServer.handleSearchResult);
                LANServer.searchInterval();
            });
        }
    }
    static stopSearch(type, callback) {
        if (!type && ("*" in LANServer._searches)) {
            type = "*";
        }
        log_1.log(`Discontinuing search for servers of type "${type}"`);
        if (type in LANServer._searches) {
            if (callback) {
                let index = LANServer._searches[type].indexOf(callback);
                if (index >= 0) {
                    LANServer._searches[type].splice(index, 1);
                }
                if (LANServer._searches[type].length == 0) {
                    delete LANServer._searches[type];
                }
            }
            else if (type == "*") {
                delete LANServer._searches[type];
            }
        }
        else {
            LANServer._searches = {};
        }
        if (Object.keys(LANServer._searches).length == 0) {
            clearInterval(LANServer._searchTimer);
            LANServer._searchTimer = null;
            LANServer._searchSocket.close();
            LANServer._searchSocket = null;
            LANServer._searchNonce = null;
        }
    }
    static searchInterval() {
        let message = new SearchMessage_1.SearchMessage();
        message.nonce = LANServer._searchNonce;
        message.serverTypes = Object.keys(LANServer._searches);
        log_1.log("Sending search packet (" + LANServer.advertisingPort + "):", message.toBuffer().toString('utf8'));
        LANServer._searchSocket.send(message.toBuffer(), LANServer.advertisingPort, "255.255.255.255");
    }
    static handleSearchResult(data, remote) {
        log_1.log("Search received response packet ... ");
        var message = Message_1.Message.fromBuffer(data);
        if (message.type === SearchResponseMessage_1.SearchResponseMessage.type) {
            log_1.log(" ... of correct message type");
            var result = message;
            if (result.nonce === LANServer._searchNonce) {
                log_1.log(" ... in response to us");
                var server = new LANServerInfo(result.serverType, result.name, result.address, result.port);
                if (server.type in LANServer._searches) {
                    log_1.log(`Sought-for server of type "${server.type}" found: ${server.name}`);
                    LANServer._searches[server.type].forEach((callback) => {
                        callback(server);
                    });
                }
                if ('*' in LANServer._searches) {
                    log_1.log(`Server of type "${server.type}" found: ${server.name}`);
                    LANServer._searches['*'].forEach((callback) => {
                        callback(server);
                    });
                }
            }
        }
    }
}
LANServer._searches = {};
LANServer._searchTimer = null;
LANServer._searchSocket = null;
LANServer._searchNonce = null;
LANServer.advertisingPort = 27614;
exports.LANServer = LANServer;
//# sourceMappingURL=LANServer.js.map