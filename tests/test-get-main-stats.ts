require("dotenv").config();

import { Client, RESTProvider } from "../src";

async function main() {
  const client = new Client(new RESTProvider("http://localhost:9531"));
  console.log(
    "AUTHORIZE",
    await client.getMainStats({
      params: {},
    })
  );
}
main().then();
