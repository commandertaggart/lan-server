"use strict";
const querystring = require("querystring");
const log_1 = require("../../util/log");
class Message {
    constructor() {
        this.properties = {};
    }
    get type() { return this.constructor.name; }
    setProperty(name, value) {
        this.properties[name] = value;
    }
    getProperty(name) {
        return this.properties[name];
    }
    static fromBuffer(data) {
        let body = data.toString('utf8');
        let div = body.indexOf('?');
        let type = body.substr(0, div);
        let props = body.substr(div + 1);
        log_1.log("deserializing message ... ");
        log_1.log(" ... type:", type);
        log_1.log(" ... props:", props);
        try {
            let constructor = require('./' + type)[type];
            let msg = new constructor();
            msg.properties = querystring.parse(props);
            log_1.log(msg);
            if (msg.validate()) {
                return msg;
            }
        }
        catch (err) {
            log_1.error(err);
        }
        return null;
    }
    toBuffer() {
        return new Buffer(this.type + "?" +
            querystring.stringify(this.properties), 'utf8');
    }
    validate() { return true; }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map