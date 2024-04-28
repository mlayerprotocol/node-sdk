/// <reference types="node" />
export type AddressString = string;
export type HexString = string;
export declare class BaseEntity {
    asPayload(): unknown;
    encodeBytes(): Buffer;
    getHash(): Buffer;
}
