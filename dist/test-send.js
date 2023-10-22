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
Object.defineProperty(exports, "__esModule", { value: true });
var icm_1 = require("./src/icm");
var sender = {
    pubKey: '0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc',
    privKey: '73fa35d75a5191e0d29cc260cb0879bc32f7fd3608492e5d5a3e061b48b822c6',
};
var channelName = "ioc-committee", channelSignature = "0xdd472dbfbf9514af5c79062ba6f800d33bd53f84b4650ecd0258528fa8e8361d499bef085716aad50c3062d4c80a3edf7a547477a3b040819e44d466e8739d491c";
var nodeAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
var contract = "Contract";
var platform = "channel";
var type = "html";
var message = "hello world";
var chainId = "1";
var subject = "Test Subject";
var abi = "Abi";
var action = "Action";
var parameters = ["good", "Jon", "Doe"];
var actions = [{ contract: contract, abi: abi, action: action, parameters: parameters }];
var origin = nodeAddress;
var param = {
    channelName: channelName,
    channelSignature: channelSignature,
    platform: platform,
    type: type,
    message: message,
    chainId: chainId,
    abi: abi,
    parameters: parameters,
    origin: origin,
    subject: subject,
    actions: actions,
};
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _client, _icm, _sendParam;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _client = {
                        host: "127.0.0.1",
                        port: 9521,
                        version: 1,
                    };
                    _icm = new icm_1.Icm(_client);
                    return [4 /*yield*/, _icm.newMessage(param, sender.privKey)];
                case 1:
                    _sendParam = _a.sent();
                    _icm.sendMessage(_sendParam, function (err, response) {
                        console.log("response:::", response);
                        if (err)
                            throw err;
                        if (response.error)
                            throw response.error;
                        console.log("response:::", response);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
run();
