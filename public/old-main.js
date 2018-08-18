let htmlCard = `<div class="ui card">
<div class="content">
  <div class="header">Block</div>
  <br>
  <div class="description">
    <h5>Hash:</h5>
    <p>l19494148ß918481891949941491490491</p>
    <h5>Previous Hash:</h5>
    <p>l19494148ß918481891949941491490491</p>
    <h5>Data</h5>
    <input class="" value={{data}} type='text'>
  </div>
</div>
</div>`;
let cardTemplate = Handlebars.compile(htmlCard);
let cardData = cardTemplate({ data: "randomName" });
$("#chain").append($(cardData));

// Show the chain on click
let isToggled = false;
$("#showBtn").on("click", function(e) {
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

// TODO: check if the chain is valid on click

// TODO: recalculate the hash on data change

// TODO: Add a arrow between each block
