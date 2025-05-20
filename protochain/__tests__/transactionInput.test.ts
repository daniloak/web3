import { describe, test, expect, beforeAll } from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet'
import TransactionOutput from '../src/lib/transactionOutput';


describe('TransactionInput tests', () =>{
    let alice: Wallet;
    let bob: Wallet;
    const exampleTx = "12add50c26882bfb3c0bfccf3c6be29d82692b4a12b96058f1b51e9a08cc142e"
    
    beforeAll(() => {
        alice = new Wallet()
        bob = new Wallet()
    })

    test('should be valid', () =>{
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: 'abc'
        } as TransactionInput)
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('should NOT be valid (no signature)', () =>{
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: 'abd'
        } as TransactionInput)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (negative amount)', () =>{
        const txInput = new TransactionInput({
            amount: -1,
            fromAddress: alice.publicKey,
            previousTx: 'abd'
        } as TransactionInput)
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (invalid signature)', () =>{
        const txInput = new TransactionInput({
            amount: 1,
            fromAddress: alice.publicKey,
            previousTx: 'abd'
        } as TransactionInput)
        txInput.sign(bob.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (invalid previousTx)', () =>{
        const txInput = new TransactionInput({
            amount: 1,
            fromAddress: alice.publicKey,
        } as TransactionInput)
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (defaults)', () =>{
        const txInput = new TransactionInput()
        txInput.sign(alice.privateKey)

        const valid = txInput.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should create from TXO', () => {
        const txi = TransactionInput.fromTxo({
            amount: 10,
            toAddress: alice.publicKey,
            tx: exampleTx
        } as TransactionOutput)
        txi.sign(alice.privateKey)
        
        txi.amount = 11
        const result = txi.isValid()

        expect(result.success).toBeFalsy()
    })
})