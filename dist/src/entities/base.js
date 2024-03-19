"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const helper_1 = require("../helper");
class BaseEntity {
    asPayload() {
        return {};
    }
    encodeBytes() {
        return;
    }
    getHash() {
        return helper_1.Utils.sha256Hash(this.encodeBytes());
    }
}
exports.BaseEntity = BaseEntity;
