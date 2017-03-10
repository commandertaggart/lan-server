"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Message_1 = require("./messages/Message");
var ConnState;
(function (ConnState) {
    ConnState[ConnState["WAITING_HEADER"] = 0] = "WAITING_HEADER";
    ConnState[ConnState["WAITING_PAYLOAD"] = 1] = "WAITING_PAYLOAD";
})(ConnState || (ConnState = {}));
class LANConnection extends events_1.EventEmitter {
    constructor(socket) {
        super();
        this._socket = socket;
        socket.on('data', this.handleSocketData.bind(this));
    }
    handleSocketData(data) {
        if (this._currentData) {
            data = Buffer.concat([this._currentData, data]);
        }
        if (data.length >= (Message_1.Message.headerSize + 4)) {
            if (data.toString('utf8', 0, Message_1.Message.headerSize) === Message_1.Message.headerString) {
                let payloadSz = data.readInt32BE(Message_1.Message.headerSize);
                let total = Message_1.Message.headerSize + 4 + payloadSz;
                if (data.length >= total) {
                    var packet;
                    if (data.length == total) {
                        packet = data.slice(Message_1.Message.headerSize + 4);
                        data = null;
                    }
                    else {
                        packet = data.slice(Message_1.Message.headerSize + 4, total);
                        data = data.slice(total);
                    }
                    let message = Message_1.Message.fromBuffer(packet);
                    this.emit('message', message);
                }
                this._currentData = data;
            }
            else {
                this._currentData = null;
                throw new Error("Bad data!!!");
            }
        }
    }
    send(message) {
        var payload = message.toBuffer();
        var headerSz = Message_1.Message.headerSize;
        var header = Buffer.allocUnsafe(headerSz + 4);
        header.write(Message_1.Message.headerString, 0, headerSz, 'utf8');
        header.writeInt32BE(payload.length, headerSz);
        this._socket.write(Buffer.concat([header, payload]));
    }
    close() {
        this._socket.end();
        this._socket = null;
    }
}
exports.LANConnection = LANConnection;
//# sourceMappingURL=LANConnection.js.map