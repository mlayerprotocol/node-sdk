"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
var helper_1 = require("../helper");
var BaseEntity = /** @class */ (function () {
    function BaseEntity() {
    }
    BaseEntity.prototype.asPayload = function () {
        return {};
    };
    BaseEntity.prototype.encodeBytes = function () {
        return;
    };
    BaseEntity.prototype.getHash = function () {
        return helper_1.Utils.sha256Hash(this.encodeBytes());
    };
    return BaseEntity;
}());
exports.BaseEntity = BaseEntity;
