import DOMElement from "./DOMElement.js";

export default class ListItem extends DOMElement {
  _id;
  _name;
  _methods;
  _searchableTerm;

  constructor({ _id, name }, methods) {
    super("div");

    this._id = _id;
    this._name = name;
    this._searchableTerm = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    this._methods = methods;

  }

  getID() { return this._id; }

  getSearchable() { return this._searchableTerm; }

  build() {

    const { onClick } = this._methods;

    this.setClass('list_item').on('click', () => { onClick( this._id ); }).setText( this._name ).getElement();

    return this._element;

  }

}