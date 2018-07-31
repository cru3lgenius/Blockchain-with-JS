class Block {
  constructor(index, data, nonce, timestamp, hash, previousHash) {
    this.index = index;
    this.data = data;
    this.nonce = nonce;
    this.timestamp = timestamp;
    this.hash = hash;
    this.previousHash = previousHash;
  }

  get genesisBlock() {
    const index = 0;
    const data = "Genesis Block";

    return new Block();
  }
}

module.exports = Block;
