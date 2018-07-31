const Block = require("./Block");
const sha256 = require("crypto-js/sha256");

class Blockchain {
  constructor() {
    this.blockchain = [Block.genesisBlock];
    this.difficulty = 3;
  }

  get latestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  addNextBlock(block) {
    if (isValidNextBlock(block, this.latestBlock)) {
      this.blockchain.push(block);
    } else {
      throw new Error("Sorry adding invalid block is forbbiden");
    }
  }

  generateNextBlock(data) {
    const index = this.latestBlock.index + 1;
    const previousHash = this.latestBlock.hash;
    const timestamp = new Date().getTime();
    let nonce = 0;
    let hash = calculateHash(index, previousHash, timestamp, nonce, data);
    while (!this.isValidNonce(hash)) {
      nonce += 1;
      hash = calculateHash(index, previousHash, timestamp, nonce, data);
    }

    return new Block(index, data, nonce, timestamp, hash, previousHash);
  }

  isValidDifficulty(hash) {
    for (var i = 0; i < this.difficulty; i++) {
      if (hash[i] !== "0") return false;
    }
    return true;
  }

  isValidNonce(hash) {
    if (this.isValidDifficulty(hash)) {
      return true;
    }
    return false;
  }

  isValidNextBlock(nextBlock, latestBlock) {
    const expectedHashNextBlock = calculateBlockHash(nextBlock);
    if (
      nextBlock.index === latestBlock.index + 1 &&
      expectedHashNextBlock === nextBlock.hash &&
      nextBlock.previousHash === latestBlock.hash &&
      this.isValidDifficulty(nextBlock.hash)
    ) {
      return true;
    }
    return false;
  }

  calculateBlockHash(block) {
    const { index, timestamp, data, previousHash, nonce } = block;

    return this.calculateHash(index, timestamp, data, previousHash, nonce);
  }

  calculateHash(index, timestamp, data, previousHash, nonce) {
    return sha256(
      index + timestamp + JSON.stringify(data) + previousHash + nonce
    ).toString();
  }
}
