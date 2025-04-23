import { describe, test, expect } from '@jest/globals'
import Block from '../src/lib/block';

describe('Block tests', () =>{
    test('should be valid', () =>{
        const block = new Block(1, "abc");
        const valid = block.isValid();

        expect(valid).toBeTruthy();
    })

    test('should NOT be valid', () =>{
        const block = new Block(1, "");
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })

    test('should NOT be valid (index)', () =>{
        const block = new Block(-1, "abc");
        const valid = block.isValid();

        expect(valid).toBeFalsy();
    })
})