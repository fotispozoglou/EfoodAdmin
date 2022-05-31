import DOMElement from "../base/DOMElement.js";
import SelectionInput from "./inputs/SelectionInput.js";

import { classes } from '../../config/strings.js';

const { ICONS } = classes;

export default class SelectionsElement extends DOMElement {
  _name;
  _type;
  _selections;
  _selectionsElements = [  ];
  _selected;
  _onSelect;
  _selectionsLabel;
  _selectedSelection;
  _selectedSelections = [  ];
  _maximumSelections;
  _isExpanded = false;
  _errorText;
  _header;

  constructor( name, type, selections, selected, maximumSelections, onSelect = () => {  } ) {
    super("div");

    this._name = name;
    this._type = type;

    this._selections = selections;
    this._selected = selected;
    this._maximumSelections = maximumSelections;
    this._onSelect = onSelect;

  }

  hasSelected() { return ( this._selected && this._selected.length > 0 ) }

  getSelected() { return this._selected; }

  getSelectedInfo( id ) { return this._selections.find( s => s._id === id ); }

  updateSelections( ...newSelections ) {

    const newSelectionsIDS = newSelections.map( s => s._id );

    for ( let selectionsIndex = 0; selectionsIndex < this._selections.length; selectionsIndex += 1 ) {

      if ( !(newSelectionsIDS.includes( this._selections[ selectionsIndex ]._id )) ) {

        this.removeSelection( selectionsIndex );

      }

    }

    const selectionsIDS = this._selections.map( s => s._id );

    for ( const newSelection of newSelections ) {

      if ( !(selectionsIDS.includes( newSelection._id )) ) {

        this.addSelection( newSelection );

      } 

    }

    this._maximumSelections = newSelectionsIDS.length;

  }

  removeSelection( selectionsIndex ) {

    const selectionID = this._selections[ selectionsIndex ]._id;

    if ( this.isSelected( selectionID ) ) {
      
      this._selected.splice( this._selected.indexOf( selectionID ) );

      this._selectedSelections.splice( this._selectedSelections.findIndex(s => s.getID() === selectionID), 1 );

    }

    this._selections.splice( selectionsIndex, 1 );

    this._selectionsElements[ selectionsIndex ].remove();

    this._selectionsElements.splice( selectionsIndex, 1 );

    this.updateTitle();

  }

  addSelection( selection ) {

    this._selections.push( selection );

    const isSelected = this.isSelected( selection._id );

    const selectionElement = new SelectionInput( selection, this._type, isSelected, selection => { this.onSelect( selection ); });

    if ( isSelected && this._type === "radio" ) this._selectedSelection = selectionElement;

    this._selectionsElements.push( selectionElement );

    this._selectionsElement.insertAdjacentElement('beforeend', selectionElement.build());

    if ( this._isExpanded ) {

      const height = this._body.children[0].children[0].getClientRects()[0].height * this._body.children[0].childElementCount;

      this._body.style.maxHeight = `${ height + 20 }px`;

    }

    this.updateTitle();

  }

  updateTitle() {

    const title = this.getSelectedTitle();

    this._selectionsTitle.textContent = title;

  }

  showEmptyMessage() {

    console.log("EMPTY");

  }

  toggleSelections() {

    if ( !(this._selections.length > 0) ) return this.showEmptyMessage();

    const height = this._body.children[0].children[0].getClientRects()[0].height * this._body.children[0].childElementCount;

    this._body.style.maxHeight = this._isExpanded ? '0px' : `${ height + 20 }px`;

    this._isExpanded = !this._isExpanded;

  }

  handleRadioSelect( selection, isSelected ) {

    const selectionID = selection.getID();

    if ( this._selectedSelection ) this._selectedSelection.unselect();

    this._selectedSelection = selection;

    this._selected = selectionID;

    const title = this.getSelectedTitle();

    this._selectionsTitle.textContent = title;

    return selection.select();

  }

  handleCheckboxSelect( selection, isSelected ) {

    const selectionID = selection.getID();

    if ( isSelected ) {

      this._selectedSelections.splice( this._selectedSelections.findIndex(s => s.getID() === selectionID), 1 );

      this._selected.splice( this._selected.indexOf( selectionID ), 1 );

      this.updateTitle();

      return selection.unselect();

    }

    if ( this._selectedSelections.length >= this._maximumSelections ) return false;

    this._selectedSelections.push( selection );

    this._selected.push( selectionID ); 

    this.updateTitle();

    selection.select();

  }

  onSelect( selection ) {

    this.resetError();

    const selectionID = selection.getID();

    const isSelected = this.isSelected( selectionID );

    this._type === "checkbox" ? this.handleCheckboxSelect( selection, isSelected ) : this.handleRadioSelect( selection, isSelected );   

    this._onSelect( this._selected );

  }   

  isSelected( itemID ) {

    if ( this._type === "checkbox" ) {

      return this._selected.includes( itemID );

    }

    return this._selected === itemID;

  }

  _generateSelections() {

    const selections = [  ];

    for ( const selection of this._selections ) {

      const isSelected = this.isSelected( selection._id );

      const selectionElement = new SelectionInput( selection, this._type, isSelected, selection => { this.onSelect( selection ); });

      if ( isSelected && this._type === "radio" ) this._selectedSelection = selectionElement;

      this._selectionsElements.push( selectionElement );

      selections.push( selectionElement.build() );

    }

    return new DOMElement("div").setClass('selections_inputs').append( ...selections ).getElement();

  }

  resetError() {

    this._header.classList.remove('border_errored');

    this._selectionsLabel.classList.remove('label_errored');

    this._errorText.setText("");

  }

  onError( message ) {

    this._header.classList.add('border_errored');

    this._selectionsLabel.classList.add('label_errored');

    this._errorText.setText( message );

  }

  pushLabel() { this._selectionsLabel.classList.add('pushed_label'); }

  resetLabel() { this._selectionsLabel.classList.remove('pushed_label'); }

  getRadioSelectedTitle() {

    let title = `select ${ this._name }`;

    for ( const selection of this._selections ) {

      if ( selection._id === this._selected ) title = selection.name;

    }

    if ( this._selectionsTitle ) {

      this._selectionsTitle.classList.remove('inactive_text');

      if ( this._selected.length <= 0 ) this._selectionsTitle.classList.add('inactive_text');

    }

    return title;

  }

  getCheckboxSelectedTitle() {

    const selectionsNames = [  ];

    for ( const selection of this._selections ) {

      if ( this._selected.includes(selection._id) ) selectionsNames.push( selection.name );

    }

    if ( this._selectionsTitle ) {

      this._selectionsTitle.classList.remove('inactive_text');

      if ( selectionsNames.length <= 0 ) this._selectionsTitle.classList.add('inactive_text');

    }

    if ( selectionsNames.length > 5 ) return `${ selectionsNames.length } ${ this._name } selected`;

    return selectionsNames.length > 0 ? selectionsNames.join(', ') : `select ${ this._name }`;

  }

  getSelectedTitle() {

    return this._type === "radio" ? this.getRadioSelectedTitle() : this.getCheckboxSelectedTitle();

  }

  build() {

    this._selectionsElement = this._generateSelections();

    this._selectionsLabel = new DOMElement("label").setClass('selections_label pushed_label').setText( this._name ).getElement();

    const title = this.getSelectedTitle();

    this._selectionsTitle = new DOMElement("p").setClass('selections_title').setText( title ).getElement();

    if ( !this.hasSelected() ) this._selectionsTitle.classList.add('inactive_text');

    const toggleSelectionsBtn = new DOMElement("div").setClass(`${ ICONS.ANGLE_DOWN } toggle_selections_btn`).getElement();

    toggleSelectionsBtn.addEventListener('click', e => { e.stopPropagation(); this.toggleSelections(); });

    const titleContainer = new DOMElement("div").setClass('selections_header_container').append( this._selectionsLabel, this._selectionsTitle ).getElement();

    this._header = new DOMElement("div").setClass('selections_header').on('click', () => { this.toggleSelections(); }).append( titleContainer, toggleSelectionsBtn ).getElement();

    this._body = new DOMElement("div").setClass('selections_body').append( this._selectionsElement ).getElement();

    this._errorText = new DOMElement("p").setClass('selections_error');

    const footer = new DOMElement("div").setClass('selections_footer').append( this._errorText.getElement() ).getElement();

    this.setClass('selections').append( this._header, this._body, footer ).getElement();

    return this;

  }

};