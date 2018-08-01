const Blockchain = require("./Blockchain");
// const Block = require('./Block');

const blockchain = new Blockchain();

const nextBlock = blockchain.generateNextBlock("new block");

console.log(nextBlock.hash);
console.log(blockchain.calculateBlockHash(nextBlock));
