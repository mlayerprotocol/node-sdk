/// <reference types="node" />
import { AddressString, BaseEntity } from "./base";
import { Address } from "./address";
export interface ISignatureData {
    ty: string;
    pubK?: string;
    sig: string;
}
export declare class SignatureData {
    type: "" | "tendermint/PubKeySecp256k1" | "eth";
    publicKey: string;
    signature: string;
    constructor(type: "" | "tendermint/PubKeySecp256k1" | "eth", publicKey: string, signature: string);
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload(): ISignatureData;
}
export interface IAuthorization {
    agt: string;
    gr: AddressString;
    acct: AddressString;
    privi: 0 | 1 | 2 | 3;
    topIds: string;
    du: number;
    snet: string;
    ts: number;
    sigD: ISignatureData;
}
export declare class Authorization extends BaseEntity {
    account: Address;
    agent: string;
    grantor: Address;
    privilege: 0 | 1 | 2 | 3;
    topicIds: string;
    timestamp: number;
    duration: number;
    subnet: string;
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
