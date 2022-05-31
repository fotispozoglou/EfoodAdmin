import ListView from '../../base/ListView.js';
import DOMElement from '../../base/DOMElement.js';
import InputElement from '../../general/inputs/InputElement.js';
import CompletedOrder from './CompletedOrder.js';
import EmptyListItem from '../../base/EmptyListItem.js';
import AnalyticsTable from '../../general/AnalyticsTable.js';

export default new class CompletedOrdersView extends ListView {
  _itemComponent = CompletedOrder;
  _parent = document.querySelector("#main_center");
  _rerender = true;
  title = "completed orders";
  _analyticsTable;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Completed Orders', icon: 'fa-check-double' }, {  });

  removeOrder( orderID ) {

    this._ordersCarousel.remove( orderID );

  }

  setAnalytics( analytics ) {

    this._analyticsTable.update( analytics );

  }

  _generateHeader() {

    this._searchInput = new InputElement("", "", value => { this.filter( value ); });

    this._searchInput.build();
    
    this._searchInput.setPlaceholder('Search Order Number').addClass('list_header_search');

    const header = new DOMElement("div").setClass('list_header_basic').append( this._searchInput.getElement() ).getElement();

    return new DOMElement("div").setClass('list_header').append( header ).getElement();

  }

  _generateElement() {

    if ( this._hasRendered ) return this._element;

    this._analyticsTable = new AnalyticsTable( this._data.analytics );

    this._searchable = this._data.searchable;

    const header = this._generateHeader();

    const items = this._generateItems();

    this._itemsContainer = new DOMElement("div").append( ...items ).getElement();

    this._body = new DOMElement("div")
      .setClass('list_body')
      .append( this._itemsContainer );

    if ( items.length < 1 ) {

      this.showNoItemsItem();

    }

    this._hasRendered = true;

    return new DOMElement("div").setID( this.id ).setClass('list').append( this._analyticsTable.build(), header, this._body.getElement() ).getElement();

  }

};