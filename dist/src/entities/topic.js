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
        console.log('TOPICDATA', this);
        return helper_1.Utils.encodeBytes({ type: 'string', value: this.id }, { type: 'string', value: this.ref }, { type: 'string', value: this.meta }, { type: 'hex', value: this.parentTopicHash }, 
        // { type: 'int', value: this.subsriberCount },
        { type: "boolean", value: this.isPublic }, { type: "boolean", value: this.readOnly }, { type: "string", value: this.subnet });
    }
}
exports.Topic = Topic;
// ebe426ef8e11fa41d4a8e204ca49562acdef673ec0d9fafba1e86676fe06cae400000000000003e9 33363064623532362d393539322d623738632d316335632d663537613932343130383537 6469643a636f736d6f73317a3770757836706574663666766e67646b6170306370796e657a746a3577776d6c76377a39662c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018f6c288f98
// ebe426ef8e11fa41d4a8e204ca49562acdef673ec0d9fafba1e86676fe06cae400000000000003e9                                                                          6469643a636f736d6f73317a3770757836706574663666766e67646b6170306370796e657a746a3577776d6c76377a39662c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018f6c288f98
// 53325434c4de46cb58434d1325251eed7b38f64fe9d69795931aa4bae2bd5e5900000000000003e9                                                                          6469643a636f736d6f73317a3770757836706574663666766e67646b6170306370796e657a746a3577776d6c76377a39662c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018f6c319a8d
// 5c1584b323832df978796a4a1c6669b68be3414b4f1e7ace570643e1c50e828700000000000003e9                                                                          6469643a636f736d6f73317a3770757836706574663666766e67646b6170306370796e657a746a3577776d6c76377a39662c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018f6c3345c6
// 5c1584b323832df978796a4a1c6669b68be3414b4f1e7ace570643e1c50e828700000000000003e9 33363064623532362d393539322d623738632d316335632d663537613932343130383537 6469643a636f736d6f73317a3770757836706574663666766e67646b6170306370796e657a746a3577776d6c76377a39662c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018f6c3345c6
