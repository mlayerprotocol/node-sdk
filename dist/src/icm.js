"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icm = void 0;
const jayson_1 = __importDefault(require("jayson"));
const web3_1 = __importDefault(require("web3"));
const websocket_1 = require("websocket");
class Icm {
    constructor(config, provider) {
        this.web3 = new web3_1.default();
        this.handleMessage = async (event) => {
            var _a, _b, _c, _d, _e;
            if (!this.socketClient)
                throw new Error("Client Socket not available");
            const message = event.data;
            console.log("message", typeof message, message);
            try {
                let _message = JSON.parse(message);
                console.log("Received: ", _message);
                (_a = this.socketMessageCallback) === null || _a === void 0 ? void 0 : _a.call(this, _message);
                switch ((_b = _message.type) !== null && _b !== void 0 ? _b : '') {
                    case 'new-message':
                        _message = _message.data;
                        const _proof = {
                            messageSignature: _message.senderSignature,
                            // messageSender: tmpAccount.pubKey,
                            tmpAccount: this.tmpAccount,
                            node: _message.message.origin,
                            timestamp: Math.floor(Date.now() / 1000),
                        };
                        const _proofSignatureBody = `Message:${_proof.messageSignature},NodeAddress:${_proof.node},Timestamp:${_proof.timestamp}`;
                        console.log("_proofSignatureBody: ", _proofSignatureBody);
                        const _signature = await this.signData(_proofSignatureBody, (_d = (_c = this.disposableAccount) === null || _c === void 0 ? void 0 : _c.privateKey) !== null && _d !== void 0 ? _d : '');
                        _proof['signature'] = _signature;
                        console.log('_proof', _proof);
                        const client = this.socketClient;
                        if (this.socketClient.readyState === this.socketClient.OPEN) {
                            this.socketClient.send(JSON.stringify({
                                type: 'delivery-proof',
                                data: _proof,
                                signature: (_e = this.tmpAccount) === null || _e === void 0 ? void 0 : _e.signature,
                            }));
                        }
                        break;
                    default:
                        break;
                }
            }
            catch (error) {
                console.log("error: ", error);
            }
        };
        if (config)
            this.client = jayson_1.default.client.tcp(config);
        if (provider) {
            this.provider = provider;
            this.web3 = new web3_1.default(provider);
        }
    }
    /**
     * subscribe
     */
    initializeRpc(config) {
        this.client = jayson_1.default.client.tcp(config);
    }
    subscribe(subscription, callback) {
        if (!this.client) {
            throw new Error("Client Not Initialize");
        }
        this.client.request("RpcService.Subscription", [subscription], callback);
    }
    /**
     * newSubscription
     */
    async newSubscription({ channelName, channelSignature, action = 'join' }, privateKey) {
        const timestamp = Math.floor(Number(Date.now().toString()) / 1000);
        let sub = [];
        sub.push(`Channel:${channelSignature}`);
        sub.push(`ChannelName:${channelName}`);
        sub.push(`Timestamp:${timestamp}`);
        sub.push(`Action:${action}`);
        const subString = sub.join(",");
        const signature = await this.signData(subString, privateKey);
        let subscriber = '';
        if (privateKey) {
            subscriber = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
        }
        else {
            const from = await this.web3.eth.getAccounts();
            if (from.length == 0)
                throw new Error("No account found");
            subscriber = from[0];
        }
        const _sub = {
            channel: channelSignature,
            channelName,
            subscriber,
            timestamp,
            signature,
            action
        };
        console.log('new Sub', _sub);
        return _sub;
    }
    async newChannel(channelName, privateKey) {
        return await this.signData(channelName.toLowerCase(), privateKey);
    }
    /**
     * sendMessage
     */
    sendMessage(message, callback) {
        if (!this.client) {
            throw new Error("Client Not Initialize");
        }
        this.client.request("RpcService.SendMessage", [message], callback);
    }
    /**
     * newMessage
     */
    async newMessage(_a, privateKey) {
        var _b, _c, _d, _e;
        var { channelName, channelSignature, chainId, message, subject, actions, origin, platform = "channel", type = "html", approval } = _a, params = __rest(_a, ["channelName", "channelSignature", "chainId", "message", "subject", "actions", "origin", "platform", "type", "approval"]);
        const receiver = `${channelName}:${channelSignature}`;
        const text = message;
        const timestamp = Number(Date.now().toString());
        let chatMessage = [];
        if (approval) {
            chatMessage.push(`Header.Approval:${approval}`);
        }
        // chatMessage.push(`Header.Sender:${from}`);
        chatMessage.push(`Header.Receiver:${receiver}`);
        chatMessage.push(`Header.ChainId:${chainId}`);
        chatMessage.push(`Header.Platform:${platform}`);
        chatMessage.push(`Header.Timestamp:${timestamp}`);
        chatMessage.push(`Body.Subject:${(_b = this.web3.utils.soliditySha3(subject)) === null || _b === void 0 ? void 0 : _b.toLowerCase()}`);
        chatMessage.push(`Body.Message:${(_c = this.web3.utils.soliditySha3(text)) === null || _c === void 0 ? void 0 : _c.toLowerCase()}`);
        let _action = [];
        let i = 0;
        while (i < actions.length) {
            _action.push(`Actions[${i}].Contract:${actions[i].contract}`);
            _action.push(`Actions[${i}].Abi:${actions[i].abi}`);
            _action.push(`Actions[${i}].Action:${actions[i].action}`);
            const _parameter = [];
            let j = 0;
            while (j < actions[i].parameters.length) {
                _parameter.push(`Actions[${i}].Parameters[${j}]:${actions[i].parameters[j]}`);
                j++;
            }
            const _parameterText = _parameter.join(" ");
            _action.push(`Actions[${i}].Parameters:[${_parameterText}]`);
            i++;
        }
        const _actionText = _action.join(" ");
        chatMessage.push(`Actions:[${_actionText}]`);
        chatMessage.push(`Origin:${origin}`);
        const chatMessageText = chatMessage.join(",");
        console.log("chatMessage:::", chatMessageText);
        // params.push(`Actions.Sender:${from}`)
        // params.push(`Body.Sender:${from}`)
        const messageSignature = await this.signData(chatMessageText, privateKey);
        const _message = {
            timestamp,
            receiver,
            platform,
            chainId,
            type,
            message,
            subject,
            signature: messageSignature,
            actions,
            origin,
            messageHash: (_d = this.web3.utils.soliditySha3(message)) !== null && _d !== void 0 ? _d : '',
            subjectHash: (_e = this.web3.utils.soliditySha3(subject)) !== null && _e !== void 0 ? _e : '',
        };
        console.log('new _message', _message);
        return _message;
    }
    async setupSocket({ privateKey, socketServer, socketPort, socketMessageCallback }) {
        this.disposableAccount = this.web3.eth.accounts.create();
        this.socketServer = socketServer;
        this.socketPort = socketPort;
        this.socketMessageCallback = socketMessageCallback;
        const timestamp = Math.floor(Date.now() / 1000);
        const disposableAccountMsg = `PubKey:${this.disposableAccount.address},Timestamp:${timestamp}`; //
        const signature = await this.signData(disposableAccountMsg, privateKey);
        let signer = '';
        if (privateKey) {
            signer = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
        }
        else {
            const from = await this.web3.eth.getAccounts();
            if (from.length == 0)
                throw new Error("No account found");
            signer = from[0];
        }
        this.tmpAccount = {
            signer,
            timestamp,
            signature,
        };
        const _message = {
            signature,
            signer,
            message: this.disposableAccount.address,
            timestamp,
        };
        const url = `${this.socketServer}:${this.socketPort}`;
        this.socketClient = new websocket_1.w3cwebsocket(url);
        this.socketClient.onerror = function () {
            console.log('Connection Error');
        };
        const client = this.socketClient;
        this.socketClient.onopen = function () {
            console.log('WebSocket Client Connected');
            const sendSignature = () => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({
                        type: 'handshake',
                        data: _message,
                        signature,
                    }));
                }
            };
            sendSignature();
        };
        this.socketClient.onclose = function () {
            console.log('echo-protocol Client Closed');
        };
        this.socketClient.onmessage = this.handleMessage;
        return {
            tmpAccount: this.disposableAccount
        };
    }
    /**
     * approveSender
     */
    async approveSender({ expiry, channels, sender }, privateKey) {
        const senderApprovalMessage = [];
        senderApprovalMessage.push(`Expiry:${expiry}`);
        // senderApprovalMessage.push(`Wildcard:${wildcard}`);
        senderApprovalMessage.push(`Channels:${channels}`);
        senderApprovalMessage.push(`Sender:${sender}`);
        // senderApprovalMessage.push(`OwnerAddress:${OwnerAddress}`);
        const _senderApprovalMessage = senderApprovalMessage.join(",");
        return this.signData(_senderApprovalMessage, privateKey);
    }
    /**
     * signData
     */
    async signData(data, privateKey) {
        var _a, _b, _c, _d, _e;
        if (privateKey) {
            const { signature } = this.web3.eth.accounts.sign((_a = this.web3.utils.soliditySha3(data)) !== null && _a !== void 0 ? _a : '', privateKey);
            return signature;
        }
        const _provider = this.web3.currentProvider;
        if (!_provider)
            throw new Error("Provider or private key is required");
        (_b = this.provider) === null || _b === void 0 ? void 0 : _b.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
        });
        await ((_c = this.provider) === null || _c === void 0 ? void 0 : _c.request({ method: 'eth_requestAccounts' }));
        const from = await this.web3.eth.getAccounts();
        if (from.length == 0)
            throw new Error("No account found");
        const params = [from[0], (_d = this.web3.utils.soliditySha3(data)) !== null && _d !== void 0 ? _d : ''];
        const method = "eth_sign";
        return await ((_e = this.provider) === null || _e === void 0 ? void 0 : _e.request({
            method,
            params,
        }));
        return await new Promise((resolve, reject) => {
            _provider === null || _provider === void 0 ? void 0 : _provider.sendAsync({
                method,
                params,
                from: from[0],
            }, function (err, result) {
                if (err)
                    reject(err);
                if (result.error)
                    console.error('ERROR', result);
                if (result.error)
                    reject(result.error);
                console.log('TYPED SIGNED:' + JSON.stringify(result.result));
                resolve(result.result.signature);
            });
        });
    }
}
exports.Icm = Icm;
// module.exports = Icm;
