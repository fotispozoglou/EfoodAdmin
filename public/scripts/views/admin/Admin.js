import DOMElement from "../base/DOMElement.js";

import AdminPermissions from '../admin/AdminPermissions.js'

export default class Admin extends DOMElement {
  _id;
  _username;
  _methods;
  _permissions;
  _permissionsElement;
  _itemData;

  constructor({ _id, username, permissions }, methods, itemData ) {
    super("div");

    this._id = _id;
    this._username = username;
    this._methods = methods;
    this._permissions = permissions;
    this._itemData = itemData;

  }

  getID() { return this._id; }

  update( data ) {

    this._permissionsElement.enablePermission( data );

  }

  build() {

    const { enablePermission, disablePermission } = this._methods;

    const adminName = new DOMElement("p").setClass('admin_name').setText( this._username ).getElement();

    this._permissionsElement = new AdminPermissions({ permissions: this._itemData, enabledPermissions: this._permissions }, {
      enablePermission: code => { enablePermission( this._username, this._id, code ); },
      disablePermission: code => { disablePermission( this._username, this._id, code ); }
    }, {});

    this.setClass('admin').append( adminName, this._permissionsElement.build() ).getElement();

    return this.getElement();

  }

};