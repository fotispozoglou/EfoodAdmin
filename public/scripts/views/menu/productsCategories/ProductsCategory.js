import ListItem from "../../base/ListItem.js";
import DOMElement from "../../base/DOMElement.js";
import SelectionInput from "../../general/inputs/SelectionInput.js";
import { router } from "../../../controllers/main.js";

export default class ProductsCategory extends ListItem {
  _nameElement;
  _selection;

  constructor({ _id, name }, methods) {
    super( { _id, name }, methods );

    this._onSelect = methods.onSelect;

  }

  getIsSelected() { return this._selection.isSelected(); }

  updateName( name ) {

    this._name = name;
    this._nameElement.textContent = this._name;

  } 

  onSelect(  ) {

    const selected = this._onSelect( this._id );

    this._selection.update( selected );

  }

  setSelected( selected ) { this._selection.update( selected ); }

  build() {

    const { onClick, onRemove } = this._methods;

    this._nameElement = new DOMElement("a")
      .setClass('menu_item_name')
      .setText( this._name )
      .attributes(['title', 'add product'], ['href', `/productsCategories/${ this._id }`], ['role', 'link'])
      .getElement();

    router.addLinkClick( this._nameElement );

    const removeBtn = new DOMElement("div")
      .setClass('icon remove_item_btn fa-trash')
      .on('click', () => { onRemove( this._id ); })
      .getElement();

    this._selection = new SelectionInput( { _id: this._id, name: '' }, "checkbox", false, () => { this.onSelect( ); } ).addClass('item_selection')

    const mainContainer = new DOMElement("div").setClass('menu_item_main_container').append( this._nameElement ).getElement();

    const selectionContainer = new DOMElement("div").setClass('menu_item_selection_container').append( removeBtn, this._selection.build() ).getElement();

    this.setClass('list_item menu_item no_image_menu_item').append( mainContainer, selectionContainer ).getElement();

    return this._element;

  }

}