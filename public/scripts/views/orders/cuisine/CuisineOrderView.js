import DOMElement from '../../base/DOMElement.js';
import ListElement from '../../base/ListElement.js';
import View from '../../base/View.js';
import CuisineOrderProduct from './CuisineOrderProduct.js';

export default new class CuisineOrderView extends View {
  _parent = document.querySelector("#main_center");
  title = "cuisine order"

  _generateElement() {

    const { products, orderID } = this._data.order;

    const { onGoBack } = this._data.methods;

    const backBtn = new DOMElement("div").setClass('icon fa-arrow-left back_btn cuisine_order_header_back').on('click', () => { onGoBack(); }).getElement();

    const title = new DOMElement("p").setText( orderID ).setClass('cuisine_order_header_title').getElement();

    const header = new DOMElement("div").setClass('cuisine_order_header').append( backBtn, title ).getElement();

    const body = new ListElement( products, CuisineOrderProduct, "", "", {}).build();

    return new DOMElement("div").setClass('cuisine_order').append( header, body ).getElement();

  }

};