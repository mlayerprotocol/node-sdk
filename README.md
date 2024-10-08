# mLayer node sdk

- Node SDK for interacting with the mLayer protocol
- Learn more at [https://www.mlayer.network](https://www.mlayer.network).


## Install

```typescript
yarn add @mlayerprotocol/core
```

## Rest client

```typescript
// browser based import
import {
  Client,
  Message,
  RESTProvider,
  Events,
} from '@mlayerprotocol/core/browser';

// nodejs backend based import
// import { Client, Message, RESTProvider, WSProvider,  Events} from '@mlayerprotocol/core';

const validatorHttpApi = 'http://localhost:9531'; // replace with valid api url
const client = new Client(new RESTProvider(validatorHttpApi));
try {
  console.log('Node Info', await client.getNodeInfo());

  console.log(
    'AUTHORIZE-HTTP',
    await client.getBlockStats({
      params: {},
    })
  );
} catch (e) {
  console.log('EEEEEE', e.message);
}
```

## Websocket client

```typescript
// browser based import
import {
  Client,
  Message,
  WSProvider,
  Events,
} from '@mlayerprotocol/core/browser';
// nodejs backend based import
// import { Client, Message, RESTProvider, WSProvider,  Events} from '@mlayerprotocol/core';

const wsUrl = 'ws://localhost:9091/ws'; // replace with valid api url
const wsClient = new Client(new WSProvider(wsUrl)); //initialize client
const connected = await wsClient.connect();
if (connected) {
  try {
    console.log('Node Info', await wsClient.getNodeInfo());
    const subnetId = '2274aec8-6107-cb4f-5204-de5a9aaedb67';
    const topicId = 'f0b7be5f-3e70-0a05-6f04-797462ec3e61';

    await wsClient.subscribe(
      {
        [subnetId]: [
          'snet',
          'auth',
          'sub',
          'top',
          'msg',
          topicId, // specify topic id to subscribe to specific topic
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
  } catch (e) {
    console.log('Error', e.message);
  }
}
```
