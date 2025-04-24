import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import morgan from 'morgan';
import { registerRoutes } from './routes';

const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);

const app = express();

if (process.argv.includes('--run')) {
  app.use(morgan('tiny'));
}

app.use(express.json());
registerRoutes(app);


app.listen(PORT, () => {
  console.log(`Blockchain server is running at ${PORT}`);
});

export {
    app
}