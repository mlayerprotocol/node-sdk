"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icm = void 0;
var jayson_1 = __importDefault(require("jayson"));
var Icm = /** @class */ (function () {
    function Icm(config) {
        this.client = jayson_1.default.client.tcp(config);
    }
    /**
     * subscribe
     */
    Icm.prototype.subscribe = function (subscription, callback) {
        this.client.request("RpcService.Subscription", subscription, callback);
    };
    return Icm;
}());
exports.Icm = Icm;
// module.exports = Icm;
