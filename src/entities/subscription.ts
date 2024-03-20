import { isHexString } from "ethers";
import { BaseEntity } from "./base";
import { Utils } from "../helper";

export type AddressString = string;
export type HexString = string;

export interface ISubscription {
  id: string;
  top: string;
  sub: HexString;
  ts: number;
  sig: string;
  h: string;
  eH: string;
  agt: string;
  rol: number;
}

export class Subscription extends BaseEntity {
  public id: string = "";
  public topic: string = "";
  public subscriber: HexString = "";
  public timestamp: number = 0;
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
      sub: this.subscriber,
      ts: this.timestamp,
      sig: this.signature,
      h: this.hash,
      eH: this.eventHash,
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
      { type: "string", value: this.topic },
      { type: "string", value: this.subscriber },
      { type: "string", value: this.eventHash },
      { type: "int", value: this.timestamp }
    );
  }
}
