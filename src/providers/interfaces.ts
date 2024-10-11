<<<<<<< HEAD
import { ClientPayload } from "../entities";
import { Events, IEvents } from "../entities/event";
=======
import { ClientPayload, UUID } from '../entities';
import { Events, IEvents } from '../entities/event';
>>>>>>> develop

export enum EntityType {
  Auth = "auth",
  Topic = "top",
  Subscription = "sub",
  Message = "msg",
  Subnet = "snet",
  Wallet = "wal",
}
export type FilterValue = "*" | EntityType | UUID;
export type EventFilter = Record<string, FilterValue[]>;
export interface ISubRespData extends IEvents {
  modelType: string;
  topic?: string;
}
type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type PartialEvent = PartialWithRequired<
  IEvents,
  | "snet"
  | "id"
  | "blk"
  | "cy"
  | "ep"
  | "h"
  | "preE"
  | "authE"
  | "ts"
  | "val"
  | "t"
>;
export interface ISubRespData extends PartialEvent {
  modelType: string;
  topic?: string;
}
export type SubscriptionResponse = {
  subscriptionId: string;
  event: ISubRespData;
};

export interface SubscriptionEvents {
  onSubscribe?: (id: string) => void;
  onReceive: (response: SubscriptionResponse) => void;
  onError?: (error: Error) => void;
}
export interface Provider {
  connect?: (options?: any) => Promise<boolean>;
  subscribe?: (
    filter: EventFilter,
    events: SubscriptionEvents
  ) => Promise<void>;
  endSubscription?: (subscriptionId: string) => Promise<void>;
  makeRequest: <T, O>(
    // payload: unknown,
    options: {
      path: string;
      method?: "get" | "put" | "post" | "patch" | "delete";
      params?: Record<string, any>;
      payload?: ClientPayload<T> | undefined;
      prefix?: string;
    }
  ) => Promise<Record<string, unknown>>;
}

// export class Provider {
//   // async read<O>(
//   //   query: Record<string, unknown>,
//   //   options?: O
//   // ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
//   //   return {};
//   // }
//   constructor() {}

//   public async connect?(): Promise<boolean> {
//     throw Error('function not callable');
//   }

//   public async subscribe?(
//     filter: EventFilter,
//     events: SubscriptionEvents
//   ): Promise<void> {
//     throw Error('function not callable');
//   }
//   async makeRequest(
//     // payload: unknown,
//     options?: unknown
//   ): Promise<Record<string, unknown>> {
//     return {};
//   }
// }

// export * from './rest';
// export * from './ws';
