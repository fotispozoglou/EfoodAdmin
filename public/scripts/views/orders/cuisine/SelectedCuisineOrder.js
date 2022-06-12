import DOMElement from "../../base/DOMElement.js";
import ListElement from "../../base/ListElement.js";
import SelectedOrderProduct from "./SelectedOrderProduct.js";
import IconElement from '../../general/IconElement.js';

export default class SelectedCuisineOrder extends DOMElement {
  _orderID;
  _client;
  _products;
  _methods;
  _id;

  constructor({ _id, orderID, products = [] }, methods ) {
    super("div");

    this._id = _id;
    this._orderID = orderID;
    this._products = products;
    this._methods = methods;

  }

  getID() { return this._id; }

  build() {

    const { onMakingOrder, onCancelOrder, onOrderReady } = this._methods;

    const readyOrder = new IconElement( 'fa-check', 'ready' )
      .addClass('ready_order_btn cuisine_order_manage_btn')
      .on('click', () => { onOrderReady( this._id ); })
      .getElement();

    const makingOrder = new IconElement( 'fa-bookmark', 'making' )
      .addClass('making_order_btn cuisine_order_manage_btn')
      .on('click', () => { onMakingOrder( this._id ); })
      .getElement();

    const cancelOrder = new IconElement( 'fa-ban', 'cancel' )
      .addClass('cancel_order_btn cuisine_order_manage_btn')
      .on('click', () => { onCancelOrder( this._id ); })
      .getElement();

    const orderManageActions = new DOMElement("div")
      .setID("selected_cuisine_order_manage")
      .append( readyOrder, cancelOrder, makingOrder )
      .getElement();

    const products = new ListElement( this._products, SelectedOrderProduct, "", "", {} ).build();

    this.append( orderManageActions, products );

    this.setID("selected_cuisine_order");

    return this.getElement();

  }

};