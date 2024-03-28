import { isHexString } from "ethers";
import { BaseEntity } from "./base";
import { Utils } from "../helper";
import { Address } from "./address";

type AddressString = string;
type HexString = string;

export interface ISubscription {
  id: string;
  top: string;
  sub: AddressString;
  ts: number;
  st: number;
  sig: string;
  h: string;
  eH: string;
  agt: string;
  rol: number;
}

enum SubscriptionStatus {
  Unsubscribed = 0,
  Pending = 1,
  Subscribed = 2,
  // ApprovedSubscriptionStatus      SubscriptionStatuses = "approved"
  Banned = 3,
  // UNBANNED     SubscriptionStatuses = "unbanned"
}

export class Subscription extends BaseEntity {
  public id: string = "";
  public topic: string = "";
  public subscriber: Address = Address.fromString("");
  public timestamp: number = 0;
  public status: SubscriptionStatus = 0;
  public signature: string = "";
  public hash: string = "";
  public eventHash: string = "";
  public agent: string = "";
  public role: number = 0;

  /**
   * @override
   * @returns {ITopic}
   */
  public asPayload(): ISubscription {
    return {
      id: this.id,
      top: this.topic,
      sub: this.subscriber.toString(),
      ts: this.timestamp,
      sig: this.signature,
      h: this.hash,
      eH: this.eventHash,
      st: this.status,
      agt: this.agent,
      rol: this.role,
    };
  }

  /**
   * @override
   * @returns {Buffer}
   */
  public encodeBytes(): Buffer {
    return Utils.encodeBytes(
      { type: "string", value: this.topic }
      // { type: "address", value: this.subscriber.toString() }
      // { type: "string", value: this.eventHash },
      // { type: "int", value: this.status },
      // { type: "int", value: this.timestamp }
    );
  }
}
