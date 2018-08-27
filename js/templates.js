const Handlebars = require("./handlebars-v4.0.11");

// Block styled as a semantic-ui card - HTML skeleton
const blockCard = `<div id={{index}} class="ui card">
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

const arrowElementHtml = `
  <div class="arrow-style">
    <i class="angle down icon"></i>
  </div>`;

const messageHtml = `<div class="ui {{type}} message">
<div class="header">
  {{header}}
</div>
<p>{{text}}</p>
</div>`;

const blockCardTemplate = Handlebars.compile(blockCard);
const messageTemplate = Handlebars.compile(messageHtml);

module.exports = {
  blockCardTemplate,
  messageTemplate,
  arrowElementHtml
};
