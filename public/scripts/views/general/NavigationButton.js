import DOMElement from "../base/DOMElement.js";

export default class NavigationButton extends DOMElement {
  _text;
  _icon;

  constructor( text, icon ) {
    super("div");

    this._text = text;
    this._icon = icon;

  }

  build() {

    const icon = new DOMElement("div").setClass(`icon ${ this._icon } navigation_btn_icon`).getElement();

    const text = new DOMElement("p").setClass('navigation_text').setText( this._text ).getElement();

    const navigationIcon = new DOMElement("div").setClass('icon icon-fw fa-angle-right navigation_btn_arrow').getElement();

    this.append( icon, text, navigationIcon ).setClass('navigation_btn');

    return this.getElement();

  }

}