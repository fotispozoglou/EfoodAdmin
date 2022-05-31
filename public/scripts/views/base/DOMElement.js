export default class DOMElement {
  _element;
  _title = "";

  constructor( type ) {

    this._element = document.createElement( type );

  }

  getTitle() { return this._title; }

  setID( id ) { this._element.id = id; return this; }
  setClass( c ) { this._element.className = c; return this; }
  addClass( cs ) { this._element.classList.add( ...cs.split(' ') ); return this; }
  removeClass( cs ) { this._element.classList.remove( ...cs.split(' ') ); return this; }

  append( ...elements ) { for ( const element of elements ) { this._element.insertAdjacentElement( 'beforeend', element ); } return this; }
  appendHTML( html ) { this._element.insertAdjacentHTML('beforeend', html); return this; }

  setText( text ) { this._element.textContent = text; return this; }

  on( event, callback ) { this._element.addEventListener( event, callback ); return this; }

  attributes( ...attributes ) { attributes.forEach(attribute => { this._element.setAttribute( attribute[0], attribute[1] ) }); return this; }

  style( ...styles ) { styles.forEach(style => { this._element.style[ style[0] ] = style[1]; return this; }); return this; }

  show() { this._element.setAttribute('style', 'display: flex !important'); }
  hide() { this._element.setAttribute('style', 'display: none !important'); }

  remove() { this._element.remove(); }
  empty() { this._element.innerHTML = ''; }

  getElement() { return this._element; }

}