import DOMElement from "../base/DOMElement.js";

export default class IconElement extends DOMElement {

  constructor( icon, text ) {
    super("div");
    
    const iconElement = new DOMElement("div").setClass(`icon icon_element_icon fa-solid ${ icon }`).getElement();

    const textElement = new DOMElement("p").setText( text ).addClass('icon_text').getElement();

    this.setClass('icon_element').append( iconElement, textElement );

  }

};