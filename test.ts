import {Icm, Client} from "./index"

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
_icm.subscribe(_icm.newSubscription({
  channelName,
  channelSignature
}, receiver.privKey), (err:any, response:any) => {
  if (err) throw err;
  console.log("response", response);
  if (response.error) throw response.error;
})