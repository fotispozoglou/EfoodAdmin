import DOMElement from "../base/DOMElement.js";
import ListElement from "../base/ListElement.js";
import ListItem from "../base/ListItem.js";

export default class CarouselElement extends ListElement {
  _currentItemIndex;
  _carouselItems = [  ];
  _body;
  _getItemTitle;
  _titleElement;

  constructor(items, itemComponent = ListItem, title, id, methods, getItemTitle = item => { return item.name; } ) {
    super( items, itemComponent, title, id, methods );

    this._getItemTitle = getItemTitle;

  }

  remove( ...itemsIDS ) {

    let found = false;

    let itemIndex = 0;

    while ( !found && itemIndex < this._itemsELS.length ) {

      if ( itemsIDS.includes( this._itemsELS[ itemIndex ].getID() ) ) {

        this._itemsELS[ itemIndex ].remove();

        this._itemsELS.splice( itemIndex, 1 );

        this._itemsIDS.splice( itemIndex, 1 );

        this._carouselItems.splice( itemIndex, 1 );

        this._items.splice( itemIndex, 1 );

        found = true;

      }

      if ( !found ) itemIndex += 1;

    }

    if ( this._itemsELS.length <= 0 ) {

      return this._titleElement.setText( 'No Items' );

    }

    this._currentItemIndex = itemIndex >= this._items.length ? 0 : itemIndex;

    this.current();

  }

  setIndex( index ) { this._currentItemIndex = index; }

  current() {

    this._body.empty();

    this._body.append( this._carouselItems[ this._currentItemIndex ] );

    const title = this._getItemTitle( this._items[ this._currentItemIndex ] );

    this._titleElement.setText( title );

  }

  next() {

    if ( this._carouselItems.length <= 1 ) return;

    this._currentItemIndex = this._currentItemIndex + 1 >= this._carouselItems.length ? 0 : this._currentItemIndex + 1;

    this._body.empty();

    this._body.append( this._carouselItems[ this._currentItemIndex ] );

    const title = this._getItemTitle( this._items[ this._currentItemIndex ] );

    this._titleElement.setText( title );

  }

  previous() {

    if ( this._carouselItems.length <= 1 ) return;

    this._currentItemIndex = this._currentItemIndex - 1 < 0 ? this._carouselItems.length - 1 : this._currentItemIndex - 1;

    this._body.empty();

    this._body.append( this._carouselItems[ this._currentItemIndex ] );

    const title = this._getItemTitle( this._items[ this._currentItemIndex ] );

    this._titleElement.setText( title );

  }

  build() {

    const nextBtn = new DOMElement("div").setClass('icon icon-fw fa-angle-right carousel_next_btn').on('click', () => { this.next(); }).getElement();

    this._titleElement = new DOMElement("p").setText( this._items.length > 0 ? this._getItemTitle( this._items[0] ) : 'No Items' ).setClass('carousel_title');

    const previousBtn = new DOMElement("div").setClass('icon icon-fw fa-angle-left carousel_previous_btn').on('click', () => { this.previous(); }).getElement();

    const header = new DOMElement("div").setClass('carousel_header').append( previousBtn, this._titleElement.getElement(), nextBtn ).getElement();

    this._carouselItems = this._generateItems();

    this._currentItemIndex = 0;

    this._body = new DOMElement("div").setClass('carousel_body');

    if ( this._items.length > 0 ) this._body.append( this._carouselItems[0] );

    this.setID( this._id );

    this.setClass(`list carousel`);

    return this.append( header, this._body.getElement() ).getElement();

  }

}