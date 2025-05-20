import { describe, test, expect, jest, beforeAll } from '@jest/globals'
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';

jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe('Transaction tests', () =>{
    const exampleDifficulty = 1
    const exampleTx = "12add50c26882bfb3c0bfccf3c6be29d82692b4a12b96058f1b51e9a08cc142e"
    const exampleFee = 1
    let alice: Wallet
    let bob: Wallet

    beforeAll(()=> {
        alice = new Wallet()
        bob = new Wallet()
    })

    test('should be valid (REGULAR default)', () =>{
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()],
                txOutputs: [new TransactionOutput()]
            } as Transaction);

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeTruthy();
    })

    test('should be valid (txoHash != txHash)', () =>{
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()],
                txOutputs: [new TransactionOutput()]
            } as Transaction);

        tx.txOutputs[0].tx = "laalal"

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (inputs < outputs)', () =>{
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput({
                    amount: 1
                } as TransactionInput)],
                txOutputs: [new TransactionOutput({
                    amount: 2
                } as TransactionOutput)]
            } as Transaction);

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (invalid hash)', () =>{
        const tx = new Transaction(
            {
                txInputs: [new TransactionInput()],
                txOutputs: [new TransactionOutput()],
                type: TransactionType.REGULAR,
                timestamp: Date.now(),
                hash: 'abc'
            } as Transaction);

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeFalsy();
    })

    test('should be valid (FEE)', () =>{
        const tx = new Transaction(
            {  
                txOutputs: [new TransactionOutput()],
                type: TransactionType.FEE
            } as Transaction);

        tx.txInputs = undefined;
        tx.hash = tx.getHash()

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeTruthy();
    })

    test('should NOT be valid (invalid to)', () =>{
        const tx = new Transaction();

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeFalsy();
    })

    test('should NOT be valid (invalid txInput)', () =>{
        const tx = new Transaction({
            txOutputs: [new TransactionOutput()],
            txInputs: [new TransactionInput({
                amount: -1,
                fromAddress: 'carteiraFrom',
                signature: 'abc'
            } as TransactionInput)]
        } as Transaction);

        const valid = tx.isValid(exampleDifficulty, exampleFee);
        expect(valid.success).toBeFalsy();
    })

    test('shoud get fee', () => {
        const txIn = new TransactionInput({
            amount: 11,
            fromAddress: alice.publicKey,
            previousTx: exampleTx
        } as TransactionInput)
        txIn.sign(alice.privateKey)

        const txOut = new TransactionOutput({
            amount: 10,
            toAddress: bob.publicKey
        } as TransactionOutput)

        const tx = new Transaction({
            txInputs: [txIn],
            txOutputs: [txOut]
        } as Transaction)

        const result = tx.getFee()

        expect(result).toBeGreaterThan(0)
    })

    test('should get zero fee', () => {
        const tx = new Transaction();
        tx.txInputs = undefined;
        const result = tx.getFee()

        expect(result).toEqual(0)
    })

    test('should create from reward', () => {
        const tx = Transaction.fromReward({
            amount: 10,
            toAddress: alice.publicKey,
            tx: exampleTx
        } as TransactionOutput);
        tx.txInputs = undefined;
        const result = tx.isValid(exampleDifficulty, exampleFee)

        expect(result.success).toBeTruthy()
    })

    test('should NOT be valid (fee excess)', () => {
        const txOut = new TransactionOutput({
            amount: Number.MAX_VALUE,
            toAddress: bob.publicKey
        } as TransactionOutput)

        const tx = new Transaction({
            type: TransactionType.FEE,
            txOutputs : [txOut]
        } as Transaction)
        const result = tx.isValid(exampleDifficulty, exampleFee)

        expect(result.success).toBeFalsy()
    })
})