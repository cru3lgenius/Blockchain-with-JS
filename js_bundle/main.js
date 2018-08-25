const Handlebars = require("./handlebars-v4.0.11");
const Blockchain = require("./Blockchain");
const $ = require("jquery");
const blockchain = new Blockchain();

//Preparing templates for late use
let blockCard = `<div id={{index}} class="ui card">
  <div class="content">
    <div class="right floated content">
      <a class="ui label nonce-label">
        {{nonce}}
      </a>
    </div>
    <h3 class="header">Block {{index}}</h3>
    <br>
    <div class="description">
      <h4>Hash:</h4>
      <p class="current-hash overflow-a">{{currentBlockHash}}</p>
      <h4>Previous Hash:</h4>
      <p class="previous-hash overflow-a">{{previousBlockHash}}</p>
      <h4>Is current block valid?</h4>
      <p class="block-validity {{isValidClass}}">{{isValid}}</p>
      <h4>Data:</h4>
      <div class="ui input focus">
        <input name={{index}} minlength="1" value="{{data}}" type='text'>
      </div>
      <br>
      <button name="fix-{{index}}" class="ui fluid button icon">
        <i class="undo icon"></i>
      </button>
    </div>
  </div>
</div>`;

let arrowCard = `
  <div class="arrow-style">
    <i class="angle down icon"></i>
  </div>`;

let messageHtml = `<div class="ui {{type}} message">
<div class="header">
  {{header}}
</div>
<p>{{text}}</p>
</div>`;

let blockCardTemplate = Handlebars.compile(blockCard);
let messageTemplate = Handlebars.compile(messageHtml);
let arrowTemplate = Handlebars.compile(arrowCard);
//let cardData = blockCardTemplate({ data: "randomName" });
//$("#chain").append($(cardData));

init();

// Show the chain on click
let isToggled = false;
$("#showBtn").on("click", function(e) {
  if (isToggled) {
    $("#showBtn .icon")
      .removeClass("minus")
      .addClass("plus");
    $("#showBtn").removeClass("clean");
  } else {
    $("#showBtn .icon")
      .removeClass("plus")
      .addClass("minus");
    $("#showBtn").addClass("clean");
  }
  isToggled = !isToggled;
  $("#chain").toggle();
});

// Add a block on click
$("#addBtn").on("click", function(e) {
  let data = $("#inputData").val();
  let message;
  if (data.length <= 0) {
    message = messageTemplate({
      type: "negative",
      header: "Error",
      text: "Sorry an empty input field is not allowed!"
    });
    $("#message-new-block").html(message);
    $("#message-new-block").toggle("slow", function() {
      setTimeout(() => {
        $("#message-new-block").toggle("slow", function() {});
      }, 1800);
    });
    return;
  } else {
    message = messageTemplate({
      type: "positive",
      header: "Successful",
      text: "You added the next block successfully!"
    });
  }
  $("#message-new-block").html(message);
  $("#message-new-block").toggle("slow", function() {
    setTimeout(() => {
      $("#message-new-block").toggle("slow", function() {});
    }, 1800);
  });
  $("#inputData").val("");
  let nextBlockCard = createNextBlock(data);
  let index = blockchain.latestBlock.index;
  $("#chain .card:last-child").append($(arrowCard));
  $("#chain").append(nextBlockCard);
  $("#chain .card:last-child [name^='fix-']").on("click", onFix);
  $(`#${index} input`).bind("input", onChange);
});

// TODO: check if the chain is valid on click
$("#checkBtn").on("click", function() {
  let isValid = blockchain.isValidChain();
  let message;
  if (isValid) {
    message = messageTemplate({
      type: "positive",
      header: "Valid",
      text: "The chain is valid!"
    });
    $("#message-chain-check").html(message);
    $("#checkBtn").toggleClass("success");
    $("#message-chain-check").toggle("slow", function() {
      setTimeout(() => {
        $("#checkBtn").toggleClass("success");
        $("#message-chain-check").toggle("slow", function() {});
      }, 1800);
    });
  } else {
    message = messageTemplate({
      type: "negative",
      header: "Invalid",
      text: "The chain is invalid!"
    });
    $("#message-chain-check").html(message);
    $("#checkBtn").toggleClass("failure");
    $("#message-chain-check").toggle("slow", function() {
      setTimeout(() => {
        $("#checkBtn").toggleClass("failure");
        $("#message-chain-check").toggle("slow", function() {});
      }, 1800);
    });
  }
});

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

// TODO: Implement this method to trigger validchain check
function onChange(e) {
  let currentBlock = blockchain.blockchain[e.target.name];
  currentBlock.data = e.target.value;
  let newHash = blockchain.calculateBlockHash(currentBlock);
  currentBlock.hash = newHash;
  currentBlock.isValid = blockchain.isValidDifficulty(currentBlock.hash);
  blockchain.propagateForward(currentBlock.index + 1, currentBlock);
  reRenderChain();
}

function reRenderChain() {
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
  $("#chain").append(genesisCard);
  $("#chain .card:last-child [name^='fix-']").on("click", onFix);
  $(`#${genesisBlock.index} input`).bind("input", onChange);
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

//TODO: change color hashes when incorrect

//TODO: add button to fix hashes

//TODO: ADD nonce

// TODO: Add onClick listener to the change button

function onFix(e) {
  // Strips the index of the name attribute of the button
  const blockIndex = e.target.name.substring(4);
  const currentBlock = blockchain.blockchain[blockIndex];
  fixBlock(currentBlock);
  blockchain.propagateForward(currentBlock.index + 1, currentBlock);
  reRenderChain();
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
