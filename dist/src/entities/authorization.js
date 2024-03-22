"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = exports.SignatureData = void 0;
const helper_1 = require("../helper");
const base_1 = require("./base");
const address_1 = require("./address");
class SignatureData {
    constructor(type, publicKey, signature) {
        this.type = type;
        this.publicKey = publicKey;
        this.signature = signature;
        type = '';
        publicKey = '';
        signature = '';
    }
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload() {
        return {
            ty: this.type,
            pubK: this.publicKey,
            sig: this.signature,
        };
    }
}
exports.SignatureData = SignatureData;
class Authorization extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.account = new address_1.Address();
        this.agent = '';
        this.grantor = new address_1.Address();
        this.privilege = 0;
        this.topicIds = '';
        this.signatureData = new SignatureData('', '', '');
    }
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload() {
        return {
            agt: this.agent,
            acct: this.account.toString(),
            gr: this.grantor.toString(),
            privi: this.privilege,
            topIds: this.topicIds,
            ts: this.timestamp,
            du: this.duration,
            sigD: this.signatureData.asPayload(),
        };
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        return helper_1.Utils.encodeBytes({ type: 'address', value: this.account.toString() }, { type: 'hex', value: this.agent }, { type: 'string', value: this.topicIds }, { type: 'int', value: this.privilege }, { type: 'int', value: this.duration }, { type: 'int', value: this.timestamp });
    }
}
exports.Authorization = Authorization;
