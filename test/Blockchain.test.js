const assert = require("assert");
const Blockchain = require("../Blockchain");
const Block = require("../Block");

let blockchain;

beforeEach(() => {
  // Init blockchain
  blockchain = new Blockchain();
});

describe("testing Blockchain methods", () => {
  it("retrieves the genesis block", () => {
    const genesisBlock = blockchain.latestBlock;
    assert.equal(genesisBlock.index, 0);
    assert.equal(genesisBlock.previousHash, "0");
    assert.equal(genesisBlock.data, "genesis block");
  });

  it("generates the next block", () => {
    const nextBlock = blockchain.generateNextBlock("next block");

    assert(blockchain.isValidDifficulty(nextBlock.hash));

    assert(nextBlock.index === 1);

    const expectedHashNextBlock = blockchain.calculateBlockHash(nextBlock);

    assert(blockchain.isValidNextBlock(nextBlock, blockchain.latestBlock));
  });

  it("adds new block to the chain", () => {
    const newBlock = blockchain.generateNextBlock("next block");
    try {
      blockchain.addNextBlock(newBlock);
    } catch (error) {
      assert(false, error.message);
    }

    assert.equal(newBlock.hash, blockchain.latestBlock.hash);
  });
});
