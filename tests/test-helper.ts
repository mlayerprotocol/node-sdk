require("dotenv").config();
const jayson = require("jayson");
import { Utils } from "../src/helper";
import { Authorization, SignatureData } from "../src/entities/authorization";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import {
  AuthorizeEventType,
  ClientPayload,
} from "../src/entities/clientPayload";
import { Client, RESTProvider } from "../src";
import { validator, account, agent, agentList } from "./lib/keys";
import { Address } from "../src/entities/address";
const client = jayson.client.tcp({
  host: "127.0.0.1",
  port: 9521,
  version: 1,
});

// console.log(Utils.generateKeyPairEdd());

// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };

async function main() {
  const kp = Utils.generateKeyPairEcc();
  console.log("AUTHORIZE", kp);
}
main().then();
