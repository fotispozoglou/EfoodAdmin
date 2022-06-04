import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';

export default new class OrdersAnalyticsView extends View {
  title = "orders analytics";
  _parent = document.querySelector("#main_center");

  _generateElement() {

    return new DOMElement("div").setID("orders_analytics").getElement();

  }

};