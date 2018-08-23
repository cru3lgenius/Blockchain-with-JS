const Handlebars = require("./handlebars-v4.0.11");
const Blockchain = require("./Blockchain");
const $ = require("jquery");
const blockchain = new Blockchain();

function onChange(e) {
  console.log("something changed ");
}

//Preparing templates for late use
let blockCard = `<div id={{index}} class="ui card">
<div class="content">
  <div class="header">Block</div>
  <br>
  <div class="description">
    <h5>Hash:</h5>
    <p class="current-hash overflow-a">{{currentBlockHash}}</p>
    <h5>Previous Hash:</h5>
    <p class="previous-hash overflow-a">{{previousBlockHash}}</p>
    <h5>Is current block valid?</h5>
    <p class="block-validity {{isValidClass}}">{{isValid}}</p>
    <h5>Data:</h5>
    <div class="ui input focus">
      <input name={{index}} minlength="1" value="{{data}}" type='text'>
    </div>
  </div>
</div>
</div>`;

let messageHtml = `<div class="ui {{type}} message">
<div class="header">
  {{header}}
</div>
<p>{{text}}</p>
</div>`;

let blockCardTemplate = Handlebars.compile(blockCard);
let messageTemplate = Handlebars.compile(messageHtml);
//let cardData = blockCardTemplate({ data: "randomName" });
//$("#chain").append($(cardData));

init();

// Show the chain on click
let isToggled = false;
$("#showBtn").on("click", function(e) {
  console.log(blockchain.blockchain);

  if (isToggled) {
    $("#showBtn .icon")
      .removeClass("minus")
      .addClass("plus");
    $("#showBtn").removeClass("yellow");
  } else {
    $("#showBtn .icon")
      .removeClass("plus")
      .addClass("minus");
    $("#showBtn").addClass("yellow");
  }
  isToggled = !isToggled;
  $("#chain").toggle();
});

// Add a block on click
$("#addBtn").on("click", function(e) {
  let data = $("#inputData").val();
  let message;
  if (data === "") {
    message = messageTemplate({
      type: "negative",
      header: "Error",
      text: "Sorry an empty input field is not allowed!"
    });
    $("#message").html(message);
    $("#message").toggle("slow", function() {
      setTimeout(() => {
        $("#message").toggle("slow", function() {});
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
  $("#message").html(message);
  $("#message").toggle("slow", function() {
    setTimeout(() => {
      $("#message").toggle("slow", function() {});
    }, 1800);
  });
  $("#inputData").val("");
  let nextBlockCard = createNextBlock(data);
  let index = blockchain.latestBlock.index;
  $("#chain").append(nextBlockCard);
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
    $("#message").html(message);
    $("#checkBtn").toggleClass("green");
    $("#message").toggle("slow", function() {
      setTimeout(() => {
        $("#checkBtn").toggleClass("green");
        $("#message").toggle("slow", function() {});
      }, 1800);
    });
    $("#checkBtn").toggleClass("green");
  } else {
    message = messageTemplate({
      type: "negative",
      header: "Invalid",
      text: "The chain is invalid!"
    });
    $("#message").html(message);
    $("#checkBtn").toggleClass("red");
    $("#message").toggle("slow", function() {
      setTimeout(() => {
        $("#checkBtn").toggleClass("red");
        $("#message").toggle("slow", function() {});
      }, 1800);
    });
  }
});

//TODO: Make block red if incorrect (isValid in Block.js)

// TODO: recalculate the hash on data change

// TODO: Add a arrow between each block

function createNextBlock(data) {
  blockchain.mine(data);
  const latestBlock = blockchain.latestBlock;
  const newCard = blockCardTemplate({
    data: latestBlock.data,
    currentBlockHash: latestBlock.hash,
    previousBlockHash: latestBlock.previousHash,
    index: latestBlock.index,
    isValid: latestBlock.isValid ? "Yes" : "No",
    isValidClass: latestBlock.isValid ? "valid" : "invalid"
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
  console.log(blockchain.blockchain);
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
      const isValidBlock = blockchain.blockchain[e1].isValid;
      adjustBlockStyles(validityParagraph, isValidBlock);
      adjustBlockHashValues(e1, hashParagraph, previousHashParagraph);
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
    isValidClass: genesisBlock.isValid ? "valid" : "invalid"
  });
  console.log(blockchain.blockchain);

  $("#chain").append(genesisCard);
  $(`#${genesisBlock.index} input`).bind("input", onChange);
}

function adjustBlockStyles(element, isValidBlock) {
  if (isValidBlock) {
    element.classList.remove("invalid");
    element.classList.add("valid");
    element.innerHTML = "Yes";
  } else {
    element.classList.remove("valid");
    element.classList.add("invalid");
    element.innerHTML = "No";
  }
}

function adjustBlockHashValues(
  blockIndex,
  hashParagraph,
  previousHashParagraph
) {
  const currentBlock = blockchain.blockchain[blockIndex];
  hashParagraph.innerHTML = currentBlock.hash;
  previousHashParagraph.innerHTML = currentBlock.previousHash;
}
