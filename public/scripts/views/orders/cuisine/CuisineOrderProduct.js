import DOMElement from "../../base/DOMElement.js";

export default class CuisineOrderProduct extends DOMElement {
  _original;
  _quantity;
  _ingredients;
  _comments;

  constructor({ original, quantity, ingredients, comments }) {  
    super("div");

    this._original = original;
    this._quantity = quantity;
    this._comments = comments;
    this._ingredients = ingredients;

  }

  build() {

    const { name } = this._original;

    const backBtn = new DOMElement("div").setClass('icon fa-arrow-left').getElement();

    const quantityElement = new DOMElement("p").setText( `${ this._quantity }x` ).setClass('cuisine_order_product_header_quantity').getElement();

    const nameElement = new DOMElement("p").setText( name ).setClass('cuisine_order_product_header_name').getElement();

    const infoContainer = new DOMElement("div").setClass('cuisine_order_product_header_info').append( quantityElement, nameElement ).getElement();

    const header = new DOMElement("div").setClass('cuisine_order_product_header').append( infoContainer ).getElement();

    const body = new DOMElement("div").setClass('cuisine_order_product_body');

    const commentsTitle = new DOMElement("p")
      .setClass('cuisine_order_product_comments_title')
      .setText('Comments')
      .getElement();

    const comments = new DOMElement("p").setText( this._comments ).setClass('cuisine_order_product_comments').getElement();

    const ingredientsTitle = new DOMElement("p")
      .setText('Ingredients')
      .setClass('cuisine_order_product_body_title')
      .getElement();

    body.append( ingredientsTitle );

    for ( const ingredient of this._ingredients ) {

      const ingredientElement = new DOMElement("p").setClass('cuisine_order_product_ingredient').setText( ingredient.name ).getElement();

      body.append( ingredientElement );

    }

    this.setClass('div').setClass('cuisine_order_product').append( header, body.getElement(), commentsTitle, comments );

    return this._element;

  }

};