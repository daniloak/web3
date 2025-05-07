import { Express } from 'express';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';
import Transaction from '../lib/transaction';

export const registerRoutes = (app: Express) => {
  const blockchain = new Blockchain();

  app.get('/status', (req, res) => {
    res.json({
      mempool: blockchain.mempool.length,
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

  app.post('/transactions', (req, res) => {
    if (req.body.hash === undefined) {res.sendStatus(422); return;}

    const tx = new Transaction(req.body as Transaction);    
    const validation = blockchain.addTransaction(tx);

    validation.success
      ? res.status(201).json(tx)
      : res.status(400).json(validation);
  });

  app.get('/transactions/:hash', (req, res) => {
    res.status(200).json(blockchain.getTransaction(req.params.hash))
  })

  app.get('/transactions', (req, res) => {
    res.status(200).json({
      next: blockchain.mempool.slice(0, Blockchain.TX_PER_BLOCK),
      total: blockchain.mempool.length
    })
  })
};
