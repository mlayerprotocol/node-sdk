import Jayson from "jayson";
import { w3cwebsocket } from "websocket";
import { AuthorizeEventType, ClientPayload } from "./entities/clientPayload";
import { Authorization } from "./entities/authorization";
import axios, { AxiosResponse } from "axios";
import { Topic } from "./entities/topic";
import { Subscription } from "./entities/subscription";
import { Message } from "./entities/message";
import { Subnet } from "./entities/subNetwork";
import { Wallet } from "./entities/wallet";
import jaysonBrowserClient from "jayson/lib/client/browser";
import ClientBrowser from "jayson/lib/client/browser";
import { EventFilter, Provider, SubscriptionEvents } from "./providers";
import { RESTProvider } from "./providers/rest";
import { WSProvider } from "./providers/ws";

export class RPCProvider implements Provider {
  private rpcClient:
    | Jayson.HttpClient
    | Jayson.HttpClientOptions
    | ClientBrowser
    | undefined;
  constructor({
    rpcConfig,
    server,
  }: {
    server: string;
    rpcConfig:
      | Jayson.HttpsClientOptions
      | Jayson.HttpClientOptions
      | Jayson.TcpClient
      | undefined;
    ethProvider?: any;
  }) {
    if (window != null) {
      if (rpcConfig) {
        const callServer = function (request: any, callback: any) {
          axios
            .post(server, request, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(
              (response) => {
                callback(null, response.data);
              },
              (error) => {
                callback(error);
              }
            );
        };

        this.rpcClient = new jaysonBrowserClient(callServer, rpcConfig as any);
      }
    } else {
      if (server.startsWith("http://")) {
        this.rpcClient = Jayson.client.http(rpcConfig as any);
      }
      if (server.startsWith("https://")) {
        this.rpcClient = Jayson.client.https(rpcConfig as any);
      }
      if (server.startsWith("tcp://")) {
        this.rpcClient = Jayson.client.tcp(rpcConfig as any);
      }
    }
  }

  makeRequest: (options?: unknown) => Promise<Record<string, unknown>>;
}

export class Client<P> {
  constructor(public provider: Provider) {}

  public async connect(): Promise<boolean> {
    return await this.provider?.connect();
  }

  public async subscribe(
    filter: EventFilter,
    events: SubscriptionEvents
  ): Promise<void> {
    return await this.provider?.subscribe(filter, events);
  }

  public async authorize(
    payload: ClientPayload<Authorization>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/authorizations",
      payload,
    });
  }

  public async createTopic(
    payload: ClientPayload<Topic>
  ): Promise<Record<string, unknown>> {
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

  public async getTopics({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/topics",
      method: "get",
      params,
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
      method: "get",
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

  public async getNodeInfo({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/info",
      method: "get",
      params,
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

  public async createSubnet(
    payload: ClientPayload<Subnet>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/subnets",
      method: "post",
      payload,
    });
  }

  public async getSubnets({
    params,
  }: Record<string, any>): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/subnets",
      method: "get",
      params,
    });
  }

  public async createWallet(
    payload: ClientPayload<Wallet>
  ): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/wallets",
      method: "post",
      payload,
    });
  }

  public async saveGamePoints(payload: any): Promise<Record<string, unknown>> {
    return await this.provider.makeRequest({
      path: "/activity/game",
      method: "post",
      payload,
      prefix: "v1",
    });
  }
}
