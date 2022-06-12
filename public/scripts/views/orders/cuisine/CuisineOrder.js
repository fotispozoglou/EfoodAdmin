import DOMElement from "../../base/DOMElement.js";
import ListElement from "../../base/ListElement.js";
import ListItem from "../../base/ListItem.js";

export default class CuisineOrder extends DOMElement {
  _id;
  _orderID;
  _products;
  _methods;

  constructor({ _id, orderID, products }, methods) {
    super("div");

    this._id = _id;

    this._orderID = orderID;
    this._products = products.map( p => 
      { return { _id: p._id, name: `x${ p.quantity } ${ p.original.name }` } 
    });

    this._methods = methods;

  }

  getID() { return this._id; }

  getOrderID() { return this._orderID; }

  build() {

    const { onLoadOrder } = this._methods;

    const orderID = new DOMElement("p")
      .setClass('cuisine_order_number')
      .setText( this._orderID )
      .getElement();

    const products = new ListElement( this._products, ListItem, "", "", { onClick: () => {} })
      .addClass('cuisine_order_products')
      .build();

    this.setClass('cuisine_order')
      .append( orderID, products )
      .on('click', () => { onLoadOrder( this ); })

    return this.getElement();

  }

  // build() {

  //   const { onLoadOrder } = this._methods;

  //   const { name } = this._client;

  //   const userIcon = new DOMElement("div").setClass('icon fa-user').getElement();

  //   const userName = new DOMElement("p").setClass('cuisine_order_username').setText( name ).getElement();

  //   const userContainer = new DOMElement("div").setClass('cuisine_order_container').append( userIcon, userName ).getElement();

  //   const orderID = new DOMElement("p").setClass('cuisine_order_number').setText( this._orderID ).getElement();

  //   this.setClass('cuisine_order')
  //     .append( orderID, userContainer )
  //     .on('click', () => { onLoadOrder( this._id ); })

  //   return this.getElement();

  // }
  
};