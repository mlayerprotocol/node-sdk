"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.WSProvider = exports.RESTProvider = exports.RPCProvider = void 0;
const jayson_1 = __importDefault(require("jayson"));
const clientPayload_1 = require("./entities/clientPayload");
const axios_1 = __importDefault(require("axios"));
class Provider {
    async read(query, options) {
        return {};
    }
    async write(payload, options) {
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
        this.server = 'http://localhost:9531';
        if (host.slice(-1) == `/`)
            host = host.substring(0, host.length - 1);
        this.server = host;
    }
    /**
     * @override
     * @param payload
     * @returns
     */
    async write(payload, options) {
        const argOptions = options;
        let path = argOptions?.path;
        const method = argOptions?.method ?? 'put';
        switch (payload.eventType) {
            case clientPayload_1.AuthorizeEventType.AuthorizeEvent:
            case clientPayload_1.AuthorizeEventType.UnauthorizeEvent:
                path = '/authorize';
                break;
        }
        try {
            const url = `${this.server}/api${path}`;
            let response;
            switch (method) {
                case 'post':
                case 'put':
                case 'patch':
                case 'delete':
                    response = await axios_1.default[options.method ?? 'put'](url, payload, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    break;
                default:
                    response = await axios_1.default.get(url, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
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
        return await this.provider.write(payload, { path: '/authorize' });
    }
    async createTopic(payload) {
        return await this.provider.write(payload, {
            path: '/topics',
            method: 'post',
        });
    }
}
exports.Client = Client;
