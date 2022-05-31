import DOMElement from "../base/DOMElement.js";

export default class InfoIcon extends DOMElement {

  constructor( icon, text, actions = [  ] ) {
    super("div");

    const iconElement = new DOMElement("div").setClass(`icon info_icon_icon icon-fw fa-${ icon }`).getElement();

    const textElement = new DOMElement("p").setClass('info_icon_text').setText( text ).getElement();

    this.setClass('info_icon').append( iconElement, textElement );

    if ( actions.length > 0 ) {
      
      for ( const action of actions ) {

        const actionElement = new DOMElement("div")
          .setClass(`icon info_icon_icon icon-fw fa-${ action[ 0 ] }`)
          .on('click', () => { action[1](); })
          .getElement();

        this.append( actionElement );

      }

    }

  }

};