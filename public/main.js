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
    <input class=" value={{data}} type='text'>
  </div>
</div>
</div>`;
let cardTemplate = Handlebars.compile(htmlCard);
let cardData = cardTemplate({ data: "randomName" });
$("#chain").append($(cardData));
