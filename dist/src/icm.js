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
var jayson_1 = __importDefault(require("jayson"));
var web3_1 = __importDefault(require("web3"));
var WebSocketClient = require('websocket').client;
var Icm = /** @class */ (function () {
    function Icm(config) {
        var _this = this;
        this.web3 = new web3_1.default();
        this.handleMessage = function (message) {
            var _a, _b, _c, _d, _e, _f;
            console.log("message", typeof message);
            if (message.type === 'utf8') {
                try {
                    var _message = JSON.parse(message.utf8Data);
                    console.log("Received: ", _message);
                    switch ((_a = _message.type) !== null && _a !== void 0 ? _a : '') {
                        case 'new-message':
                            _message = _message.data;
                            var _proof = {
                                messageSignature: _message.senderSignature,
                                // messageSender: tmpAccount.pubKey,
                                tmpAccount: _this.tmpAccount,
                                node: _message.message.origin,
                                timestamp: Math.floor(Date.now() / 1000),
                            };
                            var _proofSignatureBody = "Message:".concat(_proof.messageSignature, ",NodeAddress:").concat(_proof.node, ",Timestamp:").concat(_proof.timestamp);
                            console.log("_proofSignatureBody: ", _proofSignatureBody);
                            var _signature = _this.web3.eth.accounts.sign((_b = _this.web3.utils.soliditySha3(_proofSignatureBody)) !== null && _b !== void 0 ? _b : '', (_d = (_c = _this.disposableAccount) === null || _c === void 0 ? void 0 : _c.privateKey) !== null && _d !== void 0 ? _d : '').signature;
                            _proof['signature'] = _signature;
                            console.log('_proof', _proof);
                            if (_this.activeConnection.connected) {
                                _this.activeConnection.send(JSON.stringify({
                                    type: 'delivery-proof',
                                    data: _proof,
                                    signature: (_e = _this.tmpAccount) === null || _e === void 0 ? void 0 : _e.signature,
                                }));
                            }
                            break;
                        default:
                            (_f = _this.socketMessageCallback) === null || _f === void 0 ? void 0 : _f.call(_this, message);
                            break;
                    }
                }
                catch (error) {
                    console.log("error: ", error);
                }
            }
        };
        if (config)
            this.client = jayson_1.default.client.tcp(config);
    }
    ;
    /**
     * subscribe
     */
    Icm.prototype.initializeRpc = function (config) {
        this.client = jayson_1.default.client.tcp(config);
    };
    Icm.prototype.subscribe = function (subscription, callback) {
        if (!this.client) {
            throw new Error("Client Not Initialize");
        }
        this.client.request("RpcService.Subscription", [subscription], callback);
    };
    /**
     * newSubscription
     */
    Icm.prototype.newSubscription = function (_a, privateKey) {
        var _b;
        var channelName = _a.channelName, channelSignature = _a.channelSignature, _c = _a.action, action = _c === void 0 ? 'join' : _c;
        var timestamp = Math.floor(Number(Date.now().toString()) / 1000);
        var sub = [];
        sub.push("Channel:".concat(channelSignature));
        sub.push("ChannelName:".concat(channelName));
        sub.push("Timestamp:".concat(timestamp));
        sub.push("Action:".concat(action));
        var subString = sub.join(",");
        var signature = this.web3.eth.accounts.sign((_b = this.web3.utils.soliditySha3(subString)) !== null && _b !== void 0 ? _b : '', privateKey).signature;
        var _sub = {
            channel: channelSignature,
            channelName: channelName,
            subscriber: this.web3.eth.accounts.privateKeyToAccount(privateKey).address,
            timestamp: timestamp,
            signature: signature,
            action: action
        };
        console.log('new Sub', _sub);
        return _sub;
    };
    Icm.prototype.newChannel = function (channelName, privateKey) {
        var _a;
        var signature = this.web3.eth.accounts.sign((_a = this.web3.utils.soliditySha3(channelName.toLowerCase())) !== null && _a !== void 0 ? _a : '', privateKey).signature;
        return signature;
    };
    /**
     * sendMessage
     */
    Icm.prototype.sendMessage = function (message, callback) {
        if (!this.client) {
            throw new Error("Client Not Initialize");
        }
        this.client.request("RpcService.SendMessage", [message], callback);
    };
    /**
     * newMessage
     */
    Icm.prototype.newMessage = function (_a, privateKey) {
        var _b, _c, _d, _e, _f;
        var channelName = _a.channelName, channelSignature = _a.channelSignature, chainId = _a.chainId, message = _a.message, subject = _a.subject, actions = _a.actions, origin = _a.origin, _g = _a.platform, platform = _g === void 0 ? "channel" : _g, _h = _a.type, type = _h === void 0 ? "html" : _h, params = __rest(_a, ["channelName", "channelSignature", "chainId", "message", "subject", "actions", "origin", "platform", "type"]);
        var receiver = "".concat(channelName, ":").concat(channelSignature);
        var text = message;
        var timestamp = Number(Date.now().toString());
        var chatMessage = [];
        // chatMessage.push(`Header.Sender:${from}`);
        chatMessage.push("Header.Receiver:".concat(receiver));
        chatMessage.push("Header.ChainId:".concat(chainId));
        chatMessage.push("Header.Platform:".concat(platform));
        chatMessage.push("Header.Timestamp:".concat(timestamp));
        chatMessage.push("Body.Subject:".concat((_b = this.web3.utils.soliditySha3(subject)) === null || _b === void 0 ? void 0 : _b.toLowerCase()));
        chatMessage.push("Body.Message:".concat((_c = this.web3.utils.soliditySha3(text)) === null || _c === void 0 ? void 0 : _c.toLowerCase()));
        var _action = [];
        var i = 0;
        while (i < actions.length) {
            _action.push("Actions[".concat(i, "].Contract:").concat(actions[i].contract));
            _action.push("Actions[".concat(i, "].Abi:").concat(actions[i].abi));
            _action.push("Actions[".concat(i, "].Action:").concat(actions[i].action));
            var _parameter = [];
            var j = 0;
            while (j < actions[i].parameters.length) {
                _parameter.push("Actions[".concat(i, "].Parameters[").concat(j, "]:").concat(actions[i].parameters[j]));
                j++;
            }
            var _parameterText = _parameter.join(" ");
            _action.push("Actions[".concat(i, "].Parameters:[").concat(_parameterText, "]"));
            i++;
        }
        var _actionText = _action.join(" ");
        chatMessage.push("Actions:[".concat(_actionText, "]"));
        chatMessage.push("Origin:".concat(origin));
        var chatMessageText = chatMessage.join(",");
        console.log("chatMessage:::", chatMessageText);
        // params.push(`Actions.Sender:${from}`)
        // params.push(`Body.Sender:${from}`)
        var messageSignature = this.web3.eth.accounts.sign((_d = this.web3.utils.soliditySha3(chatMessageText)) !== null && _d !== void 0 ? _d : '', privateKey
        //   "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        ).signature;
        var _message = {
            timestamp: timestamp,
            receiver: receiver,
            platform: platform,
            chainId: chainId,
            type: type,
            message: message,
            subject: subject,
            signature: messageSignature,
            actions: actions,
            origin: origin,
            messageHash: (_e = this.web3.utils.soliditySha3(message)) !== null && _e !== void 0 ? _e : '',
            subjectHash: (_f = this.web3.utils.soliditySha3(subject)) !== null && _f !== void 0 ? _f : '',
        };
        console.log('new _message', _message);
        return _message;
    };
    Icm.prototype.setupSocket = function (privateKey) {
        var _this = this;
        var _a;
        this.disposableAccount = this.web3.eth.accounts.create();
        // const tmpAccount = {
        //     pubKey: disposableAccount.address,
        //     privKey: disposableAccount.privateKey,
        // }
        var timestamp = Math.floor(Date.now() / 1000);
        var disposableAccountMsg = "PubKey:".concat(this.disposableAccount.address, ",Timestamp:").concat(timestamp); //
        var signature = this.web3.eth.accounts.sign((_a = this.web3.utils.soliditySha3(disposableAccountMsg)) !== null && _a !== void 0 ? _a : '', privateKey).signature;
        var signer = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
        this.tmpAccount = {
            signer: signer,
            timestamp: timestamp,
            signature: signature,
        };
        var _message = {
            signature: signature,
            signer: signer,
            message: this.disposableAccount.address,
            timestamp: timestamp,
        };
        this.socketClient = new WebSocketClient({
            closeTimeout: 50000
        });
        this.socketClient.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error);
        });
        this.socketClient.on('connect', function (connection) {
            _this.activeConnection = connection;
            console.log('WebSocket Client Connected');
            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function () {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', _this.handleMessage);
            function sendSignature() {
                if (connection.connected) {
                    connection.send(JSON.stringify({
                        type: 'handshake',
                        data: _message,
                        signature: signature,
                    }));
                }
            }
            sendSignature();
        });
    };
    /**
     * listen
     */
    Icm.prototype.listen = function (socketMessageCallback) {
        if (!this.socketClient) {
            throw new Error("Web Socket Not Initialize");
        }
        this.socketMessageCallback = socketMessageCallback;
        this.socketClient.connect('ws://127.0.0.1:8088/echo');
    };
    return Icm;
}());
exports.Icm = Icm;
// module.exports = Icm;
