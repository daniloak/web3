import { describe, test, expect, beforeAll } from '@jest/globals'
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

describe('Transaction tests', () =>{
    test('should be valid (REGULAR default)', () =>{
        const tx = new Transaction({data:'tx'} as Transaction);

        const valid = tx.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('should NOT be valid (invalid hash)', () =>{
        const tx = new Transaction(
            {
                data:'tx',
                type: TransactionType.REGULAR,
                timestamp: Date.now(),
                hash: 'abc'
            } as Transaction);

        const valid = tx.isValid();
        expect(valid.success).toBeFalsy();
    })

    test('should be valid (FEE)', () =>{
        const tx = new Transaction({data:'tx', type: TransactionType.FEE} as Transaction);

        const valid = tx.isValid();
        expect(valid.success).toBeTruthy();
    })

    test('should NOT be valid (invalid data)', () =>{
        const tx = new Transaction();

        const valid = tx.isValid();
        expect(valid.success).toBeFalsy();
    })
})