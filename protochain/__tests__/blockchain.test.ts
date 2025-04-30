import { describe, test, expect, jest } from '@jest/globals'
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')

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
                                data: 'blockData'
                            } as Transaction
                        )],
        } as Block));

        expect(blockchain.isValid().success).toBeTruthy()
    })

    test('should NOT be valid', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction(
                           {
                               data: 'blockData'
                           } as Transaction
                       )],
        } as Block));
        blockchain.blocks[1].index = -1;
        expect(blockchain.isValid().success).toBeFalsy()
    })

    test('should add block', () =>{
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.blocks[0].hash, 
            transactions: [new Transaction(
                            {
                                data: 'blockData'
                            } as Transaction
                        )],
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
                                data: 'blockData'
                            } as Transaction
                        )],
        } as Block));

        expect(result.success).toBeFalsy()
    })

    test('Should get next block info', () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        
        expect(info.index).toEqual(1);
    });
})