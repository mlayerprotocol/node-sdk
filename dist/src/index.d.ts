import Jayson from 'jayson';
import { ClientPayload } from './entities/clientPayload';
import { Authorization } from './entities/authorization';
import { Topic } from './entities/topic';
export interface Client extends Jayson.TcpClientOptions {
}
declare class Provider {
    read<O>(query: Record<string, unknown>, options?: O): Promise<Record<string, unknown> | Record<string, unknown>[]>;
    write(payload: unknown, options?: unknown): Promise<Record<string, unknown>>;
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
    write<T, O>(payload: ClientPayload<T>, options?: {
        path: string;
        method?: 'get' | 'put' | 'post';
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
    createTopic(payload: ClientPayload<Topic>): Promise<Record<string, unknown>>;
}
export {};
