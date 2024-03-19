"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const icm_1 = require("../src/icm");
const sender = {
    pubKey: '0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc',
    privKey: '73fa35d75a5191e0d29cc260cb0879bc32f7fd3608492e5d5a3e061b48b822c6',
};
let channelName = 'ioc-committee', channelSignature = '0xdd472dbfbf9514af5c79062ba6f800d33bd53f84b4650ecd0258528fa8e8361d499bef085716aad50c3062d4c80a3edf7a547477a3b040819e44d466e8739d491c';
const nodeAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const contract = 'Contract';
const platform = 'channel';
const type = 'html';
const message = 'hello world';
const chainId = '1';
const subject = 'Test Subject';
const abi = 'Abi';
const action = 'Action';
const parameters = ['good', 'Jon', 'Doe'];
const actions = [{ contract, abi, action, parameters }];
const origin = nodeAddress;
const param = {
    channelName,
    channelSignature,
    platform,
    type,
    message,
    chainId,
    abi,
    parameters,
    origin,
    subject,
    actions,
};
async function run() {
    const _client = {
        host: '127.0.0.1',
        port: 9521,
        version: 1,
    };
    const _icm = new icm_1.Icm(_client);
    const _sendParam = await _icm.newMessage(param, sender.privKey);
    _icm.sendMessage(_sendParam, (err, response) => {
        console.log('response:::', response);
        if (err)
            throw err;
        if (response.error)
            throw response.error;
        console.log('response:::', response);
    });
}
run();
