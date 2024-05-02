import { keccak256 } from "ethereum-cryptography/keccak";
import { BaseEntity } from "./base";
import { EncoderDataType, Utils } from "../helper";
import { Authorization } from "./authorization";
import { Address } from "./address";
import { Keccak256 } from "@cosmjs/crypto";

// Authrization
export enum AuthorizeEventType {
  "AuthorizeEvent" = 100,
  "UnauthorizeEvent" = 101,
}

// // Administrative Topic Actions
export enum AdminTopicEventType {
  "DeleteTopic" = 1000,
  "CreateTopic" = 1001, // m.room.create
  "PrivacySet" = 1002,
  "BanMember" = 1003,
  "UnbanMember" = 1004,
  "ContractSet" = 1005,
  "UpdateName" = 1006, //  m.room.name
  "UpdateDescription" = 1007, //  m.room.topic
  "UpdateAvatar" = 1008, //  m.room.avatar
  "PinMessage" = 1008, //  m.room.avatar
  "UpdateTopic" = 1009, // m.room.create
  "UpgradeSubscriberEvent" = 1010,
}

// Member Topic Actions
export enum MemberTopicEventType {
  "LeaveEvent" = 1100,
  "JoinEvent" = 1101,
  "RequestedEvent" = 1102,
  "ApprovedEvent" = 1103,
  "UpgradedEvent" = 1104,
  "InvitedEvent" = 1105,
}

// // Message Actions
export enum MemberMessageEventType {
  "DeleteMessageEvent " = 1200, //m.room.encrypted
  "SendMessageEvent" = 1201, // m.room.message
  // CreateReaction          EventType = 1202 // m.reaction
  // IsTyping                EventType = 1203
}

// // Administrative Topic Actions
export enum AdminSubnetEventType {
  'DeleteSubnet' = 1300,
  'CreateSubnet' = 1301, // m.room.create
  // "PrivacySet" = 1002,
  // "BanMember" = 1003,
  // "UnbanMember" = 1004,
  // "ContractSet" = 1005,
  // "UpdateName" = 1006, //  m.room.name
  // "UpdateDescription" = 1007, //  m.room.topic
  // "UpdateAvatar" = 1008, //  m.room.avatar
  // "PinMessage" = 1008, //  m.room.avatar
  'SubnetTopic' = 1309, // m.room.create
  // "UpgradeSubscriberEvent" = 1010,
}

type AddressString = string;
type HexString = string;

export interface IClientPayload {
  // Primary
  d: unknown; // `data`
  ts: number; // `timestamp`
  ty: number; // `type`
  val: AddressString;
  nonce: number;
  snet?: string;
  // Secondary
  sig: HexString;
  h: HexString;
  acct: AddressString;
}

export class ClientPayload<T> extends BaseEntity {
  public data: T;
  public timestamp: number = 0;
  public account: Address = new Address();
  public validator: string = '';
  public eventType:
    | AuthorizeEventType
    | AdminTopicEventType
    | AdminSubnetEventType
    | MemberTopicEventType
    | MemberMessageEventType;
  public authHash: string = '';
  public nonce: number = 0;
  public subnet: string = '';

  // Secondary
  public signature: string = '';
  public hash: string = '';

  public encodeBytes(): Buffer {
    return Utils.encodeBytes(
      {
        type: 'byte',
        value: Utils.keccak256Hash((this.data as BaseEntity).encodeBytes()),
      },
      { type: 'int', value: this.eventType },
      { type: 'string', value: this.subnet },
      ...((this.account?.toString() ?? '') == ''
        ? []
        : ([{ type: 'address', value: this.account.toString() }] as any[])),
      // { type: "hex", value: this.authHash },
      { type: 'hex', value: this.validator },
      { type: 'int', value: this.nonce },
      { type: 'int', value: this.timestamp }
    );
    const params: {
      type: EncoderDataType;
      value: string | number | boolean | Buffer | BigInt;
    }[] = [
      {
        type: 'byte',
        value: Buffer.from(
          Utils.keccak256Hash((this.data as BaseEntity).encodeBytes()).toString(
            'hex'
          ),
          'hex'
        ),
      },
      { type: 'int', value: this.eventType },
    ];
    if (this.account.address.length) {
      params.push({ type: 'address', value: this.account.toString() });
    }
    params.push({ type: 'hex', value: this.validator });
    params.push({ type: 'int', value: this.nonce });
    params.push({ type: 'int', value: this.timestamp });
    return Utils.encodeBytes(...params);
  }

  /**
   * @override
   * @returns {IAuthorization}
   */
  public asPayload(): IClientPayload {
    return {
      d: (this.data as BaseEntity).asPayload(),
      ts: this.timestamp,
      ty: this.eventType,
      sig: this.signature,
      snet: this.subnet,
      h: this.hash,
      val: this.validator,
      acct: this.account.toAddressString(),
      nonce: this.nonce,
    };
  }
}
