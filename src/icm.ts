import Jayson from "jayson"
import Web3 from "web3";
import {Account} from "web3-core";
var WebSocketClient = require('websocket').client;


export interface Client extends Jayson.TcpClientOptions {

}

export type SubscriptionActionType = 'join'|'leave';

export interface Subscription{
  channel: string,
  channelName: string,
  subscriber: string,
  timestamp: number,
  signature: string,
  action: SubscriptionActionType
}

export interface NewSubscriptionParam{
  channelName:string, 
  channelSignature:string, 
  action?:SubscriptionActionType
}


export interface Message{
  timestamp: number,
  receiver: string,
  platform: string,
  chainId: string,
  type: string,
  message: string,
  subject: string,
  signature: string,
  actions: MessageAction[],
  origin: string,
  messageHash: string,
  subjectHash:  string,
}

export interface MessageAction{
  contract: string,
  abi: string,
  action: string,
  parameters: string[],
}
export interface NewMessageParam{
  channelName:string, 
  channelSignature:string, 

  platform?: string,
  type?: string,
  chainId: string,
  message: string,
  subject: string,
  abi: string,
  parameters: string[],
  actions: MessageAction[],
  origin: string,
}

export interface SetupSocket{
  privateKey: string;
  socketServer?: string;
  socketPort?: string;
}




export class Icm{
  private client: Jayson.TcpClient | undefined;
  private web3: Web3 = new Web3();;
  private socketClient: any;
  public activeConnection: any;
  public socketServer?: string;
  public socketPort?: string;
  public tmpAccount?: {
    signer: string,
    timestamp: number,
    signature: string,
  };

  public socketMessageCallback? :  (message:any)=>void;

  public disposableAccount?: Account;


  constructor(config: Jayson.TcpClientOptions | undefined){
    if(config) this.client = Jayson.client.tcp(config);
  }
  /**
   * subscribe
   */

   public initializeRpc(config: Jayson.TcpClientOptions ) {
    this.client = Jayson.client.tcp(config);
  }

  public subscribe(subscription: Subscription, callback: Jayson.JSONRPCCallbackType | undefined ) {
    if(!this.client){
      throw new Error("Client Not Initialize");
      
    }
    this.client.request("RpcService.Subscription", [subscription], callback);
  }

  /**
   * newSubscription
   */
  public newSubscription({channelName, channelSignature, action = 'join'}:NewSubscriptionParam, privateKey:string) : Subscription {
    const timestamp = Math.floor(Number(Date.now().toString()) / 1000);
    let sub = [];
    sub.push(`Channel:${channelSignature}`);
    sub.push(`ChannelName:${channelName}`);
    sub.push(`Timestamp:${timestamp}`);
    sub.push(`Action:${action}`);
    const subString : string = sub.join(",");
    const { signature } = this.web3.eth.accounts.sign(
      this.web3.utils.soliditySha3(subString)??'',
      privateKey
    );
    const _sub : Subscription = {
      channel:channelSignature,
      channelName,
      subscriber: this.web3.eth.accounts.privateKeyToAccount(privateKey).address,
      timestamp,
      signature,
      action
    }
    console.log('new Sub', _sub)
    return _sub
  }


  public newChannel(channelName: string, privateKey:string) : string {
    if(channelName.length == 0){
      throw new Error("Channel Name can not be empty");
      
    }
    const { signature } = this.web3.eth.accounts.sign(
      this.web3.utils.soliditySha3(channelName.toLowerCase())??'',
      privateKey
    );
    return signature
  }

  /**
   * sendMessage
   */
   public sendMessage(message: Message, callback: Jayson.JSONRPCCallbackType | undefined ) {
    if(!this.client){
      throw new Error("Client Not Initialize");
      
    }
    this.client.request("RpcService.SendMessage", [message], callback);
  }

  /**
   * newMessage
   */
   public newMessage(
      { channelName, channelSignature, chainId, 
        message, subject, actions, origin,
        platform="channel",
        type="html",
        ...params
      }:NewMessageParam, 
      privateKey:string) : Message {
    const receiver = `${channelName}:${channelSignature}`;
    const text = message;
    const timestamp = Number(Date.now().toString());
    let chatMessage = [];
    // chatMessage.push(`Header.Sender:${from}`);
    chatMessage.push(`Header.Receiver:${receiver}`);
    chatMessage.push(`Header.ChainId:${chainId}`);
    chatMessage.push(`Header.Platform:${platform}`);
    chatMessage.push(`Header.Timestamp:${timestamp}`);
    chatMessage.push(
      `Body.Subject:${this.web3.utils.soliditySha3(subject)?.toLowerCase()}`
    );
    chatMessage.push(`Body.Message:${this.web3.utils.soliditySha3(text)?.toLowerCase()}`);

    let _action = [];
    let i = 0;
    while (i < actions.length) {
      _action.push(`Actions[${i}].Contract:${actions[i].contract}`);
      _action.push(`Actions[${i}].Abi:${actions[i].abi}`);
      _action.push(`Actions[${i}].Action:${actions[i].action}`);
      const _parameter = [];
      let j = 0;
      while (j < actions[i].parameters.length) {
        _parameter.push(
          `Actions[${i}].Parameters[${j}]:${actions[i].parameters[j]}`
        );
        j++;
      }
      const _parameterText = _parameter.join(" ");
      _action.push(`Actions[${i}].Parameters:[${_parameterText}]`);
      i++;
    }
    const _actionText = _action.join(" ");
    chatMessage.push(`Actions:[${_actionText}]`);
    chatMessage.push(`Origin:${origin}`);
    const chatMessageText = chatMessage.join(",");
    console.log("chatMessage:::", chatMessageText);
    // params.push(`Actions.Sender:${from}`)
    // params.push(`Body.Sender:${from}`)
    const { signature: messageSignature } = this.web3.eth.accounts.sign(
      this.web3.utils.soliditySha3(chatMessageText)??'',
      privateKey
      //   "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );
    const _message : Message  = 
      {
        timestamp,
        receiver,
        platform,
        chainId,
        type,
        message,
        subject,
        signature: messageSignature,
        actions,
        origin,
        messageHash: this.web3.utils.soliditySha3(message)??'',
        subjectHash: this.web3.utils.soliditySha3(subject)??'',
      }
    ;
    console.log('new _message', _message)
    return _message
  }

  public setupSocket({privateKey, socketServer, socketPort}:SetupSocket) {
    this.disposableAccount = this.web3.eth.accounts.create();
    this.socketServer = socketServer;
    this.socketPort = socketPort;
    
    const timestamp = Math.floor(Date.now()/1000);
    
    const disposableAccountMsg = `PubKey:${this.disposableAccount.address},Timestamp:${timestamp}`//
    const { signature } = this.web3.eth.accounts.sign(
        this.web3.utils.soliditySha3(disposableAccountMsg)??'',
        privateKey
    );
    const signer = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
    this.tmpAccount = {
      signer,
      timestamp,
      signature,
    };
    const _message = {
        signature,
        signer,
        message: this.disposableAccount.address,
        timestamp,
    
    }
    
    this.socketClient = new WebSocketClient({
        closeTimeout: 50000
    });
    
    
    
    this.socketClient.on('connectFailed', function(error:any) {
        console.log('Connect Error: ' + error);
    });
    
    this.socketClient.on('connect',  (connection:any) => {
        this.activeConnection = connection;
        console.log('WebSocket Client Connected');
        connection.on('error', function(error:any) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', this.handleMessage);
        
        function sendSignature() {
            if (connection.connected) {
                connection.send(JSON.stringify({
                    type:'handshake',
                    data:_message,
                    signature,
                }));
            }
        }
        sendSignature();
        
    });
  }

  private handleMessage = (message:any) => {
      console.log("message", typeof message);
      if (message.type === 'utf8') {
          try {
              let _message = JSON.parse(message.utf8Data);
              console.log("Received: ", _message);

              switch (_message.type??'') {
                  case 'new-message':
                      _message = _message.data
                      const _proof:any = {
                          messageSignature: _message.senderSignature,
                          // messageSender: tmpAccount.pubKey,
                          tmpAccount: this.tmpAccount,
                          node: _message.message.origin,
                          timestamp: Math.floor(Date.now()/1000),
                      }
                      const _proofSignatureBody = `Message:${_proof.messageSignature},NodeAddress:${_proof.node},Timestamp:${_proof.timestamp}`;
                      console.log("_proofSignatureBody: ", _proofSignatureBody);
                      
                      const { signature:_signature } = this.web3.eth.accounts.sign(
                          this.web3.utils.soliditySha3(_proofSignatureBody)??'',
                          this.disposableAccount?.privateKey??''
                      );
                      _proof['signature'] = _signature;
                      console.log('_proof', _proof)
                      if (this.activeConnection.connected) {
                          this.activeConnection.send(JSON.stringify(
                              {
                                  type:'delivery-proof',
                                  data:_proof,
                                  signature:this.tmpAccount?.signature,
                              }
                          ));
                      }
                      break;
              
                  default:
                      this.socketMessageCallback?.(message)
                      break;
              }
              

              

          } catch (error) {
              console.log("error: ", error);
          }
      }
  }

  /**
   * listen
   */
  public listen(socketMessageCallback?:(message:any)=>void) {
    if(!this.socketClient){
      throw new Error("Web Socket Not Initialize");
      
    }
    this.socketMessageCallback = socketMessageCallback;
    const url = `${this.socketServer}:${this.socketPort}`;
    this.socketClient.connect(url);
  }


}




// module.exports = Icm;