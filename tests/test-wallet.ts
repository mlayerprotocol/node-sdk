require("dotenv").config();
const jayson = require("jayson");
import { Utils } from "../src/helper";
import { Authorization } from "../src/entities/authorization";
import {
  AdminWalletEventType,
  // AdminWalletEventType,
  AuthorizeEventType,
  ClientPayload,
} from '../src/entities/clientPayload';
import { Client, RESTProvider } from "../src";
import { validator, account, agent, agentList } from "./lib/keys";
import { Address } from "../src/entities/address";
import { Wallet } from '../src/entities/wallet';

// console.log(Utils.generateKeyPairEdd());

// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };

async function main() {
  const wallet: Wallet = new Wallet();
  //console.log('keypairsss', Utils.generateKeyPairSecp());
  // console.log(
  //   'BECH32ADDRESS',
  //   validator.publicKey,
  //   Utils.toAddress(Buffer.from(validator.publicKey, 'hex'))
  // );



  wallet.name = 'New Network';
  wallet.subnet = 'c870ce77c41a36f1fc60966c8c4e111964a32af400e7d9cbe78ac9117d4e0cdb';

  const payload: ClientPayload<Wallet> = new ClientPayload();
  payload.data = wallet;
  payload.timestamp = 1705392178023;
  payload.eventType = AdminWalletEventType.CreateWallet;
  payload.validator = validator.publicKey;
  payload.account = Address.fromString(agentList[0].account.address);
  payload.nonce = 0;
  const pb = payload.encodeBytes();
  console.log("HEXDATA", pb.toString("hex"));
  payload.signature = await Utils.signMessageEcc(pb, agentList[0].privateKey);
  console.log("Payload", JSON.stringify(payload.asPayload()));

  const client = new Client(new RESTProvider("http://localhost:9531"));
  console.log('AUTHORIZE', await client.createWallet(payload));
}
main().then();
