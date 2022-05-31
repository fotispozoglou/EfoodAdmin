import DOMElement from "../../base/DOMElement.js";
import InfoIcon from '../../general/InfoIcon.js';

export default class DeliveryOrder extends DOMElement {
  _client;
  _onOrderClick;
  _id;
  _orderID;
  _searchableTerm;
  _methods;

  constructor({ _id, orderID, client }, methods) {
    super("div");

    this._id = _id;
    this._client = client;
    this._methods = methods;
    this._orderID = orderID;

    this._searchableTerm = `${this._client.address.normalize("NFD").replace(/\p{Diacritic}/gu, "")}-${ this._orderID }`;

  }

  getID() { return this._id; }

  getSearchable() { return this._searchableTerm; }

  generateRow( header, data ) {

    const th = new DOMElement("th").setText( header ).getElement();
    
    const td = new DOMElement("td").setText( data ).getElement();

    const element = new DOMElement("tr").append( th, td );

    return element.getElement();

  }

  build() {

    const { onOrderComplete, onOrderClick } = this._methods;

    const orderID = new DOMElement("p").setClass('delivery_order_id').setText( `${this._orderID}` ).getElement();

    const header = new DOMElement("div").setClass('delivery_order_header').append( orderID ).getElement();

    const name = new InfoIcon( 'user', this._client.name ).getElement();

    const address = new InfoIcon( 'location-dot', this._client.address ).getElement();

    const phone = new InfoIcon( 'square-phone', this._client.phone ).getElement();

    const body = new DOMElement("table").setClass('delivery_order_body').append( name, address ).getElement();

    const showOrderInfoBtn = new DOMElement("button")
      .setClass('info_btn delivery_order_footer_action')
      .on('click', () => { onOrderClick( this._id ); })
      .setText('details')
      .getElement()

    const completeOrderBtn = new DOMElement("button")
      .setClass('success_btn delivery_order_footer_action')
      .on('click', () => { onOrderComplete( this._id ); })
      .setText('complete')
      .getElement()

    const footer = new DOMElement("div").setClass('delivery_order_footer').append( completeOrderBtn, showOrderInfoBtn ).getElement()

    this.setClass('delivery_order').append( header, body, footer ).getElement();

    return this._element;

  }

};