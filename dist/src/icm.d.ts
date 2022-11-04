import Jayson from "jayson";
export interface Client extends Jayson.TcpClientOptions {
}
export declare class Icm {
    client: Jayson.TcpClient;
    constructor(config: Jayson.TcpClientOptions | undefined);
    /**
     * subscribe
     */
    subscribe(subscription: Jayson.RequestParamsLike, callback: Jayson.JSONRPCCallbackType | undefined): void;
}
