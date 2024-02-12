import { isHexString } from 'ethers';
import { BaseEntity } from './base';
import { Utils } from '../helper';
import { Authorization } from './authorization';

// Authrization
export enum AuthorizeEventType {
  'AuthorizeEvent' = 100,
  'UnauthorizeEvent' = 101,
}

// // Administrative Topic Actions
export enum AdminTopicEventType {
  'DeleteTopic' = 1000,
  'CreateTopic' = 1001, // m.room.create
  'PrivacySet' = 1002,
  'BanMember' = 1003,
  'UnbanMember' = 1004,
  'ContractSet' = 1005,
  'UpdateName' = 1006, //  m.room.name
  'UpdateDescription' = 1007, //  m.room.topic
  'UpdateAvatar' = 1008, //  m.room.avatar
  'PinMessage' = 1008, //  m.room.avatar
}

// Member Topic Actions
export enum MemberTopicEventType {
  'LeaveEvent' = 1100,
  'JoinEvent' = 1101,
  'RequestedEvent' = 1102,
  'ApprovedEvent' = 1103,
  'UpgradedEvent' = 1104,
  'InvitedEvent' = 1105,
}

// // Message Actions
// const (
//   DeleteMessage              EventType = 1200      //m.room.encrypted
// CreateMessage              EventType = 1201      // m.room.message
// CreateReaction          EventType = 1202 // m.reaction
//   IsTyping                EventType = 1203
// )

export type AddressString = string;
export type HexString = string;

export interface IClientPayload {
  // Primary
  d: unknown; // `data`
  ts: number; // `timestamp`
  ty: number; // `type`
  val: AddressString;
  nonce: number;
  // Secondary
  sig: HexString;
  h: HexString;
  auth: HexString;
}

export class ClientPayload<T> extends BaseEntity {
  public data: T;
  public timestamp: number = 0;
  public eventType: AuthorizeEventType | AdminTopicEventType;
  public authHash: string = '';
  public validator: string = '';
  public nonce: number = 0;

  // Secondary
  public signature: string = '';
  public hash: string = '';

  public encodeBytes(): Buffer {
    return Utils.encodeBytes(
      { type: 'byte', value: (this.data as BaseEntity).encodeBytes() },
      { type: 'int', value: this.eventType },
      { type: 'hex', value: this.authHash },
      { type: 'hex', value: this.validator },
      { type: 'int', value: this.nonce },
      { type: 'int', value: this.timestamp }
    );
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
      h: this.hash,
      val: this.validator,
      auth: this.authHash,
      nonce: this.nonce,
    };
  }
}
