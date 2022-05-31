import DOMElement from "../base/DOMElement.js";
import SwitchSelection from "./inputs/SwitchSelection.js";

export default class SwitchElement extends DOMElement {
  _selections = [];
  _selectedValue;
  _selectedSelection;
  _onSwitch;
  _selectionsElements = [  ];

  constructor( selections, onSwitch = () => {} ) {
    super("div");

    this._selections = selections;
    this._onSwitch = onSwitch;

  }

  getValue() { return this._selectedValue };

  _generateSelections() {

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

        this._onSwitch( this._selectedValue );

      });

      this._selectionsElements.push( selectionElement.build() );

    }

  }

  build() {

    this._generateSelections();

    this.setClass('switch_selection');

    this.append( ...this._selectionsElements );

    return this;

  }

}