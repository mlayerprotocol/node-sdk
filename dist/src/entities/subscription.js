"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const base_1 = require("./base");
const helper_1 = require("../helper");
const address_1 = require("./address");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus[SubscriptionStatus["Unsubscribed"] = 0] = "Unsubscribed";
    SubscriptionStatus[SubscriptionStatus["Pending"] = 1] = "Pending";
    SubscriptionStatus[SubscriptionStatus["Subscribed"] = 2] = "Subscribed";
    // ApprovedSubscriptionStatus      SubscriptionStatuses = "approved"
    SubscriptionStatus[SubscriptionStatus["Banned"] = 3] = "Banned";
    // UNBANNED     SubscriptionStatuses = "unbanned"
})(SubscriptionStatus || (SubscriptionStatus = {}));
class Subscription extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = "";
        this.topic = "";
        this.account = address_1.Address.fromString("");
        this.timestamp = 0;
        this.status = 0;
        this.signature = "";
        this.hash = "";
        this.eventHash = "";
        this.agent = "";
        this.role = 0;
    }
    /**
     * @override
     * @returns {ITopic}
     */
    asPayload() {
        return {
            id: this.id,
            top: this.topic,
            acct: this.account.toString(),
            ts: this.timestamp,
            sig: this.signature,
            h: this.hash,
            eH: this.eventHash,
            st: this.status,
            agt: this.agent,
            rol: this.role,
        };
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        return helper_1.Utils.encodeBytes({ type: "string", value: this.topic }
        // { type: "address", value: this.subscriber.toString() }
        // { type: "string", value: this.eventHash },
        // { type: "int", value: this.status },
        // { type: "int", value: this.timestamp }
        );
    }
}
exports.Subscription = Subscription;
