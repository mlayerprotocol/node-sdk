"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jayson = require("jayson");
const helper_1 = require("../src/helper");
const clientPayload_1 = require("../src/entities/clientPayload");
const src_1 = require("../src");
const keys_1 = require("./lib/keys");
const address_1 = require("../src/entities/address");
const message_1 = require("../src/entities/message");
// console.log(Utils.generateKeyPairEdd());
// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };
async function main() {
    const message = new message_1.Message();
    const messageAction = new message_1.MessageAction();
    const messageAttachment = new message_1.MessageAttachment();
    const messageActions = [];
    const messagettachments = [];
    messageAction.contract = "";
    messageAction.abi = "";
    messageAction.action = "";
    messageAction.parameters = [""];
    messageActions.push(messageAction);
    messageAttachment.cid = "";
    messageAttachment.hash = "";
    messagettachments.push(messageAttachment);
    message.topicId = "ac0cb541-2313-dbb5-6cd2-dcba6ecff121";
    message.sender = address_1.Address.fromString(keys_1.agentList[2].account.address);
    message.data = Buffer.from("Hello World");
    message.attachments = messagettachments;
    message.actions = messageActions;
    const payload = new clientPayload_1.ClientPayload();
    payload.data = message;
    payload.timestamp = 1705392178023;
    payload.eventType = clientPayload_1.MemberMessageEventType.SendMessageEvent;
    payload.validator = keys_1.validator.publicKey;
    payload.account = address_1.Address.fromString(keys_1.agentList[2].account.address);
    payload.nonce = 0;
    const pb = payload.encodeBytes();
    console.log("HEXDATA", pb.toString("hex"));
    payload.signature = await helper_1.Utils.signMessageEcc(pb, keys_1.agentList[2].privateKey);
    console.log("Payload", JSON.stringify(payload.asPayload()));
    const client = new src_1.Client(new src_1.RESTProvider("http://localhost:9531"));
    const activityClient = new src_1.ActivityClient(new src_1.Client(new src_1.RESTProvider("http://localhost:5005")));
    await client
        .createMessage(payload)
        .then(async (response) => {
        const eventData = response.data;
        if (eventData.t === clientPayload_1.MemberMessageEventType.SendMessageEvent) {
            const event = await client.resolveEvent({
                type: eventData.t,
                id: eventData.id,
                delay: 5,
            });
            if (event?.["data"]?.["sync"]) {
                await activityClient.sendMessageActivity(payload);
            }
        }
        console.log("AUTHORIZE", response.body);
    })
        .catch((err) => {
        console.log("ERROR", err);
    });
}
main().then();
