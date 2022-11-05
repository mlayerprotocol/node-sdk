import Jayson from "jayson";
import Web3 from "web3";
export interface Client extends Jayson.TcpClientOptions {
}
export declare type SubscriptionActionType = 'join' | 'leave';
export interface Subscription {
    channel: string;
    channelName: string;
    subscriber: string;
    timestamp: number;
    signature: string;
    action: SubscriptionActionType;
}
export interface NewSubscriptionParam {
    channelName: string;
    channelSignature: string;
    action?: SubscriptionActionType;
}
export interface Message {
    timestamp: number;
    receiver: string;
    platform: string;
    chainId: string;
    type: string;
    message: string;
    subject: string;
    signature: string;
    actions: MessageAction[];
    origin: string;
    messageHash: string;
    subjectHash: string;
}
export interface MessageAction {
    contract: string;
    abi: string;
    action: string;
    parameters: string[];
}
export interface NewMessageParam {
    channelName: string;
    channelSignature: string;
    platform?: string;
    type?: string;
    chainId: string;
    message: string;
    subject: string;
    abi: string;
    parameters: string[];
    actions: MessageAction[];
    origin: string;
}
export declare class Icm {
    client: Jayson.TcpClient | undefined;
    web3: Web3;
    constructor(config: Jayson.TcpClientOptions | undefined);
    /**
     * subscribe
     */
    initializeRpc(config: Jayson.TcpClientOptions): void;
    subscribe(subscription: Subscription, callback: Jayson.JSONRPCCallbackType | undefined): void;
    /**
     * newSubscription
     */
    newSubscription({ channelName, channelSignature, action }: NewSubscriptionParam, privateKey: string): Subscription;
    newChannel(channelName: string, privateKey: string): string;
    /**
     * sendMessage
     */
    sendMessage(message: Message, callback: Jayson.JSONRPCCallbackType | undefined): void;
    /**
     * newMessage
     */
    newMessage({ channelName, channelSignature, chainId, message, subject, actions, origin, platform, type, ...params }: NewMessageParam, privateKey: string): Message;
}
