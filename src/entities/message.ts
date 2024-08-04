import { isHexString } from "ethers";
import { BaseEntity } from "./base";
import { Utils } from "../helper";
import { Address } from './address';
import { DataType } from '../constants';

type AddressString = string;
type HexString = string;

export interface IMessageAction {
  c: string;
  abi: string;
  a: string;
  pa: string[];
}

// export interface IMessageAttachment {
//   cid: string;
//   h: string;
// }

export interface IMessage {
  id: string;
  ts: number;
  topId: string;
  s: AddressString;
  r: AddressString;
  d: HexString;
  a: any[];
  dTy: DataType;
  h: string;
  // atts: any[];
  sig: string;
  dh: string;
  url: string;
}

export class MessageAction extends BaseEntity {
  public contract: string = '';
  public abi: string = '';
  public action: string = '';
  public parameters: string[] = [''];

  /**
   * @override
   * @returns {IMessageAction} object
   */
  public asPayload(): IMessageAction {
    return {
      c: this.contract,
      abi: this.abi,
      a: this.action,
      pa: this.parameters,
    };
  }

  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    let b = [];
    let len = 0;
    let parameters = Buffer.from('');

    for (const d of this.parameters) {
      let data = Utils.encodeBytes({ type: 'string', value: d });
      len += data.length;
      b.push(data);
    }

    parameters = Buffer.concat(b, len);

    return Utils.encodeBytes(
      { type: 'string', value: this.contract },
      { type: 'string', value: this.abi },
      { type: 'string', value: this.action },
      {
        type: 'byte',
        value: Buffer.from(parameters),
      }
    );
  }
}

// export class MessageAttachment extends BaseEntity {
//   public cid: string = '';
//   public hash: string = '';

//   /**
//    * @override
//    * @returns {IMessageAttachment} object
//    */
//   public asPayload(): IMessageAttachment {
//     return {
//       cid: this.cid,
//       h: this.hash,
//     };
//   }

//   /**
//    * @override
//    * @returns {Buffer}
//    */
//   public encodeBytes(): Buffer {
//     return Utils.encodeBytes(
//       { type: 'string', value: this.cid },
//       { type: 'string', value: this.hash }
//     );
//   }
// }

export class Message extends BaseEntity {
  public id: string = '';
  public timestamp: number = 0;
  public topicId: string = '';
  public sender: Address = Address.fromString('');
  public receiver: Address = Address.fromString('');
  public dataType: DataType = DataType.BINARY;
  public data: Buffer = Buffer.from('');
  public actions: IMessageAction[] = [];
  public hash: string = '';
  //public attachments: IMessageAttachment[] = [];
  public signature: string = '';
  public dataHash: string = '';
  public url: string = '';

  /**
   * @override
   * @returns {IMessage} object
   */
  public asPayload(): IMessage {
    return {
      id: this.id,
      ts: this.timestamp,
      topId: this.topicId,
      s: this.sender.toAddressString(),
      r: this.receiver.toAddressString(),
      //  d: new Uint8Array(this.data, this.data.byteOffset, this.data.byteLength),
      d: this.data.toString('hex'),
      a: this.actions,
      h: this.hash,
      // atts: this.attachments,
      dTy: this.dataType,
      sig: this.signature,
      dh: this.dataHash,
      url: this.url,
    };
  }

  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    let len = 0;
    const attachmentArray = [];
    const actionArray = [];
    // let attachments = Buffer.from('');
    let actions = Buffer.from('');

    for (const d of this.actions) {
      let data = new MessageAction().encodeBytes();
      len += data.length;
      actionArray.push(data);
    }

    actions = Buffer.concat(actionArray, len);
    len = 0;

    // for (const d of this.attachments) {
    //   let data: Buffer = new MessageAttachment().encodeBytes();
    //   len += data.length;
    //   attachmentArray.push(data);
    // }

    // attachments = Buffer.concat(attachmentArray, len);
    len = 0;
    return Utils.encodeBytes(
      { type: 'byte', value: Buffer.from(actions) },
      // { type: 'byte', value: Buffer.from(attachments) },
      {
        type: 'byte',
        value: this.data,
      },
      {
        type: 'string',
        value: this.dataType,
      },
      { type: 'address', value: this.receiver.toString() },
      { type: 'address', value: this.sender.toString() },
      { type: 'byte', value: Utils.uuidToBytes(this.topicId) }
    );
  }
}
