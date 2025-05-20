import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import morgan from 'morgan';
import { registerRoutes } from './routes';
import Blockchain from '../lib/blockchain';
import Wallet from '../lib/wallet';

const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);

const app = express();

if (process.argv.includes('--run')) {
  app.use(morgan('tiny'));
}

app.use(express.json());

const wallet = new Wallet(process.env.BLOCKCHAIN_WALLET)
const blockchain = new Blockchain(wallet.publicKey);
registerRoutes(app, blockchain);


app.listen(PORT, () => {
  console.log(`Blockchain server is running at ${PORT}. Wallet ${wallet.publicKey}`);
});

export {
    app
}