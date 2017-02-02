"use strict";
const Message_1 = require("./Message");
class SearchMessage extends Message_1.Message {
    constructor() {
        super();
    }
    get nonce() { return this.getProperty('nonce'); }
    set nonce(v) { this.setProperty('nonce', v); }
    get serverTypes() { return this.getProperty('serverTypes').split(','); }
    set serverTypes(v) { this.setProperty('serverTypes', v.join(',')); }
    validate() {
        return ('nonce' in this.properties) &&
            ('serverTypes' in this.properties);
    }
}
exports.SearchMessage = SearchMessage;
//# sourceMappingURL=SearchMessage.js.map