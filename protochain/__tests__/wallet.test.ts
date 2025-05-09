import { describe, test, expect, beforeAll } from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet'


describe('Wallet tests', () =>{
    const exampleWif = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"
    let alice: Wallet

    beforeAll(() => {
        alice = new Wallet()
    })

    test('should be valid', () =>{
        const wallet = new Wallet();

        expect(wallet.publicKey).toBeTruthy()
        expect(wallet.privateKey).toBeTruthy()
    })

    test('should recovery wallet (PK)', () =>{
        const wallet = new Wallet(alice.privateKey);

        expect(wallet.publicKey).toEqual(alice.publicKey)
    })

    test('should recovery wallet (WIF)', () =>{
        const wallet = new Wallet(exampleWif);
        
        expect(wallet.publicKey).toBeTruthy()
        expect(wallet.privateKey).toBeTruthy()
    })
})