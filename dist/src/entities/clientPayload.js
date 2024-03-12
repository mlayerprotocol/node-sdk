"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPayload = exports.MemberTopicEventType = exports.AdminTopicEventType = exports.AuthorizeEventType = void 0;
const base_1 = require("./base");
const helper_1 = require("../helper");
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
class ClientPayload extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.timestamp = 0;
        this.account = '';
        this.validator = '';
        this.nonce = 0;
        // Secondary
        this.signature = '';
        this.hash = '';
    }
    encodeBytes() {
        console.log('DATABYTESSSSS', this.data.encodeBytes().toString('hex'), helper_1.Utils.keccak256Hash(this.data.encodeBytes()).toString('hex'));
        const params = [
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
        return helper_1.Utils.encodeBytes(...params);
    }
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload() {
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
    }
}
exports.ClientPayload = ClientPayload;
//383938393839426974636f696e20776f726c64626974636f696e776f726c64546865206265737420746f6f7069630000000000000000
//383938393839426974636f696e20776f726c64626974636f696e776f726c64546865206265737420746f6f7069630000000000000000
