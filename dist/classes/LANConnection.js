"use strict";
const events_1 = require("events");
const Message_1 = require("./messages/Message");
class LANConnection extends events_1.EventEmitter {
    constructor(socket) {
        super();
        this._socket = socket;
        socket.on('data', this.handleSocketData.bind(this));
    }
    handleSocketData(data) {
        let message = Message_1.Message.fromBuffer(data);
        if (message.validate()) {
            this.emit('message', message);
        }
    }
    send(message) {
        if (message.validate()) {
            this._socket.write(message.toBuffer());
        }
    }
    close() {
        this._socket.end();
        this._socket = null;
    }
}
exports.LANConnection = LANConnection;
//# sourceMappingURL=LANConnection.js.map