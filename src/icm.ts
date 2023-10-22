import Jayson from "jayson"
import Web3 from "web3";
import {Account, provider} from "web3-core";
import {w3cwebsocket} from "websocket";



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

  approval?: string
}

export interface SetupSocket{
  privateKey?: string;
  socketServer?: string;
  socketPort?: string;
  socketMessageCallback?:(message:any)=>void
}

export interface SetupSocketResponse{
  tmpAccount:Account
}

export interface ApproveSender{
  expiry: string;
  channels: string[]|'*';
  sender: string;
}




export class Icm{
  private client: Jayson.TcpClient | undefined;
  private web3: Web3 = new Web3();
  public provider?: any;
  private socketClient?: w3cwebsocket;
  
  public socketServer?: string;
  public socketPort?: string;
  
  public tmpAccount?: {
    signer: string,
    timestamp: number,
    signature: string,
  };

  public socketMessageCallback? :  (message:any)=>void;

  public disposableAccount?: Account;


  constructor(config: Jayson.TcpClientOptions | undefined, provider?: provider){
    if(config) this.client = Jayson.client.tcp(config);
    if(provider){
      this.provider = provider;
      this.web3 = new Web3(provider);
    }
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
  public async newSubscription({channelName, channelSignature, action = 'join'}:NewSubscriptionParam, privateKey?:string) : Promise<Subscription> {
    const timestamp = Math.floor(Number(Date.now().toString()) / 1000);
    let sub = [];
    sub.push(`Channel:${channelSignature}`);
    sub.push(`ChannelName:${channelName}`);
    sub.push(`Timestamp:${timestamp}`);
    sub.push(`Action:${action}`);
    const subString : string = sub.join(",");
    const signature = await this.signData(subString, privateKey)
    let subscriber = '';
    if(privateKey){
      subscriber = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
    }else{
      const from = await this.web3.eth.getAccounts();
      if(from.length == 0) throw new Error("No account found");
      subscriber = from[0];
    }
    
    const _sub : Subscription = {
      channel:channelSignature,
      channelName,
      subscriber,
      timestamp,
      signature,
      action
    }
    console.log('new Sub', _sub)
    return _sub
  }



  public async newChannel(channelName: string, privateKey?:string) : Promise<string> {
    return await this.signData(channelName.toLowerCase(), privateKey);
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
   public async newMessage(
      { channelName, channelSignature, chainId, 
        message, subject, actions, origin,
        platform="channel",
        type="html",
        approval,
        ...params
      }:NewMessageParam, 
      privateKey?:string) : Promise<Message> {
    const receiver = `${channelName}:${channelSignature}`;
    const text = message;
    const timestamp = Number(Date.now().toString());
    let chatMessage = [];
    if(approval){
      chatMessage.push(`Header.Approval:${approval}`);
    }
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
    const messageSignature = await this.signData(chatMessageText, privateKey)
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

  public async setupSocket({privateKey, socketServer, socketPort, socketMessageCallback}:SetupSocket) :Promise<SetupSocketResponse> {
    this.disposableAccount = this.web3.eth.accounts.create();
    this.socketServer = socketServer;
    this.socketPort = socketPort;
    this.socketMessageCallback = socketMessageCallback;
    
    const timestamp = Math.floor(Date.now()/1000);
    
    const disposableAccountMsg = `PubKey:${this.disposableAccount.address},Timestamp:${timestamp}`//
    const signature = await this.signData(disposableAccountMsg, privateKey)
    let signer = '';
    if(privateKey){
      signer = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
    }else{
      const from = await this.web3.eth.getAccounts();
      if(from.length == 0) throw new Error("No account found");
      signer = from[0];
    }

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


    const url = `${this.socketServer}:${this.socketPort}`;
    
    
    this.socketClient = new w3cwebsocket(url);

    this.socketClient.onerror = function() {
        console.log('Connection Error');
    };
    const client = this.socketClient
    this.socketClient.onopen = function() {
        console.log('WebSocket Client Connected');
        const sendSignature = () =>{
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify({
                    type:'handshake',
                    data:_message,
                    signature,
                }));
            }
        }
        sendSignature();
    };

    this.socketClient.onclose = function() {
        console.log('echo-protocol Client Closed');
    };
    
    this.socketClient.onmessage = this.handleMessage;
    
    

    return {
      tmpAccount:this.disposableAccount
    }
  }

  private  handleMessage = async (event:any) => {
      if(!this.socketClient) throw new Error("Client Socket not available");
      const message = event.data;
      console.log("message", typeof message, message);
      
      try {
          let _message = JSON.parse(message);
          console.log("Received: ", _message);
          this.socketMessageCallback?.(_message)
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
                  
                  const _signature = await this.signData(_proofSignatureBody, this.disposableAccount?.privateKey??'')
                  _proof['signature'] = _signature;
                  console.log('_proof', _proof)
                  const client = this.socketClient
                  if (this.socketClient.readyState === this.socketClient.OPEN) {
                      this.socketClient.send(JSON.stringify(
                          {
                              type:'delivery-proof',
                              data:_proof,
                              signature:this.tmpAccount?.signature,
                          }
                      ));
                  }
                  break;
          
              default:
                  
                  break;
          }
          

          

      } catch (error) {
          console.log("error: ", error);
      }
      
  }

  /**
   * approveSender
   */
  public async approveSender({expiry,channels, sender}: ApproveSender, privateKey?:string): Promise<string> {

    const senderApprovalMessage = [];

    senderApprovalMessage.push(`Expiry:${expiry}`);
    // senderApprovalMessage.push(`Wildcard:${wildcard}`);
    senderApprovalMessage.push(`Channels:${channels}`);
    senderApprovalMessage.push(`Sender:${sender}`);
    // senderApprovalMessage.push(`OwnerAddress:${OwnerAddress}`);
    const _senderApprovalMessage = senderApprovalMessage.join(",");
    return this.signData(_senderApprovalMessage, privateKey);
  }


  /**
   * signData
   */
  public async signData(data: string, privateKey?: string) : Promise<string>  {
    if(privateKey){
      const { signature } = this.web3.eth.accounts.sign(
        this.web3.utils.soliditySha3(data)??'',
        privateKey
      );

      return signature;
      
    }
    const _provider:any = this.web3.currentProvider;
    if(!_provider) throw new Error("Provider or private key is required");
    
    this.provider?.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })
    await this.provider?.request({ method: 'eth_requestAccounts' })
    
    const from = await this.web3.eth.getAccounts();
    if(from.length == 0) throw new Error("No account found");
    const params = [from[0], this.web3.utils.soliditySha3(data)??''];
    const method = "eth_sign";
    return  await this.provider?.request({
        method,
        params,
    });

    return await new Promise<string>((resolve, reject) => {
      _provider?.sendAsync(
        {
          method,
          params,
          from: from[0],
        }, 

        function (err:any, result:any) {
            if (err) reject(err);
            if (result.error) console.error('ERROR', result);
            if (result.error) reject(result.error)
            
            console.log('TYPED SIGNED:' + JSON.stringify(result.result));
            resolve(result.result.signature)
          }
      )
    });
  }


}




// module.exports = Icm;