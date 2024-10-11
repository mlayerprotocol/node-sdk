require("dotenv").config();

import { Client, Message, RPCProvider } from "../index";
import { RESTProvider } from "../index";
import { WSProvider } from "../index";
import { Events } from "../src/entities/event";
// import { WSProvider } from '../dist';

async function main() {
  // const client = new Client(new RESTProvider('http://localhost:9531'));
  // try {
  //   console.log(
  //     'AUTHORIZE-HTTP',
  //     await client.getBlockStats({
  //       params: {},
  //     })
  //   );
  // } catch (e) {
  //   console.log('EEEEEE', e.message);
  //}
  const wsClient = new Client(new WSProvider(process.env.WEBSOCKET_URL));
  const connected = await wsClient.connect();
  console.log("connected!!!");
  if (connected) {
    // console.log(
    //   'BLOCKSTAT-WS',
    //   await wsClient.getNodeInfo({
    //     params: {},
    //   })
    // );

    const topicId = "9ec7d174-d9dd-7151-5295-f3751a20be9b";
    await wsClient.subscribe(
      {
        "15ee1c23-115d-9b6f-c005-db154b42781c": [
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
        onReceive: async (msg) => {
          const event = Events.fromPayload(msg.event);
          if (msg.event.modelType == "msg" && msg.event.topic == topicId) {
            const sentMessage = (event.payload as any).d; // if listening to
            console.log(Buffer.from(sentMessage.d, "hex").toString()); // this is the message body
            const client = new Client(
              new RESTProvider(process.env.MIDDLEWARE_HTTP)
            );
            await client.saveGamePoints(event);
          }
        },
        onSubscribe: (id) => console.log("SUBSCRIPTIONID", id),
      }
    );
  } else {
    console.log("Unable to connect");
  }
  await wsClient.subscribe;
}

main().then();
