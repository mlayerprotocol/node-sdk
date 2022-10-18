const jayson = require("jayson");
const Web3 = require("web3");
const client = jayson.client.tcp({
  host: "127.0.0.1",
  port: "9521",
  version: 1,
});

const web3 = new Web3();


const channel = "Channel One";
const subscriber = "0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc";
const sender = "0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc";
const timestamp = Math.floor(Date.now()/1000);
const action = "join";

let sub = [];
sub.push(`Channel:${channel}`);
sub.push(`Timestamp:${timestamp}`);
sub.push(`Action:${action}`);

const message = sub.join(",");
const { signature } = web3.eth.accounts.sign(
    web3.utils.soliditySha3(message),
    "73fa35d75a5191e0d29cc260cb0879bc32f7fd3608492e5d5a3e061b48b822c6"
  );



const subscription = [
  {
    channel,
    subscriber,
    sender,
    timestamp,
    signature,
    action,
    // action: "leave", "join"
  },
];
client.request("RpcService.Subscription", subscription, (err, response) => {
  if (err) throw err;
  console.log('response', response)
  if (response.error) throw response.error;
});