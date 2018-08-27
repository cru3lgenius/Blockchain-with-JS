class Block {
  constructor(index, data, nonce, timestamp, hash, previousHash) {
    this.index = index;
    this.data = data;
    this.nonce = nonce;
    this.timestamp = timestamp;
    this.hash = hash;
    this.previousHash = previousHash;
    this.isValid = true;
  }
}

module.exports = Block;
