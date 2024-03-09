import { Utils } from '../helper';

export type AddressString = string;
export type HexString = string;

export class BaseEntity {
  public asPayload(): unknown {
    return {};
  }

  public encodeBytes(): Buffer {
    return;
  }
  public getHash(): Buffer {
    return Utils.sha256Hash(this.encodeBytes());
  }
}
