"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_ts_1 = require("serialize-ts");
let SearchData = class SearchData {
};
__decorate([
    serialize_ts_1.serialized()
], SearchData.prototype, "nonce", void 0);
__decorate([
    serialize_ts_1.serialized('string[]')
], SearchData.prototype, "serverTypes", void 0);
SearchData = __decorate([
    serialize_ts_1.serializable('lan-server.search')
], SearchData);
exports.SearchData = SearchData;
//# sourceMappingURL=SearchData.js.map