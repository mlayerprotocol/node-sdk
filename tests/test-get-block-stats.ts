require("dotenv").config();

import { Client } from '../src';
import { RESTProvider } from '../src/providers/rest';
import { WSProvider } from '../src/providers/ws';

async function main() {
  // const client = new Client(new RESTProvider("http://localhost:9531"));
  // console.log(
  //   'AUTHORIZE-HTTP',
  //   await client.getBlockStats({
  //     params: {},
  //   })
  // );
  const wsClient = new Client(new WSProvider('ws://localhost:9091/ws'));
  const connected = await wsClient.connect();
  console.log('connected!!!');
  if (connected) {
    // console.log(
    //   'BLOCKSTAT-WS',
    //   await wsClient.getNodeInfo({
    //     params: {},
    //   })
    // );

    await wsClient.subscribe(
      {
        '2274aec8-6107-cb4f-5204-de5a9aaedb67': ['*'],
      },
      {
        onError: console.log,
        onReceive: (e) => console.log('RECEIVED', e),
        onSubscribe: (id) => console.log('SUBSCRIPTIONID', id),
      }
    );
  } else {
    console.log('Unable to connect');
  }
  await wsClient.subscribe;
}


main().then();
