"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var crypto = __importStar(require("crypto"));
var bech32_1 = require("bech32");
var secp256k1_1 = require("ethereum-cryptography/secp256k1");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.sha256 = function (data) {
        var hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    };
    Utils.generateKeyPair = function () {
        var privateKey;
        do {
            privateKey = crypto.randomBytes(32);
        } while (!secp256k1_1.privateKeyVerify(privateKey));
        var publicKey = secp256k1_1.publicKeyCreate(privateKey);
        // Perform SHA256 hashing followed by RIPEMD160
        var sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
        var ripemd160Hash = crypto
            .createHash('ripemd160')
            .update(sha256Hash)
            .digest();
        // Bech32 encoding
        var cosmosAddress = bech32_1.bech32.encode('ml', bech32_1.bech32.toWords(ripemd160Hash));
        return {
            privateKey: privateKey.toString('hex'),
            publicKey: Buffer.from(publicKey, publicKey.byteOffset, publicKey.byteLength).toString('hex'),
            cosmosAddress: cosmosAddress,
        };
    };
    return Utils;
}());
exports.Utils = Utils;
