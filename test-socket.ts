import {Icm, Client} from "./src/icm"
const _client : Client = {
  host: "127.0.0.1",
  port: 9521,
  version: 1,
};
let receiver = {
  pubKey: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  privKey: "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
}
const socketServer = 'ws://127.0.0.1'
const socketPort = '8088'


async function run() {
  const _icm = new Icm(_client)
  await _icm.setupSocket({
    privateKey: receiver.privKey,
    socketServer,
    socketPort,
  });
}

run()