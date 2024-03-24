import Jayson from "jayson";
import { w3cwebsocket } from "websocket";
import ethers from "ethers";
import { AuthorizeEventType, ClientPayload } from "./entities/clientPayload";
import { Authorization } from "./entities/authorization";
import axios from "axios";
import { Topic } from "./entities/topic";
import { Subscription } from "./entities/subscription";

export interface Client extends Jayson.TcpClientOptions {}

class Provider {
  // async read<O>(
  //   query: Record<string, unknown>,
  //   options?: O
  // ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
  //   return {};
  // }
  async makeRequest(
    payload: unknown,
    options?: unknown
  ): Promise<Record<string, unknown>> {
    return {};
  }
}
export class RPCProvider extends Provider {
  private rpcClient: Jayson.TcpClient | undefined;
  constructor({
    rpcConfig,
  }: {
    rpcConfig: Jayson.TcpClientOptions | undefined;
    ethProvider?: any;
  }) {
    super();
    if (rpcConfig) this.rpcClient = Jayson.client.tcp(rpcConfig);
  }
}
export class RESTProvider extends Provider {
  private server: string = "http://localhost:9531";
  constructor(host?: string, ethProvider?: unknown) {
    super();
    if (host.slice(-1) == `/`) host = host.substring(0, host.length - 1);
    this.server = host;
  }

  /**
   * @override
   * @param payload
   * @returns
   */
  async makeRequest<T, O>(
    payload: ClientPayload<T> | undefined,
    options?: { path: string; method?: "get" | "put" | "post" }
  ): Promise<Record<string, unknown>> {
    const argOptions = options as Record<string, unknown>;
    let path = argOptions?.path;
    const method = argOptions?.method ?? "put";
    if (payload != null) {
      switch (payload.eventType) {
        case AuthorizeEventType.AuthorizeEvent:
        case AuthorizeEventType.UnauthorizeEvent:
          path = "/authorize";
          break;
      }
    }
    try {
      const url = `${this.server}/api${path}`;
      let response;
      switch (method) {
        case "post":
        case "put":
        case "patch":
        case "delete":
          response = await (axios[options.method ?? "put"] as any)(
            url,
            payload?.asPayload(),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          break;
        default:
          console.log({ urlurl: url });
          response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
            },
          });
      }

      return (await response.data) as Record<string, unknown>;
    } catch (e) {
      throw e; //TODO dont throw error
    }
  }
}

export class WSProvider extends Provider {
  private socketClient?: w3cwebsocket;
  public server?: string;
  public port?: string;

  public socketMessageCallback?: (message: any) => void;

  constructor(config: { server: string; port: string; ethProvider?: any }) {
    super();
    this.server = config.server;
    this.port = config.port;
  }
}

export class Client {
  constructor(public provider: RESTProvider | RPCProvider | WSProvider) {}

  public async authorize(
    payload: ClientPayload<Authorization>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest(payload, { path: "/authorize" });
  }

  public async createTopic(
    payload: ClientPayload<Topic>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest(payload, {
      path: "/topics",
      method: "post",
    });
  }

  public async getTopic(): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest(null, {
      path: "/topics",
      method: "get",
    });
  }

  public async createSubscription(
    payload: ClientPayload<Subscription>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest(payload, {
      path: "/topics/subscribe",
      method: "post",
    });
  }
}
