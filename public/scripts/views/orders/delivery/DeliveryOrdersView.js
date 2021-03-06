import ListView from "../../base/ListView.js";
import DeliveryOrder from "./DeliveryOrder.js";
import InputElement from "../../general/inputs/InputElement.js";
import DOMElement from "../../base/DOMElement.js";
import EmptyListItem from '../../base/EmptyListItem.js';

export default new class DeliveryOrdersView extends ListView {
  _itemComponent = DeliveryOrder;
  _rerender = true;
  _parent = document.querySelector("#main_center");
  title = "delivery orders";
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Delivery Orders', icon: 'fa-truck' }, {  });

  _generateHeader() {

    this._searchInput = new InputElement("", "", value => { this.filter( value ); });

    this._searchInput.build();
    
    this._searchInput.setPlaceholder('Search Order Number').addClass('list_header_search');

    const header = new DOMElement("div").setClass('list_header_basic').append( this._searchInput.getElement() ).getElement();

    return new DOMElement("div").setClass('list_header').append( header ).getElement();

  }

}