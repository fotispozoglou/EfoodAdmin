import DOMElement from "./DOMElement.js";

export default class EmptyListItem extends DOMElement {
  _id;
  _name;
  _icon;
  _emptyText;

  constructor({ _id, name, icon }, methods) {
    super("div");

    this._id = _id;
    this._name = name;
    this._icon = icon;

  }

  getID() { return this._id; }

  updateName( name ) {

    this._name = name;
    if ( this._emptyText ) this._emptyText.textContent = name;

  }

  show() {

    this._element.classList.remove('hidden');

  }

  hide() {

    this._element.classList.add('hidden');

  }

  build() {

    const emptyIcon = new DOMElement("div").setClass(`${ this._icon } icon list_empty_icon`).getElement();
    this._emptyText = new DOMElement("p").setClass('list_empty_text').setText(`${ this._name }`).getElement();
    const emptyElement = new DOMElement("div").setClass('list_empty').append( emptyIcon, this._emptyText ).getElement();

    this._element = emptyElement;

    return this._element;

  }

}