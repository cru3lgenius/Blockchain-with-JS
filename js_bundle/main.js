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
  console.log(blockchain);
  $("#chain").append(nextBlockCard);
});

// TODO: check if the chain is valid on click
$("#checkBtn").on("click", function() {
  let isValid = blockchain.isValidChain(blockchain);
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

  //TODO: Fix isValidChain method to work for this chain
});

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
