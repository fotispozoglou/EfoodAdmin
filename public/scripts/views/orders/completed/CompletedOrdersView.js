import ListView from '../../base/ListView.js';
import DOMElement from '../../base/DOMElement.js';
import InputElement from '../../general/inputs/InputElement.js';
import CompletedOrder from './CompletedOrder.js';
import EmptyListItem from '../../base/EmptyListItem.js';
import AnalyticsTable from '../../general/AnalyticsTable.js';
import NavigationButton from '../../general/NavigationButton.js';

export default new class CompletedOrdersView extends ListView {
  _itemComponent = CompletedOrder;
  _parent = document.querySelector("#main_center");
  _rerender = true;
  title = "completed orders";
  _loadAPIOrders = async () => {}
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Completed Orders', icon: 'fa-check-double' }, {  });

  removeOrder( orderID ) {

    this._ordersCarousel.remove( orderID );

  }

  async filter( value ) {

    this._searching = value.length > 0;

    if ( this._itemsElements.length < 1 ) return;

    value = value.toUpperCase();

    let found = false;

    const exclude = [  ];

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getSearchable().toUpperCase().indexOf( value ) > -1 ) {

        found = true;

        exclude.push( itemElement.getID() );

        itemElement.getElement().style.display = 'flex';

      } else { itemElement.getElement().style.display = 'none'; }

    }

    if ( value.length > 0 ) {

      const { data } = await this._loadAPIOrders( value, exclude );

      this.add( ...data.orders );

    }

    if ( found ) return this.hideNoSearched();

    if ( !this._noSearchRendered ) this.showNoSearched();

  }

  _generateHeader() {

    this._searchInput = new InputElement("", "", value => { 
      
      this.filter( value ); 
    
    });

    this._searchInput.setTimeoutDuration( 1000 );

    this._searchInput.build();
    
    this._searchInput.setPlaceholder('Search Order Number').addClass('list_header_search');

    const header = new DOMElement("div").setClass('list_header_basic').append( this._searchInput.getElement() ).getElement();

    return new DOMElement("div").setClass('list_header').append( header ).getElement();

  }

  _generateElement() {

    const { loadAPIOrders } = this._data.methods;

    this._loadAPIOrders = loadAPIOrders;

    if ( this._hasRendered ) return this._element;

    const navigateAnalytics = new NavigationButton('orders analytics', 'fa-chart-line')
      .on('click', () => { this._data.methods.onRenderAnalytics(); });

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

    return new DOMElement("div").setID( this.id ).setClass('list').append( navigateAnalytics.build(), header, this._body.getElement() ).getElement();

  }

};