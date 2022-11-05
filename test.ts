import {Icm, Client} from "./src/icm"

const sender = {
  pubKey: '0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc',
  privKey: '73fa35d75a5191e0d29cc260cb0879bc32f7fd3608492e5d5a3e061b48b822c6',
};

let receiver = {
  pubKey: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  privKey: "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
}

let channelName = "ioc-committee",
  channelSignature="0xdd472dbfbf9514af5c79062ba6f800d33bd53f84b4650ecd0258528fa8e8361d499bef085716aad50c3062d4c80a3edf7a547477a3b040819e44d466e8739d491c"
  ;
const _client : Client = {
  host: "127.0.0.1",
  port: 9521,
  version: 1,
};
const _icm = new Icm(_client)
// _icm.subscribe(_icm.newSubscription({
//   channelName,
//   channelSignature
// }, receiver.privKey), (err:any, response:any) => {
//   if (err) throw err;
//   console.log("response", response);
//   if (response.error) throw response.error;
// })

const nodeAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const contract = "Contract";


const platform = "channel";
const type = "html";
const message = "hello world";
const chainId = "1";
const subject = "Test Subject";

const abi = "Abi";
const action = "Action";
const parameters = ["good", "Jon", "Doe"];
const actions = [{ contract, abi, action, parameters }];
const origin = nodeAddress;
// _icm.sendMessage(_icm.newMessage({
//   channelName,
//   channelSignature,

//   platform,
//   type,
//   message,
//   chainId,
//   abi,
//   parameters,
//   origin,
//   subject,
//   actions,

// }, sender.privKey), (err:any, response:any) => {
//   console.log("response:::", response);
//   if (err) throw err;
//   if (response.error) throw response.error;
//   console.log("response:::", response);
// })

_icm.setupSocket(receiver.privKey);
_icm.listen();