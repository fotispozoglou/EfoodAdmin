import DOMElement from '../base/DOMElement.js';

export default class AdminPermission extends DOMElement {
  _code;
  _title;
  _enabled;
  _description;
  _methods;

  constructor({ code, title, description }, methods ) {
    super("div");

    this._code = code;
    this._title = title;
    this._description = description;
    this._methods = methods;

  }

  getID() { return this._code; }

  update({ enabled }) {

    this._enabled = enabled;

    if ( this._enabled ) return this._element.classList.add('enabled_permission');

    this._element.classList.remove('enabled_permission');

  }

  build() {

    const { isEnabled, enablePermission, disablePermission } = this._methods;

    this._enabled = isEnabled( this._code );

    const permissionTitle = new DOMElement("p").setClass('permission_title').setText( this._title ).getElement();

    const permissionDescription = new DOMElement("p").setClass('permission_description').setText( this._description ).getElement();

    this.addClass('permission')
      .on('click', () => { 
        
        if ( !this._enabled ) return enablePermission({ code: this._code, title: this._title, description: this._description }); 

        disablePermission({ code: this._code, title: this._title, description: this._description });
      
      })
      .append( permissionTitle, permissionDescription )
      .getElement();

    if ( this._enabled ) this._element.classList.add("enabled_permission");

    return this.getElement();

  }

};