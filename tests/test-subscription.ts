require("dotenv").config();
const jayson = require("jayson");
import { Utils } from "../src/helper";
import { Authorization } from "../src/entities/authorization";
import {
  AdminTopicEventType,
  AuthorizeEventType,
  ClientPayload,
  MemberTopicEventType,
} from "../src/entities/clientPayload";
import { Client, RESTProvider } from "../src";
import { validator, account, agent } from "./lib/keys";
import { Topic } from "../src/entities/topic";
import { Subscription } from "../src/entities/subscription";

// console.log(Utils.generateKeyPairEdd());

// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };

async function main() {
  const subscribe: Subscription = new Subscription();
  //console.log('keypairsss', Utils.generateKeyPairSecp());
  // console.log(
  //   'BECH32ADDRESS',
  //   validator.publicKey,
  //   Utils.toAddress(Buffer.from(validator.publicKey, 'hex'))
  // );
  (subscribe.id = "18915c42-037e-4256-8bec-4a131cad9b61"),
    (subscribe.topic =
      "d4b2186ccb072da3c18d6e7bddc7a9eeef6c377ea2108303ca84475f1384fbcb");
  //   subscribe.subscriber = account.publicKey;
  //   subscribe.agent = "Bitcoin world";
  //   subscribe.reference = "898989";

  const payload: ClientPayload<Subscription> = new ClientPayload();
  payload.data = subscribe;
  payload.timestamp = 2705392177900;
  payload.eventType = MemberTopicEventType.JoinEvent;
  payload.validator = validator.publicKey;
  const pb = payload.encodeBytes();
  console.log("🚀 ~ main ~ pb:", pb.toString("hex"));
  payload.signature = await Utils.signMessageEcc(pb, agent.privateKey);
  console.log("Payload", JSON.stringify(payload.asPayload()));

  const client = new Client(new RESTProvider("http://localhost:9531"));
  //   console.log("AUTHORIZE", await client.createSubscription(payload));
}
main().then();
