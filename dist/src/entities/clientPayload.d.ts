/// <reference types="node" />
import { BaseEntity } from "./base";
import { Address } from "./address";
export declare enum AuthorizeEventType {
    "AuthorizeEvent" = 100,
    "UnauthorizeEvent" = 101
}
export declare enum AdminTopicEventType {
    "DeleteTopic" = 1000,
    "CreateTopic" = 1001,// m.room.create
    "PrivacySet" = 1002,
    "BanMember" = 1003,
    "UnbanMember" = 1004,
    "ContractSet" = 1005,
    "UpdateName" = 1006,//  m.room.name
    "UpdateDescription" = 1007,//  m.room.topic
    "UpdateAvatar" = 1008,//  m.room.avatar
    "PinMessage" = 1008,//  m.room.avatar
    "UpgradeSubscriberEvent" = 1010
}
export declare enum MemberTopicEventType {
    "LeaveEvent" = 1100,
    "JoinEvent" = 1101,
    "RequestedEvent" = 1102,
    "ApprovedEvent" = 1103,
    "UpgradedEvent" = 1104,
    "InvitedEvent" = 1105
}
export declare enum MemberMessageEventType {
    "DeleteMessageEvent " = 1200,//m.room.encrypted
    "SendMessageEvent" = 1201
}
type AddressString = string;
type HexString = string;
export interface IClientPayload {
    d: unknown;
    ts: number;
    ty: number;
    val: AddressString;
    nonce: number;
    sig: HexString;
    h: HexString;
    acct: AddressString;
}
export declare class ClientPayload<T> extends BaseEntity {
    data: T;
    timestamp: number;
    account: Address;
    validator: string;
    eventType: AuthorizeEventType | AdminTopicEventType | MemberTopicEventType | MemberMessageEventType;
    authHash: string;
    nonce: number;
    signature: string;
    hash: string;
    encodeBytes(): Buffer;
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload(): IClientPayload;
}
export {};
