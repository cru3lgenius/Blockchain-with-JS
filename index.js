const Blockchain = require("./Blockchain");
const stdin = process.openStdin();
const blockchain = new Blockchain();

console.log('\n1). For seeing the blockchain write "print" and press enter \n');
console.log(
  '2). For seeing if the blockchain is valid write "isValid" and press enter\n'
);

console.log("After providing data press Enter");

stdin.addListener("data", function(d) {
  const data = d.toString().trim();
  if (data === "print") {
    console.log(JSON.stringify(blockchain.blockchain, null, 4));
  } else if (data === "isValid") {
    console.log(
      "The blockchain is valid: " +
        blockchain.isValidChain(blockchain.blockchain)
    );
  } else blockchain.mine(data);
});
