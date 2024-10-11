import axios, { AxiosResponse } from "axios";
import { Provider } from ".";
import { AuthorizeEventType, ClientPayload } from "../entities";

export class RESTProvider implements Provider {
  private server: string = "http://localhost:9531";

  constructor(host?: string, ethProvider?: unknown) {
    if (host.slice(-1) == `/`) host = host.substring(0, host.length - 1);
    this.server = host;
  }

  /**
   * @override
   * @param payload
   * @returns
   */
  public async makeRequest<T, O>(options: {
    path: string;
    method?: "get" | "put" | "post" | "patch" | "delete";
    params?: Record<string, any>;
    payload?: ClientPayload<T> | undefined;
    prefix?: string;
  }): Promise<Record<string, unknown>> {
    var {
      payload,
      path,
      method = "put",
      params,
      prefix = "api",
    } = options ?? {};
    // let path = argOptions?.path;
    // const method = argOptions?.method ?? "put";
    // const params = argOptions?.params;
    if (payload != null) {
      switch (payload.eventType) {
        case AuthorizeEventType.AuthorizeEvent:
        case AuthorizeEventType.UnauthorizeEvent:
          path = "/authorizations";
          break;
      }
    }
    try {
      const url = `${this.server}/${prefix}${path}`;
      let response: AxiosResponse<any, any>;
      switch (method) {
        case "post":
        case "put":
        case "patch":
        case "delete":
          response = await (axios[options.method ?? "put"] as any)(
            url,
            payload?.asPayload(),
            {
              headers: {
                "Content-Type": "application/json",
              },
              params,
            }
          );
          break;
        default:
          // console.log({ urlurl: url });
          response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
            },
            params,
          });
      }

      return (await response.data) as Record<string, unknown>;
    } catch (e) {
      throw e; //TODO dont throw error
    }
  }
}
