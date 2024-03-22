import { isHexString, sha256 } from "ethers";
import { Utils } from "../helper";
import { HexString, AddressString, BaseEntity } from "./base";

export class Address extends BaseEntity {
  public prefix: string = "did";
  public address: string = "";
  public chain: string = "";

  public toAddressString() {
    if (this.address == "") return "";
    return `${this.prefix}:${this.address}${
      this.chain == "" ? "" : "#" + this.chain
    }`;
  }
  static fromString(addressString: string): Address {
    const addr = new Address();
    addr.prefix = "did";
    const parts = addressString.split(":");
    addr.address = parts[0] != "did" ? parts[0] : parts[1];
    const parts2 = addr.address.split("#");
    if (parts.length > 1) {
      addr.address = parts2[0];
      addr.chain = parts2[1];
    }
    return addr;
  }
  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    return Utils.encodeBytes({ type: "address", value: this.toString() });
  }
}
