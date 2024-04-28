/// <reference types="node" />
import { BaseEntity } from "./base";
import { Address } from "./address";
type AddressString = string;
export interface ISubscription {
    id: string;
    top: string;
    acct: AddressString;
    ts: number;
    st: number;
    sig: string;
    h: string;
    eH: string;
    agt: string;
    rol: number;
}
declare enum SubscriptionStatus {
    Unsubscribed = 0,
    Pending = 1,
    Subscribed = 2,
    Banned = 3
}
export declare class Subscription extends BaseEntity {
    id: string;
    topic: string;
    account: Address;
    timestamp: number;
    status: SubscriptionStatus;
    signature: string;
    hash: string;
    eventHash: string;
    agent: string;
    role: number;
    /**
     * @override
     * @returns {ITopic}
     */
    asPayload(): ISubscription;
    /**
     * @override
     * @returns {Buffer}
     */
    encodeBytes(): Buffer;
}
export {};
