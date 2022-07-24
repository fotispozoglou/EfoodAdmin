import { router } from '../../../controllers/main.js';
import DOMElement from '../../base/DOMElement.js';
import ListElement from '../../base/ListElement.js';
import View from '../../base/View.js';
import IconElement from '../../general/IconElement.js';
import InfoIcon from '../../general/InfoIcon.js';
import CompletedOrderProduct from './CompletedOrderProduct.js';

export default new class CompletedOrderView extends View {
  _parent = document.querySelector("#main_center");
  _rerender = true;
  _backURL = "/completed";
  title = "completed order";

  _generateHeader() {

    const { orderID, client } = this._data.order;

    const backBtn = new DOMElement("div")
      .setClass('icon fa-arrow-left')
      .attributes(['title', 'add product'], ['href', this._backURL], ['role', 'link'])
      .on('click', event => { 
        
        event.preventDefault(); 

        window.history.pushState({}, {}, this._backURL);

        router.handleRoute();
      
      })
      .getElement();

    const title = new DOMElement("p").setText( orderID ).setID("full_delivery_order_header_title").getElement();

    const headerNavigationContainer = new DOMElement("div").setID("full_completed_order_header_navigation").append( backBtn, title ).getElement();

    const userIcon = new DOMElement("div").setClass('fa-user icon column full_delivery_order_icon').getElement();

    const userName = new DOMElement("p").setText( client.name ).setClass('full_delivery_order_name').getElement();

    const userHeader = new DOMElement("div").setID("full_completed_order_user_header").append( userIcon, userName ).getElement();

    const locationIcon = new InfoIcon( 'location-dot', client.address ).addClass('full_completed_order_icon').getElement();

    const phoneIcon = new InfoIcon( 'square-phone', client.phone ).addClass('full_completed_order_icon').getElement();

    const commentsIcon = new InfoIcon( 'message', client.comments ).addClass('full_completed_order_icon').getElement();

    const userBody = new DOMElement("div").setID("full_completed_order_user_body").append( locationIcon, phoneIcon, commentsIcon ).getElement();

    const userContainer = new DOMElement("div").setID("full_completed_order_user").append( userHeader, userBody ).getElement();

    return new DOMElement("div").setID("full_completed_order_header").append( headerNavigationContainer, userContainer ).getElement();

  }

  _generateElement() {

    const { products, totalPrice } = this._data.order;

    const header = this._generateHeader();

    const productsTitle = new DOMElement("p").setText('products').setID("full_completed_order_products_title").getElement();

    const productsElement = new ListElement( products, CompletedOrderProduct, "products", "full_completed_order_products", {} ).build();
    
    const productsContainer = new DOMElement("div").setID("full_completed_products_container").append( productsTitle, productsElement ).getElement();

    const totalPriceTitle = new DOMElement("p").setID("full_completed_total_title").setText('total').getElement();

    const totalPriceText = new DOMElement("p").setID("full_completed_total_price").setText(`${ totalPrice } €`).getElement();

    const totalPriceContainer = new DOMElement("div").setID("full_completed_total_container").append( totalPriceTitle, totalPriceText ).getElement();

    return new DOMElement("div").setID('full_completed_order').append( header, productsContainer, totalPriceContainer ).getElement();

  }

};