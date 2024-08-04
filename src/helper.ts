import * as crypto from "crypto";
import { bech32 } from "bech32";
// import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { AddressString, HexString } from "./entities/base";
import { ethers, keccak256 } from "ethers";
import { Buffer } from "buffer";
import * as nacl from "tweetnacl";
import { Secp256k1, Sha256 } from "@cosmjs/crypto";
import { IMessageAction, IMessageAttachment } from "./entities/message";

export type EncoderDataType =
  | "string"
  | "address"
  | "int"
  | "BigInt"
  | "hex"
  | "boolean"
  | "byte";

export class Utils {
  static toUtf8(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }
  static bigintToUint8Array(
    num: bigint,
    bitLength: 32 | 64,
    littleEndian = false
  ): Uint8Array {
    // Validate the number is within the range for uint32 or uint64
    const maxUint32 = 0xffffffffn;
    const maxUint64 = 0xffffffffffffffffn;
    const size = bitLength / 8;
    if (
      (size === 4 && (num < 0n || num > maxUint32)) ||
      (size === 8 && (num < 0n || num > maxUint64))
    ) {
      throw new Error(`Number out of range for uint${size * 8}`);
    }

    const bytes = new Uint8Array(size);

    for (let i = 0; i < size; i++) {
      const byte = num & 0xffn; // Extract the least significant byte
      // Assign the byte to the correct position based on endianness
      bytes[littleEndian ? i : size - 1 - i] = Number(byte);
      num >>= 8n; // Shift right by 8 bits to process the next byte
    }
    return bytes;
  }
  static toAddress(publicKey: Buffer, prefix: string = 'ml') {
    // Perform SHA256 hashing followed by RIPEMD160
    const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
    const ripemd160Hash = crypto
      .createHash('ripemd160')
      .update(sha256Hash)
      .digest();

    // Bech32 encoding
    return bech32.encode(prefix, bech32.toWords(ripemd160Hash));
  }
  static sha256Hash(data: Buffer): Buffer {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();
  }

  static keccak256Hash(data: Buffer): Buffer {
    const hash = keccak256(data);
    return Buffer.from(hash.replace('0x', ''), 'hex');
  }

  static generateKeyPairSecp() {
    let privateKey: Buffer;
    do {
      privateKey = crypto.randomBytes(32);
    } while (!secp256k1.utils.isValidPrivateKey(privateKey));

    const publicKey = secp256k1.getPublicKey(privateKey);
    const pubKeyBuffer = Buffer.from(
      publicKey,
      publicKey.byteOffset,
      publicKey.byteLength
    );
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
    const wallet = ethers.Wallet.createRandom();

    // Extract the private key, public key, and address
    const privateKey = wallet.privateKey;
    const publicKey = wallet.publicKey;
    const address = wallet.address;

    return { privateKey, publicKey, address };
  }

  static uuidToBytes(uuid: string): Buffer {
    if (uuid == '') return Buffer.from('');
    return Buffer.from(`0x${uuid.replace(/-/g, '')}`, 'hex');
  }

  /**
   *
   * @returns
   */
  static getKeysEcc(privKey: string) {
    const wallet = new ethers.Wallet(privKey);
    const privateKey = wallet.privateKey;
    const publicKey = (wallet as any).publicKey;
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
    const publicKey = Buffer.from(
      keypair.publicKey,
      keypair.publicKey.byteOffset,
      keypair.publicKey.byteLength
    );
    return {
      privateKey: Buffer.from(
        keypair.secretKey,
        keypair.secretKey.byteOffset,
        keypair.secretKey.byteLength
      ).toString('hex'),
      publicKey: publicKey.toString('hex'),
      address: Utils.toAddress(publicKey),
    };
  }

  static signMessageEcc(message: Buffer, privateKey: string): string {
    const hash = Utils.keccak256Hash(message);
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signingKey.sign(hash).serialized;
  }

  static signMessageEdd(message: Buffer, privateKey: Buffer): string {
    const buffer = Utils.sha256Hash(message);
    const bytes = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    return Buffer.from(
      nacl.sign.detached(
        bytes,
        new Uint8Array(
          privateKey.buffer,
          privateKey.byteOffset,
          privateKey.byteLength
        )
      )
    ).toString('hex');
  }

  static getSignerEcc(message: Buffer, signature: string) {
    const hash = keccak256(message);
    return ethers.verifyMessage(hash, signature);
  }

  static signMessageSecp(message: Buffer, privateKey: Buffer): string {
    const buffer = Utils.sha256Hash(message);
    const bytes = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    const signature = secp256k1.sign(bytes, buffer.toString('hex'));
    return signature.toDERHex();
  }

  static async signAminoSecp(
    message: Buffer,
    privateKey: Buffer,
    address: string
  ): Promise<Buffer> {
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

    const msgHash = new Sha256(dataUtf).digest();
    console.log(
      'Hashh',
      Buffer.from(msgHash, msgHash.byteOffset, msgHash.byteLength).toString(
        'hex'
      )
    );
    // const bufR = Utils.bigintToUint8Array(signature.r, 32, true);
    // const bufS = Utils.bigintToUint8Array(signature.s, 32, true);
    const privKeyBytes = new Uint8Array(
      privateKey.buffer,
      privateKey.byteOffset,
      privateKey.byteLength
    );

    const signature = await Secp256k1.createSignature(msgHash, privateKey);
    const sign = new Uint8Array([...signature.r(32), ...signature.s(32)]);

    return Buffer.from(sign, sign.byteOffset, sign.byteLength);

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
  static verifyMessageSecp(
    message: Buffer,
    signature: string,
    publicKey: Buffer
  ): boolean {
    const buffer = Utils.sha256Hash(message);
    console.log('HASHHH', buffer.toString('hex'));
    const bytes = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    return secp256k1.verify(bytes, Buffer.from(signature, 'hex'), publicKey);
  }

  static encodeBytes(
    ...args: {
      type: EncoderDataType;
      value:
        | string
        | number
        | BigInt
        | boolean
        | Buffer
        | HexString
        | AddressString;
    }[]
  ): Buffer {
    let buffer = Buffer.from('');
    // console.log(
    //   'DATASTRING',
    //   this.data,
    //   Utils.keccak256Hash((this.data as BaseEntity).encodeBytes()).toString(
    //     'hex'
    //   )
    // );
    let buffers: Buffer[] = [];
    let len = 0;
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg.type) {
        case 'string':
          buffers.push(Buffer.from((arg.value ?? '') as string));
          // const newBuffer = Buffer.from(arg.value);
          // const combinedBuffer = Buffer.alloc(
          //   finalBuffer.length + newBuffer.length
          // );
          // finalBuffer.copy(combinedBuffer, 0);
          // newBuffer.copy(combinedBuffer, finalBuffer.length);
          // finalBuffer = combinedBuffer;
          break;
        case 'byte':
          buffers.push(arg.value as Buffer);
          break;
        case 'hex':
          buffers.push(
            Buffer.from((arg.value as string).replace('0x', ''), 'hex')
          );
          break;
        case 'boolean':
        case 'int':
        case 'BigInt':
          const buffer = Buffer.alloc(8);
          const bigNum = BigInt(String(Number(arg.value || 0)));
          buffer.writeBigUInt64BE(bigNum);
          console.log('TYPPPEPEEE', arg.value, buffer.toString('hex'));
          buffers.push(buffer);
          break;
        case 'address':
          console.log(
            'ACcOUNTBUFFER',
            Buffer.from(arg.value as string).toString('hex')
          );
          buffers.push(Buffer.from(arg.value as string));
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
    const finalBuffer = Buffer.alloc(len);
    let copied = 0;
    for (const b of buffers) {
      b.copy(finalBuffer, copied);
      copied += b.length;
    }
    return finalBuffer;
  }
}