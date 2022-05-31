import View from "../base/View.js";
import DOMElement from "../base/DOMElement.js";

export default new class AdminBar extends View {
  _parent = document.querySelector("#navbar_header");
  _adminIcon;

  _generateElement() {

    const { info } = this._data;

    this._adminIcon = new DOMElement("div").setID("mnavbar_header_admin_icon").setClass(`icon icon-fw fa-user-shield`).getElement();

    const adminName = new DOMElement("p").setID("mnavbar_header_admin_name").setText( info.username ).getElement();

    return new DOMElement("div").setID("mnavbar_header_admin").append( adminName, this._adminIcon ).getElement();

  }

}
