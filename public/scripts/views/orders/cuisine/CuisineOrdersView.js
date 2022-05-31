import ListView from '../../base/ListView.js';
import DOMElement from '../../base/DOMElement.js';

import CuisineOrder from './CuisineOrder.js';
import InputElement from '../../general/inputs/InputElement.js';

import EmptyListItem from '../../base/EmptyListItem.js';

export default new class CuisineOrdersView extends ListView {
  _itemComponent = CuisineOrder;
  _parent = document.querySelector("#main_center");
  _rerender = true;
  title = "cuisine orders";
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Cuisine Orders', icon: 'fa-utensils' }, {  });

  _generateHeader() {

    this._searchInput = new InputElement("", "", value => { this.filter( value ); });

    this._searchInput.build();
    
    this._searchInput.setPlaceholder('Search Order Number').addClass('list_header_search');

    const header = new DOMElement("div").setClass('list_header_basic').append( this._searchInput.getElement() ).getElement();

    return new DOMElement("div").setClass('list_header').append( header ).getElement();

  }

};