require("dotenv").config();
const jayson = require("jayson");
import { Utils } from "../src/helper";
import { Authorization } from "../src/entities/authorization";
import {
  AdminTopicEventType,
  AuthorizeEventType,
  ClientPayload,
  IClientPayload,
} from "../src/entities/clientPayload";
import { Client, RESTProvider } from "../src";
import { agentList } from "./lib/keys";

// console.log(Utils.generateKeyPairEdd());

// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };

async function main() {
  // const topic: Topic = new Topic();
  // //console.log('keypairsss', Utils.generateKeyPairSecp());
  // // console.log(
  // //   'BECH32ADDRESS',
  // //   validator.publicKey,
  // //   Utils.toAddress(Buffer.from(validator.publicKey, 'hex'))
  // // );

  // topic.handle = "bitcoinworld";
  // topic.description = "The best toopic";

  // topic.name = "Bitcoin world";
  // topic.reference = "898989";

  // const payload: ClientPayload<Topic> = new ClientPayload();
  // payload.data = topic;
  // payload.timestamp = 1705392178023;
  // payload.eventType = AdminTopicEventType.CreateTopic;
  // payload.validator = validator.publicKey;
  // payload.account = Address.fromString(account.address);
  // payload.nonce = 0;
  // const pb = payload.encodeBytes();
  // console.log("HEXDATA", pb.toString("hex"));
  // payload.signature = await Utils.signMessageEcc(pb, agent.privateKey);
  // console.log("Payload", JSON.stringify(payload.asPayload()));
  const param: Record<string, any> = { acct: "" };
  const client = new Client(new RESTProvider("http://localhost:9531"));
  console.log(
    "AUTHORIZE",
    JSON.stringify(
      await client.getAuthorizations({
        params: {
          // acct: agentList[0].account.address,
          acct: 'did:cosmos1vxm0v5dm9hacm3mznvx852fmtu6792wpa4wgqx',
        },
      })
    )
  );
}
main().then();
