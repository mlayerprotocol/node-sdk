"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const src_1 = require("../src");
async function main() {
    const client = new src_1.Client(new src_1.RESTProvider("http://localhost:9531"));
    console.log("AUTHORIZE", await client.getMainStats({
        params: {},
    }));
}
main().then();
