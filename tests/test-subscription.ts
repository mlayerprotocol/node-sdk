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
import { ActivityClient, Client, RESTProvider } from "../src";
import { validator, account, agent, agentList } from "./lib/keys";
import { Topic } from "../src/entities/topic";
import { Subscription } from "../src/entities/subscription";
import { Address } from "../src/entities";

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
  subscribe.topic = "ac0cb541-2313-dbb5-6cd2-dcba6ecff121";
  subscribe.account = Address.fromString(agentList[2].account.address);
  //   subscribe.agent = "Bitcoin world";
  //   subscribe.reference = "898989";

  const payload: ClientPayload<Subscription> = new ClientPayload();
  payload.data = subscribe;
  payload.timestamp = 2705392177908;
  payload.eventType = MemberTopicEventType.JoinEvent;
  payload.validator = validator.publicKey;
  payload.account = Address.fromString(agentList[2].account.address);
  const pb = payload.encodeBytes();
  console.log("🚀 ~ main ~ pb:", pb.toString("hex"));
  payload.signature = await Utils.signMessageEcc(pb, agentList[2].privateKey);
  console.log("Payload", JSON.stringify(payload.asPayload()));

  const client = new Client(new RESTProvider("http://localhost:9531"));
  // console.log("AUTHORIZE", await client.createSubscription(payload));
  const activityClient = new ActivityClient(
    new Client(new RESTProvider("http://localhost:5005"))
  );
  await client
    .createSubscription(payload)
    .then(async (response) => {
      const eventData: any = response.data;
      if (eventData.t === MemberTopicEventType.JoinEvent) {
        const event = await client.resolveEvent({
          type: eventData.t,
          id: eventData.id,
          delay: 5,
        });
        if (event?.["data"]?.["sync"]) {
          await activityClient.joinTopicActivity(payload);
        }
      }
      console.log("AUTHORIZE", response);
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
}
main().then();
