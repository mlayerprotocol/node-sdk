"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityClient = exports.Client = exports.WSProvider = exports.RESTProvider = exports.RPCProvider = void 0;
const jayson_1 = __importDefault(require("jayson"));
const clientPayload_1 = require("./entities/clientPayload");
const axios_1 = __importDefault(require("axios"));
class Provider {
    // async read<O>(
    //   query: Record<string, unknown>,
    //   options?: O
    // ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    //   return {};
    // }
    async makeRequest(
    // payload: unknown,
    options) {
        return {};
    }
}
class RPCProvider extends Provider {
    constructor({ rpcConfig, }) {
        super();
        if (rpcConfig)
            this.rpcClient = jayson_1.default.client.tcp(rpcConfig);
    }
}
exports.RPCProvider = RPCProvider;
class RESTProvider extends Provider {
    constructor(host, ethProvider) {
        super();
        this.server = "http://localhost:9531";
        if (host.slice(-1) == `/`)
            host = host.substring(0, host.length - 1);
        this.server = host;
    }
    /**
     * @override
     * @param payload
     * @returns
     */
    async makeRequest(options) {
        var { payload, path, method = "put", params, pathSuffix = "api", } = options ?? {};
        // let path = argOptions?.path;
        // const method = argOptions?.method ?? "put";
        // const params = argOptions?.params;
        if (payload != null) {
            switch (payload.eventType) {
                case clientPayload_1.AuthorizeEventType.AuthorizeEvent:
                case clientPayload_1.AuthorizeEventType.UnauthorizeEvent:
                    path = "/authorize";
                    break;
            }
        }
        try {
            const url = `${this.server}/${pathSuffix}${path}`;
            let response;
            switch (method) {
                case "post":
                case "put":
                case "patch":
                case "delete":
                    response = await axios_1.default[options.method ?? "put"](url, payload?.asPayload ? payload?.asPayload() : payload, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        params,
                    });
                    break;
                default:
                    // console.log({ urlurl: url });
                    response = await axios_1.default.get(url, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        params,
                    });
            }
            return (await response.data);
        }
        catch (e) {
            throw e; //TODO dont throw error
        }
    }
}
exports.RESTProvider = RESTProvider;
class WSProvider extends Provider {
    constructor(config) {
        super();
        this.server = config.server;
        this.port = config.port;
    }
}
exports.WSProvider = WSProvider;
class Client {
    constructor(provider) {
        this.provider = provider;
    }
    async authorize(payload) {
        return await this.provider.makeRequest({ path: "/authorize", payload });
    }
    async createTopic(payload) {
        return await this.provider.makeRequest({
            path: "/topics",
            method: "post",
            payload,
        });
    }
    async updateTopic(payload) {
        return await this.provider.makeRequest({
            path: `/topics`,
            method: "put",
            payload,
        });
    }
    async getTopic() {
        return await this.provider.makeRequest({
            path: "/topics",
            method: "get",
        });
    }
    async getAuthorizations({ params, }) {
        return await this.provider.makeRequest({
            path: "/authorizations",
            method: "get",
            params,
        });
    }
    async createSubscription(payload) {
        return await this.provider.makeRequest({
            path: "/topics/subscribe",
            method: "post",
            payload,
        });
    }
    async getAccountSubscriptions({ params, }) {
        return await this.provider.makeRequest({
            path: "/subscription/account",
            method: "post",
            params,
        });
    }
    async getTopicSubscribers({ params, }) {
        return await this.provider.makeRequest({
            path: "/topics/subscribers",
            method: "get",
            params,
        });
    }
    async createMessage(payload) {
        return await this.provider.makeRequest({
            path: "/topics/messages",
            method: "post",
            payload,
        });
    }
    async getBlockStats({ params, }) {
        return await this.provider.makeRequest({
            path: "/block-stats",
            method: "get",
            params,
        });
    }
    async getMainStats({ params, }) {
        return await this.provider.makeRequest({
            path: "/main-stats",
            method: "get",
            params,
        });
    }
    async getTopicMessages({ id, params, }) {
        return await this.provider.makeRequest({
            path: `/topics/${id}/messages`,
            method: "get",
            params,
        });
    }
    async getEvent({ type, id, }) {
        return await this.provider.makeRequest({
            path: `/event/${type}/${id}`,
            method: "get",
        });
    }
    async resolveEvent({ type, id, delay = 0, }) {
        const data = await this.getEvent({ type, id });
        const synced = data?.["data"]?.["sync"] ?? false;
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
    async claimActivityPoint(payload) {
        return await this.provider.makeRequest({
            path: "/activity-point/claim",
            method: "post",
            payload,
            pathSuffix: "v1",
        });
    }
    async connectWallet(payload) {
        return await this.provider.makeRequest({
            path: "/activity-point/account/connect",
            method: "post",
            payload,
            pathSuffix: "v1",
        });
    }
}
exports.Client = Client;
class ActivityClient {
    constructor(client) {
        this.client = client;
    }
    async connectWalletActivity(payload) {
        return await this.client.connectWallet({
            secret: process.env.ACTIVITY_SECRET,
            projectId: process.env.PROJECT_ID,
            activityId: process.env.CONNECT_WALLET,
            walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
        });
    }
    async authorizeAgentActivity(payload) {
        const auths = await this.client.getAuthorizations({
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
    async createTopicActivity(payload) {
        const topics = await this.client.getAccountSubscriptions({
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
    async joinTopicActivity(payload) {
        const topics = await this.client.getAccountSubscriptions({
            params: {
                // acct: payload.account
                acct: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
            },
        });
        const joinedTopics = topics.data.filter((topic) => topic.acct === payload.account);
        return await this.client.claimActivityPoint({
            secret: process.env.ACTIVITY_SECRET,
            projectId: process.env.PROJECT_ID,
            walletAddress: "did:cosmos1v825p3zrd4vpmp5r0p8szmvujdcl284ap22jcp",
            activityId: process.env.JOIN_TOPIC,
            activityCount: joinedTopics.length,
        });
    }
    async sendMessageActivity(payload) {
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
exports.ActivityClient = ActivityClient;
