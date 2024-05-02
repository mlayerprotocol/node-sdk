/// <reference types="node" />
import { BaseEntity } from "./base";
type AddressString = string;
export interface ITopic {
    id?: string;
    ref?: string;
    n: string;
    hand: string;
    pTH?: string;
    desc?: string;
    sC?: number;
    acct?: AddressString;
    ts?: number;
    pub: boolean;
    rO: boolean;
    snet: string;
}
export declare class Topic extends BaseEntity {
    id: string;
    reference: string;
    name: string;
    handle: string;
    description: string;
    parentTopicHash: string;
    subsriberCount: number;
    account: string;
    timestamp: number;
    isPublic: boolean;
    readOnly: boolean;
    subnet: string;
    /**
     * @override
     * @returns {ITopic}
     */
    asPayload(): ITopic;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
export {};
