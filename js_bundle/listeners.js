const { messageTemplate, arrowElementHtml } = require("./templates");
const { createNextBlock, appendBlock } = require("./utils");
const blockchain = require("./blockchain");
const $ = require("jquery");

// Shows if the chain menu is toggled or not
let isToggled = false;

exports.showChain = function(e) {
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
  $("#chain").toggle("slow", function() {});
};

exports.checkChainValidity = function(e) {
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
};

exports.addNewBlock = function(e) {
  // Get input field value
  let data = $("#inputData").val();

  let message;

  // Build message
  if (data.length > 0) {
    message = messageTemplate({
      type: "positive",
      header: "Successful",
      text: "You added the next block successfully!"
    });
  } else {
    message = messageTemplate({
      type: "negative",
      header: "Error",
      text: "Sorry an empty input field is not allowed!"
    });
    // Add new message to the HTML document and toggle it
    $("#message-new-block").html(message);
    $("#message-new-block").toggle("slow", function() {
      setTimeout(() => {
        $("#message-new-block").toggle("slow", function() {});
      }, 1800);
    });

    // Wrong input means no blocks added to the chain => return
    return;
  }
  // Add new message to the HTML document and toggle it
  $("#message-new-block").html(message);
  $("#message-new-block").toggle("slow", function() {
    setTimeout(() => {
      $("#message-new-block").toggle("slow", function() {});
    }, 1800);
  });

  // Input field value => empty
  $("#inputData").val("");

  //Create and append the newly created block
  let nextBlockCard = createNextBlock(data);
  let index = blockchain.latestBlock.index;

  //Append an arrow, pointing at the incoming block
  $("#chain .card:last-child").append($(arrowElementHtml));
  appendBlock(nextBlockCard, index);
};
