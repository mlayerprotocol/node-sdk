import { isHexString, sha256 } from 'ethers';
import { Utils } from '../helper';
import { HexString, AddressString, BaseEntity } from './base';

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
  acct: HexString;
  privi: 0 | 1 | 2 | 3; //  0=>Read, 1=>Write,2=>Admin
  topIds: string; // "*" all topics or comma separated list of topic ids
  du: number; // duration
  ts: number; // timestmap
  sigD: ISignatureData; // signatureData
}

export class Authorization extends BaseEntity {
  public account: string = '';
  public agent: string = '';
  public grantor: string = '';
  public privilege: 0 | 1 | 2 | 3 = 0;
  public topicIds: string = '';
  public timestamp: number;
  public duration: number;
  public signatureData: SignatureData = new SignatureData('', '', '');

  /**
   * @override
   * @returns {IAuthorization}
   */
  public asPayload(): IAuthorization {
    return {
      agt: this.agent,
      acct: this.account,
      gr: this.grantor,
      privi: this.privilege,
      topIds: this.topicIds,
      ts: this.timestamp,
      du: this.duration,
      sigD: this.signatureData.asPayload(),
    };
  }

  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    return Utils.encodeBytes(
      { type: 'hex', value: this.account },
      { type: 'address', value: this.agent },
      { type: 'string', value: this.topicIds },
      { type: 'int', value: this.privilege },
      { type: 'int', value: this.duration },
      { type: 'int', value: this.timestamp }
    );
  }
}
