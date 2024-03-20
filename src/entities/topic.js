"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
var base_1 = require("./base");
var helper_1 = require("../helper");
var Topic = /** @class */ (function (_super) {
    __extends(Topic, _super);
    function Topic() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = '';
        _this.reference = '';
        _this.name = '';
        _this.handle = '';
        _this.description = '';
        _this.parentTopicHash = '';
        _this.subsriberCount = 0;
        _this.account = '';
        _this.timestamp = 0;
        _this.isPublic = false;
        _this.readOnly = false;
        return _this;
    }
    /**
     * @override
     * @returns {ITopic}
     */
    Topic.prototype.asPayload = function () {
        return {
            id: this.id,
            ref: this.reference,
            n: this.name,
            hand: this.handle,
            pTH: this.parentTopicHash, // parent handle hash
            desc: this.description, // description
            // sC: this.subsriberCount, // subscription count
            // acct: this.account, // owner of topic
            // ts: this.timestamp, // timestamp in millisec
            pub: this.isPublic, // is public topic
            rO: this.readOnly,
        };
    };
    /**
     * @override
     * @returns {Buffer}
     */
    Topic.prototype.encodeBytes = function () {
        return helper_1.Utils.encodeBytes({ type: 'string', value: this.reference }, { type: 'string', value: this.name }, { type: 'string', value: this.handle }, { type: 'string', value: this.description }, { type: 'hex', value: this.parentTopicHash }, 
        // { type: 'int', value: this.subsriberCount },
        { type: 'boolean', value: this.isPublic }, { type: 'boolean', value: this.readOnly });
    };
    return Topic;
}(base_1.BaseEntity));
exports.Topic = Topic;
