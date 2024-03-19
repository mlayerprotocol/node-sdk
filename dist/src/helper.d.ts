/// <reference types="node" />
import { AddressString, HexString } from "./entities/base";
export type EncoderDataType = "string" | "address" | "int" | "BigInt" | "hex" | "boolean" | "byte";
export declare class Utils {
    static toAddress(publicKey: Buffer): string;
    static sha256Hash(data: Buffer): Buffer;
    static keccak256Hash(data: Buffer): Buffer;
    static generateKeyPairSecp(): {
        privateKey: string;
        publicKey: string;
        address: string;
    };
    /**
     *
     * @returns
     */
    static generateKeyPairEcc(): {
        privateKey: string;
        publicKey: string;
        address: string;
    };
    /**
     *
     * @returns
     */
    static generateKeyPairEdd(): {
        privateKey: string;
        publicKey: string;
        address: string;
    };
    static signMessageEcc(message: Buffer, privateKey: string): string;
    static signMessageEdd(message: Buffer, privateKey: Buffer): string;
    static getSignerEcc(message: Buffer, signature: string): string;
    static signMessageSecp(message: Buffer, privateKey: Buffer): string;
    static verifyMessageSecp(message: Buffer, signature: string, publicKey: Buffer): boolean;
    static encodeBytes(...args: {
        type: EncoderDataType;
        value: string | number | BigInt | boolean | Buffer | HexString | AddressString;
    }[]): Buffer;
}
