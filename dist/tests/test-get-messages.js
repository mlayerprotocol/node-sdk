"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const src_1 = require("../src");
// console.log(Utils.generateKeyPairEdd());
// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };
async function main() {
    // const subscribe: Subscription = new Subscription();
    // const payload: ClientPayload<Subscription> = new ClientPayload();
    // payload.data = subscribe;
    // payload.timestamp = 2705392177908;
    // payload.eventType = MemberTopicEventType.JoinEvent;
    // payload.validator = validator.publicKey;
    // payload.account = Address.fromString(agentList[0].account.address);
    // const pb = payload.encodeBytes();
    // console.log("🚀 ~ main ~ pb:", pb.toString("hex"));
    // payload.signature = await Utils.signMessageEcc(pb, agentList[0].privateKey);
    // console.log("Payload", JSON.stringify(payload.asPayload()));
    const id = "a6972f51-7ff9-96b4-6fae-e34fc56c0873";
    const client = new src_1.Client(new src_1.RESTProvider("http://localhost:9531"));
    console.log("AUTHORIZE", await client.getTopicMessages({
        id,
        params: {
            // acct: agentList[0].account.address,
            top: "211d12d4-fc98-b956-6f70-1a8c3d5859f1",
        },
    }));
}
main().then();
