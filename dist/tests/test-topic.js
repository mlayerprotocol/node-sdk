"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const jayson = require('jayson');
const helper_1 = require("../src/helper");
const clientPayload_1 = require("../src/entities/clientPayload");
const src_1 = require("../src");
const keys_1 = require("./lib/keys");
const topic_1 = require("../src/entities/topic");
// console.log(Utils.generateKeyPairEdd());
// const owner = {
//   privateKey:
//     '524324bf5d8d62add5b5980a4fded961bd72fd69469bb36a4aaf1f2c7ec8dc39',
//   publicKey:
//     '02ebec9d95769bb3d71712f0bf1e7e88b199fc945f67f908bbab81e9b7cb1092d8',
//   address: 'ml:12htc66jeelcfm4nv7drk4dqz6umntcfe690725',
// };
async function main() {
    const topic = new topic_1.Topic();
    //console.log('keypairsss', Utils.generateKeyPairSecp());
    // console.log(
    //   'BECH32ADDRESS',
    //   validator.publicKey,
    //   Utils.toAddress(Buffer.from(validator.publicKey, 'hex'))
    // );
    topic.handle = 'bitcoinworld';
    topic.description = 'The best toopic';
    topic.name = 'Bitcoin world';
    topic.reference = '898989';
    const payload = new clientPayload_1.ClientPayload();
    payload.data = topic;
    payload.timestamp = 1705392177896;
    payload.eventType = clientPayload_1.AdminTopicEventType.CreateTopic;
    payload.validator = keys_1.validator.publicKey;
    payload.account = keys_1.account.publicKey;
    payload.nonce = 0;
    const pb = payload.encodeBytes();
    console.log('HEXDATA', pb.toString('hex'));
    payload.signature = await helper_1.Utils.signMessageEcc(pb, keys_1.agent.privateKey);
    console.log('Payload', JSON.stringify(payload.asPayload()));
    const client = new src_1.Client(new src_1.RESTProvider('http://localhost:9531'));
    console.log('AUTHORIZE', await client.createTopic(payload));
}
main().then();
//0995acea8e015b25c930eb2170c462ca5cd2aafbe4012e7cdc487c822d78216300000000000003e9d8cb87c937a309c86f69dea3730b0a8622462ba72c165d50119fefff0e1d882c2c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018d114b82e8 
//0995acea8e015b25c930eb2170c462ca5cd2aafbe4012e7cdc487c822d78216300000000000003e9d8cb87c937a309c86f69dea3730b0a8622462ba72c165d50119fefff0e1d882c2c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca00000000000000000000018d114b82e8
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