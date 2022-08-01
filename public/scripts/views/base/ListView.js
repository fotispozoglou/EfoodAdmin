import ListItem from './ListItem.js';
import View from './View.js';
import DOMElement from './DOMElement.js';
import EmptyListItem from './EmptyListItem.js';

const intersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1
};

export default class ListView extends View {
  _itemsElements = [];
  _items = [];
  _body;
  id = "";
  _searching = false;
  _searchable = false;
  _hasRendered = false;
  _itemComponent = ListItem;
  _spinnerElement;
  _itemsContainer;
  _spinnerElementContainer;
  _noSearchText = "No Items Found";
  _noSearchRendered;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Items', icon: 'fa-solid fa-times' }, {  });
  _noSearch = new EmptyListItem({ _id: 2, name: '', icon: 'fa-solid fa-magnifying-glass' }, {  });
  _intersectObserver;
  _observedNode = null;
  _intersect = false;

  hideNoItemsItem() {

    this._noItemsItem.remove();

  }

  showNoItemsItem() {

    if ( !this._body ) return;

    this.hideNoItemsItem();

    this._body.append( this._noItemsItem.build() );

  }

  hideNoSearched() {

    this._noSearch.remove();

    this._noSearchRendered = false;

  }

  showNoSearched() {

    if ( !this._body ) return;

    this.hideNoSearched();

    this._noSearch.updateName( this._noSearchText );

    this._body.append( this._noSearch.build() );

    this._noSearchRendered = true;

  }

  _generateHeader() {

    return new DOMElement("div").setClass('list_header').getElement();

  }

  filter( value ) {

    this._searching = value.length > 0;

    if ( this._itemsElements.length < 1 ) return;

    value = value.toUpperCase();

    let found = false;

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getSearchable().toUpperCase().indexOf( value ) > -1 ) {

        found = true;

        itemElement.getElement().style.display = 'flex';

      } else { itemElement.getElement().style.display = 'none'; }

    }

    if ( found ) return this.hideNoSearched();

    if ( !this._noSearchRendered ) this.showNoSearched();

  }

  emptyList() {

    this._body.empty();

  }

  add( ...items ) {

    if ( !this._hasRendered ) return;

    for ( const item of items ) {

      const itemElement = new this._itemComponent( item, this._data.itemMethods || {  } );

      this._itemsElements.push( itemElement );

      this._items.push( item );

      this._itemsContainer.append( itemElement.build() );

    }

    if ( this._items.length > 1 && this._data.intersect ) {
     
      this.attachIntersectObserver( 
        this._itemsElements[ this._itemsElements.length - 1 ].getElement(),  
        this._data.methods.onIntersect
      );

    }

    if ( items.length <= 0 && this._items.length < 1 ) {
      
      return this.showNoItemsItem();

    }

    this.hideNoItemsItem();

  }

  removeItems( ...itemsIDS ) {

    let foundAll = false;
    let totalFound = 0;

    let itemsIndex = 0;

    while ( !foundAll && itemsIndex < this._itemsElements.length ) {

      if ( itemsIDS.includes( this._itemsElements[ itemsIndex ].getID() ) ) {

        this._itemsElements[ itemsIndex ].remove();

        this._itemsElements.splice( itemsIndex, 1 );

        totalFound += 1;

        if ( totalFound >= itemsIDS.length ) foundAll = true;

        itemsIndex -= 1;

      }

      itemsIndex += 1;

    }

    if ( this._itemsElements.length < 1 ) {

      this.showNoItemsItem();

    }

  }

  _generateItems() {

    const items = [];

    for ( const item of this._data.items ) {

      const itemElement = new this._itemComponent( item, this._data.itemMethods || {  } );

      this._itemsElements.push( itemElement );

      items.push( itemElement.build() );

    }

    if ( this._data.items.length < 1 ) {

      this.showNoItemsItem();

    }

    if ( this._data.items.length > 1 && this._data.intersect ) {
     
      this.attachIntersectObserver( items[ this._data.items.length - 1 ] );

    }

    return items;

  }

  intersectionObserverCallback( entries, onIntersect ) {

    if ( entries[0].isIntersecting ) {

      if ( !this._searching ) {
       
        onIntersect();

      }

    }

  }

  attachIntersectObserver( node, onIntersect ) {

    if ( this._observedNode !== null ) this.removeIntersectObserver();

    this._intersectObserver = new IntersectionObserver( entries => { this.intersectionObserverCallback( entries, onIntersect ); }, intersectionObserverOptions );

    this._observedNode = null;

    this._observedNode = node;

    this._intersectObserver.observe( node );

  }

  removeIntersectObserver(  ) {

    this._intersectObserver.unobserve( this._observedNode );

  }

  _generateElement() {

    if ( this._hasRendered ) return this._element;

    if ( this._data.intersect ) this._intersect = true;

    this._searchable = this._data.searchable;

    const header = this._generateHeader();

    const items = this._generateItems();

    this._itemsContainer = new DOMElement("div").setClass('list_body_items').append( ...items ).getElement();

    this._body = new DOMElement("div")
      .setClass('list_body')
      .append( this._itemsContainer );

    if ( items.length < 1 ) {

      this.showNoItemsItem();

    }

    this._hasRendered = true;

    return new DOMElement("div").setID( this.id ).setClass('list').append( header, this._body.getElement() ).getElement();

  }

}