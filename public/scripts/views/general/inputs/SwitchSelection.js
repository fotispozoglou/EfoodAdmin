import DOMElement from '../../base/DOMElement.js';

export default class SwitchSelection extends DOMElement {
  _name;
  _id;
  _selected;
  _nameElement;

  constructor( name, id, selected ) {
    super("div");

    this._name = name;
    this._id = id;
    this._selected = selected;

  }

  select() {

    this._nameElement.addClass('selected_case_text');

    this._selected = true;

  }

  unselect() {

    this._nameElement.removeClass('selected_case_text');

    this._selected = false;

  }

  build() {

    this._nameElement = new DOMElement("p").setText( this._name ).setClass('switch_case_text');

    if ( this._selected ) this._nameElement.addClass('selected_case_text');

    this.append( this._nameElement.getElement() ).setClass('switch_case');

    return this.getElement();

  }

};
