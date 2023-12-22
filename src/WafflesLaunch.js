import 'dotenv/config';
import Client from './structure/WafflesClient.js';
import options from './config/options.js';

const client = new Client(options);
client.login(process.env.TOKEN)