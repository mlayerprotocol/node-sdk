import { ethers } from 'ethers';
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

export class ChainId {
  constructor(private value: string) {}
  toString(): String {
    return String(this.value);
  }
  get() {
    return this.value;
  }
  set(val: string) {
    this.value = val;
  }
  bytes(): Buffer {
    if (!isNaN(parseInt(this.value))) {
      const bigNumberValue = ethers.toBigInt(this.value);
      return Buffer.from(
        ethers.zeroPadValue(ethers.toBeHex(bigNumberValue), 32),
        'hex'
      );
    } else {
      return Buffer.from(this.value);
    }
  }
}
