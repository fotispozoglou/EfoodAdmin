import View from '../base/View.js';

import ListElement from '../base/ListElement.js';
import DOMElement from "../base/DOMElement.js";
import Admin from '../admin/Admin.js';

export default new class ManageAdmins extends View {
  _parent = document.querySelector("#main_center");
  _adminsElement;

  updateAdmin( id, data ) {

    this._adminsElement.updateItem( id, data );

  }

  _generateElement() {

    const { admins, permissions } = this._data;

    const { itemMethods } = this._data;

    this._adminsElement = new ListElement( admins, Admin, "", "", itemMethods, permissions );

    return new DOMElement("div").setClass('admins').append( this._adminsElement.build() ).getElement();

  }

};