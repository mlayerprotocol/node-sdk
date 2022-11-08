

var WebSocketClient = require('websocket').client;
const Web3 = require("web3");

const web3 = new Web3();
const disposableAccount = web3.eth.accounts.create();
console.log('disposableAccount', disposableAccount)
let sender = {
    pubKey: process.env.PUBLIC_KEY,
    privKey: process.env.PRIVATE_KEY,
  };

// Meta Mask
const mainAccount = {
    pubKey: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
    privKey: "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
}

const tmpAccount = {
    pubKey: disposableAccount.address,
    privKey: disposableAccount.privateKey,
}
const timestamp = Math.floor(Date.now()/1000);
const disposableAccountMsg = `PubKey:${tmpAccount.pubKey},Timestamp:${timestamp}`//
console.log('disposableAccountMsg', disposableAccountMsg)
const { signature:disposableAccountSignature } = web3.eth.accounts.sign(
    web3.utils.soliditySha3(disposableAccountMsg),
    mainAccount.privKey
);


let globalConn = null;



// const message = "ICM-SIGNED-MESSAGE";
// const signer = mainAccount.pubKey;
// const timestamp = Math.floor(Date.now()/1000);

// const { signature } = web3.eth.accounts.sign(
//     web3.utils.soliditySha3(message),
//     mainAccount.privKey
// );

const _message = {
    signature: disposableAccountSignature,
    signer: mainAccount.pubKey,
    message: tmpAccount.pubKey,
    timestamp,

}






let client = new WebSocketClient({
    closeTimeout: 50000
});



client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error);
});

client.on('connect',  function(connection) {
    globalConn = connection;
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', handleMessage);
    
    function sendSignature() {
        if (connection.connected) {
            connection.send(JSON.stringify({
                type:'handshake',
                data:_message,
                signature:disposableAccountSignature,
            }));
        }
    }
    sendSignature();
    
});

client.connect('ws://127.0.0.1:8088/echo');



function handleMessage(message) {
    console.log("message", typeof message);
    if (message.type === 'utf8') {
        try {
            let _message = JSON.parse(message.utf8Data);
            console.log("Received: ", _message);

            switch (_message.type??'') {
                case 'new-message':
                    _message = _message.data
                    const _proof = {
                        messageSignature: _message.senderSignature,
                        // messageSender: tmpAccount.pubKey,
                        tmpAccount: {
                            signer: mainAccount.pubKey,
                            timestamp,
                            signature: disposableAccountSignature,
                            
                        },
                        node: _message.message.origin,
                        timestamp: Math.floor(Date.now()/1000),
                    }
                    const _proofSignatureBody = `Message:${_proof.messageSignature},NodeAddress:${_proof.node},Timestamp:${_proof.timestamp}`;
                    console.log("_proofSignatureBody: ", _proofSignatureBody);
                    
                    const { signature:_signature } = web3.eth.accounts.sign(
                        web3.utils.soliditySha3(_proofSignatureBody),
                        tmpAccount.privKey
                    );
                    _proof['signature'] = _signature;
                    console.log('_proof', _proof)
                    if (globalConn.connected) {
                        globalConn.send(JSON.stringify(
                            {
                                type:'delivery-proof',
                                data:_proof,
                                signature:disposableAccountSignature,
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
}