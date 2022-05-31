import DOMElement from "../base/DOMElement.js";
import ListItem from "../base/ListItem.js";

import { classes } from '../../config/strings.js';

const { ICONS } = classes;

export default class ProductAvailabilityElement extends ListItem {
  _available;

  constructor({ _id, name, available }) {
    super({ _id, name }, {});

    this._available = available;

  }

  build() {

    const name = new DOMElement("p").setClass('list_item_name').setText( this._name ).getElement();

    this.setClass('list_item product_availability').getElement();

    const currentState = new DOMElement("div").setClass( ICONS.CIRCLE );

    const arrow = new DOMElement("div").setClass( `state_arrow ${ICONS.ANGLE_RIGHT}` ).getElement();

    const nextState = new DOMElement("div").setClass( ICONS.CIRCLE );

    this._available ? currentState.addClass('available_circle') : currentState.addClass('unavailable_circle');

    this._available ? nextState.addClass('unavailable_circle') : nextState.addClass('available_circle');

    const stateContainer = new DOMElement("div").setClass('product_state_container').append( currentState.getElement(), arrow, nextState.getElement() ).getElement();

    this.append( name, stateContainer );

    return this._element;

  }

}