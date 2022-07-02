import DOMElement from "../../base/DOMElement.js";
import InfoIcon from "../../general/InfoIcon.js";

const getFormattedNumber = number => number.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

export default class CompletedOrder extends DOMElement {
  _id;
  _client;
  _totalPrice;
  _sendAt;
  _orderID;
  _productsLength;
  _methods;

  constructor({ _id, client, totalPrice, time, orderID, products }, methods) {
    super("div");

    this._id = _id;
    this._client = client;
    this._totalPrice = totalPrice;
    this._sendAt = time.sendAt;
    this._orderID = orderID;
    this._productsLength = products;
    this._methods = methods;

    this._searchableTerm = `${ this._orderID }`;

  }

  getID() { return this._id; }

  getSearchable() { return this._searchableTerm; }

  _getDateString( timestamp ) {

    const currentTime = Date.now();

    return timestamp > currentTime - ( 1000 * 60 * 60 * 24 ) ? 'Today' : `Not Today`;

  }

  build() {

    const userIcon = new DOMElement("div").setClass('icon fa-user').getElement();

    const username = new DOMElement("p").setClass('complete_order_body_text').setText( this._client.name ).getElement();

    const userContainer = new DOMElement("div").setClass('completed_order_user').append( userIcon, username ).getElement();

    const header = new DOMElement("div").setClass('complete_order_header').append( userContainer ).getElement();

    const orderID = new DOMElement("p").setText( this._orderID ).setClass('completed_order_id').getElement();  

    const price = new DOMElement('p').setText( `${this._totalPrice.toFixed( 2 )} €` ).setClass('complete_order_body_text').getElement();

    const date = new Date( this._sendAt );

    const timeText = `${ date.getDay() }/${ date.getMonth() } ${ getFormattedNumber( date.getHours() ) }:${ getFormattedNumber( date.getMinutes() ) }`;

    const time = new DOMElement("p").setClass('complete_order_body_text').setText( timeText ).getElement();

    const productsText = new DOMElement("p").setText(`${ this._productsLength } products`).addClass('complete_order_body_text max-width').getElement();

    const bodyInformation = new DOMElement("div").setClass('complete_order_body_info').append( time, productsText, price ).getElement();

    const body = new DOMElement("div").setClass('complete_order_body').append( orderID, bodyInformation ).getElement();

    const showOrderIcon = new DOMElement("div").setClass('icon fa-eye').getElement();

    const showOrderText = new DOMElement("p").setClass('complete_order_body_text').setText('view').getElement();

    const showOrderBtn = new DOMElement("div").setClass('show_completed_order_btn').append( showOrderIcon, showOrderText ).getElement();

    const footer = new DOMElement("div").setClass('complete_order_footer').append( showOrderBtn ).getElement();

    this.setClass('completed_order row').append( header, body, footer );

    return this.getElement();

  }

  // build() {

  //   const orderID = new InfoIcon( 'hashtag', this._orderID ).addClass('complete_order_header_icon').getElement(); 

  //   const client = new DOMElement("p").setText( this._client.name ).setClass('complete_order_body_text').getElement();

  //   const price = new InfoIcon( 'euro-sign', this._totalPrice.toFixed( 2 )).addClass('complete_order_header_icon flex-right').getElement();

  //   const date = new Date( this._sendAt );

  //   const timeText = `${ date.getDay() }/${ date.getMonth() } ${ getFormattedNumber( date.getHours() ) }:${ getFormattedNumber( date.getMinutes() ) }`;

  //   const time = new DOMElement("p").setClass('complete_order_body_text').setText( timeText ).getElement();

  //   const productsText = new DOMElement("p").setText(`${ this._productsLength } products`).addClass('complete_order_body_text max-width flex-right').getElement();

  //   const header = new DOMElement("div").setClass('complete_order_header row').append( orderID, price ).getElement();

  //   const body = new DOMElement("div").setClass('complete_order_body row').append( client, time, productsText ).getElement();

  //   this.setClass('completed_order column').append( header, body );

  //   return this._element;

  // }

}