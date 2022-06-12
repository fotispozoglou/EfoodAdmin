import DOMElement from '../../base/DOMElement.js';
import View from '../../base/View.js';
import ListElement from '../../base/ListElement.js';
import DeliveryOrderProduct from './DeliveryOrderProduct.js';
import InfoIcon from '../../general/InfoIcon.js';

export default new class DeliveryOrderView extends View {
  _parent = document.querySelector("#main_center");
  _rerender = true;
  title = "delivery order";

  _generateHeader() {

    const { orderID, client, totalPrice } = this._data.order;

    const { onGoBack } = this._data.methods;

    const backBtn = new DOMElement("div").setClass('icon fa-arrow-left').on('click', () => { onGoBack(  ); }).getElement();

    const title = new DOMElement("p").setText( orderID ).setID("full_delivery_order_header_title").getElement();

    const headerNavigationContainer = new DOMElement("div").setID("full_delivery_order_header_navigation").append( backBtn, title ).getElement();

    return new DOMElement("div").setID("full_delivery_order_header").append( headerNavigationContainer ).getElement();

  }

  _generateElement() {

    const { _id, client, totalPrice, products, user } = this._data.order;

    const { onCompleteOrder } = this._data.methods;

    const header =  this._generateHeader();

    const clientInfoTitle = new DOMElement("p").setID('full_delivery_order_client_info_title').setText('customer').getElement();

    const clientName = new InfoIcon( 'user', client.name ).getElement();

    const clientAddress = new InfoIcon( 'location-dot', client.address ).getElement();

    const clientPhone = new InfoIcon( 'square-phone', client.phone ).getElement();

    const commentsElement = new DOMElement("p").setClass('full_delivery_order_footer_commnets').setText( client.comments ).getElement();

    const clientCommentsTitle = new DOMElement("p").setID('full_delivery_order_client_info_title').setText('comments').getElement();

    const clientInfoContainer = new DOMElement("div")
      .setID("full_delivery_order_client_info")
      .append( clientInfoTitle, clientName, clientAddress, clientPhone, clientCommentsTitle, commentsElement )
      .getElement();

    const productsTitle = new DOMElement("p").setText('products').setID("full_delivery_order_client_info_title").getElement();

    const productsList = new ListElement( products, DeliveryOrderProduct, "products", "full_delivery_order_products", {}).build();

    const totalPriceElement = new DOMElement("p").setClass('full_delivery_order_footer_price').setText(`${ totalPrice.toFixed(2) }€`).getElement();

    const productsContainer = new DOMElement("div").setID("full_delivery_products_container").append( productsTitle, productsList, totalPriceElement ).getElement();

    const completeOrderBtn = new DOMElement("button").setID('full_delivery_order_complete_btn').setClass('primary_btn').setText('completed').on('click', () => { onCompleteOrder( _id ); }).getElement();

    const footer = new DOMElement("div").setID('full_delivery_order_footer').append( completeOrderBtn ).getElement();

    return new DOMElement("div").setID('full_delivery_order').append( header, clientInfoContainer, productsContainer, footer ).getElement();

  }

};