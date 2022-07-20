import DOMElement from "../../base/DOMElement.js";
import InputElement from "./InputElement.js";

import { classes } from '../../../config/strings.js';

const { ICONS } = classes;

export default class NumberInput extends InputElement {
  _initialValue;
  _increment;
  _minimumValue;
  _maximumValue;
  _body;
  _minimumValueError;
  _maximumValueError;
  _onChange = () => {}
  _defaultListener = false;

  constructor( label, initialValue, increment, minimumValue, maximumValue ) {
    super( label, parseFloat( initialValue ), undefined, false );

    this._initialValue = parseFloat(initialValue);
    this._increment = parseFloat(increment);
    this._minimumValue = parseInt(minimumValue);
    this._maximumValue = parseInt(maximumValue);

  }

  setMinimumValueError( error ) { this._minimumValueError = error; }

  setMaximumValueError( error ) { this._maximumValueError = error; }

  updateMaximumValue( newMaximumValue ) {

    this._maximumValue = newMaximumValue;

    if ( this._value > this._maximumValue ) this.update( this._maximumValue );

  }

  updateMinimumValue( newMinimumValue ) {

    this._minimumValue = newMinimumValue;

    if ( this._value < this._minimumValue ) this.update( this._minimumValue );
    
  }

  round( value, precision ) {

    const multiplier = Math.pow(10, precision || 0);
  
    return Math.round(value * multiplier) / multiplier;
  
  }

  increase() {

    if ( ( this._value + this._increment ) > this._maximumValue ) return this.onError( this._maximumValueError );

    this._value = this.round( this._value + this._increment, 2 );

    this.update( this._value );

    if ( this.isInRange() ) this.resetError();

    this._onChange( this._value );

  }

  decrease() {

    if ( ( this._value - this._increment ) < this._minimumValue ) return this.onError( this._minimumValueError );

    this._value = this.round( this._value - this._increment, 2 );

    const fixedValue = Number( this._value ) >= 0 ? Number( this._value ) : 0;

    this.update( fixedValue );

    if ( this.isInRange() ) this.resetError();

    this._onChange( this._value );

  }

  onChange( callback ) {

    this._onChange = newValue => { callback( newValue ); };

  }

  isInRange( value = this._value ) { return value <= this._maximumValue && value >= this._minimumValue; }

  resetError() {

    this._labelElement.classList.remove('label_errored');

    this._valueElement.classList.remove('inherit_background');

    this._body.removeClass('border_errored background_errored');

    this._errorText.setText("");

  }

  onError( message ) {

    this._labelElement.classList.add('label_errored');

    this._valueElement.classList.add('inherit_background');

    this._body.addClass('border_errored background_errored');

    this._errorText.setText( message );

  }

  _generateBody() {

    const decreaseBtn = new DOMElement("div")
      .setClass(`${ ICONS.MINUS } number_input_btn number_input_btn_left`)
      .on('click', () => { this.resetError(); this.decrease(); })
      .getElement();

    const increaseBtn = new DOMElement("div")
      .setClass(`${ ICONS.PLUS } number_input_btn number_input_btn_right`)
      .on('click', () => { this.resetError(); this.increase(); })
      .getElement();

    const numberInputContainer = new DOMElement("div").setClass('number_input_actions_container').append( decreaseBtn, increaseBtn ).getElement();

    this._valueElement = new DOMElement("input").setClass('number_input_field').attributes(['type', 'text'], ['value', this._value]).getElement();

    this._valueElement.addEventListener('input', e => {

      const { value } = this._valueElement;

      this.resetError();

      if ( value.length > 0 ) this.update( value );

    });

    this._body = new DOMElement("div").setClass('input_body').append( this._valueElement, numberInputContainer );

    return this._body.getElement();

  }

};