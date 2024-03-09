export declare class Utils {
  static sha256(data: string): string;
  static generateKeyPair(): {
    privateKey: any;
    publicKey: string;
    address: string;
  };
}
