import { describe, test, expect, jest, beforeAll } from '@jest/globals'
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet'
import TransactionType from '../src/lib/transactionType';
import TransactionOutput from '../src/lib/transactionOutput';

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Blockchain tests', () =>{
    let alice: Wallet;
    let bob: Wallet;
    beforeAll(()=>{
        alice = new Wallet()
        bob = new Wallet()
    })
    test('should has genesis block', () =>{
        const blockchain = new Blockchain(alice.publicKey);

        expect(blockchain.blocks.length).toEqual(1)
    })
    
    test('should be valid (genesis)', () =>{
        const blockchain = new Blockchain(alice.publicKey);

        expect(blockchain.isValid()).toBeTruthy()
    })

    test('should be valid (two blocks)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction(
                            {
                                txInputs: [new TransactionInput()]
                            } as Transaction
                        )],
        } as Block));

        expect(blockchain.isValid().success).toBeTruthy()
    })

    test('should NOT be valid', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()]
            } as Transaction
        )

        blockchain.mempool.push(tx)

        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [tx],
        } as Block));
        blockchain.blocks[1].index = -1;
        expect(blockchain.isValid().success).toBeFalsy()
    })

    test('should add transaction', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const txo = blockchain.blocks[0].transactions[0]

        const tx = new Transaction()
        tx.hash = 'tx'
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: txo.hash,
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput )]
    
        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'abc'
        } as TransactionOutput)]

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeTruthy()
    })

    test('should add transaction (pending tx)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const tx = new Transaction()
        tx.hash = 'tx'
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: 'xyz',
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput)]

        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'abc'
        } as TransactionOutput)]

        blockchain.mempool.push(tx)

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeFalsy()
    })

    test('should NOT add transaction (invalid tx)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const txo = blockchain.blocks[0].transactions[0]

        const tx = new Transaction()
        tx.hash = 'tx'
        tx.timestamp = -1
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: txo.hash,
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput)]

        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'abc'
        } as TransactionOutput)]

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeFalsy()
    })

    test('should NOT add transaction (duplicated in blockchain)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const tx = blockchain.blocks[0].transactions[0]

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeFalsy()
    })

    test('should get transaction (mempool)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()],
                hash: 'aaa'
            } as Transaction
        )

        blockchain.mempool.push(tx)

        const result = blockchain.getTransaction('aaa')
        expect(result.mempoolIndex).toEqual(0)
    })

    test('should get transaction (blockchain)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()],
                hash: 'aaa'
            } as Transaction
        )

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block))

        const result = blockchain.getTransaction('aaa')
        expect(result.blockIndex).toEqual(1)
    })

    test('should NOT get transaction (blockchain)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const result = blockchain.getTransaction('xxx')
        expect(result.blockIndex).toEqual(-1)
        expect(result.mempoolIndex).toEqual(-1)   
    })

    test('should add block', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()]
            } as Transaction
        )

        blockchain.mempool.push(tx)
        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [tx],
        } as Block));

        expect(result.success).toBeTruthy()
    })

    test('should get block', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const block = blockchain.getBlock(blockchain.blocks[0].hash)        

        expect(block).toBeTruthy()
    })

    test('should NOT add block (invalid mempool)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        blockchain.mempool.push(new Transaction())
        blockchain.mempool.push(new Transaction())

        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()]
            } as Transaction
        )

        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [tx],
        } as Block));

        expect(result.success).toBeFalsy()
    })

    test('should NOT add block (invalid index)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        blockchain.mempool.push(new Transaction())
        const block = new Block({
            index: -1, 
            previousHash: blockchain.blocks[0].hash, 
        } as Block) 
        const result = blockchain.addBlock(block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey,
                amount: 1
            } as TransactionOutput)]
        } as Transaction))

        block.hash = block.getHash()

        expect(result.success).toBeFalsy()
    })

    test('Should get next block info', () => {
        const blockchain = new Blockchain(alice.publicKey);
        blockchain.mempool.push(new Transaction())
        const info = blockchain.getNextBlock();
        
        expect(info ? info.index : 0).toEqual(1);
    });

    test('Should NOT get next block info', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const info = blockchain.getNextBlock();
        
        expect(info).toBeNull();
    });

    test('Should get balance', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const balance = blockchain.getBalance(alice.publicKey)
        
        expect(balance).toBeGreaterThan(0)
    });

    test('Should get zero balance', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const balance = blockchain.getBalance(bob.publicKey)
        
        expect(balance).toEqual(0)
    });

    test('Should get UTXO', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const txo = blockchain.blocks[0].transactions[0]
        const tx = new Transaction()
        tx.hash = 'tx'
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: txo.hash,
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput )]
    
        tx.txOutputs = [new TransactionOutput({
            amount: 5,
            toAddress: 'abc'
        } as TransactionOutput),
        new TransactionOutput({
            amount: 4,
            toAddress: alice.publicKey
        } as TransactionOutput)
        ]

        blockchain.blocks.push(new Block({
            index: 1,
            transactions: [tx]
        } as Block))

        const utxo = blockchain.getUtxo(alice.publicKey)
        
        expect(utxo.length).toBeGreaterThan(0)
    });

    test('should NOT add transaction (invalid UTXO)', () =>{
        const blockchain = new Blockchain(alice.publicKey);
        const txo = blockchain.blocks[0].transactions[0]

        const tx = new Transaction()
        tx.hash = 'tx'
        tx.txInputs = [new TransactionInput({
            amount: 10,
            previousTx: 'wrong',
            fromAddress: alice.publicKey,
            signature: 'abc'
        } as TransactionInput )]
    
        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'abc'
        } as TransactionOutput)]

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeFalsy()
    })
})