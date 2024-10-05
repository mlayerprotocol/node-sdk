import { isHexString } from "ethers";
import { BaseEntity } from "./base";
import { Utils } from "../helper";
import { Address } from "./address";

type AddressString = string;
type HexString = string;

export interface ISubscription {
  id?: string;
  top: string;
  snet: string;
  ref: string;
  meta?: string;
  sub: AddressString;
  st: number;
  rol: number;
  sig?: string;
  h?: string;
  eH?: string;
}

export enum SubscriptionStatus {
  Unsubscribed = 0,
  Invited = 10,
  Pending = 20,
  Subscribed = 30,
  Banned = 40,
}

export enum SubscriberRole {
  Reader = 0,
  Writer = 10,
  Manager = 20,
  Admin = 30,
}

// export enum SubscriptionRole {
//   Member = 0,
//   Admin = 1,
// }

export class Subscription extends BaseEntity {
  public id: string = '';
  public topic: string = '';
  public subnet: string = '';
  public ref: string = '';
  public meta: string = '';
  public subscriber: Address = Address.fromString('');
  public timestamp: number = 0;
  public status: SubscriptionStatus = 0;
  public signature: string = '';
  public hash: string = '';
  public eventHash: string = '';
  public role: SubscriberRole = 0;

  /**
   * @override
   * @returns {ITopic}
   */
  public asPayload(): ISubscription {
    return {
      id: this.id,
      top: this.topic,
      sub: this.subscriber.toString(),
      sig: this.signature,
      snet: this.subnet,
      h: this.hash,
      eH: this.eventHash,
      st: this.status,
      rol: this.role,
      ref: this.ref,
      meta: this.meta,
    };
  }

  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    return Utils.encodeBytes(
      { type: 'string', value: this.meta },
      { type: 'string', value: this.ref },
      { type: 'int', value: this.role },
      { type: 'int', value: this.status },
      { type: 'string', value: this.subscriber.toString() },
      { type: 'string', value: this.topic }
    );
  }
}
