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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var crypto = require("crypto");
var bech32_1 = require("bech32");
// import { keccak256 } from 'ethereum-cryptography/keccak';
var secp256k1_1 = require("ethereum-cryptography/secp256k1");
var ethers_1 = require("ethers");
var nacl = require("tweetnacl");
var crypto_1 = require("@cosmjs/crypto");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.toUtf8 = function (str) {
        return new TextEncoder().encode(str);
    };
    Utils.bigintToUint8Array = function (num, length, littleEndian) {
        if (littleEndian === void 0) { littleEndian = false; }
        var bytes = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
            var byte = num & 0xffn;
            bytes[littleEndian ? i : length - 1 - i] = Number(byte);
            num >>= 8n;
        }
        return bytes;
    };
    Utils.toAddress = function (publicKey, prefix) {
        if (prefix === void 0) { prefix = 'ml'; }
        // Perform SHA256 hashing followed by RIPEMD160
        var sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
        var ripemd160Hash = crypto
            .createHash('ripemd160')
            .update(sha256Hash)
            .digest();
        // Bech32 encoding
        return bech32_1.bech32.encode(prefix, bech32_1.bech32.toWords(ripemd160Hash));
    };
    Utils.sha256Hash = function (data) {
        var hash = crypto.createHash("sha256");
        hash.update(data);
        return hash.digest();
    };
    Utils.keccak256Hash = function (data) {
        var hash = (0, ethers_1.keccak256)(data);
        return Buffer.from(hash.replace("0x", ""), "hex");
    };
    Utils.generateKeyPairSecp = function () {
        var privateKey;
        do {
            privateKey = crypto.randomBytes(32);
        } while (!secp256k1_1.secp256k1.utils.isValidPrivateKey(privateKey));
        var publicKey = secp256k1_1.secp256k1.getPublicKey(privateKey);
        var pubKeyBuffer = Buffer.from(publicKey, publicKey.byteOffset, publicKey.byteLength);
        return {
            privateKey: privateKey.toString("hex"),
            publicKey: pubKeyBuffer.toString("hex"),
            address: Utils.toAddress(pubKeyBuffer),
        };
    };
    /**
     *
     * @returns
     */
    Utils.generateKeyPairEcc = function () {
        var wallet = ethers_1.ethers.Wallet.createRandom();
        // Extract the private key, public key, and address
        var privateKey = wallet.privateKey;
        var publicKey = wallet.publicKey;
        var address = wallet.address;
        return { privateKey: privateKey, publicKey: publicKey, address: address };
    };
    /**
     *
     * @returns
     */
    Utils.generateKeyPairEdd = function () {
        var keypair = nacl.sign.keyPair();
        // Bech32 encoding
        var publicKey = Buffer.from(keypair.publicKey, keypair.publicKey.byteOffset, keypair.publicKey.byteLength);
        return {
            privateKey: Buffer.from(keypair.secretKey, keypair.secretKey.byteOffset, keypair.secretKey.byteLength).toString("hex"),
            publicKey: publicKey.toString("hex"),
            address: Utils.toAddress(publicKey),
        };
    };
    Utils.signMessageEcc = function (message, privateKey) {
        var hash = Utils.keccak256Hash(message);
        var wallet = new ethers_1.ethers.Wallet(privateKey);
        return wallet.signingKey.sign(hash).serialized;
    };
    Utils.signMessageEdd = function (message, privateKey) {
        var buffer = Utils.sha256Hash(message);
        var bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        return Buffer.from(nacl.sign.detached(bytes, new Uint8Array(privateKey.buffer, privateKey.byteOffset, privateKey.byteLength))).toString("hex");
    };
    Utils.getSignerEcc = function (message, signature) {
        var hash = (0, ethers_1.keccak256)(message);
        return ethers_1.ethers.verifyMessage(hash, signature);
    };
    Utils.signMessageSecp = function (message, privateKey) {
        var buffer = Utils.sha256Hash(message);
        var bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        var signature = secp256k1_1.secp256k1.sign(bytes, buffer.toString('hex'));
        return signature.toDERHex();
    };
    Utils.signAminoSecp = function (message, privateKey, address) {
        return __awaiter(this, void 0, void 0, function () {
            var base64msg, jsonData, dataUtf, msgHash, privKeyBytes, signature, sign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        base64msg = message.toString('base64');
                        jsonData = "{\"account_number\":\"0\",\"chain_id\":\"\",\"fee\":{\"amount\":[],\"gas\":\"0\"},\"memo\":\"\",\"msgs\":[{\"type\":\"sign/MsgSignData\",\"value\":{\"data\":\"".concat(base64msg, "\",\"signer\":\"").concat(address, "\"}}],\"sequence\":\"0\"}");
                        dataUtf = Utils.toUtf8(jsonData);
                        console.log('DATAUFT', dataUtf);
                        msgHash = new crypto_1.Sha256(dataUtf).digest();
                        console.log('Hashh', Buffer.from(msgHash, msgHash.byteOffset, msgHash.byteLength).toString('hex'));
                        privKeyBytes = new Uint8Array(privateKey.buffer, privateKey.byteOffset, privateKey.byteLength);
                        return [4 /*yield*/, crypto_1.Secp256k1.createSignature(msgHash, privateKey)];
                    case 1:
                        signature = _a.sent();
                        sign = new Uint8Array(__spreadArray(__spreadArray([], signature.r(32), true), signature.s(32), true));
                        return [2 /*return*/, Buffer.from(sign, sign.byteOffset, sign.byteLength)];
                }
            });
        });
    };
    // Function to verify a message
    Utils.verifyMessageSecp = function (message, signature, publicKey) {
        var buffer = Utils.sha256Hash(message);
        console.log("HASHHH", buffer.toString("hex"));
        var bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        return secp256k1_1.secp256k1.verify(bytes, Buffer.from(signature, "hex"), publicKey);
    };
    Utils.encodeBytes = function () {
        var _a, _b, _c;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var buffer = Buffer.from("");
        var buffers = [];
        var len = 0;
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            switch (arg.type) {
                case "string":
                    buffers.push(Buffer.from(((_a = arg.value) !== null && _a !== void 0 ? _a : "")));
                    // const newBuffer = Buffer.from(arg.value);
                    // const combinedBuffer = Buffer.alloc(
                    //   finalBuffer.length + newBuffer.length
                    // );
                    // finalBuffer.copy(combinedBuffer, 0);
                    // newBuffer.copy(combinedBuffer, finalBuffer.length);
                    // finalBuffer = combinedBuffer;
                    break;
                case "byte":
                    buffers.push(arg.value);
                    break;
                case "hex":
                    buffers.push(Buffer.from(arg.value, "hex"));
                    break;
                case "boolean":
                case "int":
                case "BigInt":
                    var buffer_1 = Buffer.alloc(8);
                    var bigNum = BigInt(String(Number(arg.value || 0)));
                    buffer_1.writeBigUInt64BE(bigNum);
                    buffers.push(buffer_1);
                    break;
                case "address":
                    if (arg.value.startsWith("0x")) {
                        buffers.push(Buffer.from(arg.value.replace("0x", ""), "hex"));
                    }
                    else {
                        var values = ((_b = arg.value) !== null && _b !== void 0 ? _b : "").trim().split(":");
                        var tBuf = Buffer.from(values[0]);
                        var tBuf2 = Buffer.from(values[1]);
                        var tBuf3 = void 0;
                        if (values.length == 3) {
                            tBuf3 = this.encodeBytes({
                                type: "int",
                                value: values[3],
                            });
                        }
                        var cB = Buffer.alloc(tBuf.length + tBuf2.length + ((_c = tBuf3 === null || tBuf3 === void 0 ? void 0 : tBuf3.length) !== null && _c !== void 0 ? _c : 0));
                        tBuf.copy(cB, 0);
                        tBuf2.copy(cB, tBuf.length);
                        if (tBuf3)
                            tBuf3.copy(cB, tBuf.length + tBuf2.length);
                        buffers.push(cB);
                    }
                    break;
            }
            len += buffers[i].length;
        }
        console.log("BUFERSSSS", buffers.length);
        var finalBuffer = Buffer.alloc(len);
        var copied = 0;
        for (var _d = 0, buffers_1 = buffers; _d < buffers_1.length; _d++) {
            var b = buffers_1[_d];
            b.copy(finalBuffer, copied);
            copied += b.length;
        }
        return finalBuffer;
    };
    return Utils;
}());
exports.Utils = Utils;
