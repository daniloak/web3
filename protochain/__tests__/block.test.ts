import { describe, test, expect } from '@jest/globals'
import Block from '../src/lib/block';

describe('Block tests', () =>{
    test('should be valid', () =>{
        const block = new Block(1, "abc", "blockData");
        const valid = block.isValid();

        expect(valid).toBeTruthy();
    })

    test('should NOT be valid (previousHash)', () =>{
        const block = new Block(1, "", "blockData");
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })

    test('should NOT be valid (timestamp)', () =>{
        const block = new Block(1, "abc", "blockData");
        block.timestamp = -1;
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })

    test('should NOT be valid (hash)', () =>{
        const block = new Block(1, "abc", "");
        block.hash = "";
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })

    test('should NOT be valid (data)', () =>{
        const block = new Block(1, "abc", "");
        block.timestamp = -1;
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })


    test('should NOT be valid (index)', () =>{
        const block = new Block(-1, "abc", "blockData");
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })
})