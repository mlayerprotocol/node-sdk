import { isHexString, sha256 } from "ethers";
import { Utils } from "../helper";
import { HexString, AddressString, BaseEntity } from "./base";
import { Address } from "./address";

export enum AuthorizationPrivilege {
  Unauthorized = 0,
  Basic = 10,
  Standard = 20,
  Manager = 30,
  Admin = 40,
}

export interface ISignatureData {
  ty: string;
  pubK?: string;
  sig: string;
}

export class SignatureData {
  constructor(
    public type: '' | 'tendermint/PubKeySecp256k1' | 'eth',
    public publicKey: string,
    public signature: string
  ) {
    type = '';
    publicKey = '';
    signature = '';
  }

  /**
   * @override
   * @returns {IAuthorization}
   */
  public asPayload(): ISignatureData {
    return {
      ty: this.type,
      pubK: this.publicKey,
      sig: this.signature,
    };
  }
}

export interface IAuthorization {
  agt: string;
  gr: AddressString;
  acct: AddressString;
  privi: AuthorizationPrivilege;
  topIds: string; // "*" all topics or comma separated list of topic ids
  du: number; // duration
  snet: string; // subnet
  ts: number; // timestmap
  sigD: ISignatureData; // signatureData
}

export class Authorization extends BaseEntity {
  public account: Address = new Address();
  public agent: string = '';
  public grantor: Address = new Address();
  public privilege: AuthorizationPrivilege = 0;
  public topicIds: string = '';
  public timestamp: number;
  public duration: number;
  public subnet: string = '';
  public signatureData: SignatureData = new SignatureData('', '', '');

  /**
   * @override
   * @returns {IAuthorization}
   */
  public asPayload(): IAuthorization {
    return {
      agt: this.agent,
      acct: this.account.toString(),
      gr: this.grantor.toString(),
      privi: this.privilege,
      topIds: this.topicIds,
      ts: this.timestamp,
      du: this.duration,
      snet: this.subnet,
      sigD: this.signatureData.asPayload(),
    };
  }

  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    return Utils.encodeBytes(
      { type: 'address', value: this.account.toString() },
      { type: 'hex', value: this.agent },
      { type: 'string', value: this.topicIds },
      { type: 'int', value: this.privilege },
      { type: 'int', value: this.duration },
      { type: 'string', value: this.subnet },
      { type: 'int', value: this.timestamp }
    );
  }
}
