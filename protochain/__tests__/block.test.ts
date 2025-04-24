import { describe, test, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockinfo';

describe('Block tests', () =>{
    const exampleDifficulty = 0;
    const exampleMiner = "sample miner";
    let genesis: Block;

    beforeAll(()=>{
        genesis = new Block({data: "genesis"} as Block);
    });

    test('should be valid', () =>{
        const block = new Block({index: 1, previousHash: genesis.hash, data: "blockData"} as Block);
        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        expect(valid.success).toBeTruthy();
    })

    test('should create from block info', () =>{
        const block = Block.fromBlockInfo({
            data: "blockData",
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: genesis.hash
        } as BlockInfo)
        
        expect(block.data).toEqual("blockData")
    })

    test('should NOT be valid (fallbacks)', () =>{
        const block = new Block();
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (previousHash)', () =>{
        const block = new Block({index:1, data: "blockData"} as Block);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (timestamp)', () =>{
        const block = new Block({index:1, previousHash: genesis.hash, data: "blockData"} as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (hash)', () =>{
        const block = new Block({index: 1, previousHash: genesis.hash, data: "blockData"} as Block);
        block.mine(exampleDifficulty, exampleMiner);

        block.hash = "";

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (no mined)', () =>{
        const block = new Block({index: 1, previousHash: genesis.hash, data: "blockData"} as Block);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (data)', () =>{
        const block = new Block({index:1, previousHash: genesis.hash} as Block);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (index)', () =>{
        const block = new Block({index: -1, previousHash: genesis.hash, data: "blockData"} as Block);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBeFalsy();
    })
})