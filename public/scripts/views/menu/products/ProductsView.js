import DOMElement from "../../base/DOMElement.js";
import EmptyListItem from "../../base/EmptyListItem.js";
import MenuItemsView from "../MenuItemsView.js";
import Product from './Product.js';

import InputElement from "../../general/inputs/InputElement.js";

import { classes } from '../../../config/strings.js';

const { ICONS } = classes;

export default new class ProductsView extends MenuItemsView {
  _itemComponent = Product;
  _removeProductsBtn;
  _addProductBtn;
  _unselectAllBtn;
  _searchInput;
  id = "products";
  _totalToRemove;
  _optional;
  _searching = false;
  title = "products";
  _noSearchText = "No Products Found";
  _availableBtn;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Products', icon: 'fa-burger' }, {  });

  updateProductImage( productID, imageSrc ) {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getID() === productID ) itemElement.updateImage( imageSrc );

    }

  }

  updateProductName( productID, name ) {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getID() === productID ) itemElement.updateName( name );

    }

  }

  updateProductAvailability( productID, available ) {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getID() === productID ) itemElement.updateAvailable( available );

    }

  }

  updateProductsAvailability( products = [] ) {

    const ids = products.map( product => product._id );

    for ( const itemElement of this._itemsElements ) {

      const itemElementID = itemElement.getID();
      
      if ( ids.includes( itemElementID ) ) {

        const index = ids.indexOf( itemElementID );

        itemElement.updateAvailable( products[ index ].available );

      }

    }

  }

  _generateHeaderIcons() {

    const { onAddItem, onRemoveItems, onSelectAll, onUnselectAll, onSwitchAvailability } = this._data.methods;

    this._removeProductsBtn = new DOMElement("div")
      .setClass(`${ ICONS.TRASH } icon-fw list_action`)
      .setID('remove_products_btn')
      .attributes(['title', 'delete selected'])
      .on('click', () => { onRemoveItems(  ); })

    this._availableBtn = new DOMElement("div")
      .setClass(`${ ICONS.ROTATE } icon-fw list_action`)
      .setID('available_products_btn')
      .attributes(['title', 'make unavailable'])
      .on('click', () => { onSwitchAvailability(  ); }) 

    this._addProductBtn = new DOMElement("div")
      .setClass(`${ ICONS.PLUS } icon-fw list_action`)
      .attributes(['title', 'add product'])
      .on('click', () => { onAddItem(  ); })

    this._selectAllBtn = new DOMElement("div")
      .setClass(`${ ICONS.LIST_CHECK } icon-fw list_action`)
      .attributes(['title', 'select all'])
      .on('click', () => { onSelectAll(); })
      .getElement();

    this._unselectAllBtn = new DOMElement("div")
      .setClass(`${ ICONS.TIMES } icon-fw list_action`)
      .attributes(['title', 'unselect selected'])
      .on('click', () => { onUnselectAll(); })
      .getElement();

  }

  _generateHeader() {

    this._generateHeaderIcons();

    this._totalToRemoveText = new DOMElement("p").setID("total_to_remove").getElement();

    this._totalToRemoveContainer = new DOMElement("div").append( this._totalToRemoveText ).setID("total_to_remove_container").getElement();

    this._searchInput = new InputElement("", "", value => { this.filter( value ); }).setID( `${this.id}_search` );

    this._searchInput.build();
    
    this._searchInput.setPlaceholder('Search Products').addClass('list_header_search');

    this._basicIconsContainer = new DOMElement("div").setClass('list_header_basic_icons_container max_height_md').append( this._addProductBtn.getElement() ).getElement();

    const header = new DOMElement("div").setClass('list_header_basic').append( this._searchInput.getElement(), this._basicIconsContainer ).getElement();

    const listActions = new DOMElement("div").setClass('list_header_optional_list').append( this._totalToRemoveContainer, this._selectAllBtn, this._unselectAllBtn ).getElement();

    const listItemsActions = new DOMElement("div").setClass('list_header_optional_items').append( this._removeProductsBtn.getElement(), this._availableBtn.getElement() ).getElement();

    this._optional = new DOMElement("div").setClass('list_header_optional').append( listItemsActions, listActions ).getElement();

    return new DOMElement("div").setClass('list_header').append( header, this._optional ).getElement();

  }

}