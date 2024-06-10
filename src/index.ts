import Jayson from "jayson";
import { w3cwebsocket } from "websocket";
import ethers from "ethers";
import { AuthorizeEventType, ClientPayload } from "./entities/clientPayload";
import { Authorization } from "./entities/authorization";
import axios, { AxiosResponse } from "axios";
import { Topic } from "./entities/topic";
import { Subscription } from "./entities/subscription";
import { Message } from "./entities/message";
import { Subnet } from "./entities/subNetwork";
import { Wallet } from "./entities/wallet";

export interface Client extends Jayson.TcpClientOptions {}

class Provider {
  // async read<O>(
  //   query: Record<string, unknown>,
  //   options?: O
  // ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
  //   return {};
  // }
  async makeRequest(
    // payload: unknown,
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
  async makeRequest<T, O>(options: {
    path: string;
    method?: "get" | "put" | "post" | "patch" | "delete";
    params?: Record<string, any>;
    payload?: ClientPayload<T> | undefined;
  }): Promise<Record<string, unknown>> {
    var { payload, path, method = "put", params } = options ?? {};
    // let path = argOptions?.path;
    // const method = argOptions?.method ?? "put";
    // const params = argOptions?.params;
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
      let response: AxiosResponse<any, any>;
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
              params,
            }
          );
          break;
        default:
          // console.log({ urlurl: url });
          response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
            },
            params,
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
    return await this.provider.makeRequest({ path: '/authorize', payload });
  }

  public async createTopic(
    payload: ClientPayload<Topic>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/topics',
      method: 'post',
      payload,
    });
  }

  public async updateTopic(
    payload: ClientPayload<Topic>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: `/topics`,
      method: 'put',
      payload,
    });
  }

  public async getTopics({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/topics',
      method: 'get',
      params,
    });
  }

  public async getAuthorizations({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/authorizations',
      method: 'get',
      params,
    });
  }

  public async createSubscription(
    payload: ClientPayload<Subscription>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/topics/subscribe',
      method: 'post',
      payload,
    });
  }

  public async getAccountSubscriptions({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/subscription/account',
      method: 'get',
      params,
    });
  }

  public async getTopicSubscribers({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/topics/subscribers',
      method: 'get',
      params,
    });
  }

  public async createMessage(
    payload: ClientPayload<Message>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/topics/messages',
      method: 'post',
      payload,
    });
  }

  public async getBlockStats({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/block-stats',
      method: 'get',
      params,
    });
  }

  public async getMainStats({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/main-stats',
      method: 'get',
      params,
    });
  }
  public async getTopicMessages({
    id,
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: `/topics/${id}/messages`,
      method: 'get',
      params,
    });
  }

  public async getEvent({
    type,
    id,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: `/event/${type}/${id}`,
      method: 'get',
    });
  }

  public async resolveEvent({
    type,
    id,
    delay = 0,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    const data = await this.getEvent({ type, id });
    const synced: boolean = data?.['data']?.['sync'] ?? false;
    if (synced) {
      return data;
    }
    // console.log({ delay, synced });
    await new Promise((r) => setTimeout(r, 2000));
    if (delay < 10) {
      return this.resolveEvent({ type, id, delay: delay + 2 });
    }
    return { data };
  }

  public async createSubnet(
    payload: ClientPayload<Subnet>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/subnets',
      method: 'post',
      payload,
    });
  }

  public async getSubnets({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/subnets',
      method: 'get',
      params,
    });
  }

  public async createWallet(
    payload: ClientPayload<Wallet>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: '/wallets',
      method: 'post',
      payload,
    });
  }
}
