"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const crypto = __importStar(require("crypto"));
const bech32_1 = require("bech32");
// import { keccak256 } from 'ethereum-cryptography/keccak';
const secp256k1_1 = require("ethereum-cryptography/secp256k1");
const ethers_1 = require("ethers");
const buffer_1 = require("buffer");
const nacl = __importStar(require("tweetnacl"));
const crypto_1 = require("@cosmjs/crypto");
class Utils {
    static toUtf8(str) {
        return new TextEncoder().encode(str);
    }
    static bigintToUint8Array(num, length, littleEndian = false) {
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            const byte = num & 0xffn;
            bytes[littleEndian ? i : length - 1 - i] = Number(byte);
            num >>= 8n;
        }
        return bytes;
    }
    static toAddress(publicKey, prefix = 'ml') {
        // Perform SHA256 hashing followed by RIPEMD160
        const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
        const ripemd160Hash = crypto
            .createHash('ripemd160')
            .update(sha256Hash)
            .digest();
        // Bech32 encoding
        return bech32_1.bech32.encode(prefix, bech32_1.bech32.toWords(ripemd160Hash));
    }
    static sha256Hash(data) {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest();
    }
    static keccak256Hash(data) {
        const hash = (0, ethers_1.keccak256)(data);
        return buffer_1.Buffer.from(hash.replace('0x', ''), 'hex');
    }
    static generateKeyPairSecp() {
        let privateKey;
        do {
            privateKey = crypto.randomBytes(32);
        } while (!secp256k1_1.secp256k1.utils.isValidPrivateKey(privateKey));
        const publicKey = secp256k1_1.secp256k1.getPublicKey(privateKey);
        const pubKeyBuffer = buffer_1.Buffer.from(publicKey, publicKey.byteOffset, publicKey.byteLength);
        return {
            privateKey: privateKey.toString('hex'),
            publicKey: pubKeyBuffer.toString('hex'),
            address: Utils.toAddress(pubKeyBuffer),
        };
    }
    /**
     *
     * @returns
     */
    static generateKeyPairEcc() {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        // Extract the private key, public key, and address
        const privateKey = wallet.privateKey;
        const publicKey = wallet.publicKey;
        const address = wallet.address;
        return { privateKey, publicKey, address };
    }
    /**
     *
     * @returns
     */
    static getKeysEcc(privKey) {
        const wallet = new ethers_1.ethers.Wallet(privKey);
        const privateKey = wallet.privateKey;
        const publicKey = wallet.publicKey;
        const address = wallet.address;
        return { privateKey, address, publicKey };
    }
    /**
     *
     * @returns
     */
    static generateKeyPairEdd() {
        const keypair = nacl.sign.keyPair();
        // Bech32 encoding
        const publicKey = buffer_1.Buffer.from(keypair.publicKey, keypair.publicKey.byteOffset, keypair.publicKey.byteLength);
        return {
            privateKey: buffer_1.Buffer.from(keypair.secretKey, keypair.secretKey.byteOffset, keypair.secretKey.byteLength).toString('hex'),
            publicKey: publicKey.toString('hex'),
            address: Utils.toAddress(publicKey),
        };
    }
    static signMessageEcc(message, privateKey) {
        const hash = Utils.keccak256Hash(message);
        const wallet = new ethers_1.ethers.Wallet(privateKey);
        return wallet.signingKey.sign(hash).serialized;
    }
    static signMessageEdd(message, privateKey) {
        const buffer = Utils.sha256Hash(message);
        const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        return buffer_1.Buffer.from(nacl.sign.detached(bytes, new Uint8Array(privateKey.buffer, privateKey.byteOffset, privateKey.byteLength))).toString('hex');
    }
    static getSignerEcc(message, signature) {
        const hash = (0, ethers_1.keccak256)(message);
        return ethers_1.ethers.verifyMessage(hash, signature);
    }
    static signMessageSecp(message, privateKey) {
        const buffer = Utils.sha256Hash(message);
        const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        const signature = secp256k1_1.secp256k1.sign(bytes, buffer.toString('hex'));
        return signature.toDERHex();
    }
    static async signAminoSecp(message, privateKey, address) {
        const base64msg = message.toString('base64');
        const jsonData = `{"account_number":"0","chain_id":"","fee":{"amount":[],"gas":"0"},"memo":"","msgs":[{"type":"sign/MsgSignData","value":{"data":"${base64msg}","signer":"${address}"}}],"sequence":"0"}`;
        const dataUtf = Utils.toUtf8(jsonData);
        console.log('DATAUFT', dataUtf);
        // const msgHash = Utils.sha256Hash(
        //   Buffer.from(dataUtf, dataUtf.byteOffset, dataUtf.byteLength)
        // );
        // // console.log('BUFFERR', buffer.toString('hex'));
        // const msgHashBytes = new Uint8Array(
        //   msgHash.buffer,
        //   msgHash.byteOffset,
        //   msgHash.byteLength
        // );
        // const signature = secp256k1.sign(bytes, bytes);
        const msgHash = new crypto_1.Sha256(dataUtf).digest();
        console.log('Hashh', buffer_1.Buffer.from(msgHash, msgHash.byteOffset, msgHash.byteLength).toString('hex'));
        // const bufR = Utils.bigintToUint8Array(signature.r, 32, true);
        // const bufS = Utils.bigintToUint8Array(signature.s, 32, true);
        const privKeyBytes = new Uint8Array(privateKey.buffer, privateKey.byteOffset, privateKey.byteLength);
        const signature = await crypto_1.Secp256k1.createSignature(msgHash, privateKey);
        const sign = new Uint8Array([...signature.r(32), ...signature.s(32)]);
        return buffer_1.Buffer.from(sign, sign.byteOffset, sign.byteLength);
        // const signatureBytes = new Uint8Array([
        //   ...signature.r(32),
        //   ...signature.s(32),
        // ]);
        // console.log(
        //   'SIGNATURES===>',
        //   Buffer.from(bufR, bufR.byteOffset, bufR.byteLength).toString('hex'),
        //   Buffer.from(bufS, bufS.byteOffset, bufS.byteLength).toString('hex')
        // );
        // return (
        //   Buffer.from(bufR, bufR.byteOffset, bufR.byteLength).toString('hex') +
        //   Buffer.from(bufS, bufS.byteOffset, bufS.byteLength).toString('hex')
        // );
    }
    // Function to verify a message
    static verifyMessageSecp(message, signature, publicKey) {
        const buffer = Utils.sha256Hash(message);
        console.log('HASHHH', buffer.toString('hex'));
        const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        return secp256k1_1.secp256k1.verify(bytes, buffer_1.Buffer.from(signature, 'hex'), publicKey);
    }
    static encodeBytes(...args) {
        let buffer = buffer_1.Buffer.from('');
        // console.log(
        //   'DATASTRING',
        //   this.data,
        //   Utils.keccak256Hash((this.data as BaseEntity).encodeBytes()).toString(
        //     'hex'
        //   )
        // );
        let buffers = [];
        let len = 0;
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            switch (arg.type) {
                case 'string':
                    buffers.push(buffer_1.Buffer.from((arg.value ?? '')));
                    // const newBuffer = Buffer.from(arg.value);
                    // const combinedBuffer = Buffer.alloc(
                    //   finalBuffer.length + newBuffer.length
                    // );
                    // finalBuffer.copy(combinedBuffer, 0);
                    // newBuffer.copy(combinedBuffer, finalBuffer.length);
                    // finalBuffer = combinedBuffer;
                    break;
                case 'byte':
                    buffers.push(arg.value);
                    break;
                case 'hex':
                    buffers.push(buffer_1.Buffer.from(arg.value.replace('0x', ''), 'hex'));
                    break;
                case 'boolean':
                case 'int':
                case 'BigInt':
                    const buffer = buffer_1.Buffer.alloc(8);
                    const bigNum = BigInt(String(Number(arg.value || 0)));
                    buffer.writeBigUInt64BE(bigNum);
                    console.log('TYPPPEPEEE', arg.value, buffer.toString('hex'));
                    buffers.push(buffer);
                    break;
                case 'address':
                    console.log('ACcOUNTBUFFER', buffer_1.Buffer.from(arg.value).toString('hex'));
                    buffers.push(buffer_1.Buffer.from(arg.value));
                    // if ((arg.value as string).startsWith("0x")) {
                    //   buffers.push(
                    //     Buffer.from((arg.value as string).replace("0x", ""), "hex")
                    //   );
                    // } else {
                    //   const values = ((arg.value ?? "") as string).trim().split(":");
                    //   const tBuf = Buffer.from(values[0]);
                    //   const tBuf2 = Buffer.from(values[1]);
                    //   let tBuf3: Buffer;
                    //   if (values.length == 3) {
                    //     tBuf3 = this.encodeBytes({
                    //       type: "int",
                    //       value: values[3],
                    //     });
                    //   }
                    //   const cB = Buffer.alloc(
                    //     tBuf.length + tBuf2.length + (tBuf3?.length ?? 0)
                    //   );
                    //   tBuf.copy(cB, 0);
                    //   tBuf2.copy(cB, tBuf.length);
                    //   if (tBuf3) tBuf3.copy(cB, tBuf.length + tBuf2.length);
                    //   buffers.push(cB);
                    // }
                    break;
            }
            len += buffers[i].length;
        }
        console.log('BUFERSSSS', buffers.length);
        const finalBuffer = buffer_1.Buffer.alloc(len);
        let copied = 0;
        for (const b of buffers) {
            b.copy(finalBuffer, copied);
            copied += b.length;
        }
        return finalBuffer;
    }
}
exports.Utils = Utils;
