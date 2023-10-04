import https from 'https';

export function getAccessToken(clientSecret) {
  return new Promise((resolve, reject) => {
    const authUrl = process.env.AUTHORISATION_URL;
    const clientId = process.env.CLIENT_ID;
    const audience = process.env.AUDIENCE;
    const req = https.request(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, res => {
      const data = [];
      res.on('data', chunk => {
        data.push(chunk);
      });
      res.on('end', () => {
        const response = JSON.parse(Buffer.concat(data).toString());
        const token = response.access_token;
        resolve(token);
      });
    }).on('error', err => {
      reject(err);
    });
    
    req.write(JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience,
      grant_type: 'client_credentials'
    }));
    req.end();  
  });
}
