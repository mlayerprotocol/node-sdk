import axios, { AxiosResponse } from "axios";
import { EventFilter, Provider, SubscriptionEvents } from ".";
import { AuthorizeEventType, ClientPayload } from "../entities";
import { nanoid } from "nanoid";
import { Subject, of } from "rxjs";
import {
  first,
  timeout,
  filter as rxFilter,
  catchError,
  tap,
  takeUntil,
} from "rxjs/operators";

let WsService: any;

export const ERROR_MESSAGE = "__error__";
export const STOP_MESSAGE = "__stop__";

if (isBrowser()) {
  // In a browser environment, use the native WebSocket
  WsService = window.WebSocket;
} else {
  // In a Node.js environment, use the 'ws' package
  WsService = require("ws");
}

function isBrowser(): Boolean {
  return (
    typeof window !== "undefined" && typeof window.WebSocket !== "undefined"
  );
}

// export class WSProvider extends Provider {
//   private socketClient?: w3cwebsocket;
//   public server?: string;
//   public port?: string;

//   public socketMessageCallback?: (message: any) => void;

//   constructor(config: { server: string; port: string; ethProvider?: any }) {
//     super();
//     this.server = config.server;
//     this.port = config.port;
//   }
// }
var requestMessageBus$ = new Subject<{
  id: string;
  error?: string;
  data?: any;
  rCode?: number;
  meta?: Record<string, any>;
}>();
var subscriptionMessageBus$ = new Subject<{
  subscriptionId: string;
  event?: Record<string, any>;
}>();

/**
 *
 */
export class WSProvider implements Provider {
  private server: string = "ws://localhost:8088/ws";
  private socket;

  //  private messageBus = new Subject<{ id: string; payload?: any }>();
  constructor(host?: string) {
    if (host.slice(-1) == `/`) {
      host = host.substring(0, host.length - 1);
    }
    this.server = host;
  }
  /**
   *
   * @param subscriptionId
   */
  public async endSubscription(subscriptionId: string): Promise<void> {
    subscriptionMessageBus$.next({
      subscriptionId,
      event: { [STOP_MESSAGE]: true },
    });
  }
  /**
   * @override
   * @param filter
   * @param events
   */
  public async subscribe(
    filter: EventFilter,
    events: SubscriptionEvents
  ): Promise<void> {
    // const id = nanoid(10);

    try {
      const subscr: any = await this.makeRequest({
        path: "/__subscribe__",
        method: "post",
        params: filter,
      });
      const stopNotifier$ = subscriptionMessageBus$.pipe(
        tap((message) => {
          if (
            message.subscriptionId == subscr?.id &&
            message.event[STOP_MESSAGE]
          ) {
            console.log("Received stop message. Ending subscription.");
          }
        }),
        rxFilter((message) => {
          return (
            message.subscriptionId == subscr?.id &&
            !!message.event[STOP_MESSAGE]
          );
        }) // Only emit when the message is 'stop'
      );
      events.onSubscribe(subscr.id);
      await new Promise((resolve, reject) => {
        subscriptionMessageBus$
          .pipe(
            rxFilter((message: any) => {
              return message?.subscriptionId === subscr.id;
            }),
            catchError((error) => {
              console.error("An error occurred:", error);

              return of({ error: "An error occurred." });
            }),
            takeUntil(stopNotifier$)
          )
          .subscribe({
            next: async (message) => {
              if (message.event[STOP_MESSAGE]) {
                console.log("Subscription stopped");
                resolve(undefined);
                return;
              }
              if (message.event[ERROR_MESSAGE]) {
                reject(new Error("socket closed"));
                return;
              }

              console.log("🚀 ~ WSProvider ~ next: ~ message: ON RECIEVE");
              events.onReceive(message);
            },

            // complete: () => console.log('Subscription ended.'),
          });
      });
    } catch (e) {
      events.onError(e);
    }
  }
  /**
   *
   * @returns @override
   */
  public async connect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.socket?.readyState === WsService.OPEN) {
        return resolve(true);
      }

      this.socket = new WsService(`${this.server}`);

      if (isBrowser()) {
        this.socket.onopen = () => {
          this.onOpen();
        };

        this.socket.onmessage = (event: MessageEvent) => {
          this.onMessage(event);
        };

        this.socket.onerror = (error: Event) => {
          this.onError(error);
        };

        this.socket.onclose = () => {
          this.onClose();
        };
      } else {
        this.socket.on("open", this.onOpen);
        this.socket.on("error", this.onError);

        this.socket.on("close", this.onClose);

        this.socket.on("message", this.onMessage);
      }
      for (let i = 0; i <= 10; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        if (this.socket.readyState === WsService.OPEN) {
          resolve(true);

          break;
        }
      }
      resolve(false);
    });
  }

  onOpen() {
    console.log("WebSocket connection opened");
  }

  public onMessage(data: MessageEvent | any) {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.subscriptionId) {
        subscriptionMessageBus$.next(msg);
      } else {
        requestMessageBus$.next(JSON.parse(data.toString()));
      }
    } catch (e) {
      requestMessageBus$.next({
        id: ERROR_MESSAGE,
        error: "invalid response",
        rCode: 500,
      });
    }
  }

  onError(error: Event) {
    console.error("WebSocket error:", error);
  }

  onClose = () => {
    subscriptionMessageBus$.next({ subscriptionId: STOP_MESSAGE });
    requestMessageBus$.next({ id: STOP_MESSAGE });
  };

  private sendMessage(message: string): void {
    if (this.socket.readyState === WsService.OPEN) {
      console.log("SENDINGMESSAGE", message);
      this.socket.send(message);
    } else {
      console.error("WebSocket is not open");
    }
  }

  /**
   * @override
   * @param payload
   * @returns
   */
  async makeRequest<T, O>(options: {
    path: string;
    method?: "get" | "put" | "post" | "patch" | "delete";
    params?: Record<string, any>;
    payload?: ClientPayload<T> | undefined;
  }): Promise<Record<string, unknown>> {
    var { payload, path, method = "get", params } = options ?? {};
    // let path = argOptions?.path;
    // const method = argOptions?.method ?? "put";
    // const params = argOptions?.params;

    return new Promise((resolve, reject) => {
      let _method;
      switch (method) {
        case "get":
          _method = "READ";
          break;
        case "post":
        case "patch":
        case "put":
        case "delete":
          _method = "WRITE";
      }
      if (payload != null) {
        switch (payload.eventType) {
          case AuthorizeEventType.AuthorizeEvent:
          case AuthorizeEventType.UnauthorizeEvent:
            path = "/authorizations";
            break;
        }
      }
      try {
        const action = `${_method}:${path.replace("/", "")}`;
        console.log("Acction", action);
        const id = nanoid(5);
        requestMessageBus$
          .pipe(
            first((message: any) => {
              console.debug("MakeRequest", message, id);
              return message?.id === id || message?.id == ERROR_MESSAGE;
            }),
            timeout(60 * 1000),
            catchError((error) => {
              if (error.name === "TimeoutError") {
                console.error("Request timed out.");
                return of({ error: "Request timed out." });
              }
              console.error("An error occurred:", error);
              return of({ error: "An error occurred." });
            })
          )

          .subscribe({
            next: (message) => {
              if (message.id == ERROR_MESSAGE) {
                reject(new Error("socket closed"));

                return;
              }
              resolve(message);
            },

            // complete: () => console.log('Subscription ended.'),
          });
        this.sendMessage(
          JSON.stringify({
            id,
            rTy: action,
            params: params,
            pl: payload?.asPayload(),
          })
        );
      } catch (e) {
        reject(e); //TODO dont throw error
      }
    });
  }
}
