import DOMElement from '../base/DOMElement.js';
import EditItemView from '../base/EditItemView.js';
import InputElement from '../general/inputs/InputElement.js';

export default new class AdminInfoEdit extends EditItemView {
  _parent = document.querySelector("#main_center");
  title = "edit profile";

  _generateHeader() {

    const icon = new DOMElement("div").setClass('edit_item_header_icon icon fa-user').getElement();

    return new DOMElement("div").setID("edit_item_header").append( icon );

  }

  _generateInputs() {

    const { username } = this._data.info;

    const usernameElement = new InputElement( "username", username ).build().setPlaceholder('username');

    this._inputs.push( usernameElement );

    this.addDataElements(
      ['username', () => { return usernameElement.getValue(); }]
    );

    return [ usernameElement.getElement() ];

  }

};