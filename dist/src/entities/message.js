"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.MessageAttachment = exports.MessageAction = void 0;
const base_1 = require("./base");
const helper_1 = require("../helper");
const address_1 = require("./address");
class MessageAction extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.contract = "";
        this.abi = "";
        this.action = "";
        this.parameters = [""];
    }
    /**
     * @override
     * @returns {IMessageAction} object
     */
    asPayload() {
        return {
            c: this.contract,
            abi: this.abi,
            a: this.action,
            pa: this.parameters,
        };
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        let b = [];
        let len = 0;
        let parameters = Buffer.from("");
        for (const d of this.parameters) {
            let data = helper_1.Utils.encodeBytes({ type: "string", value: d });
            len += data.length;
            b.push(data);
        }
        parameters = Buffer.concat(b, len);
        return helper_1.Utils.encodeBytes({ type: "string", value: this.contract }, { type: "string", value: this.abi }, { type: "string", value: this.action }, {
            type: "byte",
            value: Buffer.from(parameters),
        });
    }
}
exports.MessageAction = MessageAction;
class MessageAttachment extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.cid = "";
        this.hash = "";
    }
    /**
     * @override
     * @returns {IMessageAttachment} object
     */
    asPayload() {
        return {
            cid: this.cid,
            h: this.hash,
        };
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        return helper_1.Utils.encodeBytes({ type: "string", value: this.cid }, { type: "string", value: this.hash });
    }
}
exports.MessageAttachment = MessageAttachment;
class Message extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = "";
        this.timestamp = 0;
        this.topicId = "";
        this.sender = address_1.Address.fromString("");
        this.receiver = address_1.Address.fromString("");
        this.data = Buffer.from("");
        this.actions = [];
        this.hash = "";
        this.attachments = [];
        this.signature = "";
        this.dataHash = "";
        this.url = "";
    }
    /**
     * @override
     * @returns {IMessage} object
     */
    asPayload() {
        return {
            id: this.id,
            ts: this.timestamp,
            topId: this.topicId,
            s: this.sender.toAddressString(),
            r: this.receiver.toAddressString(),
            //  d: new Uint8Array(this.data, this.data.byteOffset, this.data.byteLength),
            d: this.data.toString("hex"),
            a: this.actions,
            h: this.hash,
            atts: this.attachments,
            sig: this.signature,
            dh: this.dataHash,
            url: this.url,
        };
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        let len = 0;
        const attachmentArray = [];
        const actionArray = [];
        let attachments = Buffer.from("");
        let actions = Buffer.from("");
        for (const d of this.actions) {
            let data = new MessageAction().encodeBytes();
            len += data.length;
            actionArray.push(data);
        }
        actions = Buffer.concat(actionArray, len);
        len = 0;
        for (const d of this.attachments) {
            let data = new MessageAttachment().encodeBytes();
            len += data.length;
            attachmentArray.push(data);
        }
        attachments = Buffer.concat(attachmentArray, len);
        len = 0;
        return helper_1.Utils.encodeBytes({ type: "string", value: this.topicId }, { type: "address", value: this.sender.toString() }, { type: "address", value: this.receiver.toString() }, {
            type: "byte",
            value: helper_1.Utils.keccak256Hash(this.data),
        }, { type: "byte", value: Buffer.from(attachments) }, { type: "byte", value: Buffer.from(actions) });
    }
}
exports.Message = Message;
