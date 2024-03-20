/// <reference types="node" />
import { HexString, AddressString, BaseEntity } from './base';
export interface ISignatureData {
    ty: string;
    pubK?: string;
    sig: string;
}
export declare class SignatureData {
    type: '' | 'tendermint/PubKeySecp256k1' | 'eth';
    publicKey: string;
    signature: string;
    constructor(type: '' | 'tendermint/PubKeySecp256k1' | 'eth', publicKey: string, signature: string);
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload(): ISignatureData;
}
export interface IAuthorization {
    agt: string;
    gr: AddressString;
    acct: HexString;
    privi: 0 | 1 | 2 | 3;
    topIds: string;
    du: number;
    ts: number;
    sigD: ISignatureData;
}
export declare class Authorization extends BaseEntity {
    account: string;
    agent: string;
    grantor: string;
    privilege: 0 | 1 | 2 | 3;
    topicIds: string;
    timestamp: number;
    duration: number;
    signatureData: SignatureData;
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
