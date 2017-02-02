"use strict";
const querystring = require("querystring");
const log_1 = require("../../util/log");
class Message {
    constructor() {
        this.properties = {};
    }
    static registerMessageType(ctor) {
        if (!('type' in ctor)) {
            log_1.error('Message class does not define `static type:string;`');
            return;
        }
        if (ctor['type'] in Message._messageTypes) {
            log_1.error(`Message type "${ctor['type']}" already registered.`);
        }
        Message._messageTypes[ctor['type']] = ctor;
    }
    get type() { return this.constructor["type"]; }
    setProperty(name, value) {
        this.properties[name] = value;
    }
    getProperty(name, defaultValue) {
        if (name in this.properties)
            return this.properties[name];
        else
            return defaultValue;
    }
    static fromBuffer(data) {
        let body = data.toString('utf8');
        let div = body.indexOf('?');
        let type = body.substr(0, div);
        let props = body.substr(div + 1);
        log_1.log("deserializing message ... ");
        log_1.log(" ... type:", type);
        log_1.log(" ... props:", props);
        let constructor = Message._messageTypes[type];
        if (constructor) {
            let msg = new constructor();
            msg.properties = querystring.parse(props);
            log_1.log(msg);
            if (msg.validate()) {
                return msg;
            }
        }
        else {
            log_1.error(`Message type '${type}' not registered.`);
        }
        return null;
    }
    toBuffer() {
        return new Buffer(this.type + "?" +
            querystring.stringify(this.properties), 'utf8');
    }
    validate() { return true; }
}
Message._messageTypes = {};
Message.type = "lan-server.Message";
exports.Message = Message;
Message.registerMessageType(Message);
//# sourceMappingURL=Message.js.map