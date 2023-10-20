"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var websocket_1 = require("websocket");
var Icm = /** @class */ (function () {
    function Icm(config, provider) {
        var _this = this;
        this.web3 = new web3_1.default();
        this.handleMessage = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var message, _message, _a, _proof, _proofSignatureBody, _signature, client, error_1;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!this.socketClient)
                            throw new Error("Client Socket not available");
                        message = event.data;
                        console.log("message", typeof message, message);
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, , 7]);
                        _message = JSON.parse(message);
                        console.log("Received: ", _message);
                        (_b = this.socketMessageCallback) === null || _b === void 0 ? void 0 : _b.call(this, _message);
                        _a = (_c = _message.type) !== null && _c !== void 0 ? _c : '';
                        switch (_a) {
                            case 'new-message': return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        _message = _message.data;
                        _proof = {
                            messageSignature: _message.senderSignature,
                            // messageSender: tmpAccount.pubKey,
                            tmpAccount: this.tmpAccount,
                            node: _message.message.origin,
                            timestamp: Math.floor(Date.now() / 1000),
                        };
                        _proofSignatureBody = "Message:".concat(_proof.messageSignature, ",NodeAddress:").concat(_proof.node, ",Timestamp:").concat(_proof.timestamp);
                        console.log("_proofSignatureBody: ", _proofSignatureBody);
                        return [4 /*yield*/, this.signData(_proofSignatureBody, (_e = (_d = this.disposableAccount) === null || _d === void 0 ? void 0 : _d.privateKey) !== null && _e !== void 0 ? _e : '')];
                    case 3:
                        _signature = _g.sent();
                        _proof['signature'] = _signature;
                        console.log('_proof', _proof);
                        client = this.socketClient;
                        if (this.socketClient.readyState === this.socketClient.OPEN) {
                            this.socketClient.send(JSON.stringify({
                                type: 'delivery-proof',
                                data: _proof,
                                signature: (_f = this.tmpAccount) === null || _f === void 0 ? void 0 : _f.signature,
                            }));
                        }
                        return [3 /*break*/, 5];
                    case 4: return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _g.sent();
                        console.log("error: ", error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
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
        var channelName = _a.channelName, channelSignature = _a.channelSignature, _b = _a.action, action = _b === void 0 ? 'join' : _b;
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, sub, subString, signature, subscriber, from, _sub;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        timestamp = Math.floor(Number(Date.now().toString()) / 1000);
                        sub = [];
                        sub.push("Channel:".concat(channelSignature));
                        sub.push("ChannelName:".concat(channelName));
                        sub.push("Timestamp:".concat(timestamp));
                        sub.push("Action:".concat(action));
                        subString = sub.join(",");
                        return [4 /*yield*/, this.signData(subString, privateKey)];
                    case 1:
                        signature = _c.sent();
                        subscriber = '';
                        if (!privateKey) return [3 /*break*/, 2];
                        subscriber = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.web3.eth.getAccounts()];
                    case 3:
                        from = _c.sent();
                        if (from.length == 0)
                            throw new Error("No account found");
                        subscriber = from[0];
                        _c.label = 4;
                    case 4:
                        _sub = {
                            channel: channelSignature,
                            channelName: channelName,
                            subscriber: subscriber,
                            timestamp: timestamp,
                            signature: signature,
                            action: action
                        };
                        console.log('new Sub', _sub);
                        return [2 /*return*/, _sub];
                }
            });
        });
    };
    Icm.prototype.newChannel = function (channelName, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.signData(channelName.toLowerCase(), privateKey)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
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
        var _b, _c, _d, _e;
        var channelName = _a.channelName, channelSignature = _a.channelSignature, chainId = _a.chainId, message = _a.message, subject = _a.subject, actions = _a.actions, origin = _a.origin, _f = _a.platform, platform = _f === void 0 ? "channel" : _f, _g = _a.type, type = _g === void 0 ? "html" : _g, approval = _a.approval, params = __rest(_a, ["channelName", "channelSignature", "chainId", "message", "subject", "actions", "origin", "platform", "type", "approval"]);
        return __awaiter(this, void 0, void 0, function () {
            var receiver, text, timestamp, chatMessage, _action, i, _parameter, j, _parameterText, _actionText, chatMessageText, messageSignature, _message;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        receiver = "".concat(channelName, ":").concat(channelSignature);
                        text = message;
                        timestamp = Number(Date.now().toString());
                        chatMessage = [];
                        if (approval) {
                            chatMessage.push("Header.Approval:".concat(approval));
                        }
                        // chatMessage.push(`Header.Sender:${from}`);
                        chatMessage.push("Header.Receiver:".concat(receiver));
                        chatMessage.push("Header.ChainId:".concat(chainId));
                        chatMessage.push("Header.Platform:".concat(platform));
                        chatMessage.push("Header.Timestamp:".concat(timestamp));
                        chatMessage.push("Body.Subject:".concat((_b = this.web3.utils.soliditySha3(subject)) === null || _b === void 0 ? void 0 : _b.toLowerCase()));
                        chatMessage.push("Body.Message:".concat((_c = this.web3.utils.soliditySha3(text)) === null || _c === void 0 ? void 0 : _c.toLowerCase()));
                        _action = [];
                        i = 0;
                        while (i < actions.length) {
                            _action.push("Actions[".concat(i, "].Contract:").concat(actions[i].contract));
                            _action.push("Actions[".concat(i, "].Abi:").concat(actions[i].abi));
                            _action.push("Actions[".concat(i, "].Action:").concat(actions[i].action));
                            _parameter = [];
                            j = 0;
                            while (j < actions[i].parameters.length) {
                                _parameter.push("Actions[".concat(i, "].Parameters[").concat(j, "]:").concat(actions[i].parameters[j]));
                                j++;
                            }
                            _parameterText = _parameter.join(" ");
                            _action.push("Actions[".concat(i, "].Parameters:[").concat(_parameterText, "]"));
                            i++;
                        }
                        _actionText = _action.join(" ");
                        chatMessage.push("Actions:[".concat(_actionText, "]"));
                        chatMessage.push("Origin:".concat(origin));
                        chatMessageText = chatMessage.join(",");
                        console.log("chatMessage:::", chatMessageText);
                        return [4 /*yield*/, this.signData(chatMessageText, privateKey)];
                    case 1:
                        messageSignature = _h.sent();
                        _message = {
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
                            messageHash: (_d = this.web3.utils.soliditySha3(message)) !== null && _d !== void 0 ? _d : '',
                            subjectHash: (_e = this.web3.utils.soliditySha3(subject)) !== null && _e !== void 0 ? _e : '',
                        };
                        console.log('new _message', _message);
                        return [2 /*return*/, _message];
                }
            });
        });
    };
    Icm.prototype.setupSocket = function (_a) {
        var privateKey = _a.privateKey, socketServer = _a.socketServer, socketPort = _a.socketPort, socketMessageCallback = _a.socketMessageCallback;
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, disposableAccountMsg, signature, signer, from, _message, url, client;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.disposableAccount = this.web3.eth.accounts.create();
                        this.socketServer = socketServer;
                        this.socketPort = socketPort;
                        this.socketMessageCallback = socketMessageCallback;
                        timestamp = Math.floor(Date.now() / 1000);
                        disposableAccountMsg = "PubKey:".concat(this.disposableAccount.address, ",Timestamp:").concat(timestamp) //
                        ;
                        return [4 /*yield*/, this.signData(disposableAccountMsg, privateKey)];
                    case 1:
                        signature = _b.sent();
                        signer = '';
                        if (!privateKey) return [3 /*break*/, 2];
                        signer = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.web3.eth.getAccounts()];
                    case 3:
                        from = _b.sent();
                        if (from.length == 0)
                            throw new Error("No account found");
                        signer = from[0];
                        _b.label = 4;
                    case 4:
                        this.tmpAccount = {
                            signer: signer,
                            timestamp: timestamp,
                            signature: signature,
                        };
                        _message = {
                            signature: signature,
                            signer: signer,
                            message: this.disposableAccount.address,
                            timestamp: timestamp,
                        };
                        url = "".concat(this.socketServer, ":").concat(this.socketPort);
                        this.socketClient = new websocket_1.w3cwebsocket(url);
                        this.socketClient.onerror = function () {
                            console.log('Connection Error');
                        };
                        client = this.socketClient;
                        this.socketClient.onopen = function () {
                            console.log('WebSocket Client Connected');
                            var sendSignature = function () {
                                if (client.readyState === client.OPEN) {
                                    client.send(JSON.stringify({
                                        type: 'handshake',
                                        data: _message,
                                        signature: signature,
                                    }));
                                }
                            };
                            sendSignature();
                        };
                        this.socketClient.onclose = function () {
                            console.log('echo-protocol Client Closed');
                        };
                        this.socketClient.onmessage = this.handleMessage;
                        return [2 /*return*/, {
                                tmpAccount: this.disposableAccount
                            }];
                }
            });
        });
    };
    /**
     * approveSender
     */
    Icm.prototype.approveSender = function (_a, privateKey) {
        var expiry = _a.expiry, channels = _a.channels, sender = _a.sender;
        return __awaiter(this, void 0, void 0, function () {
            var senderApprovalMessage, _senderApprovalMessage;
            return __generator(this, function (_b) {
                senderApprovalMessage = [];
                senderApprovalMessage.push("Expiry:".concat(expiry));
                // senderApprovalMessage.push(`Wildcard:${wildcard}`);
                senderApprovalMessage.push("Channels:".concat(channels));
                senderApprovalMessage.push("Sender:".concat(sender));
                _senderApprovalMessage = senderApprovalMessage.join(",");
                return [2 /*return*/, this.signData(_senderApprovalMessage, privateKey)];
            });
        });
    };
    /**
     * signData
     */
    Icm.prototype.signData = function (data, privateKey) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var signature, _provider, from, params, method;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (privateKey) {
                            signature = this.web3.eth.accounts.sign((_a = this.web3.utils.soliditySha3(data)) !== null && _a !== void 0 ? _a : '', privateKey).signature;
                            return [2 /*return*/, signature];
                        }
                        _provider = this.web3.currentProvider;
                        if (!_provider)
                            throw new Error("Provider or private key is required");
                        (_b = this.provider) === null || _b === void 0 ? void 0 : _b.request({
                            method: 'wallet_requestPermissions',
                            params: [{ eth_accounts: {} }],
                        });
                        return [4 /*yield*/, ((_c = this.provider) === null || _c === void 0 ? void 0 : _c.request({ method: 'eth_requestAccounts' }))];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, this.web3.eth.getAccounts()];
                    case 2:
                        from = _f.sent();
                        if (from.length == 0)
                            throw new Error("No account found");
                        params = [from[0], (_d = this.web3.utils.soliditySha3(data)) !== null && _d !== void 0 ? _d : ''];
                        method = "eth_sign";
                        return [4 /*yield*/, ((_e = this.provider) === null || _e === void 0 ? void 0 : _e.request({
                                method: method,
                                params: params,
                            }))];
                    case 3: return [2 /*return*/, _f.sent()];
                    case 4: return [2 /*return*/, _f.sent()];
                }
            });
        });
    };
    return Icm;
}());
exports.Icm = Icm;
// module.exports = Icm;
