"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_ts_1 = require("serialize-ts");
class Message {
    constructor(payload, type) {
        if (!payload || (typeof (payload) !== 'object')) {
            throw new Error("Invalid payload");
        }
        this.payload = payload;
        this.type = type || payload.constructor["serializedType"];
        if (!this.type) {
            throw new Error("Message payload must be @serializable, or you must provide the message type.");
        }
        if (Buffer.byteLength(this.type) > 0xFF) {
            throw new Error("Message ID too long: " + this.type);
        }
    }
    static get headerSize() { return Buffer.byteLength(Message.headerString, 'utf8'); }
    static fromBuffer(message) {
        var idSize = message.readUInt16BE(0);
        var id = message.toString('utf8', 2, idSize + 2);
        var payload = serialize_ts_1.Serializer.fromBuffer(message.slice(idSize + 2));
        //console.log(payload);
        return new Message(payload, id);
    }
    toBuffer() {
        var idSize = Buffer.byteLength(this.type);
        var payloadBuffer = serialize_ts_1.Serializer.toBuffer(this.payload);
        var packet = Buffer.allocUnsafe(payloadBuffer.length + idSize + 2);
        packet.writeUInt16BE(idSize, 0);
        packet.write(this.type, 2, idSize, 'utf8');
        payloadBuffer.copy(packet, idSize + 2);
        return packet;
    }
}
Message.headerString = "MSG:";
exports.Message = Message;
//# sourceMappingURL=Message.js.map