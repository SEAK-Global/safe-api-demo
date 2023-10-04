import https from 'https';
import websocket from 'websocket';


export function getLiveLocationUsers(accessToken) {
  return new Promise((resolve, reject) => {
    const apiDomain = process.env.API_DOMAIN;
    const getLiveLocationUsersUrl = `https://${apiDomain}/live-location-users/`;
    https.request(getLiveLocationUsersUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`
      },
    }, res => {
      const data = [];
      res.on('data', chunk => {
        data.push(chunk);
      });
      res.on('end', () => {
        const responseText = Buffer.concat(data).toString();
        const response = JSON.parse(responseText);
        resolve(response);
      });
    }).on('error', err => {
      reject(err);
    }).end();  
  });
}

export function connectToSocket(accessToken) {
  return new Promise((resolve, reject) => {
    const apiDomain = process.env.API_DOMAIN;
    const liveLocationUsersSocketUri = `wss://${apiDomain}/ws/live-location-users/`;
    const WebSocketClient = websocket.client;
    const wsClient = new WebSocketClient();
    wsClient.on('connect', function(connection) {
      console.log('WebSocket Client Connected');
      connection.on('close', function() {
        resolve();
      });
      connection.on('message', function(message) {
        console.log('Message received', JSON.parse(message.utf8Data));
      });
    });
    wsClient.on('connectFailed', function(error) {
      console.log('Connect Error: ' + error.toString());
      reject(error);
    });
    wsClient.connect(liveLocationUsersSocketUri, 'wss', undefined, {
      authorization: `Bearer ${accessToken}`
    });
  });
}
