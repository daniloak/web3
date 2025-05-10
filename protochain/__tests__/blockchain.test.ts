import { describe, test, expect, jest } from '@jest/globals'
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Blockchain tests', () =>{
    test('should has genesis block', () =>{
        const blockchain = new Blockchain();

        expect(blockchain.blocks.length).toEqual(1)
    })
    
    test('should be valid (genesis)', () =>{
        const blockchain = new Blockchain();

        expect(blockchain.isValid()).toBeTruthy()
    })

    test('should be valid (two blocks)', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction(
                            {
                                txInput: new TransactionInput()
                            } as Transaction
                        )],
        } as Block));

        expect(blockchain.isValid().success).toBeTruthy()
    })

    test('should NOT be valid', () =>{
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput()
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
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput(),
                hash: 'xyz'
            } as Transaction
        )

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeTruthy()
    })

    test('should add transaction (pending tx)', () =>{
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput(),
                hash: 'xyz'
            } as Transaction
        )

        blockchain.addTransaction(tx)

        const tx2 = new Transaction(
            {
                txInput: new TransactionInput(),
                hash: 'xyz2'
            } as Transaction
        )
        const validation = blockchain.addTransaction(tx2)

        expect(validation.success).toBeFalsy()
    })

    test('should NOT add transaction (invalid tx)', () =>{
        const txInput = new TransactionInput();
        txInput.amount = -1
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput,
                hash: 'xyz'
            } as Transaction
        )

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeFalsy()
    })

    test('should NOT add transaction (duplicated in blockchain)', () =>{
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput(),
                hash: 'xyz'
            } as Transaction
        )

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const validation = blockchain.addTransaction(tx)

        expect(validation.success).toBeFalsy()
    })

    test('should get transaction (mempool)', () =>{
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput(),
                hash: 'aaa'
            } as Transaction
        )

        blockchain.mempool.push(tx)

        const result = blockchain.getTransaction('aaa')
        expect(result.mempoolIndex).toEqual(0)
    })

    test('should get transaction (blockchain)', () =>{
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput(),
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
        const blockchain = new Blockchain();
        const result = blockchain.getTransaction('xxx')
        expect(result.blockIndex).toEqual(-1)
        expect(result.mempoolIndex).toEqual(-1)   
    })

    test('should add block', () =>{
        const blockchain = new Blockchain();
        const tx = new Transaction(
            {
                txInput: new TransactionInput(),
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
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash)        

        expect(block).toBeTruthy()
    })

    test('should NOT add block', () =>{
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: -1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction(
                            {
                                txInput: new TransactionInput(),
                            } as Transaction
                        )],
        } as Block));

        expect(result.success).toBeFalsy()
    })

    test('Should get next block info', () => {
        const blockchain = new Blockchain();
        blockchain.mempool.push(new Transaction())
        const info = blockchain.getNextBlock();
        
        expect(info ? info.index : 0).toEqual(1);
    });

    test('Should NOT get next block info', () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        
        expect(info).toBeNull();
    });
})