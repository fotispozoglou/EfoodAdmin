import DOMElement from "../base/DOMElement.js";
import ListElement from "../base/ListElement.js";
import AdminPermission from "./AdminPermission.js";

export default class AdminPermissions extends DOMElement {
  _permissions;
  _permissionsElement;
  _enabledPermissions;

  constructor({ permissions, enabledPermissions }, methods) {
    super("div");

    this._permissions = permissions;
    this._enabledPermissions = enabledPermissions;
    this._methods = methods;

  }

  enablePermission({ code, enabled }) {

    this._permissionsElement.updateItem( code, { enabled } );
  
  }

  isEnabled( code ) {

    return this._enabledPermissions.includes( code );

  }

  build() {

    const { enablePermission, disablePermission } = this._methods;

    this._permissionsElement = new ListElement( this._permissions, AdminPermission, "", "", { 
      
      isEnabled: code => { return this.isEnabled( code ) },
      enablePermission,
      disablePermission
    
    }, {} );

    this.setClass('permissions').append( this._permissionsElement.build() ).getElement();

    return this.getElement();

  }

}