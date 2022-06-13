import DOMElement from "../../base/DOMElement.js";

export default class InputElement extends DOMElement {
  _value;
  _label;
  _labelElement;
  _placeholder = '';
  _valueElement;
  _errorText;
  _onInput;
  _inputTimeout;
  _inputTimeoutValue = 250;
  _type = "text";
  _defaultListener = true;

  constructor( label, value, onInput = () => {}, defaultListener = true ) {
    super("div");

    this._value = value;
    this._label = label;
    this._onInput = onInput;
    this._defaultListener = defaultListener;

  }

  getValue() { return this._value; }

  getInputElement() { return this._valueElement }

  update( newValue ) {

    this._value = newValue;
    this._valueElement.value = this._value;

  }

  setType( type ) { this._type = type; return this; }

  setPlaceholder( placeholder ) { this._valueElement.setAttribute('placeholder', placeholder); return this; }

  _generateHeader() {

    this._labelElement = new DOMElement("label").setText( this._label ).setClass('input_label').getElement();

    return new DOMElement("div").setClass('input_header').append( this._labelElement ).getElement();

  }

  _generateBody() {

    this._valueElement = new DOMElement("input").setClass('input_field').attributes(['type', this._type], ['value', this._value]).getElement();
    
    return new DOMElement("div").setClass('input_body').append( this._valueElement ).getElement();

  }

  _generateFooter() {

    this._errorText = new DOMElement("p").setClass('input_error');

    return new DOMElement("div").setClass('input_footer').append( this._errorText.getElement() ).getElement();

  }

  addInputClass( ...cls ) { this._valueElement.classList.add( ...cls ); return this; }

  addClass( ...cls ) { this._element.classList.add( ...cls ); return this; }

  resetError() {

    this._labelElement.classList.remove('label_errored');

    this._valueElement.classList.remove('input_errored');

    this._errorText.setText("");

  }

  onError( message ) {

    this._labelElement.classList.add('label_errored');

    this._valueElement.classList.add('input_errored');

    this._errorText.setText( message );

  }

  setTimeoutDuration( duration ) { this._inputTimeoutValue = duration };

  build() {

    const header = this._generateHeader();

    const body = this._generateBody();

    const footer = this._generateFooter();

    this._valueElement.placeholder = this._placeholder;

    if ( this._defaultListener ) {

      this._valueElement.addEventListener('input', () => {

        this._value = this._valueElement.value;
  
        clearTimeout( this._inputTimeout );
  
        this.resetError();

        this._inputTimeout = setTimeout(() => { this._onInput( this._value ); }, this._inputTimeoutValue);
  
      });

    }

    this.addClass('input').append( header, body, footer ).getElement();

    return this;

  }

};