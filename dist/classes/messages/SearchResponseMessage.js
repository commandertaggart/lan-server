"use strict";
const Message_1 = require("./Message");
class SearchResponseMessage extends Message_1.Message {
    constructor() {
        super();
    }
    get nonce() { return this.getProperty('nonce'); }
    set nonce(v) { this.setProperty('nonce', v); }
    get name() { return this.getProperty('name'); }
    set name(v) { this.setProperty('name', v); }
    get serverType() { return this.getProperty('serverType'); }
    set serverType(v) { this.setProperty('serverType', v); }
    get version() { return this.getProperty('version'); }
    set version(v) { this.setProperty('version', v); }
    get address() { return this.getProperty('address'); }
    set address(v) { this.setProperty('address', v); }
    get port() { return parseInt(this.getProperty('port')); }
    set port(v) { this.setProperty('port', v.toString()); }
    validate() {
        return ('nonce' in this.properties) &&
            ('name' in this.properties) &&
            ('serverType' in this.properties) &&
            ('version' in this.properties) &&
            ('address' in this.properties) &&
            ('port' in this.properties) && (!isNaN(this.port));
    }
}
exports.SearchResponseMessage = SearchResponseMessage;
//# sourceMappingURL=SearchResponseMessage.js.map