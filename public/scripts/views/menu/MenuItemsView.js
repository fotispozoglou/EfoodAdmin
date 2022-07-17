import ListView from "../base/ListView.js";
import DOMElement from "../base/DOMElement.js";

import { classes } from '../../config/strings.js';

const { ICONS } = classes;

import InputElement from "../general/inputs/InputElement.js";
import { router } from "../../controllers/main.js";

export default class MenuItemsView extends ListView {
  _parent = document.querySelector("#main_center");
  _basicIconsContainer;
  _addURL = "/products/add";

  selectAll() {

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getIsSelected() == false ) itemElement.setSelected( true );

    }

  }

  unselectAll() {

    for ( const itemElement of this._itemsElements ) {

      itemElement.setSelected( false );

    }

  }

  updateTotalToRemove( ttr ) {

    if ( ttr <= 0 ) { 

      this._totalToRemoveText.textContent = `${ 0 }`;

      this._totalToRemoveContainer.classList.add('hidden');

      this._basicIconsContainer.classList.add('max_height_md', 'td-250');
     
      return this._optional.classList.remove('max_height_md');

    }

    this._totalToRemoveContainer.classList.remove('hidden');

    this._totalToRemoveText.textContent = `${ ttr }`;

    this._basicIconsContainer.classList.remove('max_height_md');

    this._optional.classList.add('max_height_md', 'td-250');

  }

  _generateHeaderIcons() {

    const { onAddItem, onRemoveItems, onSelectAll, onUnselectAll } = this._data.methods;

    this._removeProductsBtn = new DOMElement("div")
      .setClass(`${ ICONS.TRASH } icon-fw list_action`)
      .setID('remove_products_btn')
      .attributes(['title', 'delete selected'])
      .on('click', () => { onRemoveItems(  ); })

    this._addProductBtn = new DOMElement("a")
      .setClass(`${ ICONS.PLUS } icon-fw list_action`)
      .attributes(['title', 'add product'], ['href', this._addURL], ['role', 'link']);

    router.addLinkClick( this._addProductBtn.getElement() );

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

    const listItemsActions = new DOMElement("div").setClass('list_header_optional_items').append( this._removeProductsBtn.getElement() ).getElement();

    this._optional = new DOMElement("div").setClass('list_header_optional').append( listItemsActions, listActions ).getElement();

    return new DOMElement("div").setClass('list_header').append( header, this._optional ).getElement();

  }

};