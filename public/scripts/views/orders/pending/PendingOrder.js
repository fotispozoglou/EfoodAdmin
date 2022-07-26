import DOMElement from "../../base/DOMElement.js";
import InfoIcon from "../../general/InfoIcon.js";

export default class PendingOrder extends DOMElement {
  _id;
  _orderID;
  _client;
  _clientAddress;
  _clientPhone;
  _methods;
  _time;
  _sendAt;
  _sendAtElement;
  _totalPrice;
  _sendAtInterval;
  _searchableTerm;

  constructor({ _id, orderID, client, time, totalPrice }, methods) {
    super("div");

    this._id = _id;
    this._orderID = orderID;
    this._client = client;

    this._methods = methods;

    this._clientAddress = this._client.address;
    this._clientPhone = this._client.phone;

    this._time = time;
    this._sendAt = this._time.sendAt;

    this._totalPrice = totalPrice;

    this._searchableTerm = `${this._clientAddress.normalize("NFD").replace(/\p{Diacritic}/gu, "")}-${ this._orderID }`;

  }

  getID() { return this._id; }

  getSearchable() { return this._searchableTerm; }

  round( value, precision ) {

    const multiplier = Math.pow(10, precision || 0);
  
    return Math.round(value * multiplier) / multiplier;
  
  }

  generateRow( header, data ) {

    const th = new DOMElement("th").setText( header ).getElement();
    
    const td = new DOMElement("td").setText( data ).getElement();

    const element = new DOMElement("tr").append( th, td );

    return element.getElement();

  }

  build() {

    const { onAccept, onReject } = this._methods;

    const orderID = new DOMElement("p").setClass('pending_order_info_name').setText(`${ this._orderID }`).getElement();

    const header = new DOMElement("div").setClass('pending_order_header').append( orderID ).getElement();

    const name = new InfoIcon( 'user', this._client.name ).getElement();

    const address = new InfoIcon( 'location-dot', this._client.address ).getElement();

    const price = new InfoIcon( 'euro-sign', this._totalPrice.toFixed( 2 ) ).getElement();

    const body = new DOMElement("table").append( name, address, price ).getElement();

    const acceptBtn = new DOMElement("button").setClass('pending_order_action success_btn').setText('accept').on('click', () => { onAccept( this._id ); }).getElement();

    const rejectBtn = new DOMElement("button").setClass('pending_order_action error_btn').setText('reject').on('click', () => { onReject( this._id ); }).getElement();

    const orderActions = new DOMElement("div").setClass('pending_order_actions').append( rejectBtn, acceptBtn ).getElement();

    this.setClass('pending_order').append( header, body, orderActions ).getElement();

    return this._element;

  }

};