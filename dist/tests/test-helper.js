"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jayson = require("jayson");
const helper_1 = require("../src/helper");
const client = jayson.client.tcp({
    host: "127.0.0.1",
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
async function main() {
    const kp = helper_1.Utils.generateKeyPairEcc();
    console.log("AUTHORIZE", kp);
}
main().then();
