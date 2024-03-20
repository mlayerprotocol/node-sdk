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
exports.ClientPayload = exports.MemberTopicEventType = exports.AdminTopicEventType = exports.AuthorizeEventType = void 0;
var base_1 = require("./base");
var helper_1 = require("../helper");
// Authrization
var AuthorizeEventType;
(function (AuthorizeEventType) {
    AuthorizeEventType[AuthorizeEventType["AuthorizeEvent"] = 100] = "AuthorizeEvent";
    AuthorizeEventType[AuthorizeEventType["UnauthorizeEvent"] = 101] = "UnauthorizeEvent";
})(AuthorizeEventType || (exports.AuthorizeEventType = AuthorizeEventType = {}));
// // Administrative Topic Actions
var AdminTopicEventType;
(function (AdminTopicEventType) {
    AdminTopicEventType[AdminTopicEventType["DeleteTopic"] = 1000] = "DeleteTopic";
    AdminTopicEventType[AdminTopicEventType["CreateTopic"] = 1001] = "CreateTopic";
    AdminTopicEventType[AdminTopicEventType["PrivacySet"] = 1002] = "PrivacySet";
    AdminTopicEventType[AdminTopicEventType["BanMember"] = 1003] = "BanMember";
    AdminTopicEventType[AdminTopicEventType["UnbanMember"] = 1004] = "UnbanMember";
    AdminTopicEventType[AdminTopicEventType["ContractSet"] = 1005] = "ContractSet";
    AdminTopicEventType[AdminTopicEventType["UpdateName"] = 1006] = "UpdateName";
    AdminTopicEventType[AdminTopicEventType["UpdateDescription"] = 1007] = "UpdateDescription";
    AdminTopicEventType[AdminTopicEventType["UpdateAvatar"] = 1008] = "UpdateAvatar";
    AdminTopicEventType[AdminTopicEventType["PinMessage"] = 1008] = "PinMessage";
})(AdminTopicEventType || (exports.AdminTopicEventType = AdminTopicEventType = {}));
// Member Topic Actions
var MemberTopicEventType;
(function (MemberTopicEventType) {
    MemberTopicEventType[MemberTopicEventType["LeaveEvent"] = 1100] = "LeaveEvent";
    MemberTopicEventType[MemberTopicEventType["JoinEvent"] = 1101] = "JoinEvent";
    MemberTopicEventType[MemberTopicEventType["RequestedEvent"] = 1102] = "RequestedEvent";
    MemberTopicEventType[MemberTopicEventType["ApprovedEvent"] = 1103] = "ApprovedEvent";
    MemberTopicEventType[MemberTopicEventType["UpgradedEvent"] = 1104] = "UpgradedEvent";
    MemberTopicEventType[MemberTopicEventType["InvitedEvent"] = 1105] = "InvitedEvent";
})(MemberTopicEventType || (exports.MemberTopicEventType = MemberTopicEventType = {}));
var ClientPayload = /** @class */ (function (_super) {
    __extends(ClientPayload, _super);
    function ClientPayload() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.timestamp = 0;
        _this.account = '';
        _this.validator = '';
        _this.nonce = 0;
        // Secondary
        _this.signature = '';
        _this.hash = '';
        return _this;
    }
    ClientPayload.prototype.encodeBytes = function () {
        console.log('DATABYTESSSSS', this.data.encodeBytes().toString('hex'), helper_1.Utils.keccak256Hash(this.data.encodeBytes()).toString('hex'));
        var params = [
            {
                type: 'byte',
                value: Buffer.from(helper_1.Utils.keccak256Hash(this.data.encodeBytes()).toString('hex'), 'hex'),
            },
            { type: 'int', value: this.eventType },
        ];
        if (this.account.length) {
            params.push({ type: 'hex', value: this.account });
        }
        params.push({ type: 'hex', value: this.validator });
        params.push({ type: 'int', value: this.nonce });
        params.push({ type: 'int', value: this.timestamp });
        return helper_1.Utils.encodeBytes.apply(helper_1.Utils, params);
    };
    /**
     * @override
     * @returns {IAuthorization}
     */
    ClientPayload.prototype.asPayload = function () {
        return {
            d: this.data.asPayload(),
            ts: this.timestamp,
            ty: this.eventType,
            sig: this.signature,
            h: this.hash,
            val: this.validator,
            acct: this.account,
            nonce: this.nonce,
        };
    };
    return ClientPayload;
}(base_1.BaseEntity));
exports.ClientPayload = ClientPayload;
//383938393839426974636f696e20776f726c64626974636f696e776f726c64546865206265737420746f6f7069630000000000000000
//383938393839426974636f696e20776f726c64626974636f696e776f726c64546865206265737420746f6f7069630000000000000000
