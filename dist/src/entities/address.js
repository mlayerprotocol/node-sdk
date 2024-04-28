"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const helper_1 = require("../helper");
const base_1 = require("./base");
class Address extends base_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.prefix = "did";
        this.address = "";
        this.chain = "";
    }
    toString() {
        return this.toAddressString();
    }
    toAddressString() {
        if (this.address == "")
            return "";
        return `${this.prefix}:${this.address}${this.chain == "" ? "" : "#" + this.chain}`;
    }
    static fromString(addressString) {
        const addr = new Address();
        addr.prefix = "did";
        const parts = addressString.split(":");
        addr.address = parts[0] != "did" ? parts[0] : parts[1];
        const parts2 = addr.address.split("#");
        if (parts.length > 1) {
            addr.address = parts2[0];
            addr.chain = parts2[1];
        }
        return addr;
    }
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes() {
        return helper_1.Utils.encodeBytes({ type: "address", value: this.toString() });
    }
}
exports.Address = Address;
