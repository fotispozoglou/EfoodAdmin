import DOMElement from "../../base/DOMElement.js";
import View from "../../base/View.js";

export default new class CuisineHint extends View {
  _parent = document.querySelector("#main_center");

  _generateElement() {

    const { onRenderManagement } = this._data;

    const icon = new DOMElement("div")
      .setClass('cuisine_hint_icon')
      .setClass('icon fa-up-right-from-square')
      .getElement();

    const hint = new DOMElement("button")
      .setClass('cuisine_hint_text')
      .setText('open cuisine management')
      .getElement();

    return new DOMElement("div")
      .setID("cuisine_hint")
      .append( icon, hint )
      .on('click', () => { onRenderManagement(); })
      .getElement();

  }

};