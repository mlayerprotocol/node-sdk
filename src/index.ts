import Jayson from "jayson";
import { w3cwebsocket } from "websocket";
import ethers from "ethers";
import { AuthorizeEventType, ClientPayload } from "./entities/clientPayload";
import { Authorization } from "./entities/authorization";
import axios, { AxiosResponse } from "axios";
import { Topic } from "./entities/topic";
import { Subscription } from "./entities/subscription";
import { Message } from "./entities/message";

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
    pathSuffix?: string | undefined;
  }): Promise<Record<string, unknown>> {
    var {
      payload,
      path,
      method = "put",
      params,
      pathSuffix = "api",
    } = options ?? {};
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
      const url = `${this.server}/${pathSuffix}${path}`;
      let response: AxiosResponse<any, any>;
      switch (method) {
        case "post":
        case "put":
        case "patch":
        case "delete":
          response = await (axios[options.method ?? "put"] as any)(
            url,
            payload?.asPayload ? payload?.asPayload() : payload,
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
    return await this.provider.makeRequest({ path: "/authorize", payload });
  }

  public async createTopic(payload: any): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/topics",
      method: "post",
      payload,
    });
  }

  public async updateTopic(
    payload: ClientPayload<Topic>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: `/topics`,
      method: "put",
      payload,
    });
  }

  public async getTopic(): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/topics",
      method: "get",
    });
  }

  public async getAuthorizations({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/authorizations",
      method: "get",
      params,
    });
  }

  public async createSubscription(
    payload: ClientPayload<Subscription>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/topics/subscribe",
      method: "post",
      payload,
    });
  }

  public async getAccountSubscriptions({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/subscription/account",
      method: "post",
      params,
    });
  }

  public async getTopicSubscribers({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/topics/subscribers",
      method: "get",
      params,
    });
  }

  public async createMessage(
    payload: ClientPayload<Message>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/topics/messages",
      method: "post",
      payload,
    });
  }

  public async getBlockStats({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/block-stats",
      method: "get",
      params,
    });
  }

  public async getMainStats({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/main-stats",
      method: "get",
      params,
    });
  }
  public async getTopicMessages({
    id,
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: `/topics/${id}/messages`,
      method: "get",
      params,
    });
  }

  public async getEvent({
    type,
    id,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: `/event/${type}/${id}`,
      method: "get",
    });
  }

  public async resolveEvent({
    type,
    id,
    delay = 0,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    const data = await this.getEvent({ type, id });
    const synced: boolean = data?.["data"]?.["sync"] ?? false;
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

  public async claimActivityPoint(
    payload: any
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/activity-point/claim",
      method: "post",
      payload,
      pathSuffix: "v1",
    });
  }

  public async connectWallet(payload: any): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/activity-point/account/connect",
      method: "post",
      payload,
      pathSuffix: "v1",
    });
  }
}

export class ActivityClient {
  constructor(public client: Client) {}

  public async connectWalletActivity(
    payload: ClientPayload<Authorization>
  ): Promise<Record<string, unknown>> {
    return await this.client.connectWallet({
      secret: process.env.ACTIVITY_SECRET,
      projectId: process.env.PROJECT_ID,
      activityId: process.env.CONNECT_WALLET,
      walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
    });
  }

  public async authorizeAgentActivity(
    payload: ClientPayload<Authorization>
  ): Promise<Record<string, unknown>> {
    const auths: any = await this.client.getAuthorizations({
      params: {
        // acct: payload.account
        acct: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      },
    });
    return await this.client.claimActivityPoint({
      secret: process.env.ACTIVITY_SECRET,
      projectId: process.env.PROJECT_ID,
      walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      activityId: process.env.AUTHORIZE_AGENT,
      activityCount: auths.data.length,
    });
  }

  public async createTopicActivity(
    payload: ClientPayload<Topic>
  ): Promise<Record<string, unknown>> {
    const topics: any = await this.client.getAccountSubscriptions({
      params: {
        // acct: payload.account
        acct: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      },
    });
    return await this.client.claimActivityPoint({
      secret: process.env.ACTIVITY_SECRET,
      projectId: process.env.PROJECT_ID,
      walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      activityId: process.env.CREATE_TOPIC,
      activityCount: topics.data.length,
    });
  }

  public async joinTopicActivity(
    payload: ClientPayload<Subscription>
  ): Promise<Record<string, unknown>> {
    const topics: any = await this.client.getAccountSubscriptions({
      params: {
        // acct: payload.account
        acct: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      },
    });
    const joinedTopics = topics.data.filter(
      (topic) => topic.acct === payload.account
    );
    return await this.client.claimActivityPoint({
      secret: process.env.ACTIVITY_SECRET,
      projectId: process.env.PROJECT_ID,
      walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      activityId: process.env.JOIN_TOPIC,
      activityCount: joinedTopics.length,
    });
  }

  public async sendMessageActivity(
    payload: ClientPayload<Message>
  ): Promise<Record<string, unknown>> {
    const topics = await this.client.getTopicMessages({
      params: {
        // acct: payload.account
        acct: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      },
    });
    return await this.client.claimActivityPoint({
      secret: process.env.ACTIVITY_SECRET,
      projectId: process.env.PROJECT_ID,
      walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
      activityId: process.env.SEND_MESSAGE_TO_TOPIC,
      activityCount: topics.length,
    });
  }
}
