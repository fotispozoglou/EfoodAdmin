import DOMElement from "../../base/DOMElement.js";
import ListElement from "../../base/ListElement.js";
import CuisineOrderProductPreview from "./CuisineOrderProductPreview.js";

export default class CuisineOrder extends DOMElement {
  _id;
  _orderID;
  _products;
  _searchableTerm;
  _methods;
  _expanded = false;

  constructor({ _id, orderID, products }, methods) {
    super("div");

    this._id = _id;
    this._orderID = orderID;
    this._products = products;
    this._methods = methods;

    this._searchableTerm = `${ this._products.join('-') }-${ this._orderID }`;

  }

  getID() { return this._id; }

  getSearchable() { return this._searchableTerm; }

  build() {

    const { onShowOrder, onOrderReady } = this._methods;

    const title = new DOMElement("p").setClass('cuisine_order_preview_header_title').setText( this._orderID ).getElement();

    const header = new DOMElement("div")
      .setClass('cuisine_order_preview_header')
      .append( title )
      .on('click', () => {

        body.classList.add( this._expanded ? 'no_height' : 'max_height_lg' );
        footer.classList.add( this._expanded ? 'no_height' : 'max_height_lg' );
        body.classList.remove( this._expanded ? 'max_height_lg' : 'no_height' );
        footer.classList.remove( this._expanded ? 'max_height_lg' : 'no_height' );
  
        this._expanded = !this._expanded;
  
      })
      .getElement();

    const products = new ListElement( this._products, CuisineOrderProductPreview, "", "", {  }).build();

    const body = new DOMElement("div").setClass('cuisine_order_preview_body no_height').append( products ).getElement();

    const showMoreBtn = new DOMElement("button")
      .setText('show')
      .setClass('cuisine_order_preview_footer_action info_btn')
      .on('click', () => { onShowOrder( this._id ); })
      .getElement();

    const readyBtn = new DOMElement("button")
      .setText('ready')
      .on('click', () => { onOrderReady( this._id ); })
      .setClass('cuisine_order_preview_footer_action success_btn')
      .getElement();

    const footer = new DOMElement("div").setClass('cuisine_order_preview_footer no_height').append( readyBtn, showMoreBtn ).getElement();

    this.setClass('cuisine_order_preview').append( header, body, footer );

    return this._element;

  }

}