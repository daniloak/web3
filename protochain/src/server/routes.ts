import { Express } from 'express';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';

export const registerRoutes = (app: Express) => {
  const blockchain = new Blockchain();

  app.get('/status', (req, res) => {
    res.json({
      numberOfBlocks: blockchain.blocks.length,
      isValid: blockchain.isValid(),
      lastBlock: blockchain.getLastBlock(),
    });
  });

  app.get('/blocks/next', (req, res) => {
    res.json(blockchain.getNextBlock())
  });

  app.get('/blocks/:indexOrHash', (req, res) => {
    const { indexOrHash } = req.params;
    const block = /^[0-9]+$/.test(indexOrHash)
      ? blockchain.blocks[parseInt(indexOrHash)]
      : blockchain.getBlock(indexOrHash);

    if (!block) {
      res.sendStatus(404);
      return;
    }

    res.json(block);
  });

  app.post('/blocks', (req, res) => {
    if (!req.body.hash) {res.sendStatus(422); return;}

    const block = new Block(req.body);
    const validation = blockchain.addBlock(block);

    validation.success
      ? res.status(201).json(block)
      : res.status(400).json(validation);
  });
};
