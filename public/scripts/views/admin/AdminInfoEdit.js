import EditItemView from '../base/EditItemView.js';
import InputElement from '../general/inputs/InputElement.js';

export default new class AdminInfoEdit extends EditItemView {
  _parent = document.querySelector("#main_center");
  title = "edit profile";

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