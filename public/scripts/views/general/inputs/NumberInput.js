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
  _onChange = () => {}
  _defaultListener = false;

  constructor( label, initialValue, increment, minimumValue, maximumValue ) {
    super( label, parseFloat( initialValue ), undefined, false );

    this._initialValue = parseFloat(initialValue);
    this._increment = parseFloat(increment);
    this._minimumValue = parseInt(minimumValue);
    this._maximumValue = parseInt(maximumValue);

  }

  updateMaximumValue( newMaximumValue ) {

    this._maximumValue = newMaximumValue;

    if ( this._value > this._maximumValue ) this.update( this._maximumValue );

  }

  updateMinimumValue( newMinimumValue ) {

    this._minimumValue = newMinimumValue;
    
  }

  round( value, precision ) {

    const multiplier = Math.pow(10, precision || 0);
  
    return Math.round(value * multiplier) / multiplier;
  
  }

  increase() {

    this._value = this.round( this._value + this._increment, 2 );

    this.update( this._value );

    this._onChange( this._value );

  }

  decrease() {

    this._value = this.round( this._value - this._increment, 2 );

    const fixedValue = Number( this._value ) >= 0 ? Number( this._value ) : 0;

    this.update( fixedValue );

    this._onChange( this._value );

  }

  onChange( callback ) {

    this._onChange = newValue => { callback( newValue ); };

  }

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