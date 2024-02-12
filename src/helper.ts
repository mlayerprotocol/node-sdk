import * as crypto from 'crypto';
import { bech32 } from 'bech32';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { AddressString, HexString } from './entities/base';
import { ethers } from 'ethers';
import * as nacl from 'tweetnacl';
import { encodeUTF8, encodeBase64, decodeUTF8 } from 'tweetnacl-util';

export type EncoderDataType =
  | 'string'
  | 'address'
  | 'int'
  | 'BigInt'
  | 'hex'
  | 'boolean'
  | 'byte';

export class Utils {
  static toAddress(publicKey: Buffer) {
    // Perform SHA256 hashing followed by RIPEMD160
    const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
    const ripemd160Hash = crypto
      .createHash('ripemd160')
      .update(sha256Hash)
      .digest();

    // Bech32 encoding
    return bech32.encode('ml:', bech32.toWords(ripemd160Hash));
  }
  static sha256(data: Buffer): Buffer {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest();
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

  static async signMessageEcc(
    message: Buffer,
    privateKey: string
  ): Promise<string> {
    const hash = keccak256(message);
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signMessage(hash);
  }

  static signMessageEdd(message: Buffer, privateKey: Buffer): string {
    const buffer = Utils.sha256(message);
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
    const buffer = Utils.sha256(message);

    console.log('HASSSSH', buffer.toString('hex'));
    const bytes = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    const signature = secp256k1.sign(
      bytes,
      new Uint8Array(
        privateKey.buffer,
        privateKey.byteOffset,
        privateKey.byteLength
      )
    );
    return signature.toDERHex();
  }

  // Function to verify a message
  static verifyMessageSecp(
    message: Buffer,
    signature: string,
    publicKey: Buffer
  ): boolean {
    const buffer = Utils.sha256(message);
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
          buffers.push(Buffer.from(arg.value as string, 'hex'));
          break;
        case 'boolean':
        case 'int':
        case 'BigInt':
          const buffer = Buffer.alloc(8);
          const bigNum = BigInt(String(Number(arg.value || 0)));
          buffer.writeBigUInt64BE(bigNum);
          buffers.push(buffer);
          break;
        case 'address':
          if ((arg.value as string).startsWith('0x')) {
            buffers.push(
              Buffer.from((arg.value as string).replace('0x', ''), 'hex')
            );
          } else {
            const values = ((arg.value ?? '') as string).trim().split(':');
            const tBuf = Buffer.from(values[0]);
            const tBuf2 = Buffer.from(values[1]);
            let tBuf3: Buffer;

            if (values.length == 3) {
              tBuf3 = this.encodeBytes({
                type: 'int',
                value: values[3],
              });
            }
            const cB = Buffer.alloc(
              tBuf.length + tBuf2.length + (tBuf3?.length ?? 0)
            );
            tBuf.copy(cB, 0);
            tBuf2.copy(cB, tBuf.length);
            if (tBuf3) tBuf3.copy(cB, tBuf.length + tBuf2.length);

            buffers.push(cB);
          }
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
//6d6c70316735613630736c6736326d7077723570326361666d71756c7a34777879656e39717275357936 2a 0000000000000002 0000018d114b82e6
//6d6c70316735613630736c6736326d7077723570326361666d71756c7a34777879656e39717275357936 2a 0000000000000002 0000018d114b82e6
