import Block from "./block";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];

    /**
     * Initiate the blockchain
     */
    constructor(){
        this.blocks = [new Block(0, "genesis")];
    }
}