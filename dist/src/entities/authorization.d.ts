/// <reference types="node" />
import { HexString, AddressString, BaseEntity } from './base';
export interface IAuthorization {
    agt: string;
    gr: AddressString;
    acct: HexString;
    privi: 0 | 1 | 2 | 3;
    topIds: string;
    du: number;
    ts: number;
    sig?: string;
}
export declare class Authorization extends BaseEntity {
    account: string;
    agent: string;
    grantor: string;
    privilege: 0 | 1 | 2 | 3;
    topicIds: string;
    timestamp: number;
    duration: number;
    signature: string;
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload(): IAuthorization;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
