import DOMElement from "../../base/DOMElement.js";
import EmptyListItem from "../../base/EmptyListItem.js";
import ListView from "../../base/ListView.js";
import InputElement from "../../general/inputs/InputElement.js";
import PendingOrder from "./PendingOrder.js";

export default new class PendingOrdersView extends ListView {
  _itemComponent = PendingOrder;
  _rerender = true;
  _parent = document.querySelector("#main_center");
  title = "pending orders";
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Pending Orders', icon: 'fa-clock' }, {  });

  _generateHeader() {

    this._searchInput = new InputElement("", "", value => { this.filter( value ); });

    this._searchInput.build();
    
    this._searchInput.setPlaceholder('Search Order Number').addClass('list_header_search');

    const header = new DOMElement("div").setClass('list_header_basic').append( this._searchInput.getElement() ).getElement();

    return new DOMElement("div").setClass('list_header').append( header ).getElement();

  }

};