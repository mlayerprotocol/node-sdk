require("dotenv").config();

import { Client, RESTProvider } from "../src";
import { agentList } from "./lib/keys";

async function main() {
  const client = new Client(new RESTProvider("http://localhost:9531"));
  console.log(
    "AUTHORIZE",
    await client.getSubnets({
      params: {
        // acct: agentList[0].account.address,
        // top: "211d12d4-fc98-b956-6f70-1a8c3d5859f1",
      },
    })
  );
}
main().then();
