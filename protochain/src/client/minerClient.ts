import dotenv from 'dotenv';
dotenv.config()

import axios from "axios";
import BlockInfo from "../lib/blockinfo";
import Block from "../lib/block";
import Wallet from "../lib/wallet"
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET)

console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0;

async function mine() {
    console.log("Getting next block info...")

    const {data} = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`)

    if (!data){
        console.log(`No tx found, waiting`)
        
        return setTimeout(() => {
            mine();
        }, 5000)
    }

    const blockInfo = data as BlockInfo

    const newBlock = Block.fromBlockInfo(blockInfo);

    newBlock.transactions.push(new Transaction({
        to: minerWallet.publicKey,
        type: TransactionType.FEE
    } as Transaction))

    newBlock.miner = minerWallet.publicKey

    console.log(`Start mining block # ${blockInfo.index}`);

    newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);
    
    console.log("Block mined! Sending to blockchain...", newBlock.hash)

    try{
        await axios.post(`${BLOCKCHAIN_SERVER}blocks/`, newBlock);
        console.log("Block sent and accepted")
        totalMined++;
        console.log(`Total mined blocks: ${totalMined}`)
    }catch(err: any){
        console.log(err.response ? err.response.data : err.message)
    }

    setTimeout(() => {
        mine();
    }, 1000)
}

mine();