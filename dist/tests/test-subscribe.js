"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const icm_1 = require("../src/icm");
const sender = {
    pubKey: '0x5c7983dd79A4461Bc2e9AeAdD9364a41D49A64dc',
    privKey: '73fa35d75a5191e0d29cc260cb0879bc32f7fd3608492e5d5a3e061b48b822c6',
};
let receiver = {
    pubKey: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
    privKey: '7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
};
let channelName = 'ioc-committee', channelSignature = '0xdd472dbfbf9514af5c79062ba6f800d33bd53f84b4650ecd0258528fa8e8361d499bef085716aad50c3062d4c80a3edf7a547477a3b040819e44d466e8739d491c';
const _client = {
    host: '127.0.0.1',
    port: 9521,
    version: 1,
};
async function run() {
    const _icm = new icm_1.Icm(_client);
    const param = {
        channelName,
        channelSignature,
    };
    const _subParam = await _icm.newSubscription(param, receiver.privKey);
    _icm.subscribe(_subParam, (err, response) => {
        if (err)
            throw err;
        console.log('response', response);
        if (response.error)
            throw response.error;
    });
}
run();
