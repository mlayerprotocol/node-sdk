require('dotenv').config();

import { Client, Message } from '../index';
import { RESTProvider } from '../index';
import { WSProvider } from '../index';
import { Events } from '../src/entities/event';
// import { WSProvider } from '../dist';

async function main() {
  const client = new Client(new RESTProvider('http://localhost:9531'));
  try {
    console.log(
      'AUTHORIZE-HTTP',
      await client.getNodeInfo({
        params: {},
      })
    );
  } catch (e) {
    console.log('EEEEEE', e.message);
  }
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

    const topicId = 'f0b7be5f-3e70-0a05-6f04-797462ec3e61';
    await wsClient.subscribe(
      {
        '2274aec8-6107-cb4f-5204-de5a9aaedb67': [
          // 'snet',
          // 'auth',
          // 'sub',
          // 'top',
          // 'msg',
          topicId,
        ],
      },
      {
        onError: console.log,
        onReceive: (msg) => {
          const event = Events.fromPayload(msg.event);
          if (msg.event.modelType == topicId) {
            const sentMessage = event.payload?.data as Message; // if listening to
            console.log(sentMessage.data); // this is the message body
          }
        },
        onSubscribe: (id) => console.log('SUBSCRIPTIONID', id),
      }
    );
  } else {
    console.log('Unable to connect');
  }
  await wsClient.subscribe;
}

main().then();
