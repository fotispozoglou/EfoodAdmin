import DOMElement from './DOMElement.js';
import EmptyListItem from './EmptyListItem.js';
import ListItem from './ListItem.js';

export default class ListElement extends DOMElement {
  _items;
  _itemsELS = [];
  _itemComponent;
  _title;
  _id;
  _itemsIDS = [  ];
  _methods;
  _itemData;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Items', icon: 'fa-solid fa-times' }, {  }).build();

  constructor( items, itemComponent = ListItem, title, id, methods, itemData = {} ) {
    super("div");

    this._items = items;
    this._itemComponent = itemComponent;
    this._title = title;
    this._id = id;
    this._itemData = itemData;
    this._methods = methods;

  }

  setNoItemsItem( item = EmptyListItem ) { this._noItemsItem = item; }

  hideNoItemsItem() {

    this._noItemsItem.remove();

  }

  showNoItemsItem() {

    if ( !this ) return;

    this.hideNoItemsItem();

    this.append( this._noItemsItem );

  }

  customModify( callback ) {

    for ( const element of this._itemsELS ) {

      callback( element );

    }

  }

  updateItem( itemID, itemData ) {

    let found = false;

    let itemIndex = 0;

    while ( !found && itemIndex < this._itemsELS.length ) {

      if ( itemID === this._itemsELS[ itemIndex ].getID() ) {

        this._itemsELS[ itemIndex ].update( itemData );

        found = true;

      }

      if ( !found ) itemIndex += 1;

    }

  }

  remove( ...itemsIDS ) {

    let found = false;

    let itemIndex = 0;

    while ( !found && itemIndex < this._itemsELS.length ) {

      if ( itemsIDS.includes( this._itemsELS[ itemIndex ].getID() ) ) {

        this._itemsELS[ itemIndex ].remove();

        this._itemsELS.splice( itemIndex, 1 );

        found = true;

      }

      if ( !found ) itemIndex += 1;

    }

    if ( this._itemsELS.length < 1 ) {

      console.log("EMPTY");

      this.append( this._noItemsItem );

    }

  }

  refresh( ...items ) {

    for ( const itemEL of this._itemsELS ) { itemEL.remove(); }

    this._itemsELS = [  ];
    this._itemsIDS = [  ];

    this.add( ...items );

  }
 
  add( ...items ) {

    for ( const item of items ) {

      const itemEL = new this._itemComponent( item, this._methods, this._itemData );

      this._itemsELS.push( itemEL );

      this._itemsIDS.push( item._id );

      this.append( itemEL.build() );

    }

    if ( items.length <= 0 && this._items.length < 1 ) {
      
      return this.showNoItemsItem();

    }

    this.hideNoItemsItem();

  }

  _generateItems() {

    const itemsELS = [];

    for ( const item of this._items ) {

      const itemEL = new this._itemComponent( item, this._methods, this._itemData );

      this._itemsELS.push( itemEL );

      this._itemsIDS.push( item._id );

      itemsELS.push( itemEL.build() );

    }

    return itemsELS;

  }

  build() {

    const itemsELS = this._generateItems();

    this.setID( this._id );
    this.addClass(`list`);

    itemsELS.length < 1 ? this.append( this._noItemsItem ) : this.append( ...itemsELS );

    return this.getElement();

  }

};