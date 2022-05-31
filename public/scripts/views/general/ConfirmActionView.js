import View from '../base/View.js';
import DOMElement from '../base/DOMElement.js';
import ListElement from '../base/ListElement.js';
import ListItem from '../base/ListItem.js';

export default new class ConfirmActionView extends View {
  _parent = document.querySelector("#root");

  _generateElement() {

    const { title, confirm, effectedItems = [], itemComponent = ListItem } = this._data;

    const { confirmText = 'confirm', confirmExec } = confirm;

    const titleElement = new DOMElement("p").setID("confirm_action_header_title").setText( title ).getElement();

    const effectedTitleElement = new DOMElement("p").setID("confirm_action_header_effected_title").setText( `Items effected - ${ effectedItems.length }` ).getElement();

    const header = new DOMElement("div").setID("confirm_action_header").append( titleElement, effectedTitleElement ).getElement();

    const cancelBtn = new DOMElement("button")
      .setID("confirm_action_calcel")
      .setClass('confirm_action_footer_action')
      .setText( 'cancel' ).on('click', () => { this.remove(); document.querySelector("body").classList.remove('hide_overflow'); }).getElement();

    const confirmBtn = new DOMElement("button").setID("confirm_action_confirm").setClass('confirm_action_footer_action').setText( confirmText )
      .on('click', () => { confirmExec(  ); this.remove(); document.querySelector("body").classList.remove('hide_overflow'); }).getElement();

    const effectedItemsElement = new ListElement( effectedItems, itemComponent, "", "effected_items", {} );

    const body = new DOMElement("div").setID("confirm_action_body").append( effectedItemsElement.build() ).getElement();

    const footer = new DOMElement("div").setID("confirm_action_footer").append( cancelBtn, confirmBtn ).getElement();

    const element = new DOMElement("div").append( header, body, footer ).setID("confirm_action").getElement();

    return new DOMElement("div").append( element ).setID("confirm_action_background").getElement();

  }

}