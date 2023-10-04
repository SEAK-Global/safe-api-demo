import { getAccessToken } from './access-token.js';
import { connectToSocket, getLiveLocationUsers } from './live-location.js';
import 'dotenv/config';

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.log('The client secret must be passed as the sole argument.');
  process.exit(1);
}

const clientSecret = args[0];
async function run() {
  try {
    const accessToken = await getAccessToken(clientSecret);
    const liveLocationUsers = await getLiveLocationUsers(accessToken);
    console.log('Live Location users', JSON.stringify(liveLocationUsers));
    await connectToSocket(accessToken);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
