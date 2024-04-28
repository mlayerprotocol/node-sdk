/// <reference types="node" />
import { AddressString, BaseEntity } from "./base";
export declare class Address extends BaseEntity {
    prefix: string;
    address: string;
    chain: string;
    toString(): string;
    toAddressString(): AddressString;
    static fromString(addressString: string): Address;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
