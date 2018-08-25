const blockchain = require("./blockchain");
const $ = require("jquery");
const { blockCardTemplate } = require("./templates");

function init() {
  const genesisBlock = blockchain.blockchain[0];
  const genesisCard = blockCardTemplate({
    data: genesisBlock.data,
    currentBlockHash: genesisBlock.hash,
    previousBlockHash: genesisBlock.previousHash,
    index: genesisBlock.index,
    isValid: genesisBlock.isValid ? "Yes" : "No",
    isValidClass: genesisBlock.isValid ? "valid" : "invalid",
    nonce: genesisBlock.nonce
  });
  appendBlock(genesisCard, genesisBlock.index);
}

function createNextBlock(data) {
  blockchain.mine(data);
  const latestBlock = blockchain.latestBlock;
  const newCard = blockCardTemplate({
    data: latestBlock.data,
    currentBlockHash: latestBlock.hash,
    previousBlockHash: latestBlock.previousHash,
    index: latestBlock.index,
    isValid: latestBlock.isValid ? "Yes" : "No",
    isValidClass: latestBlock.isValid ? "valid" : "invalid",
    nonce: latestBlock.nonce
  });
  return newCard;
}

function renderChain() {
  $("#chain")
    .children()
    .each((e1, e2) => {
      const validityParagraph = e2.getElementsByClassName("block-validity")[0];
      const hashParagraph = e2.getElementsByClassName("current-hash")[0];
      const previousHashParagraph = e2.getElementsByClassName(
        "previous-hash"
      )[0];
      const nonceLabel = e2.getElementsByClassName("nonce-label")[0];
      const fixBtn = e2.querySelector(`[name^="fix-"]`);
      const currentBlock = blockchain.blockchain[e1];
      adjustBlockStyles(currentBlock, validityParagraph, fixBtn);
      adjustBlockValues(
        currentBlock,
        hashParagraph,
        previousHashParagraph,
        nonceLabel
      );
    });
}

function fixBlock(block) {
  let nonce = 0;
  let hash = block.hash;
  const timestamp = block.timestamp;
  const previousHash = block.previousHash;
  const index = block.index;
  const data = block.data;
  while (!blockchain.isValidNonce(hash)) {
    nonce += 1;
    hash = blockchain.calculateHash(
      index,
      timestamp,
      data,
      previousHash,
      nonce
    );
  }
  block.hash = hash;
  block.nonce = nonce;
  block.isValid = true;
}

function adjustBlockStyles(currentBlock, validityParagraph, fixBtn) {
  const isValidBlock = currentBlock.isValid;
  if (isValidBlock) {
    validityParagraph.classList.remove("invalid");
    validityParagraph.classList.add("valid");
    validityParagraph.innerHTML = "Yes";
    fixBtn.style.display = "none";
  } else {
    validityParagraph.classList.remove("valid");
    validityParagraph.classList.add("invalid");
    validityParagraph.innerHTML = "No";
    fixBtn.style.display = "block";
  }
}

// TODO: recalculate the hash on data change
function adjustBlockValues(
  currentBlock,
  hashParagraph,
  previousHashParagraph,
  nonceLabel
) {
  // Check hash difficulty of the current Block
  let isValidDifficulty = blockchain.isValidDifficulty(currentBlock.hash);
  isValidDifficulty
    ? (hashParagraph.style.color = "#00bfa5")
    : (hashParagraph.style.color = "#E91E63");
  hashParagraph.innerHTML = currentBlock.hash;

  //Check the hash difficulty of the previous Block
  if (currentBlock.index > 0) {
    isValidDifficulty = blockchain.isValidDifficulty(currentBlock.previousHash);
    isValidDifficulty
      ? (previousHashParagraph.style.color = "#00bfa5")
      : (previousHashParagraph.style.color = "#E91E63");
  }
  previousHashParagraph.innerHTML = currentBlock.previousHash;

  const newNonce = currentBlock.nonce;
  nonceLabel.innerHTML = newNonce;
}

function onFix(e) {
  // Strips the index of the name attribute of the button
  const blockIndex = e.target.name.substring(4);
  const currentBlock = blockchain.blockchain[blockIndex];
  fixBlock(currentBlock);
  blockchain.propagateForward(currentBlock.index + 1, currentBlock);
  renderChain();
}

// Trigger check of chain validity
function onChange(e) {
  let currentBlock = blockchain.blockchain[e.target.name];
  currentBlock.data = e.target.value;
  let newHash = blockchain.calculateBlockHash(currentBlock);
  currentBlock.hash = newHash;
  currentBlock.isValid = blockchain.isValidDifficulty(currentBlock.hash);
  blockchain.propagateForward(currentBlock.index + 1, currentBlock);
  renderChain();
}

function appendBlock(blockCard, index) {
  $("#chain").append(blockCard);

  //Add event listeners to the fix button and the input field
  $("#chain .card:last-child [name^='fix-']").on("click", onFix);
  $(`#${index} input`).bind("input", onChange);
}

module.exports = {
  appendBlock,
  init,
  createNextBlock
};
