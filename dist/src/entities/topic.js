"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const base_1 = require("./base");
const helper_1 = require("../helper");
class Topic extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = "";
        this.reference = "";
        this.name = "";
        this.handle = "";
        this.description = "";
        this.parentTopicHash = "";
        this.subsriberCount = 0;
        this.account = "";
        this.timestamp = 0;
        this.isPublic = false;
        this.readOnly = false;
    }
    /**
     * @override
     * @returns {ITopic}
     */
    asPayload() {
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
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        return helper_1.Utils.encodeBytes({ type: "string", value: this.reference }, { type: "string", value: this.name }, { type: "string", value: this.handle }, { type: "string", value: this.description }, { type: "hex", value: this.parentTopicHash }, 
        // { type: 'int', value: this.subsriberCount },
        { type: "boolean", value: this.isPublic }, { type: "boolean", value: this.readOnly });
    }
}
exports.Topic = Topic;
