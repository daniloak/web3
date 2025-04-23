import { describe, test, expect } from '@jest/globals'
import Blockchain from '../src/lib/blockchain';

describe('Blockchain tests', () =>{
    test('should has genesis block', () =>{
        const blockchain = new Blockchain();

        expect(blockchain.blocks.length).toEqual(1)
    })
})