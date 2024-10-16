import { AddressString, BaseEntity, ChainId, HexString } from './base';
import { Address } from './address';
export declare enum AuthorizeEventType {
    'AuthorizeEvent' = 100,
    'UnauthorizeEvent' = 101
}
export declare enum AdminTopicEventType {
    'DeleteTopic' = 1000,
    'CreateTopic' = 1001,// m.room.create
    'PrivacySet' = 1002,
    'BanMember' = 1003,
    'UnbanMember' = 1004,
    'ContractSet' = 1005,
    'UpdateName' = 1006,//  m.room.name
    'UpdateDescription' = 1007,//  m.room.topic
    'UpdateAvatar' = 1008,//  m.room.avatar
    'PinMessage' = 1008,//  m.room.avatar
    'UpdateTopic' = 1009,// m.room.create
    'UpgradeSubscriberEvent' = 1010
}
export declare enum MemberTopicEventType {
    'UnsubscribeEvent' = 1100,
    'SubscribeEvent' = 1101,
    'RequestedEvent' = 1102,
    'ApprovedEvent' = 1103,
    'UpgradedEvent' = 1104,
    'InvitedEvent' = 1105
}
export declare enum MemberMessageEventType {
    'DeleteMessageEvent ' = 1200,//m.room.encrypted
    'SendMessageEvent' = 1201
}
export declare enum AdminSubnetEventType {
    'DeleteSubnet' = 1300,
    'CreateSubnet' = 1301,// m.room.create
    'UpdateSubnet' = 1309
}
export declare enum AdminWalletEventType {
    'DeleteWallet' = 1400,
    'CreateWallet' = 1401,// m.room.create
    'WalletTopic' = 1409
}
export interface IClientPayload {
    d: unknown;
    ts: number;
    ty: number;
    val: AddressString;
    nonce: number;
    snet?: string;
    sig: HexString;
    h: HexString;
    acct: AddressString;
    chId: string;
}
export declare class ClientPayload<T> extends BaseEntity {
    data: T;
    timestamp: number;
    account: Address;
    validator: string;
    eventType: AuthorizeEventType | AdminTopicEventType | AdminSubnetEventType | AdminWalletEventType | MemberTopicEventType | MemberMessageEventType;
    authHash: string;
    nonce: number;
    subnet: string;
    chainId: ChainId;
    signature: string;
    hash: string;
    encodeBytes(): Buffer;
    /**
     * @override
     * @returns {IAuthorization}
     */
    asPayload(): IClientPayload;
    sign(params: {
        chainId: string | number;
        agentPrivateKey: string;
        validator: string;
    }): ClientPayload<T>;
}
