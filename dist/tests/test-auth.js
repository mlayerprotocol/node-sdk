"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jayson = require("jayson");
const helper_1 = require("../src/helper");
const authorization_1 = require("../src/entities/authorization");
const clientPayload_1 = require("../src/entities/clientPayload");
const keys_1 = require("./lib/keys");
const address_1 = require("../src/entities/address");
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
    const authority = new authorization_1.Authorization();
    console.log("keypairsss", helper_1.Utils.generateKeyPairSecp());
    console.log("BECH32ADDRESS", keys_1.validator.publicKey, helper_1.Utils.toAddress(Buffer.from(keys_1.validator.publicKey, "hex")));
    authority.account = address_1.Address.fromString(keys_1.agentList[0].account.address);
    authority.agent = keys_1.agent.address;
    authority.grantor = address_1.Address.fromString(keys_1.agentList[0].account.address);
    authority.timestamp = 1709115075000;
    authority.topicIds = "*";
    authority.privilege = 3;
    authority.duration = 30 * 24 * 60 * 60 * 1000; // 30 days
    const encoded = authority.encodeBytes();
    const hash = helper_1.Utils.sha256Hash(encoded).toString("base64");
    console.log("Hash string", `Approve ${authority.agent} for tml: ${hash}`);
    const authSig = "juYiOV/ZOIS3AEBunyl5FLGTTTHOzliZKJeQHW8ZMCEpbHJMecWHWTD612D0kHO5m/BRTUPSSZwJgmFp6wb+gg==";
    authority.signatureData = new authorization_1.SignatureData("tendermint/PubKeySecp256k1", keys_1.agentList[0].publicKey, authSig);
    // authority.signatureData = Utils.signMessageEdd(
    //   encoded,
    //   Buffer.from(owner.privateKey, 'hex')
    // );
    // const privKBuff = Buffer.from(account.privateKey);
    // // const pubk = secp256k1.getPublicKey(account.privateKey, true);
    // const pubKeyBuffer = Buffer.from(account.publicKey, 'hex');
    // const address = Utils.toAddress(pubKeyBuffer, 'cosmos');
    // const signature = await Utils.signAminoSecp(
    //   Buffer.from('helloworld', 'ascii'),
    //   privKBuff,
    //   address
    // );
    // console.log('SIGNATURE', {
    //   publicKey: pubKeyBuffer.toString('base64'),
    //   address,
    //   signature: signature.toString('base64'),
    // });
    console.log("Grant", authority.asPayload());
    const payload = new clientPayload_1.ClientPayload();
    payload.data = authority;
    payload.timestamp = 2705392177899;
    payload.eventType = clientPayload_1.AuthorizeEventType.AuthorizeEvent;
    payload.validator = keys_1.validator.publicKey;
    const pb = payload.encodeBytes();
    payload.signature = await helper_1.Utils.signMessageEcc(pb, keys_1.agentList[0].privateKey);
    console.log("Payload", JSON.stringify(payload.asPayload()));
    // const client = new Client(new RESTProvider("http://localhost:9531"));
    // console.log("AUTHORIZE", await client.authorize(payload));
}
main().then();
// approve device
// create a topic
// let topicName = 'ioc-committee',
//   timestampSub = Math.floor(Number(Date.now().toString()) / 1000);
// const { signature: channelSignature } = web3.eth.accounts.sign(
//   web3.utils.soliditySha3(channelName.toLowerCase()),
//   sender.privKey
// );
// let sub = [];
// sub.push(`Channel:${channelSignature}`);
// sub.push(`ChannelName:${channelName}`);
// sub.push(`Timestamp:${timestampSub}`);
// sub.push(`Action:${actionSub}`);
// sub = sub.join(',');
// const { signature: signSub } = web3.eth.accounts.sign(
//   web3.utils.soliditySha3(sub),
//   'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
// );
// // sign channel name
// console.log('sub:::', sub);
// console.log('signSub:::', signSub);
// const subscription = [
//   {
//     channel: channelSignature,
//     channelName,
//     subscriber,
//     timestamp: timestampSub,
//     signature: signSub,
//     action: actionSub,
//     // action: "leave"
//   },
// ];
// client.request('RpcService.Subscription', subscription, (err, response) => {
//   if (err) throw err;
//   console.log('response', response);
//   if (response.error) throw response.error;
// });
// const timestamp = Date.now().toString();
// // const from = sender.pubKey;
// const receiver = `${channelName}:${channelSignature}`;
// const platform = 'channel';
// const type = 'html';
// const message = 'hello world';
// const chainId = '1';
// const subject = 'Test Subject';
// const contract = 'Contract';
// const abi = 'Abi';
// const action = 'Action';
// const parameters = ['good', 'Jon', 'Doe'];
// const actions = [{ contract, abi, action, parameters }];
// const origin = sender.pubKey;
// const text = message;
// const html = message;
// // user should calculate the hash... propagate it to part where it is stored on the ipfs network...
// // libraries
// // propagating with md5 ...
// let chatMessage = [];
// // chatMessage.push(`Header.Sender:${from}`);
// chatMessage.push(`Header.Receiver:${receiver}`);
// chatMessage.push(`Header.ChainId:${chainId}`);
// chatMessage.push(`Header.Platform:${platform}`);
// chatMessage.push(`Header.Timestamp:${timestamp}`);
// chatMessage.push(
//   `Body.Subject:${web3.utils.soliditySha3(subject).toLowerCase()}`
// );
// chatMessage.push(`Body.Message:${web3.utils.soliditySha3(text).toLowerCase()}`);
// let _action = [];
// let i = 0;
// while (i < actions.length) {
//   _action.push(`Actions[${i}].Contract:${actions[i].contract}`);
//   _action.push(`Actions[${i}].Abi:${actions[i].abi}`);
//   _action.push(`Actions[${i}].Action:${actions[i].action}`);
//   let _parameter = [];
//   let j = 0;
//   while (j < actions[i].parameters.length) {
//     _parameter.push(
//       `Actions[${i}].Parameters[${j}]:${actions[i].parameters[j]}`
//     );
//     j++;
//   }
//   _parameter = _parameter.join(' ');
//   _action.push(`Actions[${i}].Parameters:[${_parameter}]`);
//   i++;
// }
// _action = _action.join(' ');
// chatMessage.push(`Actions:[${_action}]`);
// chatMessage.push(`Origin:${origin}`);
// chatMessage = chatMessage.join(',');
// console.log('chatMessage:::', chatMessage);
// // params.push(`Actions.Sender:${from}`)
// // params.push(`Body.Sender:${from}`)
// const { signature: messageSignature } = web3.eth.accounts.sign(
//   web3.utils.soliditySha3(chatMessage),
//   sender.privKey
//   //   "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
// );
// const params = [
//   {
//     timestamp: Number(timestamp),
//     // from,
//     receiver,
//     platform,
//     chainId,
//     type,
//     message,
//     subject,
//     signature: messageSignature,
//     actions,
//     origin,
//   },
// ];
// client.request('RpcService.SendMessage', params, (err, response) => {
//   console.log('response:::', response);
//   if (err) throw err;
//   if (response.error) throw response.error;
//   console.log('response:::', response);
// });
