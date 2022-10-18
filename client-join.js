#!/usr/bin/env node

var WebSocketClient = require('websocket').client;
const Web3 = require("web3");

const web3 = new Web3();


const message = "ICM-SIGNED-MESSAGE";
const signer = "0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc";
const timestamp = Math.floor(Date.now()/1000);
const action = "join";

let sub = [];
sub.push(`Message:${message}`);
sub.push(`Timestamp:${timestamp}`);
sub.push(`Action:${action}`);


const { signature } = web3.eth.accounts.sign(
    web3.utils.soliditySha3(message),
    "73fa35d75a5191e0d29cc260cb0879bc32f7fd3608492e5d5a3e061b48b822c6"
  );








let client = new WebSocketClient();

async function sleepOff() {
    console.log(1);
    await new Promise(r => setTimeout(r, 2000));
    console.log(2);
  }

const _message = {
    signature,
    signer,
    message
}

client.connect("ws://localhost:8088/echo");   

client.on('connect',  function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendSignature() {
        if (connection.connected) {
            connection.send(JSON.stringify(_message));
        }
    }
    sendSignature();
    
});




