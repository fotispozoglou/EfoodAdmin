import DOMElement from "../../base/DOMElement.js";

import { classes } from "../../../config/strings.js";
import ListElement from "../../base/ListElement.js";
import ListItem from "../../base/ListItem.js";
import EmptyListItem from "../../base/EmptyListItem.js";

const { ICONS } = classes;

export default class SelectedOrderProduct extends DOMElement {
  _comments;
  _ingredients;
  _name;
  _quantity;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Ingredients', icon: 'fa-pepper-hot' }, {  });

  constructor({ comments = "", ingredients = [], original = {}, quantity }) {
    super("div");

    this._comments = comments;
    this._ingredients = ingredients;
    this._name = original.name;
    this._quantity = quantity;

  }

  build() {

    const quantity = new DOMElement("p")
      .setClass("selected_cuisine_order_product_quantity")
      .setText( `x${this._quantity}` )
      .getElement();

    const name = new DOMElement("p")
      .setClass("selected_cuisine_order_product_name")
      .setText( this._name )
      .getElement();

    const warningIcon = new DOMElement("div")
      .setClass(`selected_cuisine_order_product_icon ${ ICONS.WARNING }`)
      .getElement();

    const header = new DOMElement("div")
      .setClass("selected_cuisine_order_product_header")
      .append( quantity, name, warningIcon )
      .getElement();

    const ingredients = new ListElement( this._ingredients, ListItem, "", "", {})
      .addClass('selected_cuisine_order_ingredients');

    ingredients.setNoItemsItem( this._noItemsItem.build() );

    const comments = new DOMElement("p")
      .setClass("selected_cuisine_order_product_comments")
      .setText( this._comments )
      .getElement();

    this.append( header, ingredients.build(), comments );

    this.setClass('selected_cuisine_order_product');

    return this.getElement();

  }

};