import Jayson from "jayson"
import Web3 from "web3";


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




export class Icm{
  public client: Jayson.TcpClient | undefined;
  public web3: Web3;
  constructor(config: Jayson.TcpClientOptions | undefined){
    if(config) this.client = Jayson.client.tcp(config);

     this.web3 = new Web3();
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
}




// module.exports = Icm;