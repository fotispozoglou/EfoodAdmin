import View from "./View.js";
import DOMElement from "./DOMElement.js";

import { classes } from '../../config/strings.js';
import { router } from "../../controllers/Router.js";

const { ICONS } = classes;

const getSuccessfulElement = message => {

  const icon = new DOMElement("div").setClass(`${ ICONS.CHECK_CIRCLE } success_item_edit_icon`).getElement();

  const messageElement = new DOMElement("p").setText( message ).setClass('success_item_edit_message').getElement();

  return new DOMElement("div").setClass('success_item_edit').append( icon, messageElement ).getElement();

};

export default class EditItemView extends View {
  _parent = document.querySelector("#main_center");
  _body;
  _header;
  _inputsElements;
  _inputs = [  ];
  _footer;
  _backURL = '/products';

  onSuccess( message ) {

    const succElement = getSuccessfulElement( message );

    this._header.append( succElement );

    this._body.addClass('hidden');

    this._footer.addClass('hidden');

    setTimeout(() => {

      succElement.remove();

      this._body.removeClass('hidden');

      this._footer.removeClass('hidden');

    }, 2500);

  }

  onError( errors ) {

    const fieldsNames = errors.map(error => error.field);
    const errorsMessages = errors.map(error => error.errors);

    for ( let i = 0; i < this._inputs.length; i += 1 ) {

      const fieldNameIndex = fieldsNames.findIndex(fieldName => fieldName === this._inputs[i][0]);

      if ( fieldNameIndex >= 0 ) {

        this._inputs[i][1].onError( errorsMessages[ fieldNameIndex ] );

      }

    }

  }

  _generateHeader() {

    const backBtn = new DOMElement("a")
      .setClass('edit_item_header_action icon')
      .attributes(['href', this._backURL], ['role', 'link'])
      .attributes(['title', 'add product'], ['href', this._backURL], ['role', 'link'])
      .on('click', event => { 
        
        event.preventDefault(); 

        window.history.pushState({}, {}, this._backURL);

        router.handleRoute();
      
      })
      .getElement();

    return new DOMElement("div").setID("edit_item_header").append( backBtn );

  }

  _generateBody() {

    this._inputsElements = this._generateInputs();

    return new DOMElement("div").setID("edit_item_body").append( ...this._inputsElements );

  }

  _generateActions() {

    const actions = [];

    for ( const action of this._data.actions ) {

      const actionEL = new DOMElement("button").setClass("edit_item_footer_action").setText( action.name ).getElement();

      actionEL.addEventListener('click', () => { action.exec(); } );

      actions.push( actionEL );

    }

    return actions;

  }

  _generateFooter() {

    const actions = this._generateActions();

    return new DOMElement("div").setID("edit_item_footer").append( ...actions );
    
  }

  _generateElement() {

    this._header = this._generateHeader();

    this._body = this._generateBody();

    this._footer = this._generateFooter();

    const element = new DOMElement("div").setID("edit_item").append( this._header.getElement(), this._body.getElement(), this._footer.getElement() ).getElement();

    return element;
    
  }

}