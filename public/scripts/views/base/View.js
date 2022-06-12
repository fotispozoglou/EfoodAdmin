import DOMElement from "./DOMElement.js";

function generateViewID() {

  return `${Math.floor( (Math.random() * 100) + Math.floor( (Math.random() * 100) + 143 ))}`;

}

export default class View {
  _data;
  _element;
  _dataElements = [];
  title = "";
  id = "";
  viewID = generateViewID();
  _hasRendered = false;
  _parent = document.querySelector("#root");

  render( data ) {

    if ( data ) this._data = data;

    if ( !this._element ) this._element = this._generateElement();

    this._parent.insertAdjacentElement('beforeend', this._element);

    this._hasRendered = true;

  }

  hasRendered() { return this._hasRendered; }

  getID() { return this.viewID; }

  addDataElements( ...dataElements ) {  

    for ( const dataElement of dataElements ) {

      this._dataElements.push({ name: dataElement[ 0 ], getValue: dataElement[ 1 ] });

    }

  }

  getViewData( requested = "all" ) {

    let data = {};

    for ( const dataElement of this._dataElements ) {

      if ( dataElement['name'] === requested || requested === "all" ) {

        data[ dataElement['name'] ] = dataElement.getValue();

      }

    }

    return data;

  }

  showElements() {  }

  hideElements() {  }

  remove() { this._element.remove(); }

  _generateElement() { return new DOMElement("div"); }

  getTitle() { return this.title; }

  setTitle( title ) { this.title = title; }

  empty() { this._element.innerHTML = ''; }

}