import ListItem from "../../base/ListItem.js";
import DOMElement from "../../base/DOMElement.js";
import SelectionInput from '../../general/inputs/SelectionInput.js';
import SwitchElement from '../../general/SwitchElement.js';
import { router } from "../../../controllers/Router.js";

export default class Product extends ListItem {
  _nameElement;
  _priceElement;
  _selection;
  _tiersElement;
  _available;
  _expandedActions = false;

  constructor({ _id, name, available }, methods) {
    super( { _id, name }, methods );

    this._onSelect = methods.onSelect;

    this._available = available;

  }

  hasExpandedActions() { return this._expandedActions; }

  getIsSelected() { return this._expandedActions || this._selection.isSelected(); }

  updateName( name ) {

    this._name = name;
    this._nameElement.textContent = this._name;

  } 

  onSelect(  ) {

    const selected = this._onSelect( this._id );

    this._selection.update( selected );

  }

  setSelected( selected ) { this._selection.update( selected ); }

  updateAvailabilityColors(  ) {

    if ( !this._available ) return this.addClass('unavailable');

    this.removeClass('unavailable');

  }

  updateAvailable( available ) {

    this._available = available;

    this.updateAvailabilityColors()

  }

  buildSkeleton() {

    return new DOMElement("div").setClass('skeleton item_skeleton').getElement();

  }

  build() {

    const { onClick, onRemove, onChangeAvailability } = this._methods;

    this._nameElement = new DOMElement("p").setClass('menu_item_name').setText( this._name ).getElement();

    const header = new DOMElement("a")
      .setClass('menu_item_header')
      .attributes(['title', 'add product'], ['href', `/products/${ this._id }`], ['role', 'link'])
      .append( this._nameElement )
      .getElement();

    router.addLinkClick( header );

    const infoContainer = new DOMElement("div")
      .append( header )
      .setClass('menu_item_info');

    this._selection = new SelectionInput({ _id: this._id, name: "" }, "checkbox", false, () => { this.onSelect(); });

    const removeBtn = new DOMElement("div")
      .setClass('icon fa-trash item_action hidden')
      .on('click', () => { onRemove( this._id ); })  
      .getElement();

    const selections = [
      {
        name: 'available',
        value: true,
        selected: this._available === true
      },
      {
        name: 'not available',
        value: false,
        selected: this._available === false
      }
    ];

    const availableBtn = new SwitchElement( selections, value => { onChangeAvailability( this._id, value ); } )
      .build()
      .addClass('item_available_switch');

    const productActionsContainer = new DOMElement("div")
      .setClass('menu_item_actions_container')
      .append( availableBtn.getElement() );

    const actionsBtn = new DOMElement("div")
      .setClass('icon available_btn fa-ellipsis-vertical')
      .on('click', e => {

        if ( this._expandedActions ) {

          this.style(['backgroundColor', 'white']);

          removeBtn.classList.add('hidden');

          this._selection.removeClass('hidden');

          e.target.classList.remove('selected_actions_btn');

          if ( !this._available ) this.addClass('unavailable');
          
          productActionsContainer.removeClass('menu_item_actions_container_expanded');

        } else {

          if ( this._selection.isSelected() ) this.onSelect(  );

          this.style(['backgroundColor', '#f0eeee']);

          e.target.classList.add('selected_actions_btn');

          removeBtn.classList.remove('hidden');

          this._selection.addClass('hidden');

          this.removeClass('unavailable');

          productActionsContainer.addClass('menu_item_actions_container_expanded');

        }

        this._expandedActions = !this._expandedActions;

      })
      .getElement();

    const selectionContainer = new DOMElement("div")
      .setClass('menu_item_selection_container')
      .append( removeBtn, this._selection.build(), actionsBtn )
      .getElement();

    const mainContainer = new DOMElement("div").setClass('menu_item_main_container').append( infoContainer.getElement(), selectionContainer ).getElement();

    this.setClass('list_item menu_item column').append( mainContainer, productActionsContainer.getElement() ).getElement();

    if ( !this._available ) this.addClass('unavailable');

    return this._element;

  }

}