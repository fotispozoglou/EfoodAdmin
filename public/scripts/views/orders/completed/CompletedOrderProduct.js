import DOMElement from "../../base/DOMElement.js";
import EmptyListItem from "../../base/EmptyListItem.js";
import ListElement from "../../base/ListElement.js";
import ListItem from "../../base/ListItem.js";

export default class CompletedOrderProduct extends DOMElement {
  _original;
  _quantity;
  _name;
  _price;
  _comments;
  _ingredients;
  _body;
  _isExpanded = false;

  constructor({ original, quantity, comments, ingredients }) {
    super("div");

    this._original = original;
    this._quantity = quantity;
    this._name = this._original.name;
    this._price = this._original.price;
    this._comments = comments;
    this._ingredients = ingredients;

  }

  expand() {

    this._body.getElement().style.display = 'flex';

    setTimeout(() => { this._body.getElement().style.maxHeight = '3000px'; }, 10);

  }

  contract() {

    this._body.getElement().style.maxHeight = '0px';

    setTimeout(() => { this._body.getElement().style.display = 'none'; }, 260);

  }

  onClick() {

    if ( this._isExpanded ) {

      this._isExpanded = false;

      return this.contract();

    }

    this._isExpanded = true;

    this.expand();

  }

  round( value = Number ) {

    return value.toFixed( 2 );
  
  }

  build() {

    const quantity = new DOMElement("p").setClass('delivery_order_product_quantity').setText( `x${this._quantity}` ).getElement();

    const name = new DOMElement("p").setClass('delivery_order_product_name').setText( this._name ).getElement();

    const price = new DOMElement("p").setClass('delivery_order_product_price').setText( `${ this.round( this._quantity * this._price ) }€` ).getElement();

    const header = new DOMElement("div").setClass('delivery_order_product_header').on('click', () => { this.onClick(); }).append( quantity, name, price ).getElement();

    const ingredientsTitle = new DOMElement("p")
      .setText('Ingredients')
      .setClass('delivery_order_product_body_title')
      .getElement();

    const ingredients = new ListElement( this._ingredients, ListItem, "", "", {  } );

    const noIngredients = new EmptyListItem({ _id: 1, name: 'No Ingredients', icon: 'fa-solid fa-bacon' }, {  }).build();

    ingredients.setNoItemsItem( noIngredients );

    const comments = new DOMElement("p").setClass('delivery_order_product_comments').setText( this._comments ).getElement();

    this._body = new DOMElement("div").setClass('delivery_order_product_body').append( ingredientsTitle, ingredients.build(), comments );

    ingredients.addClass('delivery_order_product_body_ingredients');

    this.setClass('delivery_order_product').append( header, this._body.getElement() ).getElement();

    return this._element;

  }

};