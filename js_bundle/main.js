const Handlebars = require("./handlebars-v4.0.11");
const Blockchain = require("./Blockchain");
const $ = require("jquery");
const blockchain = new Blockchain();

//Preparing templates for late use
let blockCard = `<div class="ui card">
<div class="content">
  <div class="header">Block</div>
  <br>
  <div class="description">
    <h5>Hash:</h5>
    <p class="overflow-a">{{currentBlockHash}}</p>
    <h5>Previous Hash:</h5>
    <p class="overflow-a">{{previousBlockHash}}</p>
    <h5>Data:</h5>
    <div class="ui input focus">
      <input minlength="1" value={{data}} type='text'>
    </div>
  </div>
</div>
</div>`;
let blockCardTemplate = Handlebars.compile(blockCard);

//let cardData = blockCardTemplate({ data: "randomName" });
//$("#chain").append($(cardData));

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
  $("#chain").toggle("hide");
});

// TODO: Add a block on click
$("#addBtn").on("click", function(e) {
  let data = $("#inputData").val();
  $("#inputData").val("");
  let nextBlockCard = createNextBlock(data);
  $("#chain").append(nextBlockCard);
});

// TODO: check if the chain is valid on click

// TODO: recalculate the hash on data change

// TODO: Add a arrow between each block

function createNextBlock(data) {
  blockchain.mine(data);
  const latestBlock = blockchain.latestBlock;
  const newCard = blockCardTemplate({
    data: latestBlock.data,
    currentBlockHash: latestBlock.hash,
    previousBlockHash: latestBlock.previousHash
  });
  return newCard;
}
