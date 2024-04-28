import Jayson from "jayson";
import { ClientPayload } from "./entities/clientPayload";
import { Authorization } from "./entities/authorization";
import { Topic } from "./entities/topic";
import { Subscription } from "./entities/subscription";
import { Message } from "./entities/message";
export interface Client extends Jayson.TcpClientOptions {
}
declare class Provider {
    makeRequest(options?: unknown): Promise<Record<string, unknown>>;
}
export declare class RPCProvider extends Provider {
    private rpcClient;
    constructor({ rpcConfig, }: {
        rpcConfig: Jayson.TcpClientOptions | undefined;
        ethProvider?: any;
    });
}
export declare class RESTProvider extends Provider {
    private server;
    constructor(host?: string, ethProvider?: unknown);
    /**
     * @override
     * @param payload
     * @returns
     */
    makeRequest<T, O>(options: {
        path: string;
        method?: "get" | "put" | "post" | "patch" | "delete";
        params?: Record<string, any>;
        payload?: ClientPayload<T> | undefined;
        pathSuffix?: string | undefined;
    }): Promise<Record<string, unknown>>;
}
export declare class WSProvider extends Provider {
    private socketClient?;
    server?: string;
    port?: string;
    socketMessageCallback?: (message: any) => void;
    constructor(config: {
        server: string;
        port: string;
        ethProvider?: any;
    });
}
export declare class Client {
    provider: RESTProvider | RPCProvider | WSProvider;
    constructor(provider: RESTProvider | RPCProvider | WSProvider);
    authorize(payload: ClientPayload<Authorization>): Promise<Record<string, unknown>>;
    createTopic(payload: any): Promise<Record<string, unknown>>;
    updateTopic(payload: ClientPayload<Topic>): Promise<Record<string, unknown>>;
    getTopic(): Promise<Record<string, unknown>>;
    getAuthorizations({ params, }: Record<string, any>): Promise<Record<string, unknown>>;
    createSubscription(payload: ClientPayload<Subscription>): Promise<Record<string, unknown>>;
    getAccountSubscriptions({ params, }: Record<string, any>): Promise<Record<string, unknown>>;
    getTopicSubscribers({ params, }: Record<string, any>): Promise<Record<string, unknown>>;
    createMessage(payload: ClientPayload<Message>): Promise<Record<string, unknown>>;
    getBlockStats({ params, }: Record<string, any>): Promise<Record<string, unknown>>;
    getMainStats({ params, }: Record<string, any>): Promise<Record<string, unknown>>;
    getTopicMessages({ id, params, }: Record<string, any>): Promise<Record<string, unknown>>;
    getEvent({ type, id, }: Record<string, any>): Promise<Record<string, unknown>>;
    resolveEvent({ type, id, delay, }: Record<string, any>): Promise<Record<string, unknown>>;
    claimActivityPoint(payload: any): Promise<Record<string, unknown>>;
    connectWallet(payload: any): Promise<Record<string, unknown>>;
}
export declare class ActivityClient {
    client: Client;
    constructor(client: Client);
    connectWalletActivity(payload: ClientPayload<Authorization>): Promise<Record<string, unknown>>;
    authorizeAgentActivity(payload: ClientPayload<Authorization>): Promise<Record<string, unknown>>;
    createTopicActivity(payload: ClientPayload<Topic>): Promise<Record<string, unknown>>;
    joinTopicActivity(payload: ClientPayload<Subscription>): Promise<Record<string, unknown>>;
    sendMessageActivity(payload: ClientPayload<Message>): Promise<Record<string, unknown>>;
}
export {};
