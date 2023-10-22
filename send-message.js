require("dotenv").config();
const jayson = require("jayson");
const Web3 = require("web3");

const client = jayson.client.tcp({
  host: "127.0.0.1",
  port: "9521",
  version: 1,
});

const web3 = new Web3();

const sender = {
  pubKey: process.env.PUBLIC_KEY,
  privKey: process.env.PRIVATE_KEY,
};

const popularAccount = {
  pubKey: process.env.DISPOSABLE_PUBLIC_KEY,
  privKey: process.env.DISPOSABLE_PRIVATE_KEY,
};

// channel name
let channelName = "ioc-committee";

// channel expires in 15 days
const channelExpiry = Math.floor(Date.now() / 1000) + 15 * 24 * 3600;

// sender address
const senderAddress = sender.pubKey;

// channel for owner signature... channel or wildcard
const channels = "*"; // [channel1, channel2]

// const wildcard = true;

/**
 * there is a channel
 * we have a key pair we are approving to sign channels
 * the main key is signing the channel
 *
 */

// owners will sign and save key pair of - expiry/timestamp,
// public address of the sender and channels(one channel or channels(wild card)
let senderApprovalMessage = [];

senderApprovalMessage.push(`ChannelExpiry:${channelExpiry}`);
// senderApprovalMessage.push(`Wildcard:${wildcard}`);
senderApprovalMessage.push(`Channels:${channels}`);
senderApprovalMessage.push(`SenderAddress:${senderAddress}`);
// senderApprovalMessage.push(`OwnerAddress:${OwnerAddress}`);
senderApprovalMessage = senderApprovalMessage.join(",");

const { signature: senderApprovalSignature } = web3.eth.accounts.sign(
  web3.utils.soliditySha3(senderApprovalMessage),
  sender.privKey
);

const nodeAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const { signature: channelNameSignature } = web3.eth.accounts.sign(
  web3.utils.soliditySha3(channelName.toLowerCase()),
  sender.privKey
);

const timestamp = Date.now().toString() / 1000;
// const from = sender.pubKey;
const receiver = `${channelName}:${channelNameSignature}`;
const platform = "channel";
const type = "html";
const message = "hello world";
const chainId = "1";
const subject = "Test Subject";
const contract = "Contract";
const abi = "Abi";
const action = "Action";
const parameters = ["good", "Jon", "Doe"];
const actions = [{ contract, abi, action, parameters }];
const origin = nodeAddress;
const text = message;
const html = message;

// user should calculate the hash... propagate it to part where it is stored on the ipfs network...
// libraries
// propagating with md5 ...

let chatMessage = [];
chatMessage.push(`Header.Approval:${senderApprovalSignature}`);
chatMessage.push(`Header.Receiver:${receiver}`);
chatMessage.push(`Header.ChainId:${chainId}`);
chatMessage.push(`Header.Platform:${platform}`);
chatMessage.push(`Header.Timestamp:${timestamp}`);
chatMessage.push(
  `Body.Subject:${web3.utils.soliditySha3(subject).toLowerCase()}`
);
chatMessage.push(`Body.Message:${web3.utils.soliditySha3(text).toLowerCase()}`);

let _action = [];
let i = 0;
while (i < actions.length) {
  _action.push(`Actions[${i}].Contract:${actions[i].contract}`);
  _action.push(`Actions[${i}].Abi:${actions[i].abi}`);
  _action.push(`Actions[${i}].Action:${actions[i].action}`);
  let _parameter = [];
  let j = 0;
  while (j < actions[i].parameters.length) {
    _parameter.push(
      `Actions[${i}].Parameters[${j}]:${actions[i].parameters[j]}`
    );
    j++;
  }
  _parameter = _parameter.join(" ");
  _action.push(`Actions[${i}].Parameters:[${_parameter}]`);
  i++;
}
_action = _action.join(" ");
chatMessage.push(`Actions:[${_action}]`);
chatMessage.push(`Origin:${origin}`);
chatMessage = chatMessage.join(",");
console.log("chatMessage:::", chatMessage);

const { signature: messageSignature } = web3.eth.accounts.sign(
  web3.utils.soliditySha3(chatMessage),
  sender.privKey
  //   "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

const params = [
  {
    timestamp: Number(timestamp),
    approval: senderApprovalSignature,
    channelExpiry,
    // wildcard,
    channels,
    senderAddress,
    // ownerAddress,
    receiver,
    platform,
    chainId,
    type,
    message,
    subject,
    signature: messageSignature,
    actions,
    origin,
    messageHash: web3.utils.soliditySha3(message),
    subjectHash: web3.utils.soliditySha3(subject),
  },
];

client.request("RpcService.SendMessage", params, (err, response) => {
  console.log("response:::", response);
  if (err) throw err;
  if (response.error) throw response.error;
  console.log("response:::", response);
});
