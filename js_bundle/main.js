const $ = require("jquery");

const { showChain, addNewBlock, checkChainValidity } = require("./listeners");

const { init } = require("./utils");

init();

// Shows the chain on click
$("#showBtn").on("click", showChain);

// Adds a block on click
$("#addBtn").on("click", addNewBlock);

// Checks if the chain is valid on click
$("#checkBtn").on("click", checkChainValidity);
