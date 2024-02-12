require('dotenv').config();
const jayson = require('jayson');
import { Utils } from '../src/helper';
import { Authorization } from '../src/entities/authorization';
import {
  AuthorizeEventType,
  ClientPayload,
} from '../src/entities/clientPayload';
import { Client, RESTProvider } from '../src';

const client = jayson.client.tcp({
  host: '127.0.0.1',
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
const validator = {
  publicKey: '2c2387845a0e17281653050892d3095e7fc99ad32d79b7fbdf11c9a87671daca',
  address: 'ml:103szmymv8qvl9xqzhqxswm5t8mpjsav8c6j354',
};

const owner = {
  privateKey:
    '47a89d04c9949c5731837b0b247fef1df6f9573c0b8d1f645cfde472371d633dd8cb87c937a309c86f69dea3730b0a8622462ba72c165d50119fefff0e1d882c',
  publicKey: 'd8cb87c937a309c86f69dea3730b0a8622462ba72c165d50119fefff0e1d882c',
  address: 'ml:103szmymv8qvl9xqzhqxswm5t8mpjsav8c6j354',
};

const device = {
  privateKey:
    '0xbc3d5a5a6bb5024b1a96fccb677f065985d8e65d8054095eb6468244fb5ea4a9',
  publicKey:
    '0x02d2c4fa18ba44e53e10d5ec25b6ae8439f3fcaf9611183cdb7785dfe2f0c7ab73',
  address: '0xe652d28F89A28adb89e674a6b51852D0C341Ebe9',
};

async function main() {
  const authority: Authorization = new Authorization();
  console.log('keypairsss', Utils.generateKeyPairSecp());
  console.log(
    'BECH32ADDRESS',
    validator.publicKey,
    Utils.toAddress(Buffer.from(validator.publicKey, 'hex'))
  );
  authority.account = owner.publicKey;
  authority.agent = device.address;
  authority.grantor = owner.publicKey;
  authority.timestamp = 1705392178023;
  authority.topicIds = '*';
  authority.privilege = 3;
  authority.duration = 30 * 24 * 60 * 60 * 1000; // 30 days

  const encoded = authority.encodeBytes();
  console.log('MESSAGE', encoded.toString('hex'));
  authority.signature = Utils.signMessageEdd(
    encoded,
    Buffer.from(owner.privateKey, 'hex')
  );
  console.log('Grant', authority.asPayload());

  const payload: ClientPayload<Authorization> = new ClientPayload();
  payload.data = authority;
  payload.timestamp = 1705392177896;
  payload.eventType = AuthorizeEventType.AuthorizeEvent;
  payload.validator = validator.publicKey;
  const pb = payload.encodeBytes();
  payload.signature = await Utils.signMessageEcc(pb, device.privateKey);
  console.log('Payload', JSON.stringify(payload.asPayload()));

  const client = new Client(new RESTProvider('http://localhost:9531'));
  console.log('AUTHORIZE', await client.authorize(payload));
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
