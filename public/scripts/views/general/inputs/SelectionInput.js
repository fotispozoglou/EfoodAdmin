import DOMElement from "../../base/DOMElement.js";
import InputElement from "./InputElement.js";

import { classes } from '../../../config/strings.js';

const { ICONS } = classes;

const EMPTY_SQUARE = `${ ICONS.SQUARE } selection_box`;
const CHECKED_SQUARE = `${ ICONS.CHECKED_SQUARE } selection_box`;

const EMPTY_CIRCLE = `radio_box selection_box`;
const CHECKED_CIRCLE = `radio_box selected_radio_box selection_box`;

export default class SelectionInput extends InputElement {
  _id;
  _name;
  _type;
  _selected;
  _selectionElement;
  _onSelect;
  SELECTED_CLASS;
  EMPTY_CLASS;

  constructor( { _id, name }, type, selected, onSelect ) {
    super("div");

    this._id = _id;
    this._name = name;
    this._type = type;
    this._onSelect = onSelect;
    this._selected = selected;

    this.SELECTED_CLASS = this._type === "checkbox" ? `${ CHECKED_SQUARE }` : `${ CHECKED_CIRCLE }`;
    this.EMPTY_CLASS = this._type === "checkbox" ? `${ EMPTY_SQUARE }` : `${ EMPTY_CIRCLE }`;

  }

  isSelected() { return this._selected }

  getID() { return this._id }

  select() {

    this._selected = true;
    this._selectionElement.className = this.SELECTED_CLASS;

  }

  unselect() {

    this._selected = false;
    this._selectionElement.className = this.EMPTY_CLASS;

  }

  update( selected ) {

    this._selected = selected;
    this._selectionElement.className = selected ? this.SELECTED_CLASS : this.EMPTY_CLASS;

  }

  build() {

    if ( this.EMPTY_CLASS === undefined ) throw new Error("ERROR");

    this._selectionElement = new DOMElement("div").setClass( this.EMPTY_CLASS ).getElement();

    if ( this._selected ) this.select();

    const selectionName = new DOMElement("p").setClass('selection_name').setText( this._name ).getElement();

    this.addClass('selection').append( this._selectionElement, selectionName );

    this.on('click', () => {

      this._onSelect( this );

    });

    return this.getElement();

  }

}