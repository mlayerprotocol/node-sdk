import Jayson from "jayson";
import { Account, provider } from "web3-core";
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
    approval?: string;
}
export interface SetupSocket {
    privateKey?: string;
    socketServer?: string;
    socketPort?: string;
    socketMessageCallback?: (message: any) => void;
}
export interface SetupSocketResponse {
    tmpAccount: Account;
}
export interface ApproveSender {
    expiry: string;
    channels: string[] | '*';
    sender: string;
}
export declare class Icm {
    private client;
    private web3;
    provider?: any;
    private socketClient?;
    socketServer?: string;
    socketPort?: string;
    tmpAccount?: {
        signer: string;
        timestamp: number;
        signature: string;
    };
    socketMessageCallback?: (message: any) => void;
    disposableAccount?: Account;
    constructor(config: Jayson.TcpClientOptions | undefined, provider?: provider);
    /**
     * subscribe
     */
    initializeRpc(config: Jayson.TcpClientOptions): void;
    subscribe(subscription: Subscription, callback: Jayson.JSONRPCCallbackType | undefined): void;
    /**
     * newSubscription
     */
    newSubscription({ channelName, channelSignature, action }: NewSubscriptionParam, privateKey?: string): Promise<Subscription>;
    newChannel(channelName: string, privateKey?: string): Promise<string>;
    /**
     * sendMessage
     */
    sendMessage(message: Message, callback: Jayson.JSONRPCCallbackType | undefined): void;
    /**
     * newMessage
     */
    newMessage({ channelName, channelSignature, chainId, message, subject, actions, origin, platform, type, approval, ...params }: NewMessageParam, privateKey?: string): Promise<Message>;
    setupSocket({ privateKey, socketServer, socketPort, socketMessageCallback }: SetupSocket): Promise<SetupSocketResponse>;
    private handleMessage;
    /**
     * approveSender
     */
    approveSender({ expiry, channels, sender }: ApproveSender, privateKey?: string): Promise<string>;
    /**
     * signData
     */
    signData(data: string, privateKey?: string): Promise<string>;
}
