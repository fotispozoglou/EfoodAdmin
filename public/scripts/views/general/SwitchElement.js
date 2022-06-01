import DOMElement from "../base/DOMElement.js";
import SwitchSelection from "./inputs/SwitchSelection.js";

export default class SwitchElement extends DOMElement {
  _selections = [];
  _selectedValue;
  _selectedSelection;
  _onSwitch;
  _errorText;
  _selectionsElements = [  ];

  constructor( selections, onSwitch = () => {} ) {
    super("div");

    this._selections = selections;
    this._onSwitch = onSwitch;

  }

  getValue() { return this._selectedValue };

  onError( message ) {

    this._errorText.setText( message );

  }

  resetError(  ) {

    this._errorText.setText( '' );

  }

  _generateSelections() {

    const selectionsContainer = new DOMElement("div").setClass('switch_element_selections');

    for ( const selection of this._selections ) {

      const selectionElement = new SwitchSelection( selection.name, selection.id, selection.selected );

      if ( selection.selected ) {
        
        this._selectedValue = selection.value;

        this._selectedSelection = selectionElement;

      }

      selectionElement.on('click', () => {

        if ( this._selectedValue === selection.value ) return;

        if ( this._selectedSelection ) this._selectedSelection.unselect();

        this._selectedSelection = selectionElement;

        this._selectedValue = selection.value;

        this._selectedSelection.select();

        this.resetError();

        this._onSwitch( this._selectedValue );

      });

      selectionsContainer.append( selectionElement.build() );

    }

    return selectionsContainer.getElement();

  }

  build() {

    const selectionsContainer = this._generateSelections();

    this.setClass('switch_selection');

    this._errorText = new DOMElement("p").setClass('switch_selection_error_text');

    const errorContainer = new DOMElement("div").setClass('switch_selection_error').append( this._errorText.getElement() ).getElement();

    this.append( selectionsContainer, errorContainer );

    return this;

  }

}