import View from '../base/View.js';
import DOMElement from '../base/DOMElement.js';

export default new class ConfirmPermissionChange extends View {
  _parent = document.querySelector("#root");

  _generateElement() {

    const { title, confirm, enable } = this._data;

    const { permissionName, adminName } = title;

    const { confirmText = 'confirm', confirmExec } = confirm;

    const actionText = enable ? 'allow' : 'disable';

    const titleHTML = `${ actionText } <span class="confirm_permission_admin_name"> ${ adminName } </span> <span class="confirm_permission_title_text"> ${ permissionName } </span> permission?`;

    const titleElement = new DOMElement("p").setID("confirm_permission_header_title").appendHTML(`${ titleHTML }`).getElement();

    const header = new DOMElement("div").setID("confirm_permission_header").append( titleElement ).getElement();

    const cancelBtn = new DOMElement("button").setID("confirm_permission_cancel").setClass('confirm_permission_footer_action').setText( 'cancel' ).on('click', () => { this.remove(); }).getElement();

    const confirmBtn = new DOMElement("button").setID("confirm_permission_confirm").setClass('confirm_permission_footer_action').setText( confirmText ).on('click', () => { confirmExec(  ); this.remove(); }).getElement();

    const body = new DOMElement("div").setID("confirm_permission_body").getElement();

    const footer = new DOMElement("div").setID("confirm_permission_footer").append( cancelBtn, confirmBtn ).getElement();

    const element = new DOMElement("div").append( header, body, footer ).setID("confirm_permission").getElement();

    return new DOMElement("div").append( element ).setID("confirm_permission_background").getElement();

  }

}