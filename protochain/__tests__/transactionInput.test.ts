import { describe, test, expect, beforeAll } from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet'


describe('TransactionInput tests', () =>{
    let alice: Wallet;
    let bob: Wallet;
    
    beforeAll(() => {
        alice = new Wallet()
        bob = new Wallet()
    })

    test('should be valid', () =>{
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput)
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('should NOT be valid (no signature)', () =>{
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
        } as TransactionInput)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (negative amount)', () =>{
        const txInput = new TransactionInput({
            amount: -1,
            fromAddress: alice.publicKey,
        } as TransactionInput)
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (invalid signature)', () =>{
        const txInput = new TransactionInput({
            amount: 1,
            fromAddress: alice.publicKey,
        } as TransactionInput)
        txInput.sign(bob.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (defaults)', () =>{
        const txInput = new TransactionInput()
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })
})