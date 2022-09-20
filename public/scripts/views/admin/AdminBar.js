import View from "../base/View.js";
import DOMElement from "../base/DOMElement.js";

export default new class AdminBar extends View {
  _parent = document.querySelector("#mnavbar_header_admin");
  _adminIcon;
  _isExpanded = false;

  initializeListeners() {

    const closeAdminActions = document.querySelector("#close_admin_actions_container");
    const adminActions = document.querySelector("#admin_account_actions");
    const adminActionsBtn = document.querySelector("#mnavbar_header_admin_icon");

    adminActionsBtn.addEventListener('click', () => {
      
      if ( this._isExpanded ) {

        closeAdminActions.classList.add('hidden');
        adminActions.classList.add('hidden');

        this._isExpanded = false;

      } else {

        closeAdminActions.classList.remove('hidden');
        adminActions.classList.remove('hidden');

        this._isExpanded = true;

      }
  
    });
  
    closeAdminActions.addEventListener('click', e => {
  
      e.stopPropagation();
  
      closeAdminActions.classList.add('hidden');
      adminActions.classList.add('hidden');

      this._isExpanded = false;
  
    });
  
    adminActions.addEventListener('click', () => {
  
      closeAdminActions.classList.add('hidden');
      adminActions.classList.add('hidden');

      this._isExpanded = false;
  
    });

  }

  _generateElement() {

    const { info } = this._data;

    return this._adminIcon = new DOMElement("div")
      .setID("mnavbar_header_admin_icon")
      .setClass(`icon icon-fw fa-user-shield`)
      .on('click', e => { e.stopPropagation(); })
      .getElement();

  }

}
