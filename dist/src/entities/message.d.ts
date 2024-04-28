/// <reference types="node" />
import { BaseEntity } from "./base";
import { Address } from "./address";
type AddressString = string;
type HexString = string;
export interface IMessageAction {
    c: string;
    abi: string;
    a: string;
    pa: string[];
}
export interface IMessageAttachment {
    cid: string;
    h: string;
}
export interface IMessage {
    id: string;
    ts: number;
    topId: string;
    s: AddressString;
    r: AddressString;
    d: HexString;
    a: any[];
    h: string;
    atts: any[];
    sig: string;
    dh: string;
    url: string;
}
export declare class MessageAction extends BaseEntity {
    contract: string;
    abi: string;
    action: string;
    parameters: string[];
    /**
     * @override
     * @returns {IMessageAction} object
     */
    asPayload(): IMessageAction;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
export declare class MessageAttachment extends BaseEntity {
    cid: string;
    hash: string;
    /**
     * @override
     * @returns {IMessageAttachment} object
     */
    asPayload(): IMessageAttachment;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
export declare class Message extends BaseEntity {
    id: string;
    timestamp: number;
    topicId: string;
    sender: Address;
    receiver: Address;
    data: Buffer;
    actions: IMessageAction[];
    hash: string;
    attachments: IMessageAttachment[];
    signature: string;
    dataHash: string;
    url: string;
    /**
     * @override
     * @returns {IMessage} object
     */
    asPayload(): IMessage;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
export {};
