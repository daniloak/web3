import Validation from '../validation';

export default class TransactionInput{
    fromAddress: string;
    amount: number;
    signature: string;

    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || "carteira1";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "abc";
    }

    sign(privateKey: string): void{
        this.signature = "abc"     
    }

    getHash(): string {
        return "abc"
    }

    isValid(): Validation {
        if (!this.signature){
            return new Validation(false, "Signature is required")
        }

        if (this.amount < 1){
            return new Validation(false, "Amount must be greater than zero")
        }     

        return new Validation()
    }
}