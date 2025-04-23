/**
 * Block class
 */
export default class Block {
    index: number = 1;
    hash: string = "";

    /**
     * Creates a new block
     * @param index The block index in the blockchain
     * @param hash The block hash
     */
    constructor (index: number, hash: string){
        this.index = index;
        this.hash = hash;
    }

    /**
     * Check if the block is valid
     * @returns Returns true is the block is valid
     */
    isValid(): boolean {
        if(this.index < 0) return false;
        if (!this.hash) return false;

        return true;
    }
}
