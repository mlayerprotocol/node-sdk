"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const base_1 = require("./base");
const helper_1 = require("../helper");
class Topic extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = '';
        this.ref = '';
        this.meta = '';
        this.parentTopicHash = '';
        this.subsriberCount = 0;
        this.account = '';
        this.timestamp = 0;
        this.isPublic = false;
        this.readOnly = false;
        this.subnet = "";
    }
    /**
     * @override
     * @returns {ITopic}
     */
    asPayload() {
        return {
            id: this.id,
            ref: this.ref,
            meta: this.meta,
            pTH: this.parentTopicHash, // parent handle hash
            // sC: this.subsriberCount, // subscription count
            // acct: this.account, // owner of topic
            // ts: this.timestamp, // timestamp in millisec
            pub: this.isPublic, // is public topic
            rO: this.readOnly,
            snet: this.subnet,
        };
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        return helper_1.Utils.encodeBytes({ type: 'string', value: this.id }, { type: 'string', value: this.ref }, { type: 'string', value: this.meta }, { type: 'hex', value: this.parentTopicHash }, 
        // { type: 'int', value: this.subsriberCount },
        { type: "boolean", value: this.isPublic }, { type: "boolean", value: this.readOnly }, { type: "string", value: this.subnet });
    }
}
exports.Topic = Topic;
