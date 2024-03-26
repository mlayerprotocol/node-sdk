require("dotenv").config();
const jayson = require("jayson");
import { Utils } from "../src/helper";
import { Authorization } from "../src/entities/authorization";
import {
  AuthorizeEventType,
  ClientPayload,
  MemberMessageEventType,
} from "../src/entities/clientPayload";
import { Client, RESTProvider } from "../src";
import { validator, account, agent, agentList } from "./lib/keys";
import { Address } from "../src/entities/address";
import {
  IMessageAction,
  Message,
  MessageAction,
  MessageAttachment,
} from "../src/entities/message";

// console.log(Utils.generateKeyPairEdd());

// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };

async function main() {
  const message: Message = new Message();
  const messageAction = new MessageAction();
  const messageAttachment = new MessageAttachment();
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

  message.topicId = "43545300-d5f7-24a0-b271-902d399d29f7";
  message.sender = Address.fromString(agentList[0].account.address);
  message.data = Buffer.from("Hello World");
  message.attachments = messagettachments;
  message.actions = messageActions;

  const payload: ClientPayload<Message> = new ClientPayload();
  payload.data = message;
  payload.timestamp = 1705392178023;
  payload.eventType = MemberMessageEventType.SendMessageEvent;
  payload.validator = validator.publicKey;
  payload.account = Address.fromString(agentList[0].account.address);
  payload.nonce = 0;
  const pb = payload.encodeBytes();
  console.log("HEXDATA", pb.toString("hex"));
  payload.signature = await Utils.signMessageEcc(pb, agentList[0].privateKey);
  console.log("Payload", JSON.stringify(payload.asPayload()));

  const client = new Client(new RESTProvider("http://localhost:9531"));
  //   console.log("AUTHORIZE", await client.createMessage(payload));
}
main().then();
