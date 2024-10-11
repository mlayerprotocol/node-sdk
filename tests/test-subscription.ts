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
import { Client } from "../src";
import { validator, account, agent, agentList } from "./lib/keys";
import { Topic } from "../src/entities/topic";
import {
  Subscription,
  SubscriptionRole,
  SubscriptionStatus,
} from "../src/entities/subscription";
import { Address } from "../src/entities";
import { RESTProvider } from "../src/providers";

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
  // subscribe.status = 1;
  subscribe.topic = "9b93dffe-01a6-41eb-7d61-19840b19bc80";
  subscribe.subscriber = Address.fromString(agentList[2].account.address);
  subscribe.status = SubscriptionStatus.Subscribed;
  subscribe.role = SubscriptionRole.Member;
  subscribe.ref = "com.ref.com/sub1";

  //   subscribe.agent = "Bitcoin world";
  //   subscribe.reference = "898989";

  const payload: ClientPayload<Subscription> = new ClientPayload();
  payload.data = subscribe;
  payload.subnet = "360db526-9592-b78c-1c5c-f57a92410857";
  payload.timestamp = 2705392177908;
  payload.eventType = MemberTopicEventType.SubscribeEvent;
  payload.validator = validator.publicKey;
  payload.account = Address.fromString(agentList[0].account.address);
  const pb = payload.encodeBytes();
  console.log("🚀 ~ main ~ pb:", pb.toString("hex"));
  payload.signature = await Utils.signMessageEcc(pb, agentList[0].privateKey);
  console.log(
    "Payload",
    JSON.stringify(payload.asPayload(), function (k, v) {
      return v === "" ? undefined : v;
    })
  );

  const client = new Client(new RESTProvider("http://localhost:9531"));
  console.log("AUTHORIZE", await client.createSubscription(payload));
}
main().then();
