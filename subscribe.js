require("dotenv").config();
const jayson = require("jayson");
const Web3 = require("web3");
const client = jayson.client.tcp({
  host: "127.0.0.1",
  port: "9521",
  version: 1,
});

let sender = {
  pubKey: process.env.PUBLIC_KEY,
  privKey: process.env.PRIVATE_KEY,
};
let receiver = {
  pubKey: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
  privKey: "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
}

const web3 = new Web3();

let channelName = "ioc-committee",
  subscriber = receiver.pubKey,
  timestampSub = Math.floor(Number(Date.now().toString()) / 1000),
  actionSub = "join";

const { signature: channelSignature } = web3.eth.accounts.sign(
  web3.utils.soliditySha3(channelName.toLowerCase()),
  sender.privKey
);
let sub = [];
sub.push(`Channel:${channelSignature}`);
sub.push(`ChannelName:${channelName}`);
sub.push(`Timestamp:${timestampSub}`);
sub.push(`Action:${actionSub}`);
sub = sub.join(",");
const { signature: signSub } = web3.eth.accounts.sign(
  web3.utils.soliditySha3(sub),
  receiver.privKey
);

// sign channel name
console.log("sub:::", sub);
console.log("signSub:::", signSub);

const subscription = [
  {
    channel: channelSignature,
    channelName,
    subscriber,
    timestamp: timestampSub,
    signature: signSub,
    action: actionSub,
    // action: "leave"
  },
];
client.request("RpcService.Subscription", subscription, (err, response) => {
  if (err) throw err;
  console.log("response", response);
  if (response.error) throw response.error;
});

