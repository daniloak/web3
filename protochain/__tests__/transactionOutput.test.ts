import { describe, test, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'
import TransactionOutput from '../src/lib/transactionOutput';


describe('TransactionOutput tests', () =>{
    let alice: Wallet;
    let bob: Wallet;
    
    beforeAll(() => {
        alice = new Wallet()
        bob = new Wallet()
    })

    test('should be valid', () =>{
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: "abc"
        } as TransactionOutput)

        const valid = txOutput.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('should be valid (default)', () =>{
        const txOutput = new TransactionOutput()

        const valid = txOutput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid', () =>{
        const txOutput = new TransactionOutput({
            amount: -10,
            toAddress: alice.publicKey,
            tx: "abc"
        } as TransactionOutput)

        const valid = txOutput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should get hash', () =>{
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey,
            tx: "abc"
        } as TransactionOutput)

        const hash = txOutput.getHash();
        expect(hash).toBeTruthy();
    })
})
